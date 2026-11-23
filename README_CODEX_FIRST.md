# Understand Bible — Start Here

1. Read `CODEX_SETUP_RHEL.md`.
2. Extract this starter ZIP; it already includes Claude's planning documents and the root `AGENTS.md`.
4. Start Codex inside that folder and paste `prompts/CODEX_TASK_00_AUDIT_AND_SCAFFOLD.md`.
5. After Codex finishes and you review its report, let Antigravity execute `prompts/ANTIGRAVITY_TASK_00_UI_FOUNDATION.md`.
6. Only after the scaffold is approved, run `prompts/CODEX_TASK_01_LICENSE_GATE_AND_SOURCE_ACQUISITION.md`.

Do not run all agents on the same files simultaneously. Keep one shared Git repository and review each task's diff before merging.


Later prompts: `prompts/CODEX_TASK_01_LICENSE_GATE_AND_SOURCE_ACQUISITION.md` for the approved six-edition pilot, and `prompts/CODEX_TASK_02_GENEALOGY_GEOGRAPHY_KNOWLEDGE_BASE.md` after Bible parsing/versification/database foundations are stable.
