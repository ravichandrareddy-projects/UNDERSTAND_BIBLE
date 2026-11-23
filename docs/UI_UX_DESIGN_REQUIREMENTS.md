# UI / UX DESIGN REQUIREMENTS

**Status:** Draft for human review · **Date:** 2026-11-21 · **Owner:** Antigravity (design, frontend, browser validation)

---

## 1. Design principles

1. **Text first.** The reading surface is calm: generous margins, no ads, no auto-playing anything. Tools appear when asked for.
2. **One tap to the essentials.** Continue reading, parallel toggle, UNDERSTAND, People, Search and Voice are always one tap from the reader.
3. **Every script looks native.** Typography is tuned per script, not just per language.
4. **Honest states.** "Not in this edition", "AI-drafted", "Reviewed", "Dates differ", "Licensed – reading only" are visible, plain-language labels, never hidden in tooltips only.
5. **Thumb-friendly mobile.** Primary actions in the bottom third; minimum target 44×44 px.
6. **Same mental model everywhere.** Desktop and mobile share navigation structure; layouts adapt.

## 2. Information architecture

```text
Today ─ Read ─ Search ─ Explore ─ Plans ─ Library ─ Settings
          │        │         │         │        └─ Bookmarks · Highlights · Notes · History
          │        │         │         └─ My plans · Browse plans · Custom schedule · Reminders
          │        │         └─ People · Timeline · (Places, V2)
          │        └─ Verse Finder (text + voice)
          └─ Reader · Parallel · Book picker · UNDERSTAND panel · People panel · Edition picker · Copyright page
```

Mobile: bottom navigation with 5 items (Today, Read, Search, Explore, Plans); Library and Settings via profile menu. Desktop: left rail + top bar.

## 3. Key screens

### 3.1 Reader (AG-08)

| Element | Requirement |
|---|---|
| Header | Edition chip (tap → edition picker), book + chapter (tap → picker), parallel toggle, UNDERSTAND button, overflow (People, Timeline, Copy/Share, Settings) |
| Text | Verse numbers as small superscripts (option: inline, hidden); section headings distinct; poetry indentation from source; words-of-Jesus style optional (only if source marks `\wj`) |
| Initial portion | First **4 verses** rendered immediately, rest of chapter streams; no layout shift when it arrives (reserve space or append below fold) |
| Continuous scroll | Within chapter; at end show "Next: Genesis 4" card; optional auto-continue |
| Position saving | Top-most fully visible verse saved on scroll idle (≥1 s) and on page hide |
| Verse actions | Tap/long-press a verse → action bar: Highlight (5 colours), Bookmark, Note, Copy, Share, UNDERSTAND this chapter, Compare |
| Footnotes | Caller marks; tap opens bottom sheet (mobile) / popover (desktop); toggle all notes off |
| Bridges & omissions | Label as printed ("4–5"); omitted verse shows a thin row "Verse 37 is not in this edition" with the edition's footnote |
| Credit line | Under the text: "Telugu IRV © 2017, 2019 Bridge Connectivity Solutions · CC BY-SA 4.0 · Copyright" |
| Navigation | Prev/next buttons; swipe left/right on mobile (configurable to avoid conflict with parallel swipe); keyboard ←/→, J/K |

### 3.2 Parallel reader (AG-09)

| Mode | Behaviour |
|---|---|
| Desktop side-by-side | Two columns, each with its own edition chip and font size; rows aligned by passage from the alignment API; row heights equalised per aligned group; synced scrolling (toggle "Link scrolling") |
| Mobile stacked (portrait) | Two panels top/bottom with draggable divider (30/70 … 70/30); the panel being touched leads scrolling; the other follows at the aligned verse |
| Mobile swipe (single panel) | One panel; horizontal swipe switches edition at the same verse; indicator dots show which edition |
| Mobile landscape split | Automatically offers side-by-side |
| Gaps | "Not in this edition" placeholder rows; merged verses span rows; renumbered passages show a small "numbered 22 here" tag |
| Mixed direction | Each panel sets `dir` from edition language; references inside UI chrome use bidi isolation (`<bdi>`) |

### 3.3 Book / chapter picker (AG-07)

