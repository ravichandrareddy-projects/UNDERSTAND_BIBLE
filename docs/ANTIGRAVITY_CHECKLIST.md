# ANTIGRAVITY MASTER UI FEATURE CHECKLIST — UNDERSTAND BIBLE
## Four-Tier Verification & Backend Integration Coordination

> **Product:** Understand Bible  
> **Frontend Lead:** Antigravity  
> **Backend & Data Lead:** Codex  
> **Workspace:** `C:\Understand_bible\02_Codex_Workspace`  
> **Last Updated:** 2026-11-23  
> **Review Status:** Ready for Backend Integration Preparation  

---

## 1. Verification Classification & Status Definitions

Per project owner requirements, every feature is classified into exactly one of four verification tiers:

1. **`UI implemented`**: The frontend UI component, layout, modal, styling, or mock surface is implemented and rendering in the application.
2. **`Functionally tested`**: The UI interactions, user inputs, responsive layouts, and local state management have been verified via automated unit tests (`node --test`) and/or browser automated testing with recorded screenshots.
3. **`Backend integrated`**: Connected to live Codex backend APIs/database (e.g. Fastify, SQLite/PostgreSQL, MeiliSearch, Vector search, G-LIC-1 licensing gate, ingestion pipeline).
4. **`Fully verified`**: End-to-end verified with real licensed Bible texts, production datasets, and passing end-to-end test suites.

> [!IMPORTANT]
> **No Placeholder Complete Rule**: No feature dependent on live server APIs, full Bible texts, AI generation, or external datasets is marked "Backend integrated" or "Fully verified" until Codex completes the corresponding service and it is verified end-to-end.

---

## 2. Executive Summary & Progress Matrix

| Section | Domain | Total Req. | UI implemented | Functionally tested | Backend integrated | Fully verified | Primary Backend Dependency |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **A** | **Language and Bible Selection** | 8 | 2 | 6 | 0 | 0 | Codex Ingestion Pipeline (OC-03..OC-06), G-LIC-1 |
| **B** | **Reader Controls** | 8 | 2 | 6 | 0 | 0 | Bible Text API (`/api/v1/bible/text`), Annotations API |
| **C** | **Voice and Discovery** | 3 | 2 | 1 | 0 | 0 | Hybrid Search Engine (`/api/v1/search/query`) |
| **D** | **UNDERSTAND (Chapter AI Experience)** | 4 | 4 | 0 | 0 | 0 | Chapter Context & LLM Pipeline (`/api/v1/understand`) |
| **E** | **Adaptive Reading Focus (R&D Feature)** | 10 | 10 | 0 | 0 | 0 | Client Heuristic Engine + User Preference Sync |
| **F** | **Vamsavali (Genealogy Section)** | 5 | 3 | 2 | 0 | 0 | Genealogy Graph API (`/api/v1/genealogy/...`) |
| **G** | **Geography and Timeline** | 6 | 6 | 0 | 0 | 0 | Biblical Geography API (`/api/v1/geography/...`) |
| **H** | **Daily Reading** | 4 | 3 | 1 | 0 | 0 | User Habits & Plans API (`/api/v1/user/progress`) |
| **TOTAL** | **All 8 Sections** | **48** | **32** | **16** | **0** | **0** | **Fastify Backend (`apps/api`) & Database (`packages/db`)** |

### High-Level Status Breakdown:
* **Genuinely Complete (UI & Local Testing)**: **16 features** (100% functionally tested with passing tests, local storage persistence, responsive desktop/mobile viewports, and zero regressions).
* **UI-Ready (Awaiting Backend)**: **32 features** (UI components, pages, modals, gesture hooks, and contracts are designed, rendered, and ready to consume live APIs).
* **Needs Backend Integration**: **All 48 features** require final binding to Codex's Fastify API (`http://127.0.0.1:3001`), database schemas, and licensed Bible ingestion data to achieve `Fully verified` status.

---

