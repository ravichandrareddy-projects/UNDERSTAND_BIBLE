"""Validate five named local archives and atomically replace their private PostgreSQL staging rows."""

import argparse
from collections import Counter
from datetime import datetime, timezone, timedelta
import gzip
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "db"))
from foundation import APPROVED, LOCK, db, manifest, q
from pilot import REGISTRY, verify, review_hash
from source_io import RAW, ROOT, digest, save
from usfm import parse, project, independent

PARSER = "pilot-usj-1"
ADDRESS = re.compile(rb"(?:^|(?<=\s))\\(c|v)[ \t]+([^ \t\r\n\\]+)", re.M)
TABLES = ("book", "verse", "annotation")


def compact(v):
    return json.dumps(v, ensure_ascii=False, separators=(",", ":"))


def receipt(id, record):
    path = max((RAW / "evidence/rechecks").glob("*.json"), default=None)
    if not path:
        raise PermissionError("run packages/ingest/recheck.py before staging")
    r = json.loads(path.read_text(encoding="utf8"))
    refs = r["editions"][id]
    if len(refs) != len(record["evidence"]):
        raise PermissionError("missing evidence")
    for old, live in zip(record["evidence"], refs):
        stamp = datetime.fromisoformat(live["checked_at"])
        age = datetime.now(timezone.utc) - stamp
        if not timedelta(0) <= age < timedelta(hours=24):
            raise PermissionError("refresh the licence evidence before import")
        data = (ROOT / live["snapshot"]).read_bytes()
        if (
            old["url"] != live["url"]
            or digest(data) != live["sha256"]
            or review_hash(old["url"], data) != old["review_sha256"]
        ):
            raise PermissionError("evidence identity mismatch")
    return r["checked_at"]


def gate(id, sha):
    return (
        f"EXISTS (SELECT FROM content.version WHERE edition={q(id)} AND checksum={q(sha)}) AND "
        + " AND ".join(
            f"content.allowed({q(id)},{q(a)})"
            for a in ("collect", "store", "validate_text")
        )
    )


def copy_row(file, *values):
    def escape(v):
        if v is None:
            return r"\N"
        return (
            str(v)
            .replace("\\", "\\\\")
            .replace("\t", "\\t")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
        )

    file.write(("\t".join(map(escape, values)) + "\n").encode())


def spans(data):
    markers = list(ADDRESS.finditer(data))
    chapter = None
    for i, m in enumerate(markers):
        label = m[2].decode("ascii")
        if m[1] == b"c":
            chapter = label
        else:
            start = m.start()
            end = markers[i + 1].start() if i + 1 < len(markers) else len(data)
            yield chapter, label, start, end, digest(data[start:end])


def stage_book(m, bookfile, data, files, ledger, summary):
    src = data.decode("utf-8-sig")
    tree = parse(src)
    book, rows, annotations = project(tree)
    independently = independent(src)
    source_rows = list(spans(data))
    if len(source_rows) != len(rows) or len(rows) != len(independently):
        raise ValueError(
            f"{book}: verse ledger length differs {len(source_rows)}/{len(rows)}/{len(independently)}"
        )
    counts = Counter()
    id, sha = m["edition_id"], m["sha256"]
    canonical = book in m["inventory"]["chapter_verse_marker_counts"]
    usj = gzip.compress(compact(tree).encode(), mtime=0)
    copy_row(
        files["book"],
        id,
        sha,
        book,
        canonical,
        bookfile,
        digest(data),
        r"\x" + usj.hex(),
    )
    for (ch, label, value, nfc), (ch2, label2, other), (
        ch3,
        label3,
        start,
        end,
        spanhash,
    ) in zip(rows, independently, source_rows):
        if (
            (ch, label) != (ch2, label2)
            or (ch, label) != (ch3, label3)
            or value != other
        ):
            raise ValueError(
                f"{id} {book} {ch}:{label}: rendering or address mismatch; lengths {len(value)}/{len(other)}"
            )
        counts[ch] += 1
        ph = digest(value.encode())
        copy_row(files["verse"], id, sha, book, ch, counts[ch], label, value, nfc, ph)
        ledger.write(
            (
                compact([book, ch, counts[ch], label, start, end, spanhash, ph]) + "\n"
            ).encode()
        )
        if not value:
            summary["empty_labels"].append([book, ch, label])
    if (
        canonical
        and list(counts.values()) != m["inventory"]["chapter_verse_marker_counts"][book]
    ):
        raise ValueError(f"archived chapter counts differ for {book}")
    for seq, (ch, label, kind, node) in enumerate(annotations, 1):
        copy_row(
            files["annotation"], id, sha, book, seq, ch, label, kind, compact(node)
        )
        summary["annotations"][kind] += 1
    summary["books"] += int(canonical)
    summary["chapters"] += len(counts)
    summary["verses"] += len(rows)


