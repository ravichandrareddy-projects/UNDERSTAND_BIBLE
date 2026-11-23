# PRODUCT REQUIREMENTS

**Status:** Draft for human review · **Version:** 0.1 · **Date:** 2026-11-21

Priorities: **P0** = required for V1 launch · **P1** = V1 if capacity allows, otherwise V1.1 · **P2** = V2 or later.
Each requirement has an ID used by `TESTING_AND_ACCEPTANCE_CRITERIA.md`, `ANTIGRAVITY_TASKS.md` and `OPENCODE_TASKS.md`.

---

## 1. V1 feature boundaries

| Area | In V1 (P0) | Deferred | Reason for deferral |
|---|---|---|---|
| Interface languages | 14 languages incl. RTL Arabic | Urdu, Marathi, Nepali, Swahili, Korean (P2) | Review capacity |
| Bible texts | Open-licence corpus (PD, CC BY, CC BY-SA): complete Bibles in 13 languages + Indonesian if D-001 = non-commercial and YLSA confirms | Licensed editions via API (P1/V1.1); BSI, POC, LAI etc. as permissions arrive | Licences |
| Canons | Protestant 66; Catholic 73; Eastern Orthodox (Greek) where an edition supports it | Slavonic/Russian, Ethiopian, Syriac, Armenian full support (P2) | No open complete texts |
| Reader | All §5 brief requirements | Print/PDF export (P2) | KJV UK print question (LR-3) |
| Parallel reading | Two editions, any pair, desktop + mobile modes | Three or more panels (P2) | UX complexity |
| Verse Finder | Exact, keyword, meaning-based, multilingual, explained | Conversational follow-up questions (P2) | AI risk |
| Voice | Reference navigation via browser speech recognition | Server-side ASR for Indian languages (P1) | Browser support gaps |
| UNDERSTAND | 66-book canon; quick + detailed in English; quick in Telugu and Hindi | Detailed in Telugu/Hindi and all depths in the other 11 languages (P1); deuterocanon (P1) | Human review capacity |
| Genealogy | Chapter people panel, person profiles, ancestors/descendants explorer | Editable community corrections (P2) | Moderation |
| Timeline | Periods + major events, chapter highlight, alternative chronologies | Maps/animated routes (P2) | Scope |
| Daily study | Plans, custom schedules, reminders, progress, history, offline open texts | Audio Bible (P1, licensing); group plans (P2) | Licences / scope |
| Platforms | Responsive web + installable PWA | Native iOS/Android (P2) | Focus |

---

## 2. Functional requirements

### 2.1 Internationalisation — FR-I18N

| ID | Requirement | Pri |
|---|---|---|
| FR-I18N-01 | The interface is available in Telugu, English, Hindi, Tamil, Kannada, Malayalam, Bengali, Spanish, Portuguese, French, Arabic, Chinese (Simplified), Indonesian and German. | P0 |
| FR-I18N-02 | Interface language and Bible edition are independent settings (e.g. Telugu UI with English KJV). | P0 |
| FR-I18N-03 | Arabic interface renders right-to-left (mirrored layout, logical CSS properties); Arabic Bible text renders RTL even inside an LTR interface and vice versa. | P0 |
| FR-I18N-04 | Each script uses a suitable font family with correct shaping of conjuncts (Indic), joining (Arabic) and CJK punctuation; no tofu boxes in any supported language. | P0 |
| FR-I18N-05 | Numbers and verse references can be shown in Western digits or the script's native digits (Telugu, Devanagari, Tamil, Bengali, Kannada, Malayalam, Arabic-Indic); default per locale is a design decision (UI-OPEN-1). | P1 |
| FR-I18N-06 | Book names, abbreviations and chapter/verse labels appear in the interface language; the edition's own book names appear in the reader header. | P0 |
| FR-I18N-07 | All UI strings live in message catalogues with ICU plural/gender rules; no hard-coded text. | P0 |
| FR-I18N-08 | Each language's UI strings are reviewed by a native speaker before release; review status is tracked per string set. | P0 |
| FR-I18N-09 | New interface languages can be added by adding a catalogue, font config and book-name list, without code changes. | P0 |

