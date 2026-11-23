"""Regression suite on the five real staging versions. Does not approve any real mapping."""

from collections import Counter
from itertools import permutations
import json
import unittest
from engine import APPROVED, REPORT, ROOT, load, result
from registry import db, gate, versions
from rules import override_claim
from authority import authority


class Staged(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source, cls.ed = load(APPROVED)
        cls.audit = json.loads(
            (ROOT / "data/manifests/validation/oc04.json").read_text(encoding="utf8")
        )
        cls.report = json.loads(REPORT.read_text(encoding="utf8"))

    def test_all_telugu_bridges(self):
        tel = self.ed["tel-irv"]
        expected = {
            (b, c, label)
            for b, c, label, _ in self.audit["tel-irv"]["result"]["label_findings"]
        }
        actual = {ref for ref in tel.verses if "-" in ref[2]}
        self.assertEqual(expected, actual)
        self.assertEqual(len(expected), 88)
        self.assertEqual(
            sum(
                int(label.split("-")[1]) - int(label.split("-")[0])
                for b, c, label in actual
            ),
            100,
        )
        for ref in actual:
            for e, partner in self.ed.items():
                if e == "tel-irv":
                    continue
                response = result(tel, partner, ref)
                self.assertIn(ref, response["source"])
                if ref not in tel.approved:
                    self.assertEqual(
                        (response["state"], response["target"]), ("UNALIGNED", [])
                    )
                    first, last = map(int, ref[2].split("-"))
                    for marker in range(first, last + 1):
                        reverse = (*ref[:2], str(marker))
                        if reverse in partner.verses:
                            self.assertNotIn(
                                ref, result(partner, tel, reverse)["target"]
                            )

    def test_all_bsb_gaps_and_footnotes(self):
        bsb = self.ed["eng-bsb"]
        notes = self.audit["eng-bsb"]["bsb_gap_notes"]
        self.assertEqual(len(notes), 16)
        for n in notes:
            ref = n["book"], n["chapter"], n["absent_label"]
            self.assertNotIn(ref, bsb.verses)
            self.assertTrue(any(c["kind"] == "absence" for c in bsb.claims[ref]))
            self.assertTrue(n["adjacent_note_labels_mentioning_number"])
            for label in n["adjacent_note_labels_mentioning_number"]:
                self.assertIn((*ref[:2], label), bsb.verses)
        for b, ch, label in self.audit["eng-web"]["result"]["empty_labels"]:
            self.assertFalse(self.ed["eng-web"].verses[b, ch, label].has_text)
        self.assertEqual(len(self.audit["eng-web"]["result"]["empty_labels"]), 5)

    def test_seven_dra_books_and_integrated_additions(self):
        dra = self.ed["eng-dra"]
        seven = {"TOB", "JDT", "WIS", "SIR", "BAR", "1MA", "2MA"}
        refs = [r for r in dra.verses if r[0] in seven]
        self.assertEqual({r[0] for r in refs}, seven)
        self.assertEqual(len(refs), 4373)
        for e, partner in self.ed.items():
            if e == "eng-dra":
                continue
            self.assertEqual(dra.books - partner.books, seven)
            for ref in refs:
                if ref not in dra.approved:
                    self.assertEqual(
                        result(dra, partner, ref)["reason"], "BOOK_OUTSIDE_TARGET_CANON"
                    )
        for book, last in (("DAN", 14), ("EST", 16)):
            self.assertEqual(max(int(r[1]) for r in dra.verses if r[0] == book), last)
        self.assertEqual(sum(ref[:2] == ("DAN", "3") for ref in dra.verses), 100)
        for ref in (
            ("DAN", "3", "100"),
            ("DAN", "13", "1"),
            ("DAN", "14", "1"),
            ("EST", "16", "1"),
            ("PSA", "9", "1"),
        ):
            self.assertIn(ref, dra.verses)
            self.assertEqual(result(dra, self.ed["eng-web"], ref)["state"], "UNALIGNED")

    def test_all_directions_and_unique_coverage(self):
        directions = {(p["from"], p["to"]): p for p in self.report["pairs"]}
        self.assertEqual(set(directions), set(permutations(APPROVED, 2)))
        for (left, right), expected in directions.items():
            a, b = self.ed[left], self.ed[right]
            tally = Counter(result(a, b, r)["reason"] for r in a.verses)
            self.assertEqual(tally, expected["reasons"])
            self.assertEqual(len(a.verses), expected["aligned"] + expected["unaligned"])
        self.assertEqual(sum(p["rows"] for p in directions.values()), 640432)

    def test_sample_owner_hold(self):
        ref = ("GEN", "2", "25")
        for e, x in self.ed.items():
            self.assertTrue(x.claims[ref])
            self.assertEqual(x.reason[ref], "PENDING_REVIEW")
        self.assertEqual(
            result(self.ed["tel-irv"], self.ed["eng-web"], ref)["state"], "UNALIGNED"
        )

    def test_override_anchors_scope_and_duplicate_members(self):
        source, lines = authority()
        x = self.ed["tel-irv"]
        ref = ("DEU", "1", "3-4")
        anchor = {"local": list(ref), "sha256": x.verses[ref].sha}
        record = {
            **x.version,
            "scheme": source["sha256"],
            "local": list(ref),
            "members": ["DEU.1.3", "DEU.1.4"],
            "kind": "bridge",
            "anchors": [anchor],
            "authority_lines": [3698],
            "rationale": "synthetic validation only",
        }
        # The editor must judge the cited passage; this test only exercises structural admission.
        for changes in (
            {"members": ["DEU.1.3", "DEU.1.3"]},
            {"local": ["DEU", "1", "4"], "kind": "absence"},
            {"anchors": [{**anchor, "sha256": "0" * 64}]},
            {"local": ["GEN", "2", "25"]},
        ):
            with self.assertRaises(ValueError):
                override_claim(
                    source, lines, x.version, x.verses, x.books, {**record, **changes}
                )

    def test_rights_on_both_sides_and_no_public_access(self):
        scopes = versions(["eng-web", "tel-irv"])
        for edition in scopes:
            with self.assertRaisesRegex(RuntimeError, "alignment rights"):
                db(
                    f"BEGIN; UPDATE content.permission SET status='REVIEW' WHERE edition='{edition}' AND action='local_retrieval';"
                    + gate(scopes, self.source["sha256"])
                    + "ROLLBACK;"
                )
        with self.assertRaisesRegex(RuntimeError, "alignment rights"):
            db(
                "BEGIN; UPDATE staging.versification_scheme SET permitted=false;"
                + gate(scopes, self.source["sha256"])
                + "ROLLBACK;"
            )
        stale = versions(["eng-web"])
        stale["eng-web"]["ledger"] = "0" * 64
        with self.assertRaisesRegex(RuntimeError, "alignment rights"):
            db("BEGIN;" + gate(stale, self.source["sha256"]) + "ROLLBACK;")
        with self.assertRaises(PermissionError):
            versions(["eng-kjv"])
        self.assertEqual(
            db("SELECT count(*) FROM content.version WHERE published"), "0"
        )
        self.assertEqual(db("SELECT count(*) FROM content.verse"), "0")
        with self.assertRaisesRegex(RuntimeError, "permission denied"):
            db("SET ROLE ub_reader; SELECT count(*) FROM staging.versification_map;")
        for e in ("tel-irv", "hin-irv"):
            for a in ("external_ai", "embed", "synthesize_speech"):
                self.assertEqual(db(f"SELECT content.allowed('{e}','{a}')"), "f")


if __name__ == "__main__":
    unittest.main()
