# TESTING AND ACCEPTANCE CRITERIA

**Status:** Draft for human review · **Date:** 2026-11-21
Test ownership: OpenCode = backend, data, search, AI, contract, load, security tests · Antigravity = component, visual, accessibility, browser/device, E2E journey tests.

---

## 1. Test layers

| Layer | Tooling | Owner | Runs |
|---|---|---|---|
| Unit | Vitest | Both (own packages) | Every PR |
| Contract | OpenAPI schema tests; generated client compile; mock-server parity | OpenCode (spec) + Antigravity (consumer) | Every PR touching `packages/contracts` |
| Data validation | Ingest checks V-01…V-12; genealogy G-01…G-05; timeline T-01…T-03 | OpenCode | Every import; nightly sample |
| Reference parser goldens | ≥40 cases per language × 14 languages (text + spoken forms + native digits) | OpenCode | Every PR |
| Parallel alignment goldens | Curated cases (§3) | OpenCode | Every PR + every import |
| Search relevance | Gold set ≥300 queries (AI strategy §2.4) | OpenCode | Nightly + release |
| AI explanation checks | Validators AV-01…AV-10; human review sampling | OpenCode + reviewers | Per generation batch |
| Component | Storybook interaction tests, LTR/RTL | Antigravity | Every PR |
| Visual regression | Playwright screenshots: P0 screens × 14 locales × light/dark × 3 widths | Antigravity | Every PR (subset), nightly (full) |
| Accessibility | axe-core automated + manual screen-reader passes (NVDA, VoiceOver, TalkBack) | Antigravity | Every PR (axe), per milestone (manual) |
| E2E journeys | Playwright: journeys J1–J14 | Antigravity (with OpenCode fixtures) | Nightly on staging |
| Performance | Lighthouse CI (web), k6 (API) | Antigravity / OpenCode | Nightly + release |
| Security | SAST, dependency scan, DAST on staging, pen test pre-launch | OpenCode + external | Weekly + pre-launch |
| Licence gating | Policy-engine tests generated from `docs/data/edition_catalogue.csv` | OpenCode | Every PR |

## 2. CI gates (merge blocking)

1. Lint, typecheck, unit tests pass.
2. Contract unchanged or versioned, with consumer build passing.
3. Reference parser and alignment goldens pass.
4. axe: zero serious/critical violations on changed screens.
5. Visual diffs reviewed (Antigravity approves).
6. Licence-gating tests pass.
7. No new high/critical dependency vulnerabilities.

## 3. Golden test cases (must exist before Phase 2 exit)

| ID | Case | Expected |
|---|---|---|
| GT-01 | KJV Psalm 23:1 ↔ Douay-Rheims | DRA Psalm 22:1 aligned on the same row; note "numbered 22" |
| GT-02 | KJV Malachi 4:1 ↔ Hebrew-numbered edition (WLC) | Malachi 3:19 |
| GT-03 | KJV Joel 2:28 ↔ WLC | Joel 3:1 |
| GT-04 | KJV Acts 8:37 ↔ BSB | BSB row "Not in this edition" with footnote if present |
| GT-05 | Psalm 51 superscription | Hebrew-numbered editions offset by 2 verses; aligned by content |
| GT-06 | Daniel 3 (WEB+DC / DRA) ↔ KJV | Prayer of Azariah rows present only in DC edition |
| GT-07 | Esther (DRA, 16 chapters) ↔ KJV (10) | Additions aligned as extra rows; KJV chapters intact |
| GT-08 | 3 John 14–15 | Split/merge handled per edition |
| GT-09 | Telugu IRV verse bridges (sample of all bridges found by OC-05) | Single row spanning both SVKs; partner panel shows both verses |
| GT-10 | Highlight created on KJV Ps 23:1 | Visible on DRA Ps 22:1 and Telugu IRV Ps 23:1 |
| GT-11 | Reading position on WEB John 3:16, switch to Arabic SVD | Opens at John 3:16 in SVD |
| GT-12 | Reference "2 రాజులు 10" / "२ राजा १०" / "II Kings 10" / "2 Kgs 10" / "列王纪下 10" | All resolve to 2KI.10 |

## 4. Feature acceptance criteria (P0)

### 4.1 Internationalisation (FR-I18N)
- **AC-I18N-1:** Given UI language Telugu and edition English KJV, when the reader opens, then all chrome is Telugu, the text is KJV, and the edition chip shows "KJV".
- **AC-I18N-2:** Given Arabic UI, then layout is mirrored, and an English panel in parallel mode renders LTR with correct punctuation placement.
- **AC-I18N-3:** For each of the 14 locales, the script test page renders reference strings without tofu or broken conjuncts (visual baseline approved by a native reviewer).
- **AC-I18N-4:** No hard-coded user-visible strings (lint rule passes); each locale's catalogue is 100% translated and marked reviewed.

