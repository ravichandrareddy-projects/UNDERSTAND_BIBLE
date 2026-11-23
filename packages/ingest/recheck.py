"""Refresh only licence and index evidence for the approved local archives."""

import json
from pilot import Client, REGISTRY, ROOT, check_sources
from source_io import now, write_json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "db"))
from foundation import APPROVED


def recheck():
    client = Client({"ebible.org", "berean.bible", "creativecommons.org"})
    records = json.loads(REGISTRY.read_text(encoding="utf8"))["editions"]
    receipts = {}
    for edition in APPROVED:
        receipts[edition] = check_sources(client, records[edition])
        print(edition, "evidence matched", flush=True)
    timestamp = now()
    path = (
        ROOT
        / "data/sources/evidence/rechecks"
        / (timestamp.replace(":", "-") + ".json")
    )
    write_json(path, {"checked_at": timestamp, "editions": receipts})
    print(path.relative_to(ROOT))


if __name__ == "__main__":
    recheck()
