# Understand Bible — What to do next

## What Claude has completed
Claude's ZIP is a **planning pack**, not an implementation or a downloaded Bible library. It contains 17 planning documents and an 81-edition catalogue. The current catalogue marks 21 editions as CORE across 13 Bible-text languages. The roadmap names six editions for the first P1/M1 pilot. Reconcile this explicitly: import six first, then expand to the other CORE editions after the pipeline passes.

## Recommended team
- Claude: planning and documentation (use later when available for review, not as a coding blocker).
- Codex: replaces OpenCode as core engineering/data agent.
- Antigravity: UI/UX and frontend agent.
- Owner: approve decisions, network actions, licences, and spending.

## Sequence
1. Set up local repo and Codex login (`CODEX_SETUP_RHEL.md`).
2. Codex Task 00: audit + implement OC-01 scaffold only.
3. Antigravity Task 00: implement AG-01 UI/PWA shell once the scaffold exists.
4. Review both reports and Git diff.
5. Codex Task 01: OC-02 licence gate, then OC-03 download the six pilot editions only.
6. Codex OC-04/05/07/08: parse USFM, versification, database and validation.
7. Antigravity AG-02/03/04/05: design system, i18n, fonts and main app shell.
8. Codex OC-18/19/20 and Antigravity AG-16/17: genealogy, people, geography and timeline after references and schema are stable.

## Important decisions still open
- Q-01: commercial vs non-commercial model.
- Q-02: legal entity / country for permission requests.
- Q-04: who will review the content in launch languages.
- Q-06: neutral ecumenical framing (recommended) and tradition defaults.
- Whether geographic map UI is V1 or staged after the first People/Timeline experience.
- Catalogue-vs-roadmap mismatch: 21 CORE rows vs six first-pilot editions.

Until Q-01 is answered, treat the non-commercial V1 model as provisional only and do not make a permanent provider commitment.
