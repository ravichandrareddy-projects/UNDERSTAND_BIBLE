# Codex Task 00 — Understand Bible onboarding and OC-01 scaffold

You are the primary engineering agent for **Understand Bible**. Read the root `AGENTS.md` first, then read the planning documents listed there.

This repository currently contains planning documents only. Your first task is to turn the approved plan into a clean, reproducible local development foundation. Do not download Bible texts in this task.

## Step 1 — Audit the plan
1. Read all planning documents, especially `PROJECT_DECISIONS.md`, `DEVELOPMENT_ROADMAP.md`, `TECHNICAL_ARCHITECTURE.md`, `OPENCODE_TASKS.md`, `ANTIGRAVITY_TASKS.md`, `BIBLE_TRANSLATION_CATALOGUE.md`, `BIBLE_LICENSING_MATRIX.md`, `BIBLE_DATA_ARCHITECTURE.md`, and `GENEALOGY_AND_TIMELINE_PLAN.md`.
2. Create `docs/STATUS.md` with what is complete (planning only), what has not started, and the recommended next tasks.
3. Create `docs/DECISION_REQUESTS.md` and record all material conflicts or unresolved items. Do not silently rewrite the source plan.
4. Explicitly record this catalogue/roadmap mismatch: `docs/data/edition_catalogue.csv` contains 21 rows marked `CORE` across 13 Bible-text languages, while Roadmap M1 names six pilot editions. Recommendation: use the six editions named in Roadmap M1 as the first import/parser smoke test, then expand to the other 15 CORE entries only after the pipeline passes. Ask the owner to confirm.
5. Keep Q-01 (commercial model) open. Do not make legal or business commitments. Record that non-commercial V1 is only a provisional planning assumption until the owner confirms.
6. Update the project name in new project-facing files to **Understand Bible**. Do not rewrite the historic research documents wholesale.

## Step 2 — Implement OC-01 only
Follow `docs/OPENCODE_TASKS.md` Task OC-01 and `docs/TECHNICAL_ARCHITECTURE.md`.

Create the monorepo structure and local dev baseline specified by the plan:
- pnpm workspace and Turborepo configuration
- `apps/web` placeholder scaffold reserved for Antigravity ownership
- `apps/api` Fastify/TypeScript health-check skeleton
- shared package directories and TypeScript/lint/format configuration
- local Compose definition for PostgreSQL with pgvector, Redis and MinIO, plus any required embedding service only if practical for local setup
- basic CI workflow for lint, typecheck and tests
- CODEOWNERS reflecting Codex vs Antigravity path ownership
- root README explaining the workspace and startup commands

Do not implement Bible ingestion, reader APIs, AI, search, auth, or UI screens in this task.

## Step 3 — Environment compatibility
Inspect the user's OS and installed Node, pnpm, Git, Docker/Podman. Do not install system packages or start cloud resources automatically. If Docker is absent but Podman is present, report whether the compose file works with Podman; do not silently change the architecture. If required services cannot run, document the blocker and provide the exact setup instructions.

## Step 4 — Safety and quality
- Keep downloaded source archives out of Git by default.
- Do not create `.env` files containing secrets or ask the user to paste secrets.
- Do not use unrestricted network access. Request approval for specific package downloads.
- Do not use `--yolo`.
- Run the tests, lint and typecheck that are available.

## Definition of done
Provide a concise report with files changed, commands executed, test results, local service status, any unresolved decision requests, and the exact next task. Stop after OC-01; wait for owner review before proceeding to OC-02.