### 2.2 Editions, canons and attribution — FR-ED / FR-LIC

| ID | Requirement | Pri |
|---|---|---|
| FR-ED-01 | Users choose a **tradition/canon** (Protestant, Catholic, Eastern Orthodox, "All books") separately from an **edition**. | P0 |
| FR-ED-02 | Edition picker filters by language and canon, shows coverage (Full / NT only / with deuterocanon) and licence badge (open / licensed). | P0 |
| FR-ED-03 | If the selected canon includes a book the edition lacks, the book list shows it as "Not in this edition" with an option to open it in an edition that has it. Nothing is silently hidden. | P0 |
| FR-ED-04 | Book order and book names follow the selected canon (e.g. 1–4 Kingdoms naming option for Orthodox; Catholic order for Tobit/Judith/Maccabees). | P0 |
| FR-ED-05 | Greek additions to Esther and Daniel are shown in the form the edition provides (as separate books or integrated chapters) without reshuffling the text. | P0 |
| FR-LIC-01 | Every edition shows a short credit line under the text and links to a full copyright page with the exact notice required by its licence. | P0 |
| FR-LIC-02 | Features check the edition's permission flags before acting (search index, embeddings, AI, offline, TTS); disallowed features are disabled with an explanation. | P0 |
| FR-LIC-03 | Licensed editions obtained through APIs are display-only and respect provider caching, reporting (e.g. FUMS) and verse-count limits. | P1 |
| FR-LIC-04 | A public "Sources & Licences" page lists all editions and datasets with attribution. | P0 |

### 2.3 Main reader — FR-RDR

| ID | Requirement | Pri |
|---|---|---|
| FR-RDR-01 | Searchable book selector (type "gen", "ఆది", "उत्प", "1 kgs", local abbreviations) with canon-aware ordering. | P0 |
| FR-RDR-02 | Chapter grid and verse jump; deep links of the form `/read/{edition}/{book}.{chapter}.{verse}`. | P0 |
| FR-RDR-03 | Opening a chapter shows an initial portion of **4 verses** (configurable default) immediately, then the rest of the chapter streams in without blocking reading. | P0 |
| FR-RDR-04 | Continuous scrolling through the chapter; automatic loading of further verses; at chapter end, a clear "Next chapter" affordance (optional auto-continue setting). | P0 |
| FR-RDR-05 | Reading position (edition-independent verse key + edition) saves automatically, without an account (local) and syncs when signed in. | P0 |
| FR-RDR-06 | Resume returns to the exact verse last viewed (top-most visible verse), on any device after sync. | P0 |
| FR-RDR-07 | Switching translation keeps the position, mapped through versification (e.g. Ps 23:1 in KJV → Ps 22:1 in Douay-Rheims). | P0 |
| FR-RDR-08 | Bookmarks on verses or ranges, with optional label. | P0 |
| FR-RDR-09 | Highlights in at least 5 colours on whole verses; highlights persist across translations via the verse key. | P0 |
| FR-RDR-10 | Personal notes attached to verses/ranges; plain text with basic formatting; private by default. | P0 |
| FR-RDR-11 | Previous/next chapter navigation (buttons, swipe on mobile, keyboard shortcuts on desktop). | P0 |
| FR-RDR-12 | Section headings, footnotes and cross-references from the source are shown distinctly from Scripture text and can be toggled. | P0 |
| FR-RDR-13 | Verse bridges (e.g. "4–5") display as the edition prints them; omitted verses show a marker with the edition's footnote if present. | P0 |
| FR-RDR-14 | Credit line and copyright link visible for the edition in view (FR-LIC-01). | P0 |
| FR-RDR-15 | Copy/share a verse or range with reference and edition credit; share respects licence limits. | P0 |
| FR-RDR-16 | Character-range highlights within a verse (edition-specific). | P2 |

