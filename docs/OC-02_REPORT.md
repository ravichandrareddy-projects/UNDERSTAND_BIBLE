# OC-02 · Bible source licensing and acquisition

2026-11-23 · Local research and acquisition checkpoint for owner review

**Five of six pilot editions were acquired and verified.** KJV remains held. The five archives total 13,238,028 bytes. The commercial operating model is open. Neither a free-service assumption nor a commercial commitment was used to clear an edition.

## Six-edition acquisition and importer test report

| Edition and official source ID |                  Books | Chapters | Verse markers | Original ZIP SHA-256                                               |
| ------------------------------ | ---------------------: | -------: | ------------: | ------------------------------------------------------------------ |
| World English Bible · engwebp  |                     66 |    1,189 |        31,103 | `e36d23c5d28517a69faf91654cc6fc6657a298d9b6d66496166491f3ceab9749` |
| Berean Standard Bible · engbsb |                     66 |    1,189 |        31,086 | `75ca91d5a5c69ca4cbdeabdb03ea1a458db20cf3966abe15d86df086acf7fbc4` |
| Douay-Rheims 1899 · engDRA     |                     73 |    1,334 |        35,811 | `28147740343e44cede8c86cffb91973f934ddd892a887f621f4df816ffc86834` |
| Telugu IRV · tel2017           |                     66 |    1,189 |        31,004 | `2c90088101dc614422e753f10b79dccae968db28a2fd979dfc5f82b944bf8b4f` |
| Hindi IRV · hin2017            |                     66 |    1,189 |        31,104 | `7fe5d5b089c42e3f1b1f533a8042a757aed773880f1e3e824fc905f8dd7f1f0a` |
| KJV · eng-kjv2006              | 66 in the source index |        — |             — | Held before archive download. No ZIP checksum.                     |

All five book sets matched their respective official tables of contents. Each canonical book had a contiguous sequence of chapter markers starting at 1. Each chapter had verse markers. The OT, NT and deuterocanonical chapter and verse-marker totals matched the corresponding edition's planning snapshot. The inventory records chapter-by-chapter counts and the literal labels of structural exceptions. It neither establishes wording fidelity verse by verse nor supplies cross-edition alignment. The unchanged archives preserve all headings, notes, labels and source-specific book ordering.

| Edition    | OT chapters / markers | NT chapters / markers | Additional books and observed differences                                                                                                                                      |
| ---------- | --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| WEB        | 929 / 23,145          | 260 / 7,958           | Front matter and glossary retained separately from the 66 canonical books.                                                                                                     |
| BSB        | 929 / 23,145          | 260 / 7,941           | 16 internal numeric gaps, including Matthew 17 between labels 20 and 22. The receipt retains all locations. This flags numbering for review.                                   |
| DRA        | 937 / 23,487          | 260 / 7,951           | Seven deuterocanonical books add 137 chapters and 4,373 markers. Daniel has 14 chapters and Esther has 16. A shared printed chapter number is insufficient for alignment.      |
| Telugu IRV | 929 / 23,129          | 260 / 7,875           | 88 bridge labels. For example, Deuteronomy 1 has a single 3–4 marker. The spans cover 100 additional numeric positions if expanded for diagnostics. Source rows remain intact. |
| Hindi IRV  | 929 / 23,145          | 260 / 7,959           | Differs from both Telugu IRV and WEB despite the same book and chapter totals.                                                                                                 |

## Licensing decisions

WEB, BSB and DRA have public-domain text evidence. WEB and BSB also have naming guidance for adaptations. The two IRVs are open copyrighted text under CC BY-SA 4.0. Credit, notices, licence links and modification conditions travel with their records. The local structural audit uses unchanged copies. External AI processing, embedding outputs, TTS and existing recordings are held for the IRVs. No media assets were acquired separately. Across the pilot, recorded performances have their own rights.

For KJV, eBible identifies the 1769 text with Strong's numbers and UK Crown rights. Cambridge also describes a UK permissions regime. The pilot has no approved territorial boundary. Owner options are a territorially scoped collection with an enforceable distribution policy, written permission for the intended use, or continuing the hold. The Cambridge notice was inspected through web research. Its separate direct snapshot request returned HTTP 403. The eBible notice and index are preserved locally. [Edition notice](https://ebible.org/details.php?id=eng-kjv2006) · [Cambridge notice](https://assets.cambridge.org/97805211/63347/copyright/9780521163347_copyright_info.pdf)

