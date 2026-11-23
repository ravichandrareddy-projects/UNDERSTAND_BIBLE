"""Reference-only resolver fixtures. No server, source text or external data required."""

from contextlib import redirect_stdout
from io import StringIO
import json
import unittest
from unittest.mock import patch
import engine
from resolver import Edition, result
from rules import Verse, evaluate


def edition(name, spec, extra_rows=()):
    rows = {}
    claims = []
    for i, (label, members, kind, state, override) in enumerate(spec, 1):
        ref = ("TST", "1", label)
        if kind != "absence":
            rows.setdefault(ref, Verse(i, "fixture", True))
        claims.append(
            {
                "id": name + str(i),
                "local": ref,
                "members": tuple(members),
                "kind": kind,
                "status": state,
                "receipt": "test-decision",
                "override": override,
            }
        )
    for ref in extra_rows:
        rows[ref] = Verse(len(rows) + 1, "fixture", True)
    return Edition({"edition": name}, rows, claims, ["TST"])


def reviewed(label, keys, kind="identity"):
    return label, keys, kind, "APPROVED", False


class Alignment(unittest.TestCase):
    def test_range_fails_closed_on_stale_receipt_or_inaccessible_staging(self):
        args = ["engine.py", "range", "eng-bsb", "tel-irv", "GEN", "2", "--label", "25"]
        for error, reason in [
            (ValueError("stale"), "STALE_OR_INVALID_EVIDENCE"),
            (PermissionError(), "STAGING_UNAVAILABLE_OR_DENIED"),
        ]:
            output = StringIO()
            with (
                patch("sys.argv", args),
                patch.object(engine, "load", side_effect=error),
                redirect_stdout(output),
            ):
                engine.main()
            record = json.loads(output.getvalue())
            self.assertEqual(
                (record["state"], record["reason"], record["rows"]),
                ("UNALIGNED", reason, []),
            )
            self.assertEqual(
                record["target"], {"edition": "tel-irv", "rights": "UNVERIFIED"}
            )

    def test_labels_and_unreviewed_claims_do_not_align(self):
        ref = ("TST", "1", "1")
        a = edition("a", [], [ref])
        b = edition("b", [], [ref])
        self.assertEqual(result(a, b, ref)["reason"], "NO_RULE")
        for state in ["PENDING", "DISPUTED", "REVOKED"]:
            a = edition("a", [("1", ["s"], "identity", state, False)])
            self.assertEqual(result(a, b, ref)["state"], "UNALIGNED")

    def test_reviewed_renumber_and_reverse(self):
        a = edition("a", [reviewed("1", ["std.7"])])
        b = edition("b", [reviewed("8", ["std.7"], "renumber")])
        self.assertEqual(result(a, b, ("TST", "1", "1"))["target"], [("TST", "1", "8")])
        self.assertEqual(result(b, a, ("TST", "1", "8"))["target"], [("TST", "1", "1")])

    def test_bridge_full_group_both_directions(self):
        a = edition("a", [reviewed("3-4", ["s3", "s4"], "bridge")])
        b = edition("b", [reviewed("8", ["s3"]), reviewed("9", ["s4"])])
        ref = ("TST", "1", "3-4")
        self.assertEqual(
            result(a, b, ref)["target"], [("TST", "1", "8"), ("TST", "1", "9")]
        )
        for label in ["8", "9"]:
            self.assertEqual(result(b, a, ("TST", "1", label))["target"], [ref])
        partial = edition("b", [reviewed("8", ["s3"])])
        self.assertEqual(result(a, partial, ref)["reason"], "INCOMPLETE_REVIEWED_GROUP")

    def test_many_to_many_and_subverse_discriminators(self):
        a = edition(
            "a", [reviewed("1a", ["s.1"], "split"), reviewed("1b", ["s.1"], "split")]
        )
        b = edition(
            "b", [reviewed("4", ["s.1"], "merge"), reviewed("5", ["s.1"], "merge")]
        )
        for x in (a, b):
            for claim in x.approved.values():
                claim["group"] = list(x.verses)
        self.assertEqual(len(result(a, b, ("TST", "1", "1a"))["target"]), 2)
        self.assertEqual(len(result(b, a, ("TST", "1", "5"))["target"]), 2)
        distinct = edition("b", [reviewed("4", ["s.2"])])
        self.assertEqual(result(a, distinct, ("TST", "1", "1a"))["state"], "UNALIGNED")

    def test_absence_is_distinct_from_unreviewed_or_note_only(self):
        a = edition("a", [reviewed("1", ["s"])])
        b = edition("b", [reviewed("9", ["s"], "absence")])
        r = result(a, b, ("TST", "1", "1"))
        self.assertEqual(
            (r["state"], r["reason"], r["target"]),
            ("UNALIGNED", "CONFIRMED_ABSENT", []),
        )
        b.verses["TST", "1", "10"] = Verse(1, "empty", False)
        self.assertEqual(result(b, a, ("TST", "1", "10"))["reason"], "NOTE_ONLY")

    def test_conflicting_and_pending_overrides_quarantine_rules(self):
        ref = ("TST", "1", "1")
        b = edition("b", [reviewed("1", ["s"])])
        a = edition("a", [reviewed("1", ["s"]), reviewed("1", ["other"])])
        self.assertEqual(result(a, b, ref)["reason"], "DISPUTED")
        a = edition(
            "a", [reviewed("1", ["s"]), ("1", ["s"], "identity", "PENDING", True)]
        )
        self.assertEqual(result(a, b, ref)["reason"], "PENDING_REVIEW")
        self.assertEqual(result(b, a, ref)["reason"], "OVERLAPPING_UNREVIEWED_CLAIM")
        revoked = edition("a", [("1", ["s"], "identity", "REVOKED", False)])
        self.assertNotEqual(a.revision, revoked.revision)

    def test_duplicate_target_needs_reviewed_split(self):
        a = edition("a", [reviewed("1", ["s"])])
        b = edition("b", [reviewed("2", ["s"]), reviewed("3", ["s"])])
        self.assertEqual(result(a, b, ("TST", "1", "1"))["reason"], "AMBIGUOUS_MEMBER")

    def test_unreviewed_split_partner_prevents_partial_positive(self):
        a = edition(
            "a",
            [
                reviewed("14", ["3JN.1.14"], "split"),
                ("15", ["3JN.1.14"], "split", "PENDING", False),
            ],
        )
        a.approved["TST", "1", "14"]["group"] = [("TST", "1", "14"), ("TST", "1", "15")]
        b = edition("b", [reviewed("14", ["3JN.1.14"], "merge")])
        self.assertEqual(result(a, b, ("TST", "1", "14"))["state"], "UNALIGNED")
        self.assertEqual(result(b, a, ("TST", "1", "14"))["state"], "UNALIGNED")

    def test_reference_only_chapter_moves_and_superscriptions(self):
        def make(name, coordinates):
            refs = {
                r: Verse(i, "fixture", True) for i, (r, m) in enumerate(coordinates)
            }
            claims = [
                {
                    "id": name + str(i),
                    "local": r,
                    "members": [m],
                    "kind": "renumber",
                    "status": "APPROVED",
                    "override": False,
                    "receipt": "synthetic",
                }
                for i, (r, m) in enumerate(coordinates)
            ]
            return Edition({"edition": name}, refs, claims, ["ROM", "PSA"])

        a = make(
            "a",
            [(("ROM", "14", "24"), "ROM.16.25"), (("PSA", "3", "title"), "PSA.3.1.0")],
        )
        b = make(
            "b", [(("ROM", "16", "25"), "ROM.16.25"), (("PSA", "3", "1"), "PSA.3.1")]
        )
        self.assertEqual(
            result(a, b, ("ROM", "14", "24"))["target"], [("ROM", "16", "25")]
        )
        self.assertEqual(result(a, b, ("PSA", "3", "title"))["state"], "UNALIGNED")
        self.assertEqual(
            a.ordered([("ROM", "unknown", "1")]), [("ROM", "unknown", "1")]
        )

    def test_rule_predicates_are_edition_bound(self):
        rows = {
            ("TST", "1", "1"): Verse(1, "a", True),
            ("TST", "1", "2"): Verse(2, "b", False),
        }
        chapters = {("TST", "1"): ["1", "2"]}

        def check(s):
            return evaluate(s, rows, chapters, {"TST"})

        self.assertTrue(check("Tst.1:1=Exist & Tst.1:2=Last"))
        self.assertTrue(check("Tst.1:2=NotExist"))
        self.assertIsNone(check("Tst.1:2=Exist"))
        self.assertIsNone(check("Tst.1:2=Guess"))
        chapters["TST", "1"] = ["1-2"]
        self.assertIsNone(check("Tst.1:2=Last"))
        self.assertIsNone(check("Tst.1:2=NotExist"))


if __name__ == "__main__":
    unittest.main()