### 2.4 Parallel reading — FR-PAR

| ID | Requirement | Pri |
|---|---|---|
| FR-PAR-01 | Users select two editions independently from any supported languages (e.g. Telugu IRV + English KJV; KJV + WEB). | P0 |
| FR-PAR-02 | Desktop: two panels side by side; rows aligned by corresponding passage, not by printed verse number. | P0 |
| FR-PAR-03 | Alignment uses the versification map: merged verses span rows; split verses show sub-rows; verses absent in one edition show "Not in this edition" with footnote. | P0 |
| FR-PAR-04 | Synchronised navigation: changing book/chapter or scrolling one panel moves the other to the corresponding passage. Users can unlink scrolling. | P0 |
| FR-PAR-05 | Mobile portrait: two vertically stacked panels with a draggable divider; optional single-panel mode with swipe to switch editions at the same verse. | P0 |
| FR-PAR-06 | Mobile landscape: split-screen side-by-side. | P0 |
| FR-PAR-07 | Independent font size per panel; zoom; accessibility controls apply to both. | P0 |
| FR-PAR-08 | Mixed scripts and directions (e.g. Arabic + English) render correctly in the same view. | P0 |
| FR-PAR-09 | Interlinear-style verse-by-verse mode (verse A then verse B) as an alternative layout. | P1 |

### 2.5 Verse Finder — FR-SRCH

| ID | Requirement | Pri |
|---|---|---|
| FR-SRCH-01 | Single search box accepts references ("Jn 3 16", "యోహాను 3:16"), exact phrases (quoted), keywords and natural-language questions ("Where does the Bible say love is patient?"). | P0 |
| FR-SRCH-02 | Searches actual Bible text from the local corpus; results always come from stored verses. | P0 |
| FR-SRCH-03 | Supports queries in all 14 interface languages and cross-lingual matching (Telugu question → verse found via any open edition → shown in the user's edition). | P0 |
| FR-SRCH-04 | Each result shows book, chapter, verse, edition, the verse text, and a **match type**: Reference · Exact phrase · All words · Similar meaning. | P0 |
| FR-SRCH-05 | Each result explains why it matched: highlighted terms for lexical matches; for meaning matches, a short reason that only restates content of the retrieved verse. | P0 |
| FR-SRCH-06 | One tap opens the verse in the reader at that position, in the user's chosen edition (mapped via versification). | P0 |
| FR-SRCH-07 | Filters: edition, testament, book range, canon. | P0 |
| FR-SRCH-08 | Spelling-tolerant matching (typos, transliteration variants for common names). | P1 |
| FR-SRCH-09 | No result is invented: if nothing relevant is found, the UI says so and suggests rephrasing. | P0 |
| FR-SRCH-10 | Licensed (display-only) editions are searched only through provider search APIs where permitted, otherwise excluded with a notice. | P1 |

### 2.6 Voice navigation — FR-VOICE

| ID | Requirement | Pri |
|---|---|---|
| FR-VOICE-01 | Microphone button recognises spoken references ("Open Genesis chapter 5", "Take me to John chapter 3 verse 16", "Open 2 Kings chapter 10") and navigates directly. | P0 |
| FR-VOICE-02 | Works in each interface language where the browser's speech recognition supports the locale; the UI shows which languages are supported on the current device. | P0 |
| FR-VOICE-03 | Shows the recognised text and the parsed reference before navigating when confidence is low; one tap to confirm or correct. | P0 |
| FR-VOICE-04 | Uses on-device recognition when the browser offers it; audio is never stored by the Platform. | P0 |
| FR-VOICE-05 | Server-side recognition fallback for Indian languages and browsers without speech recognition. | P1 |
| FR-VOICE-06 | Voice commands for "next chapter", "previous chapter", "read aloud" (if TTS licensed). | P1 |

### 2.7 UNDERSTAND — FR-UND

| ID | Requirement | Pri |
|---|---|---|
| FR-UND-01 | An UNDERSTAND button in the reader opens an explanation of the **current chapter**. | P0 |
| FR-UND-02 | Two depths: **Quick overview** (about 150–250 words) and **Detailed study** (about 800–1,500 words). | P0 |
| FR-UND-03 | Sections: What happens · Who is involved · Why it happens · Before this chapter · After this chapter · Historical & geographical context (when relevant) · Important people & relationships · Main messages & themes · Key verses · Connections to other passages. | P0 |
| FR-UND-04 | Every factual statement about the text carries chapter/verse references that open in the reader. | P0 |
| FR-UND-05 | Content types are visibly distinguished: **The text says** (referenced), **Background** (sourced), **Interpretation** (attributed: "Many Christians understand…", "Catholic and Orthodox traditions read…"), **Views differ** (disputed). | P0 |
| FR-UND-06 | Language is simple enough for beginners (target reading level defined per language in AI strategy §4.7). | P0 |
| FR-UND-07 | Explanations never replace Scripture: the panel links to the chapter text; quoted verses are inserted verbatim from the user's edition (or an open edition if the user's is licensed display-only). | P0 |
| FR-UND-08 | Review status shown: **Reviewed** (by a named review process) or **AI-drafted, automatically checked**; users can report a problem. | P0 |
| FR-UND-09 | Coverage V1: all 1,189 chapters of the 66-book canon — Quick overview and Detailed study in English; Quick overview in Telugu and Hindi; Detailed study in Telugu/Hindi and all other languages in V1.1. | P0 |
| FR-UND-10 | Deuterocanonical chapters explained in V1.1 with tradition-appropriate framing. | P1 |
| FR-UND-11 | Explanations are versioned; corrections publish a new version and keep an audit trail. | P0 |

