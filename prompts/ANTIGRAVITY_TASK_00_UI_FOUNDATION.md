# Antigravity Task 00 — Understand Bible UI foundation

You are the UI/UX and frontend engineering agent for **Understand Bible**. Codex owns backend, database, data ingestion, contracts, search and AI. Read root `AGENTS.md` and the relevant docs before starting.

Run this after Codex completes the OC-01 shared repository scaffold. Your primary source documents are:
- `docs/MASTER_PRODUCT_VISION.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/USER_JOURNEYS.md`
- `docs/UI_UX_DESIGN_REQUIREMENTS.md`
- `docs/ANTIGRAVITY_TASKS.md`
- `docs/TECHNICAL_ARCHITECTURE.md`

## First assignment: AG-01, then propose AG-02/03/04
Build only the PWA app shell and app scaffold described by AG-01. Preserve the ownership boundaries in `AGENTS.md`.

Create the visual direction for a calm, premium Bible reading product:
- warm paper / neutral reading surfaces, with light, dark and sepia themes
- typography designed for long-form Scripture reading
- clear hierarchy, restrained decoration and comfortable spacing
- strong accessibility and keyboard navigation
- mobile-first layout, excellent at 360px and 390px widths

Create the initial route/screen skeletons:
1. Language selection / welcome
2. Onboarding: tradition/canon and Bible edition (independent selectors)
3. Today / continue reading dashboard
4. Main Bible reader shell
5. Book and chapter picker
6. Search / Verse Finder shell
7. Understand panel shell (Quick and Detailed tabs)
8. Explore shell with People, Vamsavali, Geography and Timeline entry points
9. Plans and reading progress
10. Settings

For the reader, design the key layout with an initial four-verse portion and continuous-scroll affordance. For side-by-side reading, provide a visual concept for desktop two-column and mobile stacked comparison. These can be empty/loading placeholders until Codex supplies the real APIs.

## Data integrity
- Do not invent Scripture text, genealogy or historical facts.
- Use neutral skeleton/placeholder components or clearly labelled synthetic fixtures only.
- Do not show mock content as actual Bible translations.
- Add clear slots for edition attribution and licence labels.

## Internationalisation
Prepare locale routing and UI message catalogues for the 14 planned interface languages listed in `PROJECT_DECISIONS.md`. Ensure Arabic RTL and proper Indic-script rendering. Do not machine-translate sensitive theological copy as final; mark translations for native review.

## Contracts and coordination
- Do not invent API response shapes. Use generated contracts/mock server once Codex creates them.
- If an API is missing, file an issue or create a contract proposal for Codex; do not implement an incompatible parallel API.
- Own only `apps/web/**`, `apps/review/**`, `packages/ui/**`, `packages/i18n/**`, and `e2e/**`.

## Definition of done
Provide desktop and mobile screenshots, routes created, components created, accessibility checks, tests run, and outstanding backend contract needs. Stop after AG-01 and present AG-02/03/04 as the next work packages for approval.
