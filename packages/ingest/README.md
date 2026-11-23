# OC-02 source tools

Run from the repository root with Python 3.10 or later. The acquisition and ZIP-inventory commands use its standard library. They run outside the serving API and preserve originals under ignored `data/sources/`. The registry, source receipts and tests are safe to keep in Git.

```sh
python -B packages/ingest/test_pilot.py -v
python -B packages/ingest/pilot.py verify eng-web eng-bsb eng-dra tel-irv hin-irv
python -B packages/ingest/study.py verify
python -B packages/ingest/relationships.py
```

Offline verification requires the private original files and evidence snapshots on this workstation. A clean checkout can run the synthetic gate tests. After authorised network access, use `acquire` in place of `verify` in the pilot command, or `study.py collect` for the six pinned study files. Run one live source collection at a time to respect provider request rates. Same-day repeats reuse verified receipts. KJV is registered with a territorial hold.

The source gate requires verified collection, storage and structural validation for the exact ID. It reads public sources over HTTPS, checks robots rules, limits requests and rejects redirects. It rechecks the reviewed evidence and verifies that the official detail page still links the exact archive and book index. A changed notice closes the gate pending owner review. Every evidence response has a raw SHA-256. The eBible detail-page comparison also records a hash excluding only the known machine label at the very end of its dated footer. All other evidence uses the original bytes. An approved baseline is a reviewed Git change, never an automatically refreshed hash.

The inventory reads ZIP members with CRC verification, rejects unsafe or duplicate names, checks book sets and contiguous chapter markers, and records verse-marker counts and label anomalies. It retains the full archive and stores verbatim USFM members separately by content hash. A member's original name is in its manifest. Signatures inside the archives are preserved as supplied. The current integrity check does not authenticate signatures with an independently trusted publisher key.

`data/rights/` contains edition-specific permissions and attribution conditions. Generated manifests are in `data/manifests/`. Unknown, held and unverified actions are denied. This milestone covers local collection and inventory. Future display, external AI, embeddings, narration and offline delivery must consult their own action and honour applicable conditions at the point of use. The importer test report and checklist are under `docs/`.