### 2.8 Genealogy explorer — FR-GEN

| ID | Requirement | Pri |
|---|---|---|
| FR-GEN-01 | For the current chapter, a People panel lists people named or clearly referred to, with role in the chapter and verse references. | P0 |
| FR-GEN-02 | Person profile: names in the UI language, alternative names/spellings, short description, family, key events, all references (paged), and disambiguation from same-named people. | P0 |
| FR-GEN-03 | Family explorer shows parents, children, spouses and siblings where established; ancestors and descendants across generations with scroll/expand. | P0 |
| FR-GEN-04 | Each relationship shows its evidence (verses) and confidence: Stated · Stated elsewhere · Inferred · Disputed · Tradition (extra-biblical). | P0 |
| FR-GEN-05 | Royal lines and dynasties (e.g. House of Omri, House of David, House of Jehu) can be viewed as lines of succession, separate from family trees. | P0 |
| FR-GEN-06 | Missing relationships are shown as unknown, never filled by guess. | P0 |
| FR-GEN-07 | Parallel genealogies that differ (e.g. Matthew 1 and Luke 3) are shown side by side with their own references. | P0 |

### 2.9 Timeline — FR-TL

| ID | Requirement | Pri |
|---|---|---|
| FR-TL-01 | Interactive timeline of periods (patriarchs → early church) and major events, linked to chapters and people. | P0 |
| FR-TL-02 | The current chapter's period is highlighted when the timeline is opened from the reader. | P0 |
| FR-TL-03 | Dates are labelled approximate ("c.") and show ranges; disputed dates show a "Dates differ" badge with the main alternatives (e.g. early vs late Exodus). | P0 |
| FR-TL-04 | Undated or symbolic periods (e.g. primeval history) are shown without invented years. | P0 |
| FR-TL-05 | Users can switch the chronology view for disputed spans where alternatives are modelled. | P1 |

### 2.10 Daily study — FR-DAILY

