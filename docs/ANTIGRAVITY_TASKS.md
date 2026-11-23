# ANTIGRAVITY TASKS — Interface Design, Frontend, Browser Validation

**Status:** Draft for human review · **Date:** 2026-11-21
**Role:** Antigravity designs and builds the user interface, implements the frontend, and validates it visually and functionally in real browsers and devices.
**Counterpart:** OpenCode (`OPENCODE_TASKS.md`) owns APIs, data, search, AI and backend tests.

---

## 0. Operating rules for Antigravity (read before every task)

1. **Read first:** `PRODUCT_REQUIREMENTS.md`, `UI_UX_DESIGN_REQUIREMENTS.md`, `USER_JOURNEYS.md`, `TECHNICAL_ARCHITECTURE.md` §4–§5, `PROJECT_DECISIONS.md`.
2. **Own only your paths:** `apps/web/**`, `apps/review/**`, `packages/ui/**`, `packages/i18n/**`, `e2e/**`. Never edit `apps/api/**`, `packages/{contracts,refparser,db,ingest,search,ai,policy}/**`, `data/**`, `infra/**`. Root config changes go through PRs labelled `root-config`.
3. **Contracts are the interface.** Consume the generated client from `packages/contracts`. Need a field or endpoint? Open an issue labelled `contract-change` with a JSON example; build against the mock server until OpenCode merges it.
4. **Never render model-generated text as Scripture.** Verse text comes only from verse fields in API responses; UNDERSTAND quotes come from `quote` objects the API resolves.
5. **Show licence and AI status honestly** using the labels in UI_UX §8; never hide attribution.
6. **No third-party trackers, ad SDKs or external fonts/CDNs** that leak reading behaviour; self-host fonts.
7. **Test data:** use public-domain fixtures (KJV, WEB) and OpenCode fixtures; never paste copyrighted Bible text into prompts, mocks or screenshots for docs.
8. **Browser validation is part of done:** every UI task includes screenshots in Chrome + Safari (mobile + desktop), one RTL locale (Arabic) and one Indic locale (Telugu), plus axe results.
9. **Definition of done:** component stories (LTR + RTL), unit/interaction tests, visual baselines, axe clean (no serious/critical), acceptance criteria shown in PR with screenshots/video.

Task fields: **Phase · Depends on · Inputs · Outputs (owned paths) · Acceptance criteria · Requirements covered**.

---

## Phase P0–P1 — Foundations

### AG-01 Web app scaffold and PWA shell
- **Phase:** P0 · **Depends on:** OC-01
- **Outputs:** `apps/web` (Next.js App Router, TypeScript), locale routing `/{locale}/…`, PWA manifest, service-worker skeleton, error boundaries, generated API client wired to mock server (Prism or MSW).
- **Acceptance:** `pnpm dev` serves `/en` and `/te` shells; Lighthouse PWA installable; mock mode toggle via env.

### AG-02 Design system and tokens
- **Phase:** P1 · **Depends on:** AG-01
- **Inputs:** UI_UX §1, §4, §8.
- **Outputs:** `packages/ui` (tokens: colour/light-dark-sepia, spacing, radii, per-script type scales; components: Button, IconButton, Chip, Sheet, Dialog, Popover, Tabs, Toggle, Slider, ListItem, Card, Badge, Toast, Skeleton, EmptyState); Storybook with LTR/RTL and script switchers.
- **Acceptance:** all components keyboard-accessible; contrast ≥4.5:1 in all themes; RTL stories correct; logical CSS properties only (lint rule).

### AG-03 Internationalisation framework and catalogues
- **Phase:** P1 · **Depends on:** AG-01
- **Outputs:** `packages/i18n` (ICU messages for 14 locales, locale metadata: direction, digits, date/time formats, reference format), language switcher independent of edition; extraction + missing-key lint.
- **Acceptance:** AC-I18N-1/2/4 (structure); switching UI language never changes edition; RTL flip works without reload; pseudo-locale with +40% expansion renders without truncation of primary labels.
- **Covers:** FR-I18N-01/02/03/06/07/09.

### AG-04 Fonts and script rendering validation
- **Phase:** P1 · **Depends on:** AG-02
- **Outputs:** self-hosted font families per UI_UX §4 with `unicode-range` subsets; `apps/web/app/[locale]/dev/scripts` test pages (conjunct strings, Arabic tashkeel, CJK punctuation, Malayalam chillu, ZWJ/ZWNJ); visual baselines.
- **Acceptance:** AC-I18N-3 approved by a native reviewer per script; no fallback tofu on Android Chrome, iOS Safari, Windows Chrome; font bytes per page reported (budget agreed in AG-24).
- **Covers:** FR-I18N-04.

### AG-05 App shell and navigation
- **Phase:** P1 · **Depends on:** AG-02, AG-03
- **Outputs:** bottom nav (mobile) / left rail (desktop); Today, Read, Search, Explore, Plans, Library, Settings routes with placeholders; offline indicator; toast system.
- **Acceptance:** responsive at 360/390/768/1024/1440 px; keyboard and screen-reader landmarks; visual baselines.

