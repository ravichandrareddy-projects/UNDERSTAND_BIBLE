# Codex Task 01 — Licence gate and six-edition source acquisition

Run this only after OC-01 is reviewed and approved.

Implement the foundation tasks OC-02 and OC-03 from `docs/OPENCODE_TASKS.md` for **Understand Bible**.

## A. Licence registry first
1. Read `docs/data/edition_catalogue.csv`, `docs/BIBLE_LICENSING_MATRIX.md`, `docs/PROJECT_DECISIONS.md`, and `AGENTS.md`.
2. Re-check the official edition details and licence pages immediately before importing any text.
3. Create a machine-readable rights record and evidence snapshot for each pilot edition.
4. Enforce default deny: if the required hosting/import permission is not clearly verified, do not download or ingest that edition. Record it as blocked and report why.
5. Keep display, hosting, offline, commercial, AI retrieval, embedding and audio permissions as separate flags. Do not infer permission in one category from another.

## B. Initial pilot editions
Use the six editions named in Roadmap M1:
- `eng-kjv` (eBible ID `eng-kjv2006`)
- `eng-web` (eBible ID `engwebp`)
- `eng-bsb` (eBible ID `engbsb`)
- `tel-irv` (eBible ID `tel2017`)
- `hin-irv` (eBible ID `hin2017`)
- `eng-dra` (eBible ID `engDRA`)

Use the edition detail page URLs from `docs/data/edition_catalogue.csv`. Inspect each page and obtain its official USFM download link from that page. Do not guess URL patterns. Respect source terms and rate limits (the existing task plan specifies no more than one request per second).

## C. Source archive handling
- Save untouched archives to `data/sources/bible-texts/raw/{edition_id}/{YYYY-MM-DD}/` or the storage location agreed in the architecture.
- Keep `data/sources/**` and other raw licensed source materials out of Git by default.
- Create `manifest.json` with edition ID, official source URL, exact file URL, retrieval timestamp, licence evidence URL, checked date, source filenames, archive SHA-256, file sizes and status.
- Preserve attribution and copyright notices.
- Verify archive integrity before extraction.
- Extract to a separate working directory; never modify the raw archive.

## D. Do not fetch everything yet
The CSV currently marks 21 editions as `CORE`, while Roadmap M1 calls for six initial pilot editions. Download only the six listed above in this task. Create a follow-up expansion checklist for the remaining 15 CORE editions, but do not acquire them until the six-edition pipeline passes parsing, versification and validation.

## E. Do not acquire restricted content
- Do not download NIV, ESV, NLT, NASB, CSB, NKJV, BSI O.V. or any edition with unclear or restricted permissions.
- Do not bulk-extract from API.Bible or YouVersion APIs.
- Do not place copyrighted text in Codex prompts, chat messages, issue descriptions or external AI contexts.
- Do not spend money, sign up for a paid plan, or create cloud storage automatically.

## Definition of done
Produce the manifests, evidence snapshots, hash report, downloaded file inventory and a report of blocked editions. Stop before implementing the USFM parser; that is the next task OC-04 after review of OC-02/03.