| ID | Requirement | Pri |
|---|---|---|
| FR-DAILY-01 | Built-in reading plans (e.g. whole Bible in a year, NT in 90 days, Psalms & Proverbs monthly, Gospels in 30 days) in all UI languages. | P0 |
| FR-DAILY-02 | Custom schedule builder: choose books/range, start date, days per week, end date or pace. | P0 |
| FR-DAILY-03 | Reminders at user-selected times in the user's timezone; web push and email; quiet hours; snooze. | P0 |
| FR-DAILY-04 | Mark readings complete (manual, or automatic when the portion is read to the end). | P0 |
| FR-DAILY-05 | Weekly and monthly progress views; streaks shown gently (no shaming on missed days). | P0 |
| FR-DAILY-06 | Reading history (what was read, when, in which edition). | P0 |
| FR-DAILY-07 | Bookmarks and study notes accessible from the plan view. | P0 |
| FR-DAILY-08 | Audio Bible where available and licensed (e.g. Telugu IRV audio, BSB audio). | P1 |
| FR-DAILY-09 | Offline reading of downloaded open-licence editions, including plan portions. | P0 |
| FR-DAILY-10 | Catch-up and reschedule when days are missed. | P1 |

### 2.11 Accounts and data — FR-ACC

| ID | Requirement | Pri |
|---|---|---|
| FR-ACC-01 | Reader works without an account; local data migrates to an account on sign-in. | P0 |
| FR-ACC-02 | Sign-in with email magic link and Google; passkeys. | P0 (email, Google) / P1 (passkeys) |
| FR-ACC-03 | Sync of positions, bookmarks, highlights, notes, plans, settings across devices. | P0 |
| FR-ACC-04 | Export all personal data (JSON + readable HTML) and delete account. | P0 |
| FR-ACC-05 | Consent and notice screens meet DPDP Act 2023 / DPDP Rules 2025 and GDPR (see security doc). | P0 |

---

## 3. Non-functional requirements

| ID | Requirement | Target (proposed) |
|---|---|---|
| NFR-PERF-01 | First chapter render on mid-range Android (e.g. 4 GB RAM) over 4G | LCP ≤ 2.5 s; initial 4 verses visible ≤ 1.5 s after navigation |
| NFR-PERF-02 | Chapter API latency | p95 ≤ 150 ms from cache, ≤ 400 ms uncached |
| NFR-PERF-03 | Verse Finder latency | p95 ≤ 1.5 s (hybrid search), ≤ 300 ms for reference lookups |
| NFR-PERF-04 | JS budget for reader route | ≤ 170 KB compressed initial JS |
| NFR-A11Y-01 | Accessibility | WCAG 2.2 AA across all P0 screens |
| NFR-A11Y-02 | Text scaling | Usable at 200% zoom and OS large-text settings |
| NFR-REL-01 | Availability | 99.5% monthly for reading APIs |
| NFR-REL-02 | Offline | Downloaded editions readable with no network |
| NFR-INT-01 | Text integrity | 100% of stored verses match source files (hash checks); 0 invented verses |
| NFR-INT-02 | Traceability | Every displayed verse and every AI citation resolves to edition + verse key + source hash |
| NFR-SEC-01 | Security baseline | OWASP ASVS Level 2 |
| NFR-PRIV-01 | Privacy | No third-party ad/tracking scripts; privacy-preserving analytics only |
| NFR-OBS-01 | Observability | Structured logs, metrics, tracing on all services; licence-policy denials logged |
| NFR-MAINT-01 | Data updates | Re-import of an edition without breaking user highlights/notes (verse keys stable) |
| NFR-COST-01 | Cost awareness | AI generation is batch/offline; per-query AI calls limited and cached |

---

## 4. Out of scope (V1)

AI chat about theology; user-generated public content; social feeds; advertising; paid tiers (pending D-001); native apps; print/PDF export; translation editing.

## 5. Open requirement questions

| ID | Question | Default if not answered |
|---|---|---|
| RQ-1 | Should "All books" be a canon option for curious readers? | Yes, labelled "All books in this edition" |
| RQ-2 | Default parallel pair for each UI language? | UI-language open edition + English KJV (or WEB for modern English) |
| RQ-3 | Native digits default for Indic locales? | Western digits default, native digits optional (UI-OPEN-1) |
| RQ-4 | Should streaks be shown at all? | Yes, gently, can be hidden |
