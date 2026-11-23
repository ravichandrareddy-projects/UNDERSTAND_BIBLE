"""Fetch only the approved files from each pinned upstream study repository."""
import argparse
from collections import Counter
import json
from urllib.parse import quote

from pilot import require_actions
from source_io import Client, ROOT, RAW, digest, evidence, now, save, write_json


def profile(path, body):
    if path.endswith((".json", ".jsonl")):
        rows = (json.loads(body) if path.endswith(".json")
                else [json.loads(line) for line in body.splitlines() if line.strip()])
        fields = Counter()
        nested = Counter()
        for row in rows:
            fields.update(row.keys())
            if isinstance(row.get("fields"), dict):
                nested.update(row["fields"].keys())
        return {"rows": len(rows), "top_level_field_presence": dict(sorted(fields.items())),
                "nested_field_presence": dict(sorted(nested.items()))}
    lines = body.decode("utf-8-sig").splitlines()
    widths = Counter(len(line.split("\t")) for line in lines if line.strip())
    return {"physical_lines": len(lines),
            "nonblank_lines_by_tab_field_count": {str(n): count for n, count in sorted(widths.items())}}


def run(name, record, client, offline):
    require_actions(record, ["collect", "store", "audit_metadata"])
    base = "https://raw.githubusercontent.com/" + record["repository"] + "/" + record["commit"] + "/"
    target = ROOT / "data/manifests/study" / name / record["commit"] / "manifest.json"
    if offline or target.exists():
        m = json.loads(target.read_text(encoding="utf8"))
        if (m["commit"] != record["commit"] or m["repository"] != record["repository"]
                or m["attribution"] != record["attribution"] or m["licence"] != record["licence"]
                or [f["path"] for f in m["files"]] != record["files"]):
            raise ValueError("study manifest does not match approved source")
        for ref in record["evidence"]:
            if digest((ROOT / ref["snapshot"]).read_bytes()) != ref["sha256"]:
                raise ValueError("study licence evidence mismatch")
        for f in m["files"]:
            raw = RAW / "study" / name / record["commit"] / f["path"]
            if (f["raw_path"] != raw.relative_to(ROOT).as_posix() or f["source_url"] != base + quote(f["path"], safe="/")
                    or [(r["url"], r["sha256"]) for r in f["evidence"]] !=
                       [(r["url"], r["sha256"]) for r in record["evidence"]]):
                raise ValueError("study manifest provenance mismatch")
            data = raw.read_bytes()
            if len(data) != f["bytes"] or digest(data) != f["sha256"] or profile(f["path"], data) != f["profile"]:
                raise ValueError(f"study inventory mismatch for {name}")
        return m
    files = []
    for file in record["files"]:
        checked = []
        for ref in record["evidence"]:
            live, _ = evidence(client, ref["url"])
            if live["sha256"] != ref["sha256"]:
                raise PermissionError("study evidence changed; obtain reapproval")
            checked.append(live)
        url = base + quote(file, safe="/")
        data = client.get(url)
        raw = RAW / "study" / name / record["commit"] / file
        save(raw, data)
        files.append({"path": file, "source_url": url, "raw_path": raw.relative_to(ROOT).as_posix(),
                      "retrieved_at": now(), "bytes": len(data), "sha256": digest(data),
                      "evidence": checked, "profile": profile(file, data)})
    m = {"dataset_id": name, "repository": record["repository"], "commit": record["commit"],
         "licence": record["licence"], "licence_status": "VERIFIED for source-local metadata audit",
         "attribution": record["attribution"], "files": files}
    write_json(target, m)
    return m


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["collect", "verify"])
    args = parser.parse_args()
    client = Client({"raw.githubusercontent.com"})
    for name, record in json.loads((ROOT / "data/rights/study_sources.json").read_text(encoding="utf8")).items():
        result = run(name, record, client, args.mode == "verify")
        print(name, [(f["path"], f["bytes"]) for f in result["files"]], flush=True)
