# OC-05 · Private verse alignment

**2026-11-23 · Editorial review pending.** All four engineering work packages ran against local PostgreSQL 17.12. Across 160,108 native rows and 20 directions, 640,432 lookups returned `UNALIGNED`. There are 12,798 evidence-backed proposals, zero approved claims, zero confirmed absences and zero verified pair results. The owner left Genesis 2:25 pending in every edition. V-07 remains open. [Approved plan](OC-05_PLAN.md) · [Coverage receipt](../data/manifests/validation/oc05.json)

## Evidence and rights

STEPBible's NRSV-based TVTMS in **Older Formats** supplies the D-005 standard coordinate. Newer TVTMS uses a different standard. This receipt pins the upstream commit `5de0a47f35f0fc13dfe1430d104e5db8a4285f9c`, file SHA-256 `83d8d2924a8cd2b7b98b80f997aff9546a56391cda9c60a3cbb3fcc451342347`, 5,398,278 bytes and 27,808 physical lines. The permissions check on 2026-11-23 verified the upstream README, file-specific CC BY 4.0 notice and licence terms. The manifest records evidence URLs, timestamps, snapshot checksums and permitted actions. Credit belongs to STEPBible.org, based on work at Tyndale House, Cambridge. Understand Bible extracted mapping metadata and evaluated rules against private edition inventories. The raw file and evidence snapshots remain in ignored storage. Paratext contributed zero rules because the optional input lacks a pinned file-specific receipt and edition applicability decision. [Source manifest](../data/versification/tvtms-source.json) · [Standard definition](../data/versification/standard.json) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Each pair read checks verified storage, text validation and local retrieval grants for both editions, the current staging ledgers and the mapping-source permission. The resolver hashes staged bodies inside PostgreSQL and checks every native coordinate, ordinal and hash against its immutable OC-04 ledger. The response carries edition identity, archive hash, ledger hash, terms, attribution and mapping-source credit. WEB and BSB retain their naming conditions and DRA retains the historical edition credit. Both IRVs retain Bridge Connectivity Solutions attribution, notices, changes disclosure and applicable CC BY-SA 4.0 conditions. Their external AI, embedding and synthesized-speech actions remain held. KJV remains unavailable. The business model is undecided. [Edition receipts](../data/manifests/bible) · [Edition rights](../data/rights/edition_rights.json)

The acquisition was limited to mapping metadata and licence evidence from `raw.githubusercontent.com` and `creativecommons.org`. Research also consulted the upstream project pages on `github.com`. The engine uses the existing five Bible inputs. The database checks found zero production verses and zero published versions. The reader role could not read the alignment tables.

At closeout, all five private Bible archives matched their OC-02 SHA-256 receipts. Git tracks no files under `data/sources/`.

## Staging coverage

| Edition | Native rows | Pending native rows | Missing-label proposals | Native rows without a candidate, including note-only | Standard positions in native books awaiting review |
| --- | ---: | ---: | ---: | ---: | ---: |
| WEB | 31,103 | 2,153 | 0 | 28,950 | 31,423 |
| BSB | 31,086 | 2,137 | 16 | 28,949 | 31,423 |
| Douay-Rheims | 35,811 | 4,191 | 0 | 31,620 | 36,186 |
| Telugu IRV | 31,004 | 2,138 | 0 | 28,866 | 31,423 |
| Hindi IRV | 31,104 | 2,163 | 0 | 28,941 | 31,423 |

The 12,782 proposed native rows and 16 proposed BSB absences have no recorded decisions or explicit disputes. The local database also retains 90 inactive proposals from development runs for audit. Five WEB rows have a printed label and a footnote but an empty verse body. Each of the 16 BSB gaps lacks a native marker and has an adjacent note mentioning the number. Neither observation authorizes a cross-edition mapping. Telugu keeps each bridge as one native row. The seven additional DRA books contain 4,373 rows. Daniel and Esther additions within existing books remain in the editorial queue. The report lists each edition's version, per-book standard positions, exact absence proposals and checksummed private queue. [Staging results](../data/manifests/validation/oc05.json)

| Left edition | Right edition | Left → right unaligned | Right → left unaligned |
| --- | --- | ---: | ---: |
| WEB | BSB | 31,103 | 31,086 |
| WEB | Douay-Rheims | 31,103 | 35,811 |
| WEB | Telugu IRV | 31,103 | 31,004 |
| WEB | Hindi IRV | 31,103 | 31,104 |
| BSB | Douay-Rheims | 31,086 | 35,811 |
| BSB | Telugu IRV | 31,086 | 31,004 |
| BSB | Hindi IRV | 31,086 | 31,104 |
| Douay-Rheims | Telugu IRV | 35,811 | 31,004 |
| Douay-Rheims | Hindi IRV | 35,811 | 31,104 |
| Telugu IRV | Hindi IRV | 31,004 | 31,104 |

