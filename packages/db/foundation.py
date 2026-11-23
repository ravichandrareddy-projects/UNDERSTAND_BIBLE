"""PostgreSQL migrations and owner-approved registry seed. Uses psql and standard PG connection variables."""

import argparse
from datetime import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
APPROVED = ("eng-web", "eng-bsb", "eng-dra", "tel-irv", "hin-irv")
EDITION_CANON = {
    "eng-web": "protestant",
    "eng-bsb": "protestant",
    "eng-dra": "catholic",
    "tel-irv": "protestant",
    "hin-irv": "protestant",
    "eng-kjv": "protestant",
}
ACTIONS = "collect store validate_text host display redistribute offline cache index commercial local_retrieval external_ai embed synthesize_speech recorded_audio".split()
LOCK = "SELECT pg_advisory_xact_lock(7140207);"
BOOT = """CREATE TABLE IF NOT EXISTS public.ub_migration
(version text PRIMARY KEY, checksum text NOT NULL);"""


def db(sql, *, private=False):
    env = dict(os.environ, PGCLIENTENCODING="UTF8", PGCONNECT_TIMEOUT="5")
    cmd = [env.get("PSQL", "psql"), "-XqAt", "-v", "ON_ERROR_STOP=1", "-f", "-"]
    result = subprocess.run(
        cmd, input=sql, capture_output=True, encoding="utf8", env=env
    )
    if result.returncode:
        # PostgreSQL COPY errors may contain verbatim private text.
        raise RuntimeError(
            "private database operation failed" if private else result.stderr.strip()
        )
    return result.stdout.strip()


def q(value):
    if value is None:
        return "NULL"
    return "'" + str(value).replace("'", "''") + "'"


def tx(sql):
    return (
        "BEGIN;\nSET LOCAL standard_conforming_strings=on;\n"
        + LOCK
        + "\n"
        + sql
        + "\nCOMMIT;"
    )


def migrate_one(name, direction):
    script = (HERE / f"migrations/{name}.{direction}.sql").read_text(encoding="utf8")
    hash_up = hashlib.sha256(
        (HERE / f"migrations/{name}.up.sql").read_text(encoding="utf8").encode()
    ).hexdigest()
    number = q(name.split("_")[0])
    # psql conditionals run after the advisory lock, including concurrent first install.
    prior = f"""DO $$ BEGIN IF EXISTS (SELECT FROM public.ub_migration WHERE version={number}
    AND checksum<>{q(hash_up)}) THEN RAISE EXCEPTION 'installed migration checksum differs'; END IF; END $$;"""
    test = "NOT EXISTS" if direction == "up" else "EXISTS"
    change = (
        f"INSERT INTO public.ub_migration VALUES ({number},{q(hash_up)});"
        if direction == "up"
        else f"DELETE FROM public.ub_migration WHERE version={number};"
    )
    db(
        tx(
            BOOT
            + prior
            + f"\nSELECT {test} (SELECT FROM public.ub_migration WHERE version={number}) AS apply \\gset\n"
            + "\\if :apply\n"
            + script
            + "\n"
            + change
            + "\n\\endif"
        )
    )


def migration(direction):
    names = sorted(p.name.split(".")[0] for p in (HERE / "migrations").glob("*.up.sql"))
    for name in names if direction == "up" else reversed(names):
        migrate_one(name, direction)


def manifest(edition):
    (path,) = (ROOT / "data/manifests/bible" / edition).glob("*/manifest.json")
    return json.loads(path.read_text(encoding="utf8"))


def version(m):
    raw = ROOT / m["raw_path"]
    if (
        raw.stat().st_size != m["bytes"]
        or hashlib.sha256(raw.read_bytes()).hexdigest() != m["sha256"]
    ):
        raise ValueError("archive identity mismatch: " + m["edition_id"])
    with zipfile.ZipFile(raw) as z:
        notice = z.read("copr.htm")
    sha = hashlib.sha256(notice).hexdigest()
    if not any(
        f["path"] == "copr.htm" and f["sha256"] == sha for f in m["inventory"]["files"]
    ):
        raise ValueError("archive notice identity mismatch")
    (date,) = re.findall(rb"source files dated (\d{1,2} [A-Z][a-z]{2} \d{4})", notice)
    return (
        m["edition_id"],
        m["sha256"],
        m["bytes"],
        m["retrieved_at"],
        m["source_version_date"],
        datetime.strptime(date.decode(), "%d %b %Y").date().isoformat(),
        "copr.htm",
        sha,
    )


def insert(table, fields, values, keys):
    cols = fields.split()
    updates = [c + "=excluded." + c for c in cols if c not in keys.split()]
    on_conflict = "DO UPDATE SET " + ",".join(updates) if updates else "DO NOTHING"
    return (
        f"INSERT INTO content.{table} ({','.join(cols)}) VALUES ("
        + ",".join(map(q, values))
        + f") ON CONFLICT ({','.join(keys.split())}) {on_conflict};"
    )