The machine-readable permissions list every requested action independently. Underlying text permissions for AI or speech do not cover third-party services or performances. Rights evidence was checked before each archive download and includes the source revision date, exact URL, retrieval time, raw snapshot hash and local snapshot path. The linking, licence and coverage checks fail closed. The first WEB recheck found an eBible replica identifier changing in the terminal footer. Both originals were retained. A regression test verifies that licence wording or date changes still stop acquisition.

## Source locations

- Edition records, conditions and evidence references are in [edition_rights.json](../data/rights/edition_rights.json). Study sources and upstream commits are in [study_sources.json](../data/rights/study_sources.json).
- Public [Bible manifests](../data/manifests/bible) contain original archive hashes and sizes, member filenames, member hashes, per-chapter counts, attribution and evidence references. [Study manifests](../data/manifests/study) also include field-presence profiles.
- Private originals are under `data/sources/bible-texts/raw/<edition>/<UTC-date>/<sha256>/`. Verbatim extracted USFM members are under `data/sources/bible-texts/working/`. Licence evidence is under `data/sources/evidence/<sha256>`. These directories remain ignored.
- The three independent study inputs contain six selected files. Theographic's separately attributed working projection has 8,926 directed source assertions. No cross-source identity merge, merged genealogy, coordinate selection or chronology reconciliation was performed. [Field and rights audit](OC-02_STUDY_SOURCES.md)
- The [adaptive-reading note](OC-02_READING_FOCUS.md) proposes a session-local estimate and separates user preferences, temporary focus and saved annotations. It changes no product behaviour.

## Commands and results

| Command                                                                                                                                          | Result                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `python -B packages/ingest/pilot.py acquire eng-web eng-bsb eng-dra tel-irv hin-irv`                                                             | Five official USFM archives retrieved following per-edition evidence checks.                                                                                                                                                                                      |
| `python -B packages/ingest/pilot.py verify eng-web eng-bsb eng-dra tel-irv hin-irv`                                                              | Five offline replays passed. Original byte counts, ZIP SHA-256, CRCs, member hashes, coverage, per-chapter inventory, label diagnostics and evidence matched.                                                                                                     |
| `python -B packages/ingest/study.py collect` and `python -B packages/ingest/study.py verify`                                                     | Three pinned sources, six raw files verified. During testing, TSV column-width counters were corrected to survive JSON key serialization.                                                                                                                         |
| `python -B packages/ingest/relationships.py`                                                                                                     | Repeated projection reproduced SHA-256 `3d7eeef7780c82a9b20ad35b5c66797227e7e2ed7896ccc18d39be053e0ef812`.                                                                                                                                                        |
| `python -B packages/ingest/test_pilot.py -v`                                                                                                     | Eight offline tests passed, including denial on changed evidence, blocked actions, corrupt ZIPs, missing books/chapters, immutable file handling, TSV round-trip and unmerged relationships. Windows required a permitted retry for the temporary-directory test. |
| `python -B -m tabnanny packages/ingest`                                                                                                          | Passed.                                                                                                                                                                                                                                                           |
| `node node_modules/eslint/bin/eslint.js apps/api --max-warnings=0` and `node node_modules/typescript/bin/tsc --noEmit -p apps/api/tsconfig.json` | Backend lint and typecheck passed. Antigravity's active frontend was outside the check scope.                                                                                                                                                                     |

The tools use Python's standard library for offline ZIP and evidence handling. No package installation, paid service or deployment was required. Direct source/evidence hosts were eBible.org, berean.bible, creativecommons.org, viz.bible, api.github.com and raw.githubusercontent.com. Web research additionally consulted Cambridge, GitHub, MDN, W3C and WHATWG. The Cambridge direct-access exception is recorded above.

## Coordination and remaining work

The owner's task includes the six-pilot acquisition subset described in the roadmap under OC-03. This checkpoint covers that requested subset only. OC-07 has no database schema available for an edition-rights seed. The source of truth for this checkpoint is a file-backed registry. The API contract has no new reader endpoint. Antigravity should keep using its current UI fixtures pending approved ingestion and serving contracts. Only OC-02 paths belong in the Git checkpoint.

The next decision is the owner's review of the five archives, territorial hold, derivative-use holds and OC-07 sequencing. Once authorised, OC-04 can parse the eligible archives into the planned structured representation. OC-05 versification maps, OC-08 content validation, any remaining source expansion and production publication are outstanding. [Milestone checklist](OC-02_CHECKLIST.md)