- Search field at top accepts names and abbreviations in UI language and edition language (uses shared reference parser).
- Grouped by canon sections (Law, History, Wisdom, Prophets, Gospels…, Deuterocanon/Apocrypha per tradition).
- Books not in the current edition are visible but dimmed with "Not in this edition" and an "Open in…" action.
- Chapter grid with recently read chapters marked.

### 3.4 Verse Finder (AG-13)

- One search box with mic button; placeholder rotates examples in the UI language ("love is patient", "John 3:16").
- Results as cards: reference (UI language), edition, verse text with highlights, **match badge** (Reference · Exact phrase · All words · Similar meaning), "Why it matches" line, "Also in: KJV, WEB".
- Filters in a sheet: edition, testament, books, canon.
- Empty state: "No close match found. Try other words, or search by a reference."
- Never show a result without an edition and reference.

### 3.5 UNDERSTAND panel (AG-15)

- Desktop: right-side panel (resizable) beside the text; mobile: full-height sheet with tabs.
- Tabs: **Quick** · **Detailed**.
- Section headers as in FR-UND-03; each claim's references as tappable chips that scroll the reader to the verse (and highlight briefly).
- Visual coding for claim types: *The text says* (default), *Background* (book icon), *Interpretation* (speech-bubble icon, attributed text), *Views differ* (split icon, list of views).
- Status line at top: "Reviewed · Telugu editorial team · 12 Mar 2027" or "AI-drafted, automatically checked — help us review"; info link explains the process.
- Footer: "Report a problem", "Read the chapter".
- Quoted verses are styled as Scripture with edition credit; if quoted from a different edition than the reader's, show "Quotation from WEB".

### 3.6 People & genealogy (AG-16) · Timeline (AG-17)

See `GENEALOGY_AND_TIMELINE_PLAN.md` §6 and §7.3. Additional UI rules: confidence legend always reachable; colour is never the only signal (line style + label); tree has an outline/list alternative.

### 3.7 Today & Plans (AG-18)

- Today: "Continue reading" card, today's plan portion(s) with progress ring, verse-of-the-day (from an open edition), recent highlights.
- Plan builder: choose scope (books or whole Bible), pace (end date or chapters/day), days of week, start date, reminder time (24 h or 12 h per locale), timezone auto-detected and editable.
- Progress: week strip and month calendar; streak shown gently with "Rest days are fine" messaging; catch-up options.

### 3.8 Settings

UI language · Tradition/canon · Default editions (primary/secondary) · Text size, line spacing, font (serif/sans per script), theme (light, dark, sepia), verse-number style, digits (Western/native) · Notifications · Offline downloads · Privacy (analytics opt-out, data export/delete) · Voice language.

## 4. Typography and scripts (AG-02, AG-04)

| Script / languages | Font families (all open licence; confirm licence per family) | Default size (body) | Line height | Notes |
|---|---|---|---|---|
| Latin (en, es, pt, fr, de, id) | Noto Serif / Noto Sans (or Source Serif/Inter) | 18 px | 1.6 | Old-style figures off for verse numbers |
| Telugu | Noto Serif Telugu / Noto Sans Telugu (alternatives: Ramabhadra, NTR, Mandali for headings — evaluate) | 19–20 px | 1.8–1.9 | Tall stacks & vowel signs: avoid clipping; test conjuncts like "క్ష", "స్త్ర" |
| Devanagari (hi) | Noto Serif/Sans Devanagari, Mukta (eval) | 19 px | 1.8 | Shirorekha alignment; nukta forms |
| Tamil | Noto Serif/Sans Tamil, Mukta Malar (eval) | 18–19 px | 1.75 | Long words; hyphenation off |
| Kannada | Noto Serif/Sans Kannada | 19–20 px | 1.85 | Deep below-base forms |
| Malayalam | Noto Serif/Sans Malayalam, Manjari (eval) | 19 px | 1.85 | Chillu and ZWJ/ZWNJ must render; reformed vs traditional orthography both appear in sources |
| Bengali | Noto Serif/Sans Bengali, Hind Siliguri (eval) | 19 px | 1.8 | Conjunct shaping |
| Arabic | Noto Naskh Arabic (body), Noto Sans Arabic (UI) | 20 px | 1.9 | RTL; tashkeel present in Van Dyck → line height must not clip |
| Chinese (Simplified) | Noto Serif SC / Noto Sans SC (subset per page) | 18 px | 1.75 | Full-width punctuation; no letter-spacing changes; large font files → subsetting/unicode-range essential |
| Hebrew / Greek (reference editions) | Noto Serif Hebrew / Noto Serif (Greek) or SBL fonts (licence check) | 20 px | 1.8 | RTL Hebrew with vowel points |