def seed():
    records = json.loads(
        (ROOT / "data/rights/edition_rights.json").read_text(encoding="utf8")
    )["editions"]
    if set(records) != set(APPROVED) | {"eng-kjv"}:
        raise ValueError("rights registry differs from the approved pilot scope")
    stmts = [insert("action", "id", [a], "id") for a in ACTIONS]
    profiles = [
        ("protestant", "eng-web", "Pilot order from WEB."),
        (
            "catholic",
            "eng-dra",
            "Pilot order from Douay-Rheims, including its integrated additions.",
        ),
        (
            "orthodox-greek",
            None,
            "Greek usage. Review Esdras naming, Psalm 151 and appendix treatment against the selected edition.",
        ),
        (
            "orthodox-slavonic",
            None,
            "Slavonic usage. Review the edition's Esdras numbering and book order independently of Greek usage.",
        ),
    ]
    for canon, model, description in profiles:
        stmts.append(insert("tradition", "id", [canon], "id"))
        if model is None:
            # Reserve each profile without overwriting a later reviewed Orthodox definition.
            stmts.append(
                f"INSERT INTO content.canon (id,tradition,description) VALUES ({q(canon)},{q(canon)},{q(description)}) ON CONFLICT (id) DO NOTHING;"
            )
            continue
        stmts.append(
            insert(
                "canon",
                "id tradition definition_status description",
                [canon, canon, "edition_sourced", description],
                "id",
            )
        )
        stmts.append(f"DELETE FROM content.canon_book WHERE canon={q(canon)};")
        stmts.extend(
            insert("canon_book", "canon ordinal book", [canon, i, b], "canon ordinal")
            for i, b in enumerate(records[model]["book_order"], 1)
        )
    for id, r in records.items():
        canon = EDITION_CANON[id]
        lang = {"eng": "en", "tel": "te", "hin": "hi"}[id.split("-")[0]]
        stmts += [
            insert(
                "edition",
                "id language title publisher source_id canon source_url",
                [
                    id,
                    lang,
                    r["title"],
                    r["publisher"],
                    r["source_id"],
                    canon,
                    r["archive_url"],
                ],
                "id",
            ),
            insert(
                "licence",
                "edition terms status conditions",
                [id, r["licence"], r["licence_status"], json.dumps(r["conditions"])],
                "edition",
            ),
            insert("attribution", "edition notice", [id, r["attribution"]], "edition"),
            f"DELETE FROM content.evidence WHERE edition={q(id)};",
            f"DELETE FROM content.permission WHERE edition={q(id)};",
        ]
        for ref in r["evidence"]:
            if (
                hashlib.sha256((ROOT / ref["snapshot"]).read_bytes()).hexdigest()
                != ref["sha256"]
            ):
                raise ValueError("rights evidence differs: " + id)
            stmts.append(
                insert(
                    "evidence",
                    "edition url checked_at sha256 review_sha256",
                    [
                        id,
                        *[
                            ref[k]
                            for k in ("url", "checked_at", "sha256", "review_sha256")
                        ],
                    ],
                    "edition url",
                )
            )
        for a, status in r["permissions"].items():
            if (
                id == "eng-kjv"
                or id in ("tel-irv", "hin-irv")
                and a in ("external_ai", "embed", "synthesize_speech")
            ) and status == "VERIFIED":
                raise ValueError("permission conflicts with owner decision")
            stmts.append(
                insert(
                    "permission",
                    "edition action status",
                    [id, a, status],
                    "edition action",
                )
            )
        if id in APPROVED:
            m = manifest(id)
            if (m["source_id"], m["source_url"], m["source_version_date"]) != (
                r["source_id"],
                r["archive_url"],
                r["source_version_date"],
            ):
                raise ValueError("manifest and rights source differ")
            stmts.append(
                insert(
                    "version",
                    "edition checksum archive_bytes retrieved_at notice_date embedded_date notice_member notice_checksum",
                    version(m),
                    "edition checksum",
                )
            )
            inventory = m["inventory"]
            order = inventory["books_in_source_index_order"]
            counts = inventory["chapter_verse_marker_counts"]
            if order != r["book_order"] or set(order) != set(counts):
                raise ValueError("version coverage differs from its edition receipt")
            stmts.append(
                f"DELETE FROM content.version_book WHERE edition={q(id)} AND checksum={q(m['sha256'])};"
            )
            for ordinal, book in enumerate(order, 1):
                chapters = counts[book]
                stmts.append(
                    insert(
                        "version_book",
                        "edition checksum book source_order chapter_count verse_rows",
                        [id, m["sha256"], book, ordinal, len(chapters), sum(chapters)],
                        "edition checksum book",
                    )
                )
    db(tx("\n".join(stmts)))


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("command", choices=["up", "down", "seed"])
    command = p.parse_args().command
    seed() if command == "seed" else migration(command)