### 4.2 Editions and canons (FR-ED, FR-LIC)
- **AC-ED-1:** Given tradition Catholic and edition Telugu IRV, the book list shows Tobit etc. marked "Not in this edition" with "Open in…" options.
- **AC-ED-2:** Changing tradition reorders books per canon definition without changing the text.
- **AC-LIC-1:** Every panel shows a credit line; the copyright page shows the exact notice stored in `edition_rights.attribution_full`.
- **AC-LIC-2:** Attempting to embed, AI-process or bundle offline an edition whose flag is false is denied and logged (unit + integration test).

### 4.3 Reader (FR-RDR)
- **AC-RDR-1:** Opening any chapter shows verses 1–4 (or the requested verse ±) within 1.5 s on the reference device profile; remaining verses appear without layout shift > 0.1 CLS.
- **AC-RDR-2:** Scrolling to verse 20 and closing the tab, then reopening, lands within ±1 verse of verse 20.
- **AC-RDR-3:** Signed-in position syncs to a second device within 10 s of scroll idle when online.
- **AC-RDR-4:** Switching edition keeps the same passage via SVK (GT-11).
- **AC-RDR-5:** Bookmarks, highlights (5 colours) and notes can be created, edited and deleted offline and sync later without duplicates.
- **AC-RDR-6:** Verse bridges and omitted verses render per FR-RDR-13.

### 4.4 Parallel (FR-PAR)
- **AC-PAR-1:** Any two live editions can be paired; goldens GT-01…GT-09 pass in the UI.
- **AC-PAR-2:** Desktop rows stay aligned while scrolling 3 chapters continuously (no drift > 1 row).
- **AC-PAR-3:** Mobile stacked mode: divider drag works; touching either panel leads scroll; the other follows to the aligned verse within 300 ms.
- **AC-PAR-4:** Mobile swipe mode switches editions at the same verse.
- **AC-PAR-5:** Landscape shows side-by-side automatically (can be disabled).
- **AC-PAR-6:** Independent font sizes persist per panel.

### 4.5 Verse Finder (FR-SRCH)
- **AC-SRCH-1:** Gold-set metrics meet release gates (AI strategy §2.4).
- **AC-SRCH-2:** "Where does the Bible say love is patient?" (English) returns 1 Corinthians 13:4 in the top 3; the same question in Telugu and Hindi returns it in the top 5.
- **AC-SRCH-3:** "Where did Jesus say that He is the way, the truth and the life?" returns John 14:6 first.
- **AC-SRCH-4:** "Which verse talks about not being afraid?" returns at least 3 relevant verses (e.g. Isaiah 41:10, Joshua 1:9, John 14:27) in the top 10.
- **AC-SRCH-5:** Every result shows reference, edition, text and match type; 100% of result SVKs exist in the database.
- **AC-SRCH-6:** Tapping a result opens the reader at that verse in the user's edition.
- **AC-SRCH-7:** A nonsense query returns the "No close match found" state, never fabricated content.

### 4.6 Voice (FR-VOICE)
- **AC-VOICE-1:** On Chrome (desktop + Android) and Safari (macOS + iOS), spoken commands "Open Genesis chapter 5", "Take me to John chapter 3 verse 16", "Open 2 Kings chapter 10" navigate correctly in English for ≥ 9/10 trials by 3 testers.
- **AC-VOICE-2:** For each other UI language where the browser supports the locale, a 20-command test set achieves ≥ 80% correct navigation (after confirmation step).
- **AC-VOICE-3:** Unsupported browser shows a clear message; no errors thrown.
- **AC-VOICE-4:** No audio is sent to Platform servers (network inspection).

### 4.7 UNDERSTAND (FR-UND)
- **AC-UND-1:** All 1,189 chapters of the 66 books have a published Quick overview in English, Telugu and Hindi, and a Detailed study in English, at launch; status label displayed correctly.
- **AC-UND-2:** 100% of published explanations pass AV-01…AV-08; AV-09 faithfulness flags are resolved or the explanation is held back.
- **AC-UND-3:** Random sample of 100 published English explanations reviewed by editors: ≥ 98% of `text` claims judged supported by their references; zero quotations not matching DB text.
- **AC-UND-4:** All sensitive-register chapters are human-reviewed before publication.
- **AC-UND-5:** Tapping any reference chip scrolls the reader to that verse.
- **AC-UND-6:** Reported problems create review tasks visible in the review console within 1 minute.

