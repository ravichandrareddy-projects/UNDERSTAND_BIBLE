# OC-04 · Five-edition USFM staging

**Owner review, 2026-11-23.** All 160,108 source verse markers across 337 canonical book instances and 6,090 chapters passed level-by-level validation and PostgreSQL readback. The stage contains 339 book documents including WEB front matter and glossary. Production has zero verses.

| Edition | Canonical books | Chapters | Verse rows | Exact verse ledger SHA-256 |
| --- | ---: | ---: | ---: | --- |
| English WEB | 66 | 1,189 | 31,103 | `bfee50b18c629aa302eee65a6dc033c5780dd7803b34bed79066134b83b2ef23` |
| English BSB | 66 | 1,189 | 31,086 | `c0e296e4aedddd3f79294e4c48ffde32bea25a5cdd42b553b2011e8ae276f658` |
| English Douay-Rheims | 73 | 1,334 | 35,811 | `6bf31bb569fa9ed2052643a7c19199aedfe54f12c674c2ab7040b52f5fd88edc` |
| Telugu IRV | 66 | 1,189 | 31,004 | `6725f7eb47fc312130dc34da2a9f38d6e5570f713d554c434e22e82679dde398` |
| Hindi IRV | 66 | 1,189 | 31,104 | `f0dd6b64646418788f3287274111c2c670657882dc183b6c9f8c17bb9b1517b5` |

## What was checked

For each original ZIP the gate reconfirmed archive and member SHA-256, CRC, book coverage, per-chapter counts and licence evidence. A local parser converts the observed pilot marker vocabulary to USJ. It preserves source labels, word attributes, paragraph styles, notes and Unicode. Unsupported markers and unbalanced inline spans fail the import. An independent line renderer compares every plain verse. The projection removes markup, normalizes ASCII layout whitespace, keeps original text code points and creates a separate NFC column. Private USJ and source bytes retain formatting. The parser is scoped to these five archives. A new edition with different syntax requires review and fixtures.

Each private ledger entry records book, source chapter, ordinal, printed label, start and exclusive end byte offsets, SHA-256 of the original source span and SHA-256 of the projected UTF-8 text. A span runs from a verse marker to the next verse or chapter marker, so it can include adjacent layout or notes. The verifier reads back the staged UTF-8 checksum, NFC, stored USJ and ordered annotations and compares the ledger to the archive bytes. [Machine-readable results and private ledger locations](../data/manifests/validation/oc04.json)

The database has 11,221 headings, 2,308 introductions, 9,477 footnotes, 340 cross-references and 1,356 metadata nodes. The full book USJ retains context. Annotation anchors record source order and the preceding verse label. A heading before the first verse has a null anchor.

## Numbering findings

- **Telugu IRV.** All 88 bridge labels remain single source rows, covering 100 additional numeric addresses when counted diagnostically. DEU 1:3-4 is one row. Replaying the complete Telugu import returned the same ledger SHA-256 and row count.
- **BSB.** Sixteen printed labels are absent inside chapters. In every case the immediately preceding verse has a footnote whose body mentions the missing number. The affected labels are MAT 17:21, 18:11, 23:14; MRK 7:16, 9:44, 9:46, 11:26, 15:28; LUK 17:36, 23:17; JHN 5:4; ACT 8:37, 15:34, 24:7, 28:29; ROM 16:24. The notes and adjacent sequence are preserved. ZEC 12:1 begins inside a superscription. Its heading and verse survived the round-trip check.
- **Chapter ends.** A comparison of BSB, WEB and Hindi IRV shows different final labels at 3JN 1 (14/14/15), REV 12 (17/17/18), ROM 14 (23/26/23) and ROM 16 (27/25/27), in that edition order. These observations do not establish cross-edition equivalence. OC-05 owns mapping.
- **Douay-Rheims.** TOB, JDT, WIS, SIR, BAR, 1MA and 2MA account for 137 chapters and 4,373 rows. Daniel retains 14 chapters and Esther 16.
- **WEB.** LUK 17:36, ACT 8:37, 15:34, 24:7 and ROM 16:25 each have a source verse marker and a footnote with empty verse-body text. Staging preserves all five markers and their notes.

## Source-date reconciliation

| Edition | Edition notice | Embedded source-file date |
| --- | --- | --- |
| WEB | 2026-10-30 | 2026-11-21 |
| Douay-Rheims | 2022-11-03 | 2026-11-13 |
| Telugu IRV | 2020-02-11 | 2023-04-19 |

Both values are retained with distinct meanings. The registry uses the archived bytes' SHA-256 as version identity. Each embedded value is read from the original ZIP's `copr.htm`, whose member SHA-256 is verified and recorded. BSB's two values agree on 2026-10-30 and Hindi IRV's on 2023-04-11. This resolves how to identify and reproduce these sources. A publisher explanation for the different dates was not available.

## Commands, evidence and limits

1. `python -B packages/ingest/recheck.py` matched the five editions' official evidence on eBible, Berean and Creative Commons. The first run stopped on eBible's terminal replica identifier changing from `e` to `c`. The underlying rights wording and dates matched. Both raw snapshots remain private. The regression test allows only named footer variants. The completed receipt is `data/sources/evidence/rechecks/2026-11-23T16-28-14+00-00.json`.
2. `python -B packages/ingest/parse/stage.py eng-web eng-bsb eng-dra tel-irv hin-irv` ran against the seeded local database. Windows required a permitted retry for the private temp folder. The first BSB diagnostic exposed the ZEC superscription. The importer stopped that edition, the parser was corrected, and all remaining editions passed. Each replacement is atomic per edition. Telugu was replayed separately.
3. `python -B packages/ingest/parse/validate_staging.py` verified database readback against each source and wrote the review receipt. `python -B packages/ingest/parse/test_usfm.py -v` passed four fixture tests including bridge labels, nested content, scripture-free multilingual Unicode samples, empty markers and fatal diagnostics. `python -B packages/ingest/test_pilot.py -v` passed all eight existing offline source-gate tests.
4. The original ZIPs and private ledgers stay under ignored `data/sources/bible-texts/`. [Archive manifests and original hashes](../data/manifests/bible) · [Parser and verifier](../packages/ingest/parse)

The database received only the five approved editions. All parsing and verification ran locally. No additional editions or audio were acquired. Owner review precedes OC-05 alignment, production seeding or reader publication.