### AG-07 Book / chapter / verse picker
- **Phase:** P1 · **Depends on:** AG-05, OC-09, OC-11
- **Outputs:** searchable picker using `packages/refparser`; canon-grouped list; "Not in this edition" rows with "Open in…".
- **Acceptance:** typing "gen", "ఆది", "उत्प", "1 kgs", "2 రాజులు" finds the book; AC-ED-1; works fully by keyboard.
- **Covers:** FR-RDR-01/02, FR-ED-03/04.

### AG-08 Reader view
- **Phase:** P1 · **Depends on:** AG-07, OC-09
- **Outputs:** SSR of first 4 verses; streaming remaining verses; headings, poetry, footnotes sheet/popover; bridges and omitted-verse rows; position tracking (IntersectionObserver, idle save, page-hide save); prev/next chapter (buttons, swipe, keys); copy/share with credit; translation switch preserving SVK.
- **Acceptance:** AC-RDR-1/2/4/6; CLS ≤0.1; works with JS disabled for first portion (SSR); visual baselines for Telugu, Hindi, Arabic, Chinese, English.
- **Covers:** FR-RDR-03…07/11…15.

## Phase P2 — Read & compare

### AG-06 Onboarding
- **Depends on:** AG-03, AG-08
- **Outputs:** UI language → tradition → primary edition → optional parallel edition; skippable; notice for pending editions (e.g. Telugu O.V.).
- **Acceptance:** J1 in ≤3 taps after language selection; no account required.

### AG-09 Parallel reader
- **Depends on:** AG-08, OC-10
- **Outputs:** desktop side-by-side with row alignment from `/v1/parallel`; linked/unlinked scrolling; mobile stacked with draggable divider; swipe single-panel mode; landscape split; per-panel font size; mixed-direction panels.
- **Acceptance:** AC-PAR-1…6; GT-01…GT-09 visible correctly in UI; 60 fps scrolling on reference device (no long tasks > 50 ms during scroll in trace).
- **Covers:** FR-PAR-01…08.

### AG-10 Reader settings and accessibility controls
- **Depends on:** AG-08
- **Outputs:** text size (80–200%), line spacing, serif/sans per script, theme, verse-number style, digits, notes/headings toggles, zoom-safe layout.
- **Acceptance:** settings persist locally and sync when signed in; 200% zoom without horizontal scroll.

### AG-11 Bookmarks, highlights, notes, history
- **Depends on:** AG-08, OC-13
- **Outputs:** verse action bar; highlight colours (5) with colour-blind-safe patterns; note editor; Library screens; offline queue with sync status.
- **Acceptance:** AC-RDR-5; GT-10 in UI; notes never logged to console/analytics.
- **Covers:** FR-RDR-08…10, FR-DAILY-06/07.

### AG-12 Attribution, licence and AI labels
- **Depends on:** AG-08, OC-09
- **Outputs:** credit line component; copyright page per edition; Sources & Licences page; licence badges in edition picker; label components (Not in this edition, Renumbered, Reviewed/AI-drafted, Dates differ, confidence).
- **Acceptance:** AC-LIC-1; every panel/screen in visual baselines shows required labels.
- **Covers:** FR-LIC-01/04.

### AG-20 Accounts and privacy UI
- **Depends on:** OC-12, OC-13, OC-32
- **Outputs:** sign-in (magic link, Google), consent screens, sync status, data export/delete, analytics opt-out.
- **Acceptance:** AC-ACC-1/3; consent texts sourced from i18n catalogues reviewed by counsel (placeholders until then).

## Phase P3 — Find, understand, explore

### AG-13 Verse Finder UI
- **Depends on:** AG-05, OC-16
- **Outputs:** search page and global search entry; result cards with match badges and "why it matches"; filters sheet; empty/error states; deep link to reader with verse flash.
- **Acceptance:** AC-SRCH-4…7 in UI; screen reader announces result count and match type.
- **Covers:** FR-SRCH-01…09.

### AG-14 Voice navigation UI
- **Depends on:** AG-13, OC-11, OC-27
- **Outputs:** mic button with permission flow; listening/processing states; transcript + parsed reference confirmation; per-locale support detection; `processLocally` when available; graceful unsupported state.
- **Acceptance:** AC-VOICE-1/3/4 (manual device runs recorded as video); CI uses mocked SpeechRecognition.
- **Covers:** FR-VOICE-01…04.

### AG-15 UNDERSTAND panel
- **Depends on:** AG-08, OC-22 (read API)
- **Outputs:** side panel / bottom sheet with Quick/Detailed tabs; claim-type styling; reference chips; status line; quote rendering with edition credit; report-a-problem form; offline availability toggle.
- **Acceptance:** AC-UND-5/6 in UI; labels per UI_UX §3.5; readable at 200% zoom.
- **Covers:** FR-UND-01…08.