### 4.8 Genealogy (FR-GEN)
- **AC-GEN-1:** For 2 Kings 10, the People panel lists the entities in GENEALOGY plan §5 with references.
- **AC-GEN-2:** Jehu's profile shows father Jehoshaphat, grandfather Nimshi, with references 2 Kgs 9:2 and 1 Kgs 19:16 and correct confidence labels.
- **AC-GEN-3:** G-01…G-05 pass; every displayed edge opens its evidence verses.
- **AC-GEN-4:** Matthew 1 and Luke 3 genealogies display as separate lineage paths.

### 4.9 Timeline (FR-TL)
- **AC-TL-1:** Opening the timeline from 2 Kings 10 highlights the Divided Kingdom period and Jehu's reign.
- **AC-TL-2:** No date appears without "c."/range and a chronology label on tap; Exodus shows both early and late options.
- **AC-TL-3:** Every standard chapter of the 66 books maps to a period (T-02).

### 4.10 Daily study (FR-DAILY)
- **AC-DAILY-1:** A user can enrol in each built-in plan, receive a reminder at the chosen local time (±2 min), and see the day's portion.
- **AC-DAILY-2:** Reading a portion to the end marks it complete; weekly/monthly views update.
- **AC-DAILY-3:** Custom schedule builder produces a valid plan covering exactly the chosen books.
- **AC-DAILY-4:** Downloaded open editions are readable in airplane mode, including plan portions.

### 4.11 Accounts & privacy (FR-ACC, PR-*)
- **AC-ACC-1:** Anonymous local data migrates to a new account without loss or duplicates.
- **AC-ACC-2:** Export produces complete JSON + HTML; deletion removes all user rows (verified by test query) and schedules backup purge.
- **AC-ACC-3:** Consent screens appear in the user's UI language before sync/reminders/analytics are enabled.

## 5. Journey E2E tests

| Journey | Test ID | Key assertions |
|---|---|---|
| J1 first visit | E2E-01 | Telugu UI + IRV + KJV parallel set in ≤3 taps; O.V. unavailability notice |
| J2 resume | E2E-02 | AC-RDR-2/3 |
| J3 find verse | E2E-03 | AC-SRCH-2 in Hindi |
| J4 understand | E2E-04 | Status label, references open verses |
| J5 people | E2E-05 | AC-GEN-1/2 |
| J6 timeline | E2E-06 | AC-TL-1/2 |
| J7 Catholic | E2E-07 | AC-ED-1, GT-01, GT-06 |
| J8 voice | E2E-08 | Speech mocked in CI; real-device manual runs per milestone |
| J9 RTL | E2E-09 | AC-I18N-2 |
| J10 Chinese search | E2E-10 | Segmented highlighting |
| J11 Orthodox | E2E-11 | Kingdoms naming; LXX psalm mapping |
| J12 plans | E2E-12 | AC-DAILY-1/2 (time mocked) |
| J13 offline | E2E-13 | AC-DAILY-4 |
| J14 review | E2E-14 | Edit → approve → published label |

## 6. Browser and device matrix

| Platform | Browsers | Devices (real or cloud) |
|---|---|---|
| Android | Chrome (latest 2), Samsung Internet (latest) | Mid-range 4 GB RAM reference device; low-end 2–3 GB device |
| iOS / iPadOS | Safari (latest 2) | iPhone (small + large), iPad |
| Desktop | Chrome, Edge, Firefox, Safari (latest 2) | 1366×768 and 1920×1080 |

Firefox: full functionality except voice (until shipped) — verify graceful degradation.

## 7. Launch readiness checklist (V1)

- [ ] All P0 acceptance criteria pass on staging with production data.
- [ ] ≥10 complete Bible text languages live with VERIFIED licences re-checked at import (G-LIC-1 records stored).
- [ ] Sources & Licences page complete; all credit lines correct (spot-check every edition).
- [ ] Search gates met; UNDERSTAND coverage per AC-UND-1; review labels correct.
- [ ] WCAG 2.2 AA audit passed (external or structured internal audit).
- [ ] Pen test high/critical findings fixed.
- [ ] Privacy notice and terms in 14 languages approved by counsel.
- [ ] Load test: 10× expected launch traffic on reading APIs with p95 within targets.
- [ ] Restore drill completed.
- [ ] Incident and content-correction runbooks published; on-call rota set.
