"""Private PostgreSQL inventory and content-addressed candidate/review registry."""

import gzip
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "db"))
from foundation import APPROVED, ROOT, db, manifest, q, tx
from authority import authority
from rules import Verse, absence_claims, encoded, fingerprint, override_claim, propose

DATA = ROOT / "data/versification"
RECEIPTS = ROOT / "data/manifests/validation/oc04.json"
ACTIONS = ("store", "validate_text", "local_retrieval")


def versions(ids):
    validation = json.loads(RECEIPTS.read_text(encoding="utf8"))
    result = {}
    for edition in ids:
        if edition not in APPROVED:
            raise PermissionError("outside approved editions")
        m = manifest(edition)
        r = validation[edition]
        if r["result"]["version"] != m["sha256"]:
            raise ValueError("staging receipt differs from archive manifest")
        result[edition] = {
            "edition": edition,
            "checksum": m["sha256"],
            "ledger": r["ledger"],
            "attribution": m["attribution"],
            "terms": m["licence"],
            "conditions": m["conditions"],
            "source_url": m["source_url"],
            "rights": {action: "VERIFIED" for action in ACTIONS},
        }
    return result


def gate(scopes, revision=None):
    checks = []
    for e, v in scopes.items():
        checks.extend(f"content.allowed({q(e)},{q(a)})" for a in ACTIONS)
        checks.append(
            f"EXISTS (SELECT FROM staging.import WHERE edition={q(e)} AND checksum={q(v['checksum'])} AND ledger_sha256={q(v['ledger'])})"
        )
    if revision:
        checks.append(
            f"EXISTS (SELECT FROM staging.versification_scheme WHERE revision={q(revision)} AND permitted)"
        )
    return (
        "DO $$ BEGIN IF NOT ("
        + " AND ".join(checks)
        + ") THEN RAISE EXCEPTION 'alignment rights or version denied'; END IF; END $$;"
    )


def scope_filter(scopes, alias):
    return (
        "("
        + alias
        + ".edition,"
        + alias
        + ".checksum) IN ("
        + ",".join("(" + q(e) + "," + q(v["checksum"]) + ")" for e, v in scopes.items())
        + ")"
    )


def snapshot(scopes, revision=None):
    where = scope_filter(scopes, "v")
    sql = f"""BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
        {gate(scopes, revision)}
        SELECT json_build_array('row',v.edition,v.book,v.chapter,v.label,v.ordinal,
            encode(sha256(convert_to(v.text_plain,'UTF8')),'hex'),v.text_plain<>'')
        FROM staging.verse v WHERE {where} ORDER BY v.edition,v.book,v.chapter,v.ordinal;"""
    if revision:
        sql += f"""SELECT json_build_array('map',v.edition,v.book,v.chapter,v.label,v.claim,v.kind,
            v.standard_members, o.claim IS NOT NULL, coalesce(r.decision,'PENDING'),r.receipt,v.evidence->'local_group')
          FROM staging.versification_map v JOIN staging.import i USING (edition,checksum)
          LEFT JOIN staging.edition_versification_override o USING(claim)
          LEFT JOIN LATERAL (SELECT decision,receipt FROM staging.versification_review WHERE claim=v.claim
            ORDER BY reviewed_at DESC,sequence DESC LIMIT 1) r ON true
          WHERE {where} AND v.active AND v.scheme={q(revision)} AND v.ledger=i.ledger_sha256 ORDER BY v.claim;"""
    verses = {e: {} for e in scopes}
    claims = {e: [] for e in scopes}
    for line in db(sql + "COMMIT;", private=True).splitlines():
        tag, e, b, ch, label, *values = json.loads(line)
        if tag == "row":
            verses[e][b, ch, label] = Verse(*values)
        else:
            cid, kind, members, override, status, receipt, group = values
            claims[e].append(
                {
                    "id": cid,
                    "local": (b, ch, label),
                    "kind": kind,
                    "members": tuple(members),
                    "override": override,
                    "status": status,
                    "receipt": receipt,
                    "group": group,
                }
            )
    audits = json.loads(RECEIPTS.read_text(encoding="utf8"))
    for edition, rows in verses.items():
        blob = (ROOT / audits[edition]["ledger_path"]).read_bytes()
        if hashlib.sha256(blob).hexdigest() != scopes[edition]["ledger"]:
            raise ValueError("edition ledger checksum differs")
        count = 0
        for line in gzip.decompress(blob).splitlines():
            book, chapter, ordinal, label, _, _, _, body_hash = json.loads(line)
            row = rows.get((book, chapter, label))
            if row is None or (row.ordinal, row.sha) != (ordinal, body_hash):
                raise ValueError(
                    f"{edition} {book} {chapter}:{label} differs from staged ledger"
                )
            count += 1
        if count != len(rows):
            raise ValueError("edition inventory differs from staged ledger")
    return verses, claims


