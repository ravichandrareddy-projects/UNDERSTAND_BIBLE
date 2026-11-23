"""OC-02 source gate, immutable acquisition and offline verification. Python 3.10+."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from inventory import inventory
from source_io import Client, ROOT, RAW, digest, evidence, now, save, write_json

REGISTRY = ROOT / "data/rights/edition_rights.json"
MANIFESTS = ROOT / "data/manifests/bible"
PILOTS = {"eng-kjv", "eng-web", "eng-bsb", "eng-dra", "tel-irv", "hin-irv"}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        if tag == "a" and (href := dict(attrs).get("href")):
            self.urls.append(href)


def require_actions(record, actions):
    if record.get("licence_status") != "VERIFIED":
        raise PermissionError("source licence is not verified for this scope")
    for action in actions:
        if record.get("permissions", {}).get(action) != "VERIFIED":
            raise PermissionError(f"{action} has no applicable verified grant")


def review_hash(url, data):
    # eBible's detail page footer identifies the serving replica. Preserve the
    # entire original separately and ignore only this terminal machine label.
    if url.startswith("https://ebible.org/details.php?id="):
        data = re.sub(rb"(Last updated \d{4}-\d\d-\d\d +)(?:c|e|www|tiny\d+)(</p></body></html>\s*\Z)",
                      rb"\1\2", data)
    return digest(data)


def check_sources(client, record):
    require_actions(record, ["collect", "store", "validate_text"])
    refs = record["evidence"]
    detail_url = "https://ebible.org/details.php?id=" + record["source_id"]
    if len(refs) < 2 or refs[0]["url"] != detail_url:
        raise ValueError("missing edition-specific detail and coverage evidence")
    current = []
    for i, ref in enumerate(refs):
        live, data = evidence(client, ref["url"])
        live["review_sha256"] = review_hash(ref["url"], data)
        if live["review_sha256"] != ref["review_sha256"]:
            raise PermissionError(f"evidence changed at {ref['url']}; owner reapproval required")
        parser = Links()
        if i < 2:
            parser.feed(data.decode("utf-8-sig"))
        if i == 0:
            links = [urljoin(detail_url, link) for link in parser.urls]
            if record["archive_url"] not in links or refs[1]["url"] not in links:
                raise PermissionError("reviewed archive or book index is no longer linked")
        if i == 1:
            index_books = list(dict.fromkeys(m[1] for link in parser.urls
                               if (m := re.fullmatch(r"([A-Z0-9]{3})0*1\.htm", link))
                               and m[1] not in {"FRT", "GLO", "INT", "BAK"}))
            if index_books != record["book_order"]:
                raise PermissionError("edition coverage changed")
        current.append(live)
    if urlsplit(record["archive_url"]).hostname != "ebible.org" or not record["archive_url"].endswith("_usfm.zip"):
        raise PermissionError("unexpected edition archive")
    return current


def verify(path, record):
    m = json.loads(path.read_text(encoding="utf8"))
    require_actions(record, ["collect", "store", "validate_text"])
    if (m["source_url"] != record["archive_url"] or m["source_id"] != record["source_id"]
            or [(r["url"], r["review_sha256"]) for r in m["evidence"]] !=
               [(r["url"], r["review_sha256"]) for r in record["evidence"]]):
        raise ValueError("manifest no longer matches the reviewed record")
    for ref in m["evidence"]:
        snapshot = (ROOT / ref["snapshot"]).read_bytes()
        if digest(snapshot) != ref["sha256"] or review_hash(ref["url"], snapshot) != ref["review_sha256"]:
            raise ValueError("licence evidence checksum mismatch")
    data = (ROOT / m["raw_path"]).read_bytes()
    if digest(data) != m["sha256"] or len(data) != m["bytes"]:
        raise ValueError("archive checksum mismatch")
    if inventory(data, record["book_order"]) != m["inventory"]:
        raise ValueError("inventory mismatch")
    return m


def acquire(client, edition, record):
    current = check_sources(client, record)
    checked = now()
    day = checked[:10]
    manifest = MANIFESTS / edition / day / "manifest.json"
    if manifest.exists():
        return verify(manifest, record)
    data = client.get(record["archive_url"])
    sha = digest(data)
    path = RAW / "bible-texts/raw" / edition / day / sha / Path(urlsplit(record["archive_url"]).path).name
    save(path, data)
    stats = inventory(data, record["book_order"], RAW / "bible-texts/working" / edition / sha)
    result = {"edition_id": edition, "source_id": record["source_id"], "edition": record["title"],
              "publisher": record["publisher"], "source_url": record["archive_url"], "repository": "eBible.org",
              "retrieved_at": now(), "source_version_date": record["source_version_date"],
              "raw_path": path.relative_to(ROOT).as_posix(), "bytes": len(data), "sha256": sha,
              "licence": record["licence"], "licence_status": "VERIFIED for local acquisition and inventory",
              "attribution": record["attribution"], "conditions": record["conditions"],
              "evidence": current, "inventory": stats}
    write_json(manifest, result)
    return verify(manifest, record)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["acquire", "verify"])
    parser.add_argument("editions", nargs="+", choices=sorted(PILOTS))
    args = parser.parse_args()
    records = json.loads(REGISTRY.read_text(encoding="utf8"))["editions"]
    client = Client({"ebible.org", "berean.bible", "creativecommons.org"})
    for edition in args.editions:
        if args.mode == "acquire":
            items = [acquire(client, edition, records[edition])]
        else:
            paths = sorted((MANIFESTS / edition).glob("*/manifest.json"))
            if not paths:
                raise FileNotFoundError(f"no manifest for {edition}")
            items = [verify(path, records[edition]) for path in paths]
        for m in items:
            print(edition, m["sha256"], m["inventory"]["counts"], flush=True)


if __name__ == "__main__":
    main()
