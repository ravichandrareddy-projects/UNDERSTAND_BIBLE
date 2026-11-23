"""OC-05 private staging CLI. Never emits Scripture text."""

import argparse
from collections import Counter
import gzip
from itertools import permutations
import json
from pathlib import Path
from tempfile import NamedTemporaryFile

from registry import (
    APPROVED,
    ROOT,
    authority,
    apply_reviews,
    build,
    db,
    gate,
    manifest,
    q,
    snapshot,
    versions,
)
from resolver import Edition, result
from rules import encoded, fingerprint, standard_inventory
from source_io import RAW, digest, save

REPORT = ROOT / "data/manifests/validation/oc05.json"


def load(ids):
    source, _ = authority()
    scopes = versions(ids)
    rows, claims = snapshot(scopes, source["sha256"])
    editions = {
        e: Edition(
            v,
            rows[e],
            claims[e],
            manifest(e)["inventory"]["books_in_source_index_order"],
        )
        for e, v in scopes.items()
    }
    return source, editions


def pair_revision(source, a, b):
    return fingerprint([source["sha256"], a.version, a.revision, b.version, b.revision])


def report():
    source, editions = load(APPROVED)
    _, lines = authority()
    hub = standard_inventory(lines)
    audits = json.loads(
        (ROOT / "data/manifests/validation/oc04.json").read_text(encoding="utf8")
    )
    edition_report = {}
    for e, x in editions.items():
        states = Counter()
        ledger = []
        for ref in x.ordered(x.verses):
            row = x.verses[ref]
            status = x.reason.get(
                ref,
                "APPROVED"
                if ref in x.approved
                else "NO_RULE"
                if row.has_text
                else "NOTE_ONLY",
            )
            states[status] += 1
            ledger.append(
                [
                    *ref,
                    row.ordinal,
                    row.sha,
                    status,
                    [c["id"] for c in x.claims.get(ref, ())],
                ]
            )
        data = gzip.compress(("\n".join(map(encoded, ledger)) + "\n").encode(), mtime=0)
        path = RAW / "versification" / "reports" / e / (digest(data) + ".jsonl.gz")
        save(path, data)
        expected = set().union(*(hub.get(book, set()) for book in x.books))
        covered = {
            key
            for c in x.approved.values()
            if c["kind"] != "absence"
            for key in c["members"]
        }
        absent = {
            key
            for c in x.approved.values()
            if c["kind"] == "absence"
            for key in c["members"]
        }
        edition_report[e] = {
            **x.version,
            "native_rows": len(x.verses),
            "review_revision": x.revision,
            "claims": sum(map(len, x.claims.values())),
            "row_status": dict(states),
            "review_queue": {
                "path": path.relative_to(ROOT).as_posix(),
                "sha256": digest(data),
            },
            "structural_exceptions": audits[e]["result"]["label_findings"],
            "note_only": audits[e]["result"]["empty_labels"],
            "genesis_2_25": [c["id"] for c in x.claims.get(("GEN", "2", "25"), ())],
            "absence_proposals": [
                {"local": ref, "claim": c["id"], "status": c["status"]}
                for ref, cs in sorted(x.claims.items())
                for c in cs
                if c["kind"] == "absence"
            ],
            "standard_side": {
                "reference_positions_in_native_books": len(expected),
                "approved_covered": len(expected & covered),
                "confirmed_absent": len(expected & absent),
                "unresolved": len(expected - covered - absent),
                "conflicting": len(covered & absent),
                "by_book": {
                    b: {
                        "total": len(hub.get(b, set())),
                        "covered": len(hub.get(b, set()) & covered),
                        "confirmed_absent": len(hub.get(b, set()) & absent),
                        "unresolved": len(hub.get(b, set()) - covered - absent),
                    }
                    for b in sorted(x.books)
                },
            },
            "reviewed_absence_claims": sum(
                c["kind"] == "absence" for c in x.approved.values()
            ),
        }
    pairs = []
    for left, right in permutations(editions, 2):
        a, b = editions[left], editions[right]
        counts = Counter()
        for ref in a.verses:
            outcome = result(a, b, ref)
            counts[outcome["reason"]] += 1
        total = sum(counts.values())
        verified = counts["VERIFIED"]
        pairs.append(
            {
                "from": left,
                "to": right,
                "revision": pair_revision(source, a, b),
                "rows": total,
                "aligned": verified,
                "unaligned": total - verified,
                "unresolved": total
                - verified
                - counts["BOOK_OUTSIDE_TARGET_CANON"]
                - counts["CONFIRMED_ABSENT"],
                "reasons": dict(sorted(counts.items())),
            }
        )
    return {
        "authority": source,
        "editions": edition_report,
        "pairs": pairs,
        "v07": "NOT_VERIFIED"
        if any(p["unresolved"] for p in pairs)
        else "REQUIRES_STANDARD_SIDE_AUDIT",
    }


