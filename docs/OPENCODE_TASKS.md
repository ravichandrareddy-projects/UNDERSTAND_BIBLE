# OPENCODE TASKS — Backend, Data, Search, AI, Testing

**Status:** Draft for human review · **Date:** 2026-11-21
**Role:** OpenCode builds the backend, database, source imports, versification, search, AI integrations, background jobs, infrastructure and automated backend testing.
**Counterpart:** Antigravity (`ANTIGRAVITY_TASKS.md`) builds the interface and validates it in browsers.

---

## 0. Operating rules for OpenCode (read before every task)

1. **Read first:** `PRODUCT_REQUIREMENTS.md`, `BIBLE_DATA_ARCHITECTURE.md`, `TECHNICAL_ARCHITECTURE.md`, `BIBLE_LICENSING_MATRIX.md`, `PROJECT_DECISIONS.md`. If a task conflicts with these, stop and raise a decision request in `docs/DECISION_REQUESTS.md` (create if absent) rather than improvising.
2. **Own only your paths:** `apps/api/**`, `packages/{contracts,refparser,db,ingest,search,ai,policy}/**`, `data/**`, `infra/**`, root config files. Never edit `apps/web/**`, `apps/review/**`, `packages/ui/**`, `packages/i18n/**`, `e2e/**`. Need a UI change? Open an issue labelled `antigravity`.
3. **Contracts first:** any API change starts as a PR to `packages/contracts/openapi.yaml` with version bump and example payloads; Antigravity is a required reviewer.
4. **Licence rules are code:** never store, embed, cache offline or send to an AI provider any edition whose `edition_rights` flag disallows it. Do not bypass API rate limits or access controls; do not bulk-extract from APIs (API.Bible prohibits this).
5. **No Scripture from models.** No code path may display model-generated verse text.
6. **Never upload copyrighted full texts to external AI systems**, including coding assistants' context. Use public-domain fixtures (KJV/WEB) in tests.
7. **Provenance:** every import writes a manifest (URL, timestamp, SHA-256, licence snapshot hash).
8. **Definition of done (all tasks):** code + tests + docs in package README; CI green; acceptance criteria demonstrated in the PR description; no TODOs without issue links.

Task fields: **Phase · Depends on · Inputs · Outputs (owned paths) · Acceptance criteria · Requirements covered**.

---

## Phase P0–P1 — Foundations

### OC-01 Monorepo, CI and environments
- **Phase:** P0 · **Depends on:** — 
- **Inputs:** TECHNICAL_ARCHITECTURE §3–§4, §6.
- **Outputs:** root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, lint/format/tsconfig bases, `infra/docker-compose.yml` (Postgres+pgvector, Redis, MinIO, TEI), `.github/workflows/*`, `CODEOWNERS` reflecting the ownership map, `apps/api` skeleton with health endpoint.
- **Acceptance:** `pnpm i && pnpm dev` starts API + services locally; CI runs lint/typecheck/test on PR; CODEOWNERS routes paths to the right agent; preview environment deploys on PR.

### OC-02 Licence registry and rights evidence (gate G-LIC-1)
- **Phase:** P0–P1 · **Depends on:** OC-01, OC-07
- **Inputs:** `docs/data/edition_catalogue.csv`, BIBLE_LICENSING_MATRIX.
- **Outputs:** `packages/ingest/rights/*` (fetch licence page, snapshot to object storage, hash, diff against approved record), `data/rights/edition_rights.yaml` (approved records, public fields only), seed into `edition_rights`.
- **Acceptance:** for every CORE edition a snapshot + hash exists; changing a snapshot fixture makes import fail with a clear message; NOT VERIFIED / PERMISSION REQUIRED editions cannot be imported (test).
- **Covers:** FR-LIC-02, NFR-INT-02.

### OC-03 Source acquisition
- **Phase:** P1 · **Depends on:** OC-02
- **Inputs:** eBible details pages for CORE editions (USFM zips).
- **Outputs:** `packages/ingest/acquire/*`; originals in object storage `sources/{edition}/{date}/`; `manifest.json` (URL, date, SHA-256, file list, book list).
- **Acceptance:** re-running is idempotent; manifests for all CORE editions; download respects robots/terms and rate (≤1 request/sec); counts recomputed from files and compared with catalogue snapshot (differences reported, not failed).