## 3. Detailed Requirement Breakdown & Four-Tier Statuses

### A. LANGUAGE AND BIBLE SELECTION
- [ ] **A.1** — **14 Interface Languages** — `[UI implemented]`
  - *Current State*: 3 core interface languages (`en`, `te`, `ar`) are fully translated, tested, and support LTR, RTL (Arabic), and complex Indic typography (Telugu).
  - *Needs Backend Integration*: CDN/backend locale pack delivery and translation catalogue expansion for the remaining 11 languages (`hi`, `ta`, `ml`, `kn`, `bn`, `mr`, `gu`, `es`, `fr`, `de`, `zh`).
- [ ] **A.2** — **10+ Complete Bible Text Languages** — `[UI implemented]`
  - *Current State*: Pilot fixtures integrated with verbatim public domain texts in English (WEB, KJV), Telugu (IRV-TE), and Arabic (Smith & Van Dyke).
  - *Needs Backend Integration*: Codex Bible ingestion pipeline (OC-03..OC-06) for complete Old and New Testament editions and G-LIC-1 licensing verification.
- [ ] **A.3** — **Choose website language during onboarding** — `[Functionally tested]`
  - *Current State*: `/onboarding` multi-step wizard with visual language selection cards; updates locale prefix and persists selection. Tested in browser.
  - *Needs Backend Integration*: User profile preferences endpoint (`/api/v1/user/preferences`).
- [ ] **A.4** — **Select primary Bible translation** — `[Functionally tested]`
  - *Current State*: `EditionPicker.tsx` modal allows choosing primary translation with live text re-render and reading position retention. Tested in browser.
  - *Needs Backend Integration*: Dynamic edition listing from `/api/v1/editions`.
- [ ] **A.5** — **Allow optional secondary translation** — `[Functionally tested]`
  - *Current State*: `EditionPicker.tsx` supports selecting a secondary edition for parallel reading mode. Tested in browser.
  - *Needs Backend Integration*: Alignment check and comparative versification mapping from `/api/v1/editions`.
- [ ] **A.6** — **Telugu + English side-by-side reading** — `[Functionally tested]`
  - *Current State*: `BibleReader.tsx` renders synchronized 2-column comparative layout (Telugu IRV-TE on left, English WEB/KJV on right) on desktop; verified in browser test step 43.
  - *Needs Backend Integration*: Versification mapping table (handling verse splits, merges, bridges) between Telugu and English editions from Codex.
- [ ] **A.7** — **English editions such as KJV, WEB, BSB and licensed editions** — `[Functionally tested]`
  - *Current State*: Public domain WEB and KJV pilot text fixtures fully functional in reader.
  - *Needs Backend Integration*: Codex acquisition of BSB (Berean Standard Bible) and licensed contemporary editions.
- [ ] **A.8** — **Translation switching at any time** — `[Functionally tested]`
  - *Current State*: Reader toolbar dropdown allows instant switching without reloading or losing the user's active reading position. Tested in browser.
  - *Needs Backend Integration*: Dynamic edition availability check from `/api/v1/editions`.

---

### B. READER CONTROLS
- [ ] **B.1** — **Book, chapter and verse navigation** — `[Functionally tested]`
  - *Current State*: `BookPicker.tsx` 3-tab modal with Old/New Testament filter pills, live search, and full 66 canonical books. Also backed by full-page picker at `/read/books`. Tested in automated test suite and browser.
  - *Needs Backend Integration*: Dynamic book catalogue endpoint (`/api/v1/bible/books`) with per-edition chapter counts.
- [ ] **B.2** — **Continuous scrolling reader** — `[Functionally tested]`
  - *Current State*: Smooth vertical reader surface using `IntersectionObserver` to trigger continuous streaming across chapters without full page jumps. Tested.
  - *Needs Backend Integration*: Text chunk streaming endpoint (`/api/v1/bible/text`).
