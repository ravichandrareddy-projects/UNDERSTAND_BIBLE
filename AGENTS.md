# Understand Bible — Project Instructions for Codex

## Product identity
- Product name: **Understand Bible**.
- Product vision: a multilingual Bible reading and understanding platform with continuous reading, side-by-side translations, verse discovery, a chapter-level UNDERSTAND experience, people and genealogy exploration (Vamsavali), biblical geography and timelines, and personal reading plans.
- The planning documents in `docs/` are the current project source of truth. Read the relevant documents before each task.

## Team and ownership
- Claude: planning architect; maintains product decisions and documentation when available.
- Codex: core engineering and data lead. Owns repository setup, API, database, contracts, reference parser, Bible ingestion, licensing policy, search, AI pipelines, genealogy/geography/timeline data, infrastructure, and backend tests.
- Antigravity: UI/UX and frontend lead. Owns `apps/web/**`, `apps/review/**`, `packages/ui/**`, `packages/i18n/**`, and `e2e/**` unless a later written decision changes this.
- ChatGPT / project owner: product and quality review; final approval of product, licence and spending decisions.
- Treat the old `OpenCode` owner references in the planning documents as **Codex**. Preserve the existing task IDs (OC-01 etc.) for traceability; do not mass-edit source planning documents merely to rename the agent.

## Required reading
Before implementation, read:
- `docs/MASTER_PRODUCT_VISION.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/BIBLE_DATA_ARCHITECTURE.md`
- `docs/BIBLE_TRANSLATION_CATALOGUE.md`
- `docs/BIBLE_LICENSING_MATRIX.md`
- `docs/PROJECT_DECISIONS.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/OPENCODE_TASKS.md` (treat it as the Codex task list)
- `docs/ANTIGRAVITY_TASKS.md`
- `docs/GENEALOGY_AND_TIMELINE_PLAN.md`

## Source-of-truth and change control
- Do not silently resolve conflicts in the planning pack. Record each conflict in `docs/DECISION_REQUESTS.md` with options, recommendation, impact, and required owner decision.
- Keep original Claude planning files intact. Add revised decisions in a clearly dated decision log or new document.
- The project name is now **Understand Bible**. The old phrase “the Platform” may remain in research prose, but use “Understand Bible” in product-facing UI and new documentation.
- Keep D-001 business model open until the owner decides. Use the draft's non-commercial V1 assumption only as a temporary planning default; do not make legal commitments or tell publishers it is final.

## Critical content and licensing rules
- Scripture text must be imported verbatim from an approved, named source edition. Never generate or reconstruct Bible verses with an LLM.
- The edition catalogue is a research snapshot, not final legal advice. Re-check official publisher/source terms immediately before each import and record evidence, date checked, URL, and licence snapshot hash.
- Default deny: do not download, store, host, cache, index, embed, send to AI, create offline bundles, or produce audio for an edition unless the relevant permission is VERIFIED for that specific action.
- Do not bypass APIs, authentication, rate limits, robots rules, or publisher controls. Do not bulk-extract from APIs where prohibited.
- Do not put restricted source text in Git, issue trackers, chat prompts, or external model context. Keep raw source archives out of Git by default; use manifests and checksums in Git.
- Use only official source URLs in the catalogue or repositories identified in the planning documents. Ask for approval before accepting paid plans, paid APIs, cloud services, subscriptions, or other spend.
- Do not expose secrets, tokens, OAuth credentials, `.env` files, or Codex auth files. Never commit credentials.

## Data provenance and correctness
- Every acquired source needs a manifest: source URL, publisher/repository, edition or dataset ID, retrieval timestamp, licence status/evidence, source version or Git commit, file list, SHA-256, and attribution.
- Preserve original downloads unchanged. Parse into separate processed outputs.
- Preserve edition-specific book order, verse labels, bridges, headings, notes, omissions, additions, and versification.
- Do not align verses by printed number alone. Use the planned standard verse key and mapping data, with explicit handling for splits, merges, bridges, omissions, and extra verses.
- Genealogy must use typed relationships (parent, child, spouse, sibling, adoptive/legal, ancestor, successor, dynasty, etc.) and carry source references, provenance, and confidence labels. Never infer a missing parent as fact.
- Keep Matthew 1 and Luke 3 genealogies as separate source accounts. Do not silently force them into one lineage.
- Separate historical facts, archaeological evidence, chronology hypotheses, and theological interpretations. Dates can be disputed; preserve alternative chronologies and uncertainty.
- Location identifications must have evidence and confidence. Never invent coordinates or present uncertain locations as certain.

## Engineering workflow
- Work in small, reviewable tasks matching `docs/OPENCODE_TASKS.md` and `docs/DEVELOPMENT_ROADMAP.md`.
- Do not start all tasks at once. Complete dependencies and acceptance criteria in sequence.
- Codex owns backend/data paths. Coordinate API contracts before Antigravity consumes them. Do not edit Antigravity-owned paths without explicit coordination.
- Run tests, lint, typecheck, and relevant validation before reporting completion. Report exact commands and results; never claim tests passed if they were not run.
- Create/update `docs/STATUS.md`, `docs/DECISION_REQUESTS.md`, and task reports as needed.
- Never use dangerous full-access / YOLO mode for routine work. Request approval for network access and commands when required.

## Immediate milestone
1. Audit the planning docs and record open decisions / conflicts.
2. Implement OC-01 repository scaffold and local development environment only.
3. After owner review, implement OC-02 licence registry and the G-LIC-1 gate.
4. Then implement OC-03 source acquisition for the six pilot editions named in the roadmap. The CSV currently marks 21 editions as CORE; treat six as the initial smoke-test set and expand to the remaining CORE editions only after acquisition, parsing, versification, and validation pass.
5. Build data ingestion and the reader API before asking Antigravity to connect real Bible content.

## Completion report format
For each task report:
- Task ID and scope
- Files changed
- Decisions made / decisions requested
- Commands run and test results
- Downloads or network hosts accessed
- Licence evidence and manifest locations
- Known gaps / risks
- Exact next task recommended