def inspect_claim(cid):
    source, _ = authority()
    where = "m.claim=" + q(cid)
    edition = db("SELECT edition FROM staging.versification_map m WHERE " + where)
    scopes = versions([edition])
    sql = f"""BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; {gate(scopes, source["sha256"])}
      SELECT json_build_object('claim',to_jsonb(m),'reviews',coalesce((SELECT json_agg(to_jsonb(r) ORDER BY sequence)
        FROM staging.versification_review r WHERE r.claim=m.claim),'[]')) FROM staging.versification_map m WHERE {where};
      COMMIT;"""
    return json.loads(db(sql, private=True))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="cmd", required=True)
    commands.add_parser("build")
    commands.add_parser("apply-reviews")
    commands.add_parser("report")
    read = commands.add_parser("range")
    read.add_argument("source", choices=APPROVED)
    read.add_argument("target", choices=APPROVED)
    read.add_argument("book")
    read.add_argument("chapter")
    read.add_argument("--label")
    read.add_argument(
        "--expect-revision", help="pin a previously inspected pair revision"
    )
    inspect = commands.add_parser("inspect")
    inspect.add_argument("claim")
    args = parser.parse_args()
    if args.cmd == "build":
        print(encoded(build()))
    elif args.cmd == "apply-reviews":
        print("Editorial decisions replayed:", apply_reviews())
    elif args.cmd == "inspect":
        print(encoded(inspect_claim(args.claim)))
    elif args.cmd == "report":
        summary = report()
        temp = None
        try:
            with NamedTemporaryFile(dir=REPORT.parent, delete=False) as out:
                temp = Path(out.name)
                out.write(
                    (json.dumps(summary, ensure_ascii=False, indent=2) + "\n").encode()
                )
            temp.replace(REPORT)
        finally:
            if temp:
                temp.unlink(missing_ok=True)
        print(
            "Directions:",
            len(summary["pairs"]),
            "native rows:",
            sum(x["native_rows"] for x in summary["editions"].values()),
        )
    else:
        if args.source == args.target:
            parser.error("select two distinct editions")
        try:
            authority_record, editions = load([args.source, args.target])
        except (ValueError, PermissionError, FileNotFoundError, RuntimeError) as error:
            reason = (
                "STALE_OR_INVALID_EVIDENCE"
                if isinstance(error, ValueError)
                else "STAGING_UNAVAILABLE_OR_DENIED"
            )
            print(
                encoded(
                    {
                        "state": "UNALIGNED",
                        "reason": reason,
                        "rows": [],
                        "source": {"edition": args.source, "rights": "UNVERIFIED"},
                        "target": {"edition": args.target, "rights": "UNVERIFIED"},
                    }
                )
            )
            return
        a, b = editions[args.source], editions[args.target]
        revision = pair_revision(authority_record, a, b)
        if args.expect_revision and revision != args.expect_revision:
            print(
                encoded(
                    {
                        "state": "UNALIGNED",
                        "reason": "STALE_PAIR_REVISION",
                        "revision": revision,
                        "source": a.version,
                        "target": b.version,
                        "mapping_source": authority_record["url"],
                        "mapping_attribution": authority_record["attribution"],
                        "rows": [],
                    }
                )
            )
            return
        refs = (
            [(args.book, args.chapter, args.label)]
            if args.label
            else [ref for ref in a.verses if ref[:2] == (args.book, args.chapter)]
        )
        rows = []
        seen = set()
        for ref in a.ordered(refs):
            if ref in seen:
                continue
            record = result(a, b, ref)
            seen.update(record["source"])
            if record["state"] == "UNALIGNED":
                record["source_candidates"] = [c["id"] for c in a.claims.get(ref, ())]
            rows.append(record)
        state = (
            "ALIGNED"
            if rows and all(row["state"] == "ALIGNED" for row in rows)
            else (
                "PARTIAL"
                if any(row["state"] == "ALIGNED" for row in rows)
                else "UNALIGNED"
            )
        )
        print(
            encoded(
                {
                    "source": a.version,
                    "target": b.version,
                    "mapping_source": authority_record["url"],
                    "mapping_attribution": authority_record["attribution"],
                    "revision": revision,
                    "state": state,
                    "reason": None if rows else "UNKNOWN_SOURCE_RANGE",
                    "rows": rows,
                }
            )
        )


if __name__ == "__main__":
    main()
