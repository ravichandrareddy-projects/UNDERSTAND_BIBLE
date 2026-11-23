# Private verse alignment

Run the commands from the repository root with the OC-07 PostgreSQL owner connection. The five original archives, verified licence snapshots, OC-04 ledgers and staged rows must be present. The engine reads content hashes, literal source references and body-presence flags. Its command-line results contain reference metadata only. [Database setup](../../db/README.md) · [Staging procedure](../../../docs/OC-04_REPORT.md)

```sh
python -B packages/db/foundation.py up
python -B packages/ingest/versify/authority.py
python -B packages/ingest/versify/engine.py build
python -B packages/ingest/versify/engine.py apply-reviews
python -B packages/ingest/versify/engine.py report
python -B packages/ingest/versify/engine.py range tel-irv eng-web DEU 1 --label 3-4
python -B packages/ingest/versify/engine.py range eng-web eng-bsb GEN 2 --label 25
python -B packages/ingest/versify/test_alignment.py -v
python -B packages/ingest/versify/test_staged.py -v
```

On a fresh authorized staging workstation, `authority.py --restore` restores only the pinned TVTMS metadata and its rights evidence. It verifies the receipt hashes. A changed source or notice requires renewed review. [Source manifest](../../../data/versification/tvtms-source.json)

## Editorial review

1. Open the coverage receipt. Each edition lists its private compressed review queue, SHA-256, and the candidate IDs for Genesis 2:25. BSB also lists missing-label candidates. Each native queue row contains book, chapter, literal label, ordinal, body SHA-256, state and candidate IDs. [Coverage receipt](../../../data/manifests/validation/oc05.json)
2. Run `python -B packages/ingest/versify/engine.py inspect CLAIM_SHA256`. Inspect the TVTMS file at the specified 1-based physical line and the edition at the exact archive and OC-04 ledger coordinates. Evaluate tradition, exceptions, any bridge or split, and the published edition's original reference in private staging. Each supported candidate is bounded to one literal local row or an explicit absence.
3. For a missing or disputed correspondence, leave it unresolved or submit a justified proposal. A manual proposal is a JSON object in a JSON-compatible YAML array at `data/versification/overrides/EDITION.yaml`. Supply `edition`, `checksum`, `ledger`, `scheme`, literal `local` triplet, ordered standard `members`, `kind`, exact local `anchors` (each with `local` and `sha256`), `authority_lines` and `rationale`. A multi-row local group must enumerate every member in `local_group` and provide their anchors in each claim. Store each actual editorial decision separately.
4. An authorized reviewer records a written decision covering the exact claim, date, evidence and exceptions. Record its immutable claim ID, `edition`, `checksum`, `ledger`, `scheme`, `decision` (APPROVED, DISPUTED or REVOKED), `reviewer`, timezone-aware `reviewed_at` and written decision `locator` in the version-controlled register. This is an administrative workflow. Repository change control establishes reviewer authority. A confidence or a passing test cannot supply an approval. [Review register](../../../data/versification/reviews.json)
5. Rebuild, replay the register, run the report and inspect both directions. The range command accepts a whole native chapter or one exact label and optionally `--expect-revision HASH`. Each side needs compatible reviewed coverage of the entire group. A stale pair revision or incomplete group returns `UNALIGNED`. Carry the edition identity, licence conditions, source credits and both editions' independent positions into any future approved reader integration.