def write_stage(m, result, checked, folder, ledger_hash):
    id, sha = m["edition_id"], m["sha256"]
    head = f"""BEGIN;
    SET LOCAL standard_conforming_strings=on;
    {LOCK}
    DO $$ BEGIN IF NOT ({gate(id, sha)}) THEN RAISE EXCEPTION 'rights gate denied'; END IF; END $$;
    DELETE FROM staging.import WHERE edition={q(id)} AND checksum={q(sha)};
    INSERT INTO staging.import VALUES ({q(id)},{q(sha)},{q(PARSER)},{q(ledger_hash)},{q(checked)},{q(compact(result))});
    """
    path = folder / "import.sql"
    with path.open("wb") as f:
        f.write(head.encode())
        for table in TABLES:
            f.write(f"COPY staging.{table} FROM STDIN;\n".encode())
            with (folder / table).open("rb") as stream:
                shutil.copyfileobj(stream, f)
            f.write(b"\\.\n")
        f.write(b"COMMIT;\n")
    with path.open("rb") as f:
        result = subprocess.run(
            [
                os.environ.get("PSQL", "psql"),
                "-XqAt",
                "-v",
                "ON_ERROR_STOP=1",
                "-f",
                "-",
            ],
            stdin=f,
            capture_output=True,
            env=dict(os.environ, PGCLIENTENCODING="UTF8"),
        )
    if result.returncode:
        # Do not log rejected COPY payloads, including scripture, from PostgreSQL.
        line = re.search(rb"psql:<stdin>:\d+", result.stderr)
        raise RuntimeError(
            "staging transaction failed at "
            + (line[0].decode() if line else "connection")
        )


def run(id):
    if id not in APPROVED:
        raise PermissionError("edition is outside the five approved sources")
    record = json.loads(REGISTRY.read_text(encoding="utf8"))["editions"][id]
    m = manifest(id)
    if db("SELECT " + gate(id, m["sha256"])) != "t":
        raise PermissionError("database rights or archive identity denied")
    checked = receipt(id, record)
    (path,) = (ROOT / "data/manifests/bible" / id).glob("*/manifest.json")
    verify(path, record)
    dest = RAW / "bible-texts/staging" / id / m["sha256"]
    dest.mkdir(exist_ok=True, parents=True)
    result = {
        "edition": id,
        "version": m["sha256"],
        "books": 0,
        "chapters": 0,
        "verses": 0,
        "empty_labels": [],
        "ancillary_books": m["inventory"]["noncanonical_files_by_id"],
        "annotations": Counter(),
        "label_findings": m["inventory"]["label_findings"],
    }
    with tempfile.TemporaryDirectory(dir=dest) as tmp:
        folder = Path(tmp)
        files = {k: (folder / k).open("wb") for k in TABLES}
        ledger_path = folder / "ledger"
        try:
            with (
                zipfile.ZipFile(ROOT / m["raw_path"]) as z,
                ledger_path.open("wb") as stream,
                gzip.GzipFile(
                    filename="", fileobj=stream, mode="wb", mtime=0
                ) as ledger,
            ):
                for name in z.namelist():
                    if name.lower().endswith((".usfm", ".sfm")):
                        stage_book(m, name, z.read(name), files, ledger, result)
        finally:
            for f in files.values():
                f.close()
        expected = m["inventory"]["counts"]
        if (result["books"], result["chapters"], result["verses"]) != (
            expected["books"],
            expected["chapters"],
            expected["verse_markers"],
        ):
            raise ValueError("edition inventory mismatch")
        data = ledger_path.read_bytes()
        sha = digest(data)
        save(dest / (sha + ".jsonl.gz"), data)
        write_stage(m, result, checked, folder, sha)
    print(
        id,
        result["books"],
        result["chapters"],
        result["verses"],
        dict(result["annotations"]),
        sha,
        flush=True,
    )


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("editions", nargs="+", choices=APPROVED)
    for edition in p.parse_args().editions:
        run(edition)