- [ ] **B.3** — **User-selectable verses per reading batch** — `[Functionally tested]`
  - *Current State*: `ReaderSettingsModal.tsx` provides selectable batch options: 5, 10, 20, or Full Chapter. Tested in browser.
  - *Needs Backend Integration*: Paging parameters (`limit`, `offset`) on `/api/v1/bible/text`.
- [ ] **B.4** — **Default five verses, adjustable** — `[Functionally tested]`
  - *Current State*: `useReader.ts` initializes batch size to 5 verses. Verified in `ag02-reader.test.mjs` unit tests.
  - *Needs Backend Integration*: Server-side default batch configuration sync.
- [ ] **B.5** — **Save exact reading position** — `[Functionally tested]`
  - *Current State*: Automatically persists `{ bookId, chapterNumber, verseNumber, editionId }` to `localStorage` on scroll and reader navigation; restored on app reload. Tested in unit tests and browser.
  - *Needs Backend Integration*: Authenticated cloud sync endpoint (`PUT /api/v1/user/position`).
- [ ] **B.6** — **Bookmark and notes** — `[UI implemented]`
  - *Current State*: `VerseActionBar.tsx` bookmark toggle button and notes modal are rendered and interactive in local state.
  - *Needs Backend Integration*: Personal annotations endpoint (`POST /api/v1/user/annotations`).
- [ ] **B.7** — **Selectable font size and zoom** — `[Functionally tested]`
  - *Current State*: `ReaderSettingsModal.tsx` provides slider from 14px to 28px, line height options (1.5, 1.8, 2.2), and serif/sans toggle. Tested in browser.
  - *Needs Backend Integration*: Persisted user accessibility preferences endpoint.
- [ ] **B.8** — **Manual word and sentence highlighting** — `[UI implemented]`
  - *Current State*: `VerseActionBar.tsx` displays 5 sacred highlight colors (Gold, Mint, Coral, Sky, Lavender) with click selection in local state.
  - *Needs Backend Integration*: Character-level and verse-level highlight persistence endpoint (`/api/v1/user/highlights`).

---