### AG-16 People panel and genealogy explorer
- **Depends on:** OC-19
- **Outputs:** chapter People panel; person profile; Family view, Lineage path, Royal lines; confidence legend and line styles; evidence popovers; outline (list) alternative.
- **Acceptance:** AC-GEN-1/2/4 in UI; keyboard-navigable tree; colour not sole signal.
- **Covers:** FR-GEN-01…07.

### AG-17 Timeline UI
- **Depends on:** OC-20
- **Outputs:** zoomable timeline (horizontal desktop / vertical mobile); period bands; event markers; current-chapter highlight; "Dates differ" comparisons; chronology switch (P1).
- **Acceptance:** AC-TL-1/2 in UI; performant with all periods/events loaded (no frame drops >100 ms).
- **Covers:** FR-TL-01…04.

### AG-21 Explanation review console
- **Depends on:** OC-23
- **Outputs:** `apps/review`: queue filters (language, book, status, sensitive), side-by-side chapter text + draft with validator results, inline edit, approve/return/escalate, diff view, report triage.
- **Acceptance:** E2E-14; reviewer can process a quick overview in ≤5 minutes on average in a timed pilot (5 reviewers × 10 items).

## Phase P4 — Grow & harden

### AG-18 Daily study UI
- **Depends on:** OC-25, OC-26
- **Outputs:** Today screen; plan browser; custom schedule builder; reminders settings (time, days, timezone, quiet hours); progress week/month views; catch-up flows.
- **Acceptance:** AC-DAILY-1…3 in UI; gentle streak messaging per UI_UX §3.7.
- **Covers:** FR-DAILY-01…07.

### AG-19 Offline experience
- **Depends on:** OC-28
- **Outputs:** edition download manager (sizes, progress, delete); service-worker caching for app shell; IndexedDB storage of bundles with signature verification; offline reading and queued user-data writes.
- **Acceptance:** AC-DAILY-4; E2E-13 in airplane mode on Android and iOS.

### AG-22 Accessibility pass
- **Outputs:** audit report against WCAG 2.2 AA; fixes; screen-reader scripts for NVDA, VoiceOver, TalkBack.
- **Acceptance:** zero serious/critical axe issues; manual checklist complete for all P0 screens.

### AG-23 Visual regression and browser validation matrix
- **Outputs:** Playwright visual suites: P0 screens × 14 locales × light/dark × 3 widths; device runs per TESTING §6; V-09 support — browser-assisted spot-check tool that opens provider online reader pages side by side with our reader for sampled verses (for human comparison; no scraping).
- **Acceptance:** baselines approved; nightly run green; spot-check tool used for every CORE edition import.

### AG-24 Performance budgets
- **Outputs:** Lighthouse CI budgets; bundle analysis; font budget; image policy.
- **Acceptance:** NFR-PERF-01/04 met on reference device profile.

### AG-25 End-to-end journey tests
- **Depends on:** OC-08 fixtures
- **Outputs:** `e2e/journeys/*` for J1–J14 (TESTING §5).
- **Acceptance:** all pass nightly on staging; flaky-test rate <2%.

### AG-26 Error, empty, loading and restricted states
- **Outputs:** consistent states for network errors, offline, not-in-edition, display-only licensed editions (V1.1), AI not available, search no result.
- **Acceptance:** every P0 screen has designed states captured in visual baselines.

## V1.1 tasks

| ID | Task | Gate |
|---|---|---|
| AG-27 | Licensed edition panels (display-only badge, disabled AI/offline with explanation, provider credit/FUMS hooks from API) | OC-33 |
| AG-28 | Audio player (chapter audio, speed, follow-along highlighting where timing data exists) | OC-36 |
| AG-29 | Server-ASR voice path UI | OC-35 |
| AG-30 | Interlinear verse-by-verse parallel layout | FR-PAR-09 |

## Dependency graph (summary)

```text
OC-01 → AG-01 → AG-02 → AG-04
              ↘ AG-03 → AG-05 → AG-07 → AG-08 → AG-09 (needs OC-10)
                                              ↘ AG-10, AG-11 (OC-13), AG-12, AG-15 (OC-22)
AG-05 → AG-13 (OC-16) → AG-14 (OC-27)
OC-19 → AG-16 ; OC-20 → AG-17 ; OC-23 → AG-21
OC-25/26 → AG-18 ; OC-28 → AG-19
```

## Coordination with OpenCode

| Interface point | Contract / artefact | Producer → Consumer |
|---|---|---|
| All APIs | `packages/contracts/openapi.yaml` + generated client | OpenCode → Antigravity |
| Reference parsing | `packages/refparser` | OpenCode → Antigravity |
| E2E fixtures | `data/fixtures/*` | OpenCode → Antigravity |
| Offline bundle signature test vectors | `packages/contracts/offline/` | OpenCode → Antigravity |
| UI copy for consent/privacy | `packages/i18n` (texts from human lead/counsel) | Antigravity |
| Bugs across the boundary | GitHub issues labelled `opencode` / `antigravity` | Either |

Weekly sync (async in `docs/STATUS.md`): each agent lists done/next/blocked; the architect resolves cross-boundary blockers.
