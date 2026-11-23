"""Project Theographic relationship assertions without inventing or joining edges."""
import json

from source_io import RAW, ROOT, digest, save, write_json
from study import run

FIELDS = ("mother", "father", "children", "partners", "siblings",
          "halfSiblingsSameMother", "halfSiblingsSameFather")


def project(rows):
    ids = {row["id"] for row in rows}
    for row in rows:
        for field in FIELDS:
            targets = row["fields"].get(field, [])
            if not isinstance(targets, list):
                raise ValueError(f"unexpected relationship shape in {field}")
            for target in targets:
                yield {"source_person_id": row["id"], "relationship_field": field,
                       "target_person_id": target, "target_in_people_table": target in ids,
                       "evidence": f"json/people.json#{row['id']}/fields/{field}",
                       "confidence": "source_asserted_unreviewed", "passage_evidence": None,
                       "genealogy_account": None}


if __name__ == "__main__":
    record = json.loads((ROOT / "data/rights/study_sources.json").read_text(encoding="utf8"))["theographic"]
    manifest = run("theographic", record, None, offline=True)
    people = next(f for f in manifest["files"] if f["path"] == "json/people.json")
    rows = json.loads((ROOT / people["raw_path"]).read_bytes())
    edges = list(project(rows))
    data = b"".join((json.dumps(edge, sort_keys=True) + "\n").encode() for edge in edges)
    path = RAW / "study-working/theographic" / manifest["commit"] / "relationships.jsonl"
    save(path, data)
    write_json(ROOT / "data/manifests/study/theographic" / manifest["commit"] / "relationships.json",
               {"dataset_id": "theographic-relationships", "source_url": people["source_url"],
                "source_sha256": people["sha256"], "commit": manifest["commit"],
                "source_manifest": "manifest.json", "licence": "CC BY-SA 4.0",
                "attribution": manifest["attribution"], "changes": "Projected named relationship fields into directed rows.",
                "output": path.relative_to(ROOT).as_posix(), "sha256": digest(data),
                "assertions": len(edges), "unresolved_targets": sum(not e["target_in_people_table"] for e in edges)})
    print(f"{len(edges)} source assertions; SHA-256 {digest(data)}")
