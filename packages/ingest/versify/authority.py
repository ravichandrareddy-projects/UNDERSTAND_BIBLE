"""Verify and optionally restore the single approved metadata source."""

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from source_io import ROOT, Client, digest, save

SOURCE = ROOT / "data/versification/tvtms-source.json"
REVISION = "83d8d2924a8cd2b7b98b80f997aff9546a56391cda9c60a3cbb3fcc451342347"
README = "261d5157c0ffeadeedad3f734db945a4c3642e3e4ce5fa28002985b6c52437b1"


def authority(restore=False):
    record = json.loads(SOURCE.read_text(encoding="utf8"))
    if record["sha256"] != REVISION or record["evidence"][0]["sha256"] != README:
        raise PermissionError("mapping authority needs renewed verification")
    if record["licence"] != "CC BY 4.0" or any(
        record["permissions"].get(action) != "VERIFIED"
        for action in (
            "store",
            "local_processing",
            "derive",
            "redistribute_with_credit",
        )
    ):
        raise PermissionError("mapping metadata permissions unavailable")
    client = (
        Client({"raw.githubusercontent.com", "creativecommons.org"})
        if restore
        else None
    )
    for ref in record["evidence"]:
        path = ROOT / ref["snapshot"]
        data = client.get(ref["url"]) if client else path.read_bytes()
        if digest(data) != ref["sha256"]:
            raise PermissionError("licence snapshot changed")
        if client:
            save(path, data)
    path = ROOT / record["raw_path"]
    data = client.get(record["url"]) if client else path.read_bytes()
    if digest(data) != REVISION or len(data) != record["bytes"]:
        raise PermissionError("source version changed")
    lines = data.decode("utf-8-sig").splitlines()
    if "CC BY 4.0" not in lines[9] or "NRSV-based" not in lines[0]:
        raise PermissionError("unexpected file-specific notice or coordinate system")
    if client:
        save(path, data)
    return record, lines


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--restore",
        action="store_true",
        help="recheck notices before restoring the pinned metadata",
    )
    record, lines = authority(p.parse_args().restore)
    print(record["source_id"], record["sha256"], len(lines), "lines")