### OC-04 USFM parsing and normalisation
- **Phase:** P1 · **Depends on:** OC-03
- **Inputs:** USFM 3 spec; `usfm3` parser (npm/WASM) or equivalent; BIBLE_DATA_ARCHITECTURE §3–§4.
- **Outputs:** `packages/ingest/parse/*` producing USJ + verse/heading/footnote records; diagnostics report.
- **Acceptance:** all CORE editions parse with zero fatal diagnostics; verse labels incl. bridges ("4-5") preserved; headings and notes separated; `text_plain` round-trip check V-06 passes; Unicode NFC applied without code-point substitution; fixtures for Telugu, Arabic, Chinese, Malayalam (ZWJ/ZWNJ) included.

### OC-05 Versification engine
- **Phase:** P1 (continues P2) · **Depends on:** OC-04, OC-07
- **Inputs:** STEPBible TVTMS (CC BY 4.0, pinned commit), Paratext `.vrs` standard files (licence check), CANON_AND_TRADITION_RESEARCH §3.
- **Outputs:** `packages/ingest/versify/*`, `data/versification/{scheme}.json`, `data/versification/overrides/{edition}.yaml`, tables `versification_scheme`, `versification_map`, `edition_versification_override`; diagnostic report per edition (bridges, omissions, renumbering).
- **Acceptance:** documented definition of the `std` scheme (and how it relates to TVTMS's standard); V-07 passes for all CORE editions; Telugu and Kannada IRV verse-count gaps explained item by item in the report; goldens GT-01…GT-09 pass at API level.

### OC-06 Canon definitions and book names
- **Phase:** P1 · **Depends on:** OC-07
- **Inputs:** CANON_AND_TRADITION_RESEARCH §2, edition `\h`/`\toc` markers.
- **Outputs:** `data/canons/*.yaml` (protestant, catholic, orthodox-greek, orthodox-slavonic [metadata], ethiopian [metadata]), `data/book-names/{lang}.yaml` (name, short, abbreviations, spoken forms), seeds.
- **Acceptance:** each canon validates (no unknown codes, unique ordinals); names for all 14 UI languages present for the 66 books + deuterocanon where used; native-review flag per file; Esdras naming per §2.3 encoded.

### OC-07 Database schema and migrations
- **Phase:** P1 · **Depends on:** OC-01
- **Outputs:** `packages/db/*` (migrations, typed queries, seeds), schemas `content`, `study`, `userdata` with least-privilege roles.
- **Acceptance:** migrations up/down on empty DB; partitioned `verse` table; RLS on `userdata`; ERD generated into package README.

### OC-08 Content validation suite
- **Phase:** P1 · **Depends on:** OC-04, OC-05
- **Outputs:** `packages/ingest/validate/*` implementing V-01…V-12; HTML/JSON report per import; fixtures for E2E (`data/fixtures/`) consumed by Antigravity.
- **Acceptance:** an injected error (missing verse, duplicate, wrong script, hash mismatch) fails the import with a precise message; reports archived per content version.

### OC-09 Reader API
- **Phase:** P1 · **Depends on:** OC-07, OC-29
- **Inputs:** BIBLE_DATA_ARCHITECTURE §5; FR-RDR-*.
- **Outputs:** `apps/api/routes/{editions,canons,chapters,resolve}.ts`; OpenAPI paths; CDN cache headers.
- **Acceptance:** `limit=4` initial portion and paging; responses include content version + attribution; p95 ≤150 ms cached / ≤400 ms uncached on staging; contract tests pass.
- **Covers:** FR-RDR-02/03/04/12/13/14, FR-ED-02/03/04.

### OC-29 Licence policy engine
- **Phase:** P1 · **Depends on:** OC-02
- **Outputs:** `packages/policy/*` (`assertAllowed`, response decorators, denial logging).
- **Acceptance:** tests generated from `docs/data/edition_catalogue.csv` assert allowed/denied actions for every edition; default deny for unknown editions.

### OC-11 Multilingual reference parser
- **Phase:** P1 · **Depends on:** OC-06
- **Outputs:** `packages/refparser/*` (isomorphic: browser + Node), golden tests per language incl. native digits, ordinals, spoken forms, ranges ("John 3:16-18", "Ps 23; 24"), ambiguous abbreviations.
- **Acceptance:** ≥40 goldens per language pass; GT-12 passes; bundle ≤30 KB gz for the browser build (book data loaded per language).
- **Covers:** FR-RDR-01, FR-SRCH-01, FR-VOICE-01.

## Phase P2 — Read & compare

### OC-10 Parallel alignment API
- **Depends on:** OC-05, OC-09
- **Outputs:** `apps/api/routes/parallel.ts`, precompute job per content-version pair.
- **Acceptance:** aligned rows per BIBLE_DATA_ARCHITECTURE §5 example; merges/splits/absences represented; GT-01…GT-09 pass end-to-end; any pair of live editions supported.
- **Covers:** FR-PAR-01…04.

### OC-12 Authentication and accounts
- **Depends on:** OC-07
- **Outputs:** auth module (email magic link, Google OAuth; passkeys P1), sessions, CSRF, account deletion hooks.
- **Acceptance:** ASVS L2 auth controls; rate-limited; tests for link reuse/expiry; anonymous-to-account migration endpoint.
- **Covers:** FR-ACC-01/02.

### OC-13 User data and sync APIs
- **Depends on:** OC-12, OC-05
- **Outputs:** `/v1/me/{position,bookmarks,highlights,notes,history,settings}`; sync protocol (per-item `updated_at`, tombstones, idempotent upserts); note encryption (envelope, KMS).
- **Acceptance:** offline-created items sync without duplicates (AC-RDR-5); highlights anchored to SVKs (GT-10); export endpoint returns complete data.
- **Covers:** FR-RDR-05…10, FR-ACC-03/04, PR-05.

### OC-14 Lexical search and normalisation
- **Depends on:** OC-09
- **Outputs:** `packages/search/normalise/*` (per-script folding, Chinese segmentation), FTS + trigram indexes, exact-phrase across verse boundaries.
- **Acceptance:** unit tests per script; exact-phrase queries in all 14 languages return expected verses from fixtures; display text unchanged.
- **Covers:** FR-SRCH-01/02/04.

## Phase P3 — Find, understand, explore

### OC-15 Embedding pipeline
- **Depends on:** OC-14, OC-29
- **Outputs:** TEI service config (BGE-M3), job to embed verse + 3-verse windows for embed-permitted editions; pgvector HNSW indexes.
- **Acceptance:** policy engine blocks non-permitted editions (test); re-embedding only on content-version change; throughput and storage documented.

### OC-16 Verse Finder API
- **Depends on:** OC-11, OC-14, OC-15
- **Outputs:** `/v1/search` implementing AI strategy §2 (intent, lexical, semantic, RRF, grouping by SVK, user-edition mapping, match types, explanation strings).
- **Acceptance:** AC-SRCH-2…7; p95 ≤1.5 s; never returns a result without SVK + edition.

### OC-17 Search evaluation set and harness
- **Depends on:** OC-16
- **Outputs:** `packages/search/eval/*` with ≥300 queries (native-speaker reviewed), metrics report, CI job comparing to baseline.
- **Acceptance:** report with Recall@10, MRR, nDCG, latency per language; gates enforced in release pipeline (D-010 trigger documented).

### OC-27 Spoken-form lexicon for voice
- **Depends on:** OC-06, OC-11
- **Outputs:** spoken forms of book names and number words (1–176) for 14 languages in `data/book-names/*`; parser support for "chapter/verse" words per language.
- **Acceptance:** 20-command transcript test set per language parses ≥95% correctly (text-only test, no audio).

### OC-18 People, places and events import
- **Depends on:** OC-07, OC-05
- **Inputs:** STEPBible TIPNR, Theographic, OpenBible geocoding (pinned versions), GENEALOGY plan §2–§4.
- **Outputs:** `packages/ingest/study/*`; tables `person`, `person_name`, `relationship`, `person_mention`, `place`, `event`; reconciliation report; review queue for conflicts.
- **Acceptance:** G-01…G-03 pass; hard cases in plan §4 encoded and tested; attribution recorded; derived dataset export under CC BY-SA 4.0 (D-012).

### OC-19 Genealogy API
- **Depends on:** OC-18
- **Outputs:** `/v1/people?chapter=`, `/v1/people/{id}`, `/v1/people/{id}/graph?up=&down=`, `/v1/dynasties`.
- **Acceptance:** AC-GEN-1/2/4; graph queries ≤200 ms p95 for 5 generations.

### OC-20 Timeline data and API
- **Depends on:** OC-18
- **Outputs:** `data/timeline/*.yaml` (periods, events, datings with chronologies; defaults per D-013), `chapter_period` for 66 books, `/v1/timeline`.
- **Acceptance:** T-01…T-03; AC-TL-1/2 at API level; every dating has a source.

### OC-21 Cross-references
- **Depends on:** OC-05
- **Outputs:** OpenBible cross-reference import mapped to SVKs; `/v1/crossrefs?svk=`.
- **Acceptance:** attribution stored; top-N by votes per verse; mapping errors <0.5% (report).

### OC-22 UNDERSTAND generation pipeline
- **Depends on:** OC-18, OC-20, OC-21, OC-29; decision D-017 (provider)
- **Outputs:** `packages/ai/*`: provider adapter, grounding-packet builder, prompt templates (versioned), JSON schema, quote-placeholder filler, validators AV-01…AV-10, batch job with retries and cost logging.
- **Acceptance:** 50-chapter benchmark run with report; all outputs schema-valid; no model-written verse text reaches storage (test); restricted editions never in packets (test); model/prompt/packet hash stored.
- **Covers:** FR-UND-01…07/11.

### OC-23 Explanation review workflow backend
- **Depends on:** OC-22, OC-12
- **Outputs:** statuses and transitions, assignments, comments, diffs, audit log, report intake from users, admin APIs for `apps/review`.
- **Acceptance:** E2E-14 passes with Antigravity's console; RBAC tests; sensitive-register chapters cannot publish without theological approval.

## Phase P4 — Grow & harden

### OC-24 Explanation translation pipeline
- **Depends on:** OC-22, OC-23
- **Outputs:** glossary per language (names from `person_name`/edition), translation job, target-edition quote filling, language review queue.
- **Acceptance:** Telugu and Hindi quick overviews for all 1,189 chapters produced and queued; validators re-run in target language.

### OC-25 Reading plans engine
- **Outputs:** `data/plans/*.yaml` (built-in plans), plan generator for custom schedules, `/v1/plans`, `/v1/me/plans`.
- **Acceptance:** AC-DAILY-3; plans expressed in SVK ranges so they work for any edition.

### OC-26 Reminders and notifications
- **Outputs:** worker for Web Push (VAPID) and email; timezone-aware scheduling; quiet hours; unsubscribe.
- **Acceptance:** AC-DAILY-1 (±2 min); retries; no PII in push payloads beyond reading portion title.

### OC-28 Offline bundles
- **Depends on:** OC-29
- **Outputs:** bundle generator per open edition (`{BOOK}.json.br` + signed manifest), `/v1/offline/*`.
- **Acceptance:** bundles only for `can_offline=true`; signature verification test vectors shared with Antigravity; sizes reported.

### OC-30 Observability, rate limiting, hardening
- **Outputs:** OpenTelemetry setup, dashboards, alerts, rate limits, security headers on API, incident runbook.
- **Acceptance:** SLO dashboards live; alert tests; ASVS L2 checklist for API complete.

### OC-31 Performance and load tests
- **Outputs:** k6 scenarios (chapter reads, parallel, search, sync).
- **Acceptance:** 10× expected launch load with p95 within NFR targets on staging.

### OC-32 Privacy compliance features
- **Outputs:** consent records, export/delete jobs, retention jobs, record of processing data map.
- **Acceptance:** AC-ACC-2/3; deletion verified by automated query; retention jobs scheduled.

### OC-34 Content operations CLI
- **Outputs:** `pnpm content import|validate|publish|rollback --edition=…`.
- **Acceptance:** publish/rollback atomic; audit entries written.

## V1.1 tasks (after launch, only with permissions in place)

| ID | Task | Gate |
|---|---|---|
| OC-33 | Licensed Edition Adapter (API.Bible first): live fetch, ≤30-day cache, FUMS reporting, `display_only` flag, verse-count limits | Signed plan/licence; LR-6 |
| OC-35 | Server ASR fallback for Indian languages (evaluate Bhashini, AI4Bharat IndicConformer, Whisper-class) | Privacy review |
| OC-36 | Audio catalogue and streaming (Telugu IRV audio, BSB audio, licensed audio) | Audio licences verified |
| OC-37 | Explanations for deuterocanon; remaining 11 languages | Editorial capacity |

## Dependency graph (summary)

```text
OC-01 → OC-07 → OC-02 → OC-03 → OC-04 → OC-05 → OC-10
                       ↘ OC-29 → OC-09 ↗        ↘ OC-13 (needs OC-12)
OC-06 → OC-11 → OC-16 ← OC-14 ← OC-09 ; OC-15 → OC-16 → OC-17
OC-05 → OC-18 → OC-19 ; OC-18 → OC-20 ; OC-05 → OC-21
OC-18 + OC-20 + OC-21 + OC-29 → OC-22 → OC-23 → OC-24
OC-29 → OC-28 ; OC-12 → OC-26 ; OC-25
```