def build():
    source, lines = authority()
    scheme = json.loads((DATA / "standard.json").read_text(encoding="utf8"))
    if scheme["revision"] != source["sha256"]:
        raise ValueError("standard authority changed")
    scopes = versions(APPROVED)
    verses, _ = snapshot(scopes)
    books = {key[0] for rows in verses.values() for key in rows}
    candidates = []
    stats = {}
    for e, v in scopes.items():
        claims, stats[e] = propose(source, lines, v, verses[e], books)
        if e == "eng-bsb":
            audit = json.loads(RECEIPTS.read_text(encoding="utf8"))[e]
            claims.extend(
                absence_claims(
                    source, lines, v, verses[e], books, audit["bsb_gap_notes"]
                )
            )
        path = DATA / "overrides" / (e + ".yaml")
        if path.exists():
            for record in json.loads(path.read_text(encoding="utf8")):
                claims.append(
                    override_claim(source, lines, v, verses[e], books, record)
                )
        candidates.extend(claims)
    if len({x["id"] for x in candidates}) != len(candidates):
        raise ValueError("duplicate claims in build")
    revision = source["sha256"]
    sql = f"""INSERT INTO staging.versification_scheme VALUES ({q(revision)},{q(encoded(scheme))},
      {q(encoded(source))},true) ON CONFLICT DO NOTHING;
      {gate(scopes, revision)}
      DO $$ BEGIN IF NOT EXISTS (SELECT FROM staging.versification_scheme WHERE revision={q(revision)}
        AND definition={q(encoded(scheme))}::jsonb AND source_manifest={q(encoded(source))}::jsonb)
        THEN RAISE EXCEPTION 'pinned mapping receipt differs'; END IF; END $$;
      LOCK TABLE staging.versification_map IN SHARE ROW EXCLUSIVE MODE;
      CREATE TEMP TABLE batch (payload jsonb NOT NULL) ON COMMIT DROP;
      COPY batch FROM STDIN WITH (FORMAT csv, DELIMITER E'\\t', QUOTE E'\\x01');\n"""
    sql += "".join(encoded(c) + "\n" for c in candidates) + "\\.\n"
    sql += f"""CREATE INDEX ON batch ((payload->>'id'));
      INSERT INTO staging.versification_review(claim,decision,reviewer,reviewed_at,receipt,locator)
        SELECT v.claim,'REVOKED','OC-05 registry',clock_timestamp(),
          encode(sha256(convert_to(r.receipt || ':retired','UTF8')),'hex'),'Candidate retired by staging rebuild'
        FROM staging.versification_map v
        CROSS JOIN LATERAL (SELECT decision,receipt FROM staging.versification_review WHERE claim=v.claim
          ORDER BY reviewed_at DESC,sequence DESC LIMIT 1) r
        WHERE v.active AND {scope_filter(scopes, "v")} AND r.decision='APPROVED'
          AND NOT EXISTS (SELECT FROM batch b WHERE b.payload->>'id'=v.claim)
        ON CONFLICT (claim,receipt) DO NOTHING;
      UPDATE staging.versification_map v SET active=false WHERE v.active AND {scope_filter(scopes, "v")}
        AND NOT EXISTS (SELECT FROM batch b WHERE b.payload->>'id'=v.claim);
      INSERT INTO staging.versification_map(claim,scheme,edition,checksum,ledger,book,chapter,label,
          kind,standard_members,evidence,confidence)
        SELECT payload->>'id',payload->>'scheme',payload->>'edition',payload->>'checksum',payload->>'ledger',
          payload#>>'{{local,0}}',payload#>>'{{local,1}}',payload#>>'{{local,2}}',payload->>'kind',
          ARRAY(SELECT jsonb_array_elements_text(payload->'members')),payload->'evidence',payload->>'confidence'
          FROM batch ON CONFLICT (claim) DO UPDATE SET active=true WHERE NOT staging.versification_map.active;
      INSERT INTO staging.edition_versification_override SELECT payload->>'id',payload#>>'{{evidence,rationale}}'
        FROM batch WHERE payload->>'origin'='override' ON CONFLICT DO NOTHING;"""
    db(tx(sql), private=True)
    return {
        "revision": revision,
        "candidate_count": len(candidates),
        "candidate_set_sha256": fingerprint(sorted(c["id"] for c in candidates)),
        "rule_evaluation": stats,
    }


def apply_reviews():
    source, _ = authority()
    records = json.loads((DATA / "reviews.json").read_text(encoding="utf8"))[
        "decisions"
    ]
    scopes = versions(APPROVED)
    statements = [
        "LOCK TABLE staging.versification_map IN SHARE ROW EXCLUSIVE MODE;",
        gate(scopes, source["sha256"]),
    ]
    for r in records:
        e = r["edition"]
        if (
            e not in scopes
            or r["checksum"] != scopes[e]["checksum"]
            or r["ledger"] != scopes[e]["ledger"]
            or r["scheme"] != source["sha256"]
        ):
            raise ValueError("stale editorial receipt")
        if not r["reviewer"].strip() or not r["locator"].strip():
            raise ValueError("missing reviewer or written decision")
        date = datetime.fromisoformat(r["reviewed_at"].replace("Z", "+00:00"))
        if (
            not re.fullmatch(r"[a-f0-9]{64}", r["claim"])
            or r["decision"] not in ("APPROVED", "DISPUTED", "REVOKED")
            or date.utcoffset() is None
            or date > datetime.now(timezone.utc)
        ):
            raise ValueError("invalid claim, decision or editorial timestamp")
        where = f"claim={q(r['claim'])} AND edition={q(e)} AND checksum={q(r['checksum'])} AND ledger={q(r['ledger'])} AND scheme={q(r['scheme'])} AND active"
        statements.append(f"""DO $$ BEGIN IF NOT EXISTS (SELECT FROM staging.versification_review
            WHERE claim={q(r["claim"])} AND receipt={q(fingerprint(r))}) AND NOT EXISTS (SELECT FROM staging.versification_map WHERE {where})
            THEN RAISE EXCEPTION 'review refers to stale or unknown candidate'; END IF; END $$;""")
        values = [
            r["claim"],
            r["decision"],
            r["reviewer"],
            r["reviewed_at"],
            fingerprint(r),
            r["locator"],
        ]
        statements.append(
            "INSERT INTO staging.versification_review (claim,decision,reviewer,reviewed_at,receipt,locator) VALUES ("
            + ",".join(map(q, values))
            + ") ON CONFLICT (claim,receipt) DO NOTHING;"
        )
    db(tx("\n".join(statements)))
    return len(records)