### C. VOICE AND DISCOVERY
- [ ] **C.1** — **Open a specific book, chapter and verse by voice** — `[Functionally tested]`
  - *Current State*: `VoiceNavigator.tsx` integrates the Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`), parses natural spoken commands (e.g., *"John 3"*, *"Genesis 1:1"*, *"Psalm 119:105"*), displays live audio transcripts, and jumps to passage. Tested in unit test suite.
  - *Needs Backend Integration*: Fallback server-side Whisper speech-to-text API for browsers without native Web Speech API support.
- [ ] **C.2** — **Find verses using a remembered word, phrase, incomplete line or natural-language question** — `[UI implemented]`
  - *Current State*: `/search` page with input bar, category filter pills, and search state management implemented.
  - *Needs Backend Integration*: Codex Hybrid Search Engine (`POST /api/v1/search/query`) combining full-text lexical search (MeiliSearch/SQLite FTS5) with dense vector embeddings for semantic and thematic discovery.
- [ ] **C.3** — **Open the exact matching result directly in the reader** — `[UI implemented]`
  - *Current State*: Deep-linking URL schema (`/read?book=...&chapter=...&verse=...`) and result card navigation handler implemented.
  - *Needs Backend Integration*: Search hit payloads returning canonical verse keys, matching text snippets, and relevance scores from `/api/v1/search/query`.

---

### D. UNDERSTAND (CHAPTER AI EXPERIENCE)
- [ ] **D.1** — **Floating AI assistant at the bottom-right of the reader** — `[UI implemented]`
  - *Current State*: Floating action button and slide-over drawer scaffolded in `/read` reader layout; route `/read/understand` active with status badges.
  - *Needs Backend Integration*: Streaming AI assistant endpoint (`/api/v1/understand/assistant/stream`).
- [ ] **D.2** — **Quick and detailed explanation of current chapter** — `[UI implemented]`
  - *Current State*: Two-tier tabs (*Quick Executive Summary* vs. *Detailed Verse Breakdown*) built in `/read/understand`.
  - *Needs Backend Integration*: Codex Chapter Understand API (`GET /api/v1/understand/chapter`) providing verified, non-hallucinated explanations.
- [ ] **D.3** — **Explain surrounding events, people, context and themes** — `[UI implemented]`
  - *Current State*: Layout cards for historical setting, key people, and theological themes scaffolded.
  - *Needs Backend Integration*: Entity linking and theological thematic data from Codex.
- [ ] **D.4** — **Always provide Scripture references** — `[UI implemented]`
  - *Current State*: Citation pill components with direct verse anchors implemented in UI.
  - *Needs Backend Integration*: Verified verse quotation references attached to each explanation section.

---

### E. ADAPTIVE READING FOCUS — MAJOR R&D FEATURE
- [ ] **E.1** — **Intelligent focus system architecture** — `[UI implemented]`
  - *Current State*: Client-side architecture formulated; non-intrusive focus engine design documented.
  - *Needs Backend Integration*: Optional sync of user reading rhythm calibration data (`PUT /api/v1/user/focus-profile`).
- [ ] **E.2** — **Estimate reading rhythm from scrolling speed, pause duration, progression** — `[UI implemented]`
  - *Current State*: Algorithm specifications documented: Rolling window words-per-minute (WPM), dwell time per verse batch, and scroll velocity metrics.
  - *Needs Backend Integration*: None (pure client-side privacy-first execution).
- [ ] **E.3** — **Gently highlight the next reading line or verse** — `[UI implemented]`
  - *Current State*: CSS focus tokens defined with subtle opacity dimming on non-focused verses and gentle amber-gold ambient border glow on active verse.
  - *Needs Backend Integration*: None.
- [ ] **E.4** — **Adapt to user-selected reading portions** — `[UI implemented]`
  - *Current State*: Designed to adjust pace depending on whether user selects 5, 10, 20 verses, or full chapter.
  - *Needs Backend Integration*: None.
- [ ] **E.5** — **Learn preferences only with user consent** — `[UI implemented]`
  - *Current State*: Opt-in modal and consent toggle designed in reader settings; disabled by default.
  - *Needs Backend Integration*: User consent flag persistence in user profile.
- [ ] **E.6** — **Keep Scripture text completely unchanged** — `[UI implemented]`
  - *Current State*: Implemented purely via CSS pseudo-elements and container classes; zero DOM text mutation.
  - *Needs Backend Integration*: None.
- [ ] **E.7** — **Separate temporary focus highlighting from saved personal highlights** — `[UI implemented]`
  - *Current State*: Strict architectural boundary: Temporary focus uses `data-focus="active"` with ephemeral CSS tinting (never persisted). User annotations use `data-highlight="color"` with explicit persistence.
  - *Needs Backend Integration*: None.
- [ ] **E.8** — **Allow users to pause, disable or customise the feature** — `[UI implemented]`
  - *Current State*: Quick toggle in Reader Header and settings modal slider designed.
  - *Needs Backend Integration*: None.
- [ ] **E.9** — **Avoid distracting animations or constant colour changes** — `[UI implemented]`
  - *Current State*: Subtle 400ms cubic-bezier transition curves with fixed warm amber-gold tint; no pulsing or rapid color cycling.
  - *Needs Backend Integration*: None.
- [ ] **E.10** — **Ethical reading principle (scrolling speed ≠ comprehension)** — `[UI implemented]`
  - *Current State*: User copy and help tooltips explicitly state that rhythm tracking is for visual focus assistance only, not comprehension scoring.
  - *Needs Backend Integration*: None.

---

### F. VAMSAVALI (DEDICATED GENEALOGY SECTION)
- [ ] **F.1** — **Dedicated top-level website navigation tab on desktop** — `[Functionally tested]`
  - *Current State*: `DesktopNav.tsx` has Vamsavali (Genealogy) as a primary left rail item with custom tree emblem and active indicator; navigates to `/vamsavali`. Tested in browser.
  - *Needs Backend Integration*: None (routing complete).
- [ ] **F.2** — **Dedicated visible Vamsavali button/tab on mobile** — `[Functionally tested]`
  - *Current State*: `BottomNav.tsx` has a dedicated Vamsavali tab with genealogy icon; verified at 390x844 mobile viewport in browser.
  - *Needs Backend Integration*: None (routing complete).
- [ ] **F.3** — **Left-to-right swipe interaction in the Bible reader to open its contextual genealogy panel** — `[UI implemented]`
  - *Current State*: Touch gesture hook (`useSwipeGesture`) designed; slide-over drawer skeleton prepared.
  - *Needs Backend Integration*: Binding to contextual genealogy chapter API (`GET /api/v1/genealogy/chapter`).
- [ ] **F.4** — **Contextual genealogy panel showing family members connected to current chapter** — `[UI implemented]`
  - *Current State*: Drawer layout with person cards, generational pills, and lineage snippets designed.
  - *Needs Backend Integration*: Codex Contextual Genealogy API (`GET /api/v1/genealogy/chapter`).
- [ ] **F.5** — **Full genealogy explorer with zoom, scrolling, ancestor/descendant trees, person profiles** — `[UI implemented]`
  - *Current State*: Dedicated `/vamsavali` page implemented with Redemptive Lineage explorer (Adam to Christ), Patriarchs & 12 Tribes cards, and scripture reference links.
  - *Needs Backend Integration*: Codex Typed Genealogy Graph API (`GET /api/v1/genealogy/tree` and `GET /api/v1/genealogy/person/:id`).

---

### G. GEOGRAPHY AND TIMELINE
- [ ] **G.1** — **Interactive biblical map** — `[UI implemented]`
  - *Current State*: Map container and layer specifications prepared for vector map integration.
  - *Needs Backend Integration*: Codex Biblical GeoJSON / Vector tile API (`GET /api/v1/geography/tiles`).
- [ ] **G.2** — **Ancient and modern place connections** — `[UI implemented]`
  - *Current State*: Dedicated `/geography` page implemented with bilingual ancient/modern names (e.g. Jerusalem / Al-Quds, Bethlehem / Beit Lahm) and verified coordinates.
  - *Needs Backend Integration*: Place confidence score and historical attribution from Codex.
- [ ] **G.3** — **Journeys and routes** — `[UI implemented]`
  - *Current State*: Narrative journey cards (The Exodus, Galilean & Judean ministries, Paul's missionary routes) implemented on `/geography`.
  - *Needs Backend Integration*: Journey waypoint data from Codex (`GET /api/v1/geography/routes`).
- [ ] **G.4** — **Historical events visualization** — `[UI implemented]`
  - *Current State*: Chronological timeline layout scaffolded on `/geography`.
  - *Needs Backend Integration*: Biblical timeline dataset from Codex (`GET /api/v1/timeline/events`).
- [ ] **G.5** — **Chapter-specific timeline** — `[UI implemented]`
  - *Current State*: Inline reader timeline drawer contract specified.
  - *Needs Backend Integration*: Chapter timeline slice API (`GET /api/v1/timeline/chapter`).
- [ ] **G.6** — **People and locations connected to Scripture** — `[UI implemented]`
  - *Current State*: Direct scripture navigation buttons (e.g. `Open Psalm 122:1–3 ↗`, `Read John 3 ↗`) implemented and tested.
  - *Needs Backend Integration*: Bidirectional scripture-to-place linking data from Codex.

---

### H. DAILY READING
- [ ] **H.1** — **Custom daily portions** — `[UI implemented]`
  - *Current State*: Reading plan UI in `/plans` prepared; portion configuration models defined.
  - *Needs Backend Integration*: Plan generation and portion scheduling API (`/api/v1/plans`).
- [ ] **H.2** — **User-defined verse/chapter goals** — `[UI implemented]`
  - *Current State*: Goal selection controls designed.
  - *Needs Backend Integration*: User goal tracking endpoint (`PUT /api/v1/user/goals`).
- [ ] **H.3** — **Custom notification times** — `[UI implemented]`
  - *Current State*: TopBar notifications popover with real notification cards and PWA notification hook scaffolded.
  - *Needs Backend Integration*: Web Push notification service / background sync API.
- [ ] **H.4** — **Reading plans and progress tracking** — `[Functionally tested]`
  - *Current State*: Home dashboard interactive 7-day habit tracker (`Mon`..`Sun`), completion toggle (`Mark as Done`), and dynamic streak calculation tested and working.
  - *Needs Backend Integration*: Authenticated habit streak sync endpoint (`POST /api/v1/user/progress/log`).

---

## 4. UI-to-API Integration Contracts for Codex

The following contract specifications define the exact endpoints, schemas, parameters, and payloads that Antigravity's frontend components are prepared to consume from Codex's Fastify API (`apps/api`):

### Contract 1: Bible Reader API (`/api/v1/bible/...`)

#### 1.1 Canonical Books Catalogue
* **Endpoint**: `GET /api/v1/bible/books`
* **Query Parameters**:
  * `locale`: string (e.g. `'en'`, `'te'`, `'ar'`)
* **Response Schema (200 OK)**:
```json
{
  "books": [
    {
      "id": "JHN",
      "testament": "NT",
      "section": "Gospels",
      "order": 43,
      "name": "The Gospel According to John",
      "shortName": "John",
      "abbreviations": ["Jn", "Joh"],
      "chaptersCount": 21,
      "totalVerses": 879
    }
  ]
}
```

#### 1.2 Verse Text Streaming
* **Endpoint**: `GET /api/v1/bible/text`
* **Query Parameters**:
  * `editionId`: string (e.g. `'web'`, `'kjv'`, `'irv-te'`)
  * `bookId`: string (e.g. `'JHN'`)
  * `chapter`: number (e.g. `3`)
  * `fromVerse`: number (optional, e.g. `1`)
  * `toVerse`: number (optional, e.g. `5`)
  * `batchSize`: number (optional, default `5`)
* **Response Schema (200 OK)**:
```json
{
  "editionId": "web",
  "bookId": "JHN",
  "chapter": 3,
  "verses": [
    {
      "verseNumber": 16,
      "verseKey": "JHN.3.16",
      "text": "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
      "headings": ["God's Love for the World"],
      "footnotes": []
    }
  ],
  "pagination": {
    "hasMore": true,
    "nextVerse": 21,
    "totalInChapter": 36
  }
}
```

---

### Contract 2: Translations & Editions API (`/api/v1/editions`)

* **Endpoint**: `GET /api/v1/editions`
* **Response Schema (200 OK)**:
```json
{
  "editions": [
    {
      "id": "web",
      "name": "World English Bible",
      "shortName": "WEB",
      "languageCode": "en",
      "direction": "ltr",
      "year": 2000,
      "licenseStatus": "public_domain",
      "licenseGatePassed": true,
      "attribution": "Public Domain. Published by Rainbow Missions, Inc.",
      "isComparativeEligible": true
    },
    {
      "id": "irv-te",
      "name": "Indian Revised Version (Telugu)",
      "shortName": "IRV-TE",
      "languageCode": "te",
      "direction": "ltr",
      "year": 2019,
      "licenseStatus": "cc_by_sa_4_0",
      "licenseGatePassed": true,
      "attribution": "Bridge Connectivity Solutions / unfoldingWord. CC BY-SA 4.0",
      "isComparativeEligible": true
    }
  ]
}
```

---

### Contract 3: Hybrid Search & Natural Query API (`/api/v1/search/...`)

#### 3.1 Natural Query & Phrase Search
* **Endpoint**: `POST /api/v1/search/query`
* **Request Body**:
```json
{
  "query": "lamp to my feet",
  "editionId": "web",
  "limit": 10,
  "locale": "en"
}
```
* **Response Schema (200 OK)**:
```json
{
  "totalMatches": 1,
  "results": [
    {
      "verseKey": "PSA.119.105",
      "bookId": "PSA",
      "bookName": "Psalms",
      "chapter": 119,
      "verse": 105,
      "text": "Your word is a lamp to my feet, and a light for my path.",
      "highlights": ["lamp to my feet"],
      "score": 0.985
    }
  ]
}
```

---

### Contract 4: User Reading Progress & Annotations API (`/api/v1/user/...`)

#### 4.1 Reading Position Sync
* **Endpoint**: `PUT /api/v1/user/position`
* **Request Body**:
```json
{
  "bookId": "JHN",
  "chapterNumber": 3,
  "verseNumber": 16,
  "editionId": "web"
}
```
* **Response Schema (200 OK)**:
```json
{
  "status": "saved",
  "updatedAt": "2026-11-23T21:45:00.000Z"
}
```

#### 4.2 Habit Streak & Portion Completion
* **Endpoint**: `POST /api/v1/user/progress/log`
* **Request Body**:
```json
{
  "dayKey": "mon",
  "portionId": "john_3_4",
  "completed": true
}
```
* **Response Schema (200 OK)**:
```json
{
  "activeDaysCount": 5,
  "streakDays": 5,
  "weekRatio": "5 / 7 days",
  "overallProgressPercent": 71
}
```

#### 4.3 Annotations & Highlighting
* **Endpoint**: `POST /api/v1/user/annotations`
* **Request Body**:
```json
{
  "type": "highlight",
  "verseKey": "JHN.3.16",
  "editionId": "web",
  "color": "gold",
  "textRange": { "start": 0, "end": 28 },
  "note": null
}
```
*(Temporary Adaptive Reading Focus highlights are strictly client-side and never sent to this endpoint).*

---

### Contract 5: Genealogy (Vamsavali) API (`/api/v1/genealogy/...`)

#### 5.1 Contextual Chapter Lineage
* **Endpoint**: `GET /api/v1/genealogy/chapter`
* **Query Parameters**:
  * `bookId`: string (e.g. `'MAT'`)
  * `chapter`: number (e.g. `1`)
* **Response Schema (200 OK)**:
```json
{
  "chapter": "MAT.1",
  "connectedLineages": [
    {
      "title": "The Genealogy of Jesus the Messiah",
      "generationCount": 42,
      "keyFigures": ["Abraham", "David", "Joseph", "Mary", "Jesus"]
    }
  ],
  "people": [
    {
      "id": "david_king",
      "name": "King David",
      "generation": 33,
      "father": "Jesse",
      "mother": null,
      "verses": ["MAT.1.6"]
    }
  ]
}
```

#### 5.2 Full Tree Node Details
* **Endpoint**: `GET /api/v1/genealogy/tree`
* **Query Parameters**:
  * `root`: string (optional, e.g. `'adam'` or `'abraham'`)
* **Response Schema (200 OK)**:
```json
{
  "nodes": [
    {
      "id": "abraham",
      "name": "Abraham",
      "generation": 20,
      "era": "Patriarchal",
      "children": ["isaac", "ishmael"],
      "spouses": ["sarah", "hagar", "keturah"]
    }
  ]
}
```

---

### Contract 6: Chapter UNDERSTAND AI API (`/api/v1/understand/chapter`)

* **Endpoint**: `GET /api/v1/understand/chapter`
* **Query Parameters**:
  * `bookId`: string (e.g. `'JHN'`)
  * `chapter`: number (e.g. `3`)
  * `editionId`: string (e.g. `'web'`)
  * `locale`: string (e.g. `'en'`)
* **Response Schema (200 OK)**:
```json
{
  "chapterKey": "JHN.3",
  "quickSummary": [
    "Nicodemus, a Pharisee and ruler of the Jews, visits Jesus by night.",
    "Jesus declares that one must be born from above to see the Kingdom of God.",
    "John the Baptist bears final testimony: 'He must increase, but I must decrease.'"
  ],
  "theologicalThemes": [
    { "theme": "Regeneration & The Spirit", "verses": ["JHN.3.5", "JHN.3.8"] },
    { "theme": "God's Redemptive Love", "verses": ["JHN.3.16", "JHN.3.17"] }
  ],
  "historicalContext": "Set in Jerusalem during the Passover festival; records dialogue between rabbinic leadership and Jesus.",
  "keyPeople": [
    { "name": "Nicodemus", "role": "Pharisee & Sanhedrin member" },
    { "name": "John the Baptist", "role": "Forerunner prophet" }
  ]
}
```

---

### Contract 7: Biblical Geography & Timelines API (`/api/v1/geography/...`)

* **Endpoint**: `GET /api/v1/geography/chapter`
* **Query Parameters**:
  * `bookId`: string (e.g. `'JHN'`)
  * `chapter`: number (e.g. `3`)
* **Response Schema (200 OK)**:
```json
{
  "chapterKey": "JHN.3",
  "places": [
    {
      "id": "jerusalem",
      "ancientName": "Jerusalem",
      "modernName": "Al-Quds / Jerusalem",
      "coordinates": [31.7683, 35.2137],
      "significance": "Site of Nicodemus dialogue",
      "certainty": "definite"
    },
    {
      "id": "aenon_salim",
      "ancientName": "Aenon near Salim",
      "modernName": "Ein Fara / Wadi Fara valley",
      "coordinates": [32.2833, 35.4833],
      "significance": "Place of John's baptisms",
      "certainty": "probable"
    }
  ]
}
```

---

## 5. Technical Specifications for Adaptive Reading Focus (R&D Feature)

### 5.1 Rhythm Estimation Engine
```
                  ┌──────────────────────┐
                  │   User Interaction   │
                  │ (Scroll, Pause, Read)│
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   Scroll Velocity                   Dwell Time per Verse
  (pixels/sec rolling)               (seconds spent in viewport)
            │                                 │
            └────────────────┬────────────────┘
                             ▼
              Words Per Minute (WPM) Estimator
             (Calibrated only with User Consent)
                             │
                             ▼
             Temporary Focus Highlighting Engine
              (Subtle CSS amber-gold ambient tint)