Rules:
- Fonts loaded by `unicode-range` subsets, `font-display: swap`, preloaded only for the UI language and active edition scripts.
- No faux bold/italic for Indic scripts; use real weights.
- User font-size scale from 80% to 200% in 10% steps, per panel.
- Hyphenation off for Indic, Arabic and CJK.
- Render-check pages per script with test strings (AG-04) captured in visual regression.

## 5. Internationalisation and RTL (AG-03)

- Locale routing `/{locale}/…`; locale switch never changes the edition.
- Logical CSS properties only (`margin-inline-start`, etc.); mirrored icons where directional (back arrows), not for media controls or clocks.
- Dates, times and numbers formatted with `Intl` APIs; native digits optional (UI-OPEN-1).
- Reference formatting per locale (e.g. "యోహాను 3:16", "Jean 3.16" vs "Jean 3:16" — style table per language reviewed by native speakers).
- Text expansion budget: UI must tolerate +40% string length (German, Malayalam) without truncating key labels.

## 6. Accessibility (AG-22)

- WCAG 2.2 AA: contrast ≥ 4.5:1 for body text in all themes; focus visible; target size ≥ 24 px (AA) and 44 px for primary actions (our standard).
- Screen readers: verses announced with reference ("Genesis 1, verse 3"); `lang` attribute set per panel so screen readers switch voices; landmarks for reader, panel, navigation.
- Keyboard: full reader navigation, verse selection, panel toggles; skip links.
- Reduced motion respected; no parallax.
- Zoom to 200% without horizontal scroll on reader (single column fallback).
- Voice and large-text paths tested with older users (usability study in Phase 4).

## 7. Performance UX (AG-24)

- Skeleton for header only; verse text arrives fast (server-rendered first 4 verses).
- Offline indicator; queued sync status ("3 changes waiting to sync").
- Avoid layout shift when fonts swap (size-adjust fallbacks).
- Budgets per NFR-PERF-01/04.

## 8. Content labels and attribution UI (AG-12)

| Label | Where | Text (English source; localised) |
|---|---|---|
| Licence badge | Edition picker | "Open licence" / "Licensed – reading only" |
| Not in edition | Book list, parallel rows | "Not in this edition" |
| Renumbered | Parallel rows | "Numbered {n} in this edition" |
| AI status | UNDERSTAND | "Reviewed" / "AI-drafted, automatically checked" |
| Dates | Timeline | "c." + "Dates differ" badge |
| Confidence | Genealogy | "Stated" / "Stated elsewhere" / "Inferred" / "Views differ" / "Tradition" |
| Credit line | Under each text panel | Edition short attribution + link |

## 9. Design deliverables (Antigravity)

1. Design tokens (colour, type scale per script, spacing, radii, elevation) — light/dark/sepia.
2. Component library with Storybook stories in LTR and RTL and at least Telugu, Hindi, Arabic, Chinese, English samples.
3. High-fidelity flows for journeys J1–J14 (`USER_JOURNEYS.md`).
4. Responsive specs at 360, 390, 768, 1024, 1440 px widths.
5. Visual regression baselines for all P0 screens × 14 locales × light/dark.

## 10. Open UI questions

| ID | Question | Proposal |
|---|---|---|
| UI-OPEN-1 | Native digits default for Indic/Arabic locales? | Western digits default; native optional; test with users |
| UI-OPEN-2 | Swipe for chapter vs swipe for parallel edition — conflict on mobile | Swipe = edition in parallel-swipe mode only; chapter via buttons/edge swipe |
| UI-OPEN-3 | Serif or sans default for Indic body text? | Serif-style (Noto Serif) for reading, sans for UI — validate with readers |