Verified coverage is **0% in every direction**. Of the 640,432 directional results, 17,492 identify a book outside the target edition's native catalogue (4,373 DRA rows × four partners). The remaining 622,940 are unresolved. The counts use native source rows as their denominator. A single row therefore occurs once for each of its four partners.

## Engineering and validation

1. The source gate verifies pinned evidence offline. The standard retains optional numeric subverse segments, including zero. Unsupported source expressions remain open.
2. Migration 005 adds a private versioned authority, candidate registry, edition overrides and review history. A candidate ID binds its edition, archive and ledger hashes, rule revision, source lines, local evidence and ordered standard members. Retiring an approved candidate records a revocation. A reviewer, timestamp and written decision locator are required for a review event.
3. The importer tests explicit keep/renumber rules with supported existence, absence and chapter-end predicates. A source marker or ordinal alone never creates a proposal. A qualified result still needs editorial review of its applicability. Complex moves, ambiguous compounds, titles and unhandled predicates require more evidence or an edition-specific override. Numeric standard inventory positions describe the review denominator.
4. The staging CLI composes compatible reviewed memberships in both directions and preserves opaque labels and native order. Partial or conflicting groups, stale data and unreviewed rows fail closed. Synthetic reference fixtures exercise positive splits, merges and many-to-many results. The live pilot currently supplies no editorial positive control.

| Command or check | Observed result |
| --- | --- |
| `python -B packages/ingest/versify/authority.py` | Pinned mapping file, header and rights evidence passed. |
| `python -B packages/db/foundation.py up` and `python -B packages/db/test_migrations.py` | Applied migration 005 on private staging. All five migrations passed up/up/down/up on a separate disposable PostgreSQL 17.12 cluster. The fixture tested invalid reviewer rollback, review replay, revocation and reader isolation. |
| `python -B packages/ingest/versify/engine.py build`, `apply-reviews`, `report` | Repeated builds returned 12,798 active candidates and candidate-set SHA-256 `422891fd69eb631eb252ca3c3fdeff6ddb43c7d11e633b9dd9c54e65de9d13b2`. Zero decisions replayed. Repeated coverage SHA-256 `025dcf7c431ba1fa1849b4949c16074ee7c7c3e85c88ab5b18f41aa149b17046`. |
| `python -B packages/ingest/versify/test_alignment.py -v` | Eleven reference-only tests passed, including positive and reverse groups, superscription segments, chapter moves, incomplete groups, stale evidence, denied range lookup and revocation. |
| `python -B packages/ingest/versify/test_staged.py -v` | Seven live tests passed on the five accepted versions. The tests recomputed every directional outcome and checked bridge, gap, book, owner-hold, grant, ledger and publication cases. |
| `engine.py range eng-web eng-bsb GEN 2 --label 25` and `engine.py inspect` on its candidate | Returned `UNALIGNED / PENDING_REVIEW`. The claim identified TVTMS line 3698 and had zero reviews. Supplying a stale `--expect-revision` yielded `STALE_PAIR_REVISION`. |
| `python -B packages/ingest/parse/test_usfm.py -v` and `python -B packages/ingest/test_pilot.py -v` | Four parser tests and eight offline acquisition-policy tests passed. |
| `pnpm test`, `pnpm typecheck`, ESLint and Ruff | The existing infrastructure, API and frontend suites passed (1 + 9 + 5 tests). Both workspace typechecks passed. ESLint and Ruff passed. Windows required subprocess access for the Node suites and writable temporary directories for the offline acquisition tests. |
| `prettier --check .` and `git diff --check` | Repository formatting and whitespace checks passed. The coverage receipt uses LF for stable file hashing on Windows checkouts. |

Changes are confined to the new staging migration, migration tests, `packages/ingest/versify/`, `data/versification/`, the OC-05 coverage receipt, backend CI checks and project documentation. Detailed operational commands and the editorial register format are in the workflow. [Operator and reviewer instructions](../packages/ingest/versify/README.md) · [Checklist](OC-05_CHECKLIST.md)

## Next editorial task

Use the five Genesis 2:25 claim IDs in the coverage receipt to inspect TVTMS line 3698 and the edition-specific evidence. Continue with Telugu DEU 1:3-4, the BSB MAT 17:21 gap and DRA DAN 13. A named reviewer can approve, dispute or leave each case pending. Record only written decisions, then rerun both directions. Broader scheme coverage, including superscriptions and integrated additions, depends on this review. KJV/WLC and public reader API or UI goldens remain outside the approved staging milestone. [Review workflow](../packages/ingest/versify/README.md) · [Owner decisions](DECISION_REQUESTS.md)