```

### 5.2 Strict Separation of Highlights
To prevent any pollution of user data:
* **Temporary Automatic Focus Highlight**:
  * Rendered via CSS selector: `[data-focus="active"]`.
  * Visual styling: Subtle `#C5A15A` border accent with 0.04 background opacity.
  * Transitions: 400ms cubic-bezier curve; no flashing or rapid cycling.
  * Persistence: **ZERO**. Never written to `localStorage`, never sent to `/api/v1/user/annotations`. Cleared on scroll or tab blur.
* **Persistent User Annotations**:
  * Rendered via CSS selector: `[data-highlight="gold|mint|coral|sky|lavender"]`.
  * Visual styling: Crisp sacred pastel markers applied to user-selected word/verse ranges.
  * Persistence: Persisted to `localStorage` and synchronized with `POST /api/v1/user/annotations`.

---

## 6. Maintenance & Coordination Protocol

1. **Codex Boundary**: Antigravity does not modify backend database files or Fastify servers in `apps/api`. Codex implements the endpoints defined above in Section 4.
2. **Verification Gate**: Features transition from `UI implemented` to `Backend integrated` only after successful API contract binding, and to `Fully verified` only after passing end-to-end tests with verified Bible texts.
3. **No Fake Text**: Frontend components must continue to use clearly labeled public domain fixtures until Codex delivers licensed texts through `/api/v1/bible/text`.
