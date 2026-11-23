# Interactive Bible Platform — Planning Documents

Prepared 2026-11-21 for human review and approval. Start with **MASTER_PRODUCT_VISION.md**, then answer the questions at the top of **PROJECT_DECISIONS.md**.

| # | File | One-line purpose |
|---|---|---|
| 1 | MASTER_PRODUCT_VISION.md | Vision, principles, scope summary, key constraints |
| 2 | PRODUCT_REQUIREMENTS.md | V1 boundaries; functional (FR-*) and non-functional (NFR-*) requirements |
| 3 | USER_JOURNEYS.md | Personas and 14 journeys (J1–J14) |
| 4 | BIBLE_TRANSLATION_CATALOGUE.md | 81 researched editions by language with coverage, source and V1 role |
| 5 | BIBLE_LICENSING_MATRIX.md | Per-edition permissions for display, hosting, offline, commercial, AI, embeddings, audio |
| 6 | CANON_AND_TRADITION_RESEARCH.md | Protestant, Catholic, Orthodox, Oriental canons; naming; versification |
| 7 | BIBLE_DATA_ARCHITECTURE.md | Identifiers, schema, versification mapping, ingest & validation |
| 8 | AI_AND_SEARCH_STRATEGY.md | Verse Finder, voice, UNDERSTAND pipeline and AI safeguards |
| 9 | GENEALOGY_AND_TIMELINE_PLAN.md | People/relationship model, confidence labels, chronology model |
| 10 | UI_UX_DESIGN_REQUIREMENTS.md | Screens, typography per script, RTL, mobile, accessibility |
| 11 | TECHNICAL_ARCHITECTURE.md | Stack, components, repository ownership, deployment |
| 12 | SECURITY_AND_PRIVACY_REQUIREMENTS.md | DPDP/GDPR, privacy and security controls, content integrity |
| 13 | TESTING_AND_ACCEPTANCE_CRITERIA.md | Test layers, golden cases, acceptance criteria, launch checklist |
| 14 | DEVELOPMENT_ROADMAP.md | Phases P0–P5, milestones, critical path, risks |
| 15 | ANTIGRAVITY_TASKS.md | Frontend/design/browser-validation tasks AG-01…AG-30 |
| 16 | OPENCODE_TASKS.md | Backend/data/search/AI/testing tasks OC-01…OC-37 |
| 17 | PROJECT_DECISIONS.md | Questions Q-01…Q-12 and decisions D-001…D-020 |

`data/edition_catalogue.csv` is the machine-readable version of the catalogue and licensing matrix (one row per edition), used by OpenCode to seed the licence registry.

**Research caveats:** licence statuses were checked on 2026-11-21 and must be re-verified at import. eBible book/chapter/verse counts come from a mirror snapshot of eBible's catalogue (newest row 2024-07-18) because ebible.org downloads were not reachable from the research environment; live eBible pages were read for licence terms. YouVersion Platform's terms page could not be read directly, so YouVersion terms are marked NOT VERIFIED. Nothing here is legal advice.
