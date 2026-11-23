import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from inventory import inventory
from pilot import PILOTS, REGISTRY, check_sources, require_actions, review_hash
from relationships import project
from source_io import digest, save
from study import profile


def archive(files):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        for name, content in files.items():
            z.writestr(name, content)
    return buf.getvalue()


class PilotTests(unittest.TestCase):
    def test_tsv_profile_survives_manifest_round_trip(self):
        stats = profile("names.txt", b"A\tB\nC\n")
        self.assertEqual(stats, json.loads(json.dumps(stats)))

    def test_scope_and_absent_grants_deny(self):
        rows = json.loads(REGISTRY.read_text(encoding="utf8"))["editions"]
        self.assertEqual(set(rows), PILOTS)
        for rec in ({}, {"permissions": {"collect": "VERIFIED"}}, rows["eng-kjv"]):
            with self.assertRaises(PermissionError):
                require_actions(rec, ["collect"])
        for key in ["tel-irv", "hin-irv"]:
            for action in ["external_ai", "embed", "synthesize_speech", "recorded_audio", "unknown"]:
                with self.assertRaises(PermissionError):
                    require_actions(rows[key], [action])

    def test_changed_evidence_stops_before_any_archive_request(self):
        record = json.loads(REGISTRY.read_text(encoding="utf8"))["editions"]["eng-web"]
        data = b"new rights notice"
        with patch("pilot.evidence", return_value=({"sha256": digest(data)}, data)) as fetch:
            with self.assertRaisesRegex(PermissionError, "evidence changed"):
                check_sources(None, record)
            fetch.assert_called_once_with(None, record["evidence"][0]["url"])

    def test_only_the_known_replica_suffix_is_ignored(self):
        url = "https://ebible.org/details.php?id=test"
        body = b"rights A Last updated 2026-11-23   e</p></body></html>"
        self.assertEqual(review_hash(url, body), review_hash(url, body.replace(b"   e<", b"   tiny3<")))
        for before, after in [(b"A ", b"B "), (b"11-23", b"11-24"), (b"   e<", b"   restricted<")]:
            self.assertNotEqual(review_hash(url, body), review_hash(url, body.replace(before, after)))

    def test_inventory_keeps_literal_bridges_and_separate_ancillary_book(self):
        blob = archive({"01.sfm": "\\id GEN\n\\c 1\n\\v 1 X\n\\v 3-4 X",
                        "front.sfm": "\\id FRT\n", "notice.txt": "test"})
        r = inventory(blob, ["GEN"])
        self.assertEqual(r["counts"], {"books": 1, "chapters": 1, "verse_markers": 2})
        self.assertEqual(r["noncanonical_files_by_id"], ["FRT"])
        self.assertEqual(r["label_findings"][1], ["GEN", "1", "3-4", "bridge or suffix"])

    def test_invalid_inventory_and_damaged_zip_fail(self):
        for files in [{"x.sfm": "\\id EXO\n"}, {"x.sfm": "\\id GEN\n\\c 2\n\\v 1 X"},
                      {"../x.sfm": "\\id GEN\n"}, {"x.sfm": "\\id GEN\n\\c 1\n"}]:
            with self.subTest(files=list(files)), self.assertRaises(ValueError):
                inventory(archive(files), ["GEN"])
        blob = archive({"x.sfm": "\\id GEN\n\\c 1\n\\v 1 synthetic"})
        with self.assertRaises(zipfile.BadZipFile):
            inventory(blob.replace(b"synthetic", b"corrupted"), ["GEN"])

    def test_raw_storage_is_idempotent_and_refuses_overwrite(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "archive"
            save(path, b"first")
            save(path, b"first")
            with self.assertRaises(ValueError):
                save(path, b"second")
            self.assertEqual(path.read_bytes(), b"first")

    def test_links_remain_directional_and_unknown_parent_stays_absent(self):
        result = list(project([{"id": "a", "fields": {"partners": ["b"]}},
                               {"id": "b", "fields": {}}]))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["relationship_field"], "partners")
        self.assertIsNone(result[0]["passage_evidence"])


if __name__ == "__main__":
    unittest.main()
