# Frontend Contract Acknowledgement — Understand Bible

> **Document:** Antigravity Frontend Review & Agreement  
> **Source Proposals Reviewed:**  
> - `packages/contracts/reader-proposal.md`  
> - `packages/contracts/reader.ts`  
> - `docs/UI_TO_CODEX_API_CONTRACTS.md`  
> - `docs/ANTIGRAVITY_CHECKLIST.md`  
> **Author:** Antigravity (UI/UX Frontend Lead)  
> **Recipient:** Codex (Core Engineering & Data Lead), ChatGPT / Project Owner  
> **Date:** 2026-11-23  
> **Milestone Coordination:** Post OC-07 (Scaffold/DB) & OC-04 (Licensing/Acquisition)  

---

## 1. Executive Summary

Antigravity acknowledges and welcomes Codex's Reader API proposal (`packages/contracts/reader-proposal.md` and `reader.ts`). The proposed Fastify service operations, cursor-based pagination, content versioning, and edition identification (`eng-web`, `eng-bsb`, `eng-dra`, `tel-irv`, `hin-irv`) provide a sound engineering foundation for transitioning the frontend from static fixtures to the live Codex backend.

Below is our formal response on the seven critical contract items, detailing our exact agreements, minor interface enhancements, and component impact assessments.

---

## 2. Explicit Item-by-Item Agreement

### Item 1: String-Based Verse Identifiers
* **Status**: **Accepted with changes**
* **Evaluation**:
  * We fully endorse replacing pure numeric verse identifiers with string-based labels (`label: string`).
  * In canonical Scripture editions, bridge verses (e.g., `"3-4"`, `"15-16"`), sub-verse divisions (e.g., `"1a"`, `"1b"`), and omitted verses cannot be represented as strict positive integers without loss of textual fidelity.
  * Preserving the exact source label on screen and in reading positions aligns with the project's provenance rules.
* **Proposed Enhancement**:
  * Ensure `ReaderVerse` provides `verseKey` as an explicit or easily derived property (e.g., `JHN.3.16` or `JHN.3.3-4`). This allows cross-references, deep links, and speech navigators to anchor directly without requiring client-side row-ordinal lookups.
  * Proposed interface:
    ```typescript
    export interface ReaderVerse {
      ordinal: number;      // 1-based sequential row index within the chapter
      label: string;        // Textual verse label from source (e.g., "16", "3-4", "1a")
      text: string;         // Verbatim Scripture text
      verseKey?: string;    // Optional canonical key, e.g. "JHN.3.16" (or computable as `${book}.${chapter}.${label}`)
    }
    ```
* **Frontend Component Impact**:
  * `apps/web/data/bible/types.ts`: Update `Verse.verseNumber: number` to `Verse.label: string`, with optional helper `verseNumber?: number` (parsed integer when label is strictly numeric).
  * `apps/web/components/reader/BibleReader.tsx`: Render verse badge using `verse.label` (e.g. `3-4`); set DOM scroll anchor to `id={`v-${verse.ordinal}`}` to ensure valid DOM IDs even with bridge labels.

---

### Item 2: Edition/Version-Bound Pagination
* **Status**: **Accepted**
* **Evaluation**:
  * We accept the cursor-based pagination contract:
    `GET /v1/editions/{id}/chapters/{book}.{chapter}?version=&from=&limit=`
  * Binding `nextFrom` (opaque string) to the edition ID, content checksum/version, book, chapter, and last row ordinal is architecturally superior to numeric offsets. It prevents duplicate verse insertions when continuous scrolling spans version updates or when rows contain bridge verses.
  * Returning `nextFrom: null` upon page exhaustion cleanly signals to the frontend infinite reader that the chapter boundary has been reached.
  * Returning `409 Conflict` on a stale continuation token ensures the client refreshes rather than rendering mismatched content chunks.
* **Frontend Component Impact**:
  * `apps/web/lib/reader/useReader.ts`: Update pagination state from numeric `{ offset, limit }` to `{ cursor: string | null, limit: number }`. When `nextFrom === null`, set `hasMore = false`.
  * On `409 Conflict`, the reader will automatically discard the stale cursor and re-fetch from `from=""` without user disruption.

---

### Item 3: Reading-Position Request and Response Payloads
* **Status**: **Accepted with changes**
* **Evaluation**:
  * We accept the core payload proposed in `packages/contracts/reader.ts`:
    ```typescript
    export interface ReadingPosition {
      edition: string;
      version: string;
      book: string;
      chapter: string;
      label: string;
      scrollFraction: number; // 0.0 to 1.0
      updatedAt: string;      // ISO 8601
    }
    ```
  * Using `scrollFraction` (0.0 to 1.0) rather than pixel offsets allows accurate reading restoration across heterogeneous screen sizes (mobile 390px vs. desktop 1440px).
* **Proposed Enhancement**:
  * **Anonymous-to-Authenticated Compatibility**: For anonymous users, the frontend will persist the exact same schema to `localStorage` (`understand_bible_last_reading_pos`). When the user authenticates, the client can submit this object directly via `PUT /v1/me/position` without transformation.
  * **Default Scroll Fraction**: Allow `scrollFraction` to be optional on initial position creation (defaulting to `0.0` at chapter start).
  * **Transport Adapter Aliases**: To prevent breaking existing local storage data from pilot testers, the frontend transport adapter will accept legacy keys (`bookId`, `chapterNumber`, `verseNumber`, `editionId`) and seamlessly normalize them to the canonical schema.
* **Frontend Component Impact**:
  * `apps/web/app/[locale]/today/page.tsx`: Update reading position parser to read `pos.book`, `pos.chapter` (using `parseInt(pos.chapter, 10)` for chapter-count progress math), and `pos.label`.
  * `apps/web/lib/reader/useReader.ts`: Update position emission to calculate vertical scroll fraction `window.scrollY / document.body.scrollHeight` clamped to `[0.0, 1.0]`.

---

### Item 4: Translation Switching Without Losing Reading Position
* **Status**: **Accepted with changes**
* **Evaluation**:
  * Codex correctly notes that unified cross-translation alignment data will be built under task OC-05.
  * When a reader switches translations (e.g. from `eng-web` to `tel-irv`) in the middle of a chapter, we must guarantee the user does not experience a blank screen or lose their position.
* **Proposed Enhancement — Deterministic Fallback Protocol**:
  Prior to OC-05, translation switching will follow this strict fallback hierarchy:
  1. **Exact Label Match**: If the target edition contains a verse row with the exact same `label` (e.g. `"16"`), scroll directly to that row.
  2. **Bridge / Prefix Match**: If the active label is `"16"` and the target edition has a bridge `"15-16"` or `"16-17"`, match the bridge row containing that verse number.
  3. **Scroll Fraction Fallback**: If no label match exists (e.g., significant versification difference), scroll to the corresponding `scrollFraction` position in the chapter.
  4. **Chapter Start Fallback**: If the chapter exists but coordinates differ, default to row 1 (`ordinal: 1`).
  5. **Canon Boundary Notification**: If the current book or chapter does not exist in the target edition (e.g. navigating from Douay-Rheims Tobit to a 66-book Protestant edition), display an in-app banner (*"Tobit is not included in World English Bible. Switched to Genesis 1"*) and navigate safely.
* **Frontend Component Impact**:
  * `apps/web/components/reader/EditionPicker.tsx`: Implement the fallback resolver during translation change dispatch.

---

### Item 5: Telugu-English Parallel Verse Alignment
* **Status**: **Accepted with changes**
* **Evaluation**:
  * Codex specifies: *"API data has no cross-translation alignment key until OC-05. Comparative eligibility requires reviewed mappings."*
  * We agree that parallel reading must be restricted to verified editions with reviewed mappings to prevent misaligning Scripture verses.
  * For the pilot launch, the New Testament texts of `eng-web` and `tel-irv` share identical chapter/verse structures (e.g., John 3 has exactly 36 verses in both).
* **Proposed Enhancement**:
  * In parallel desktop mode (`BibleReader.tsx`), the frontend will fetch both chapter batches concurrently:
    `GET /v1/editions/tel-irv/chapters/JHN.3` and `GET /v1/editions/eng-web/chapters/JHN.3`.
  * Rows will be rendered side-by-side matching on `verse.label`.
  * When OC-05 provides the cross-translation mapping table, the server can optionally supply an alignment array:
    ```typescript
    export interface ComparativeAlignment {
      primaryOrdinal: number;
      primaryLabel: string;
      secondaryOrdinals: number[];
      secondaryLabels: string[];
    }
    ```
  * Where a bridge occurs on one side, the frontend will insert a visual spacer block to keep subsequent verses synchronized across both columns.
* **Frontend Component Impact**:
  * `apps/web/components/reader/BibleReader.tsx`: Parallel 2-column view already aligns by verse index; update comparator to key on `label` with fallback to `ordinal`.

---

### Item 6: Book and Chapter Navigation Across Different Canons
* **Status**: **Accepted with changes**
* **Evaluation**:
  * Codex confirms that `GET /v1/canons/{id}/books` returns books in that edition's specific order, supporting 73 books for `eng-dra` (Douay-Rheims) including the 7 deuterocanonical books (Tobit, Judith, Wisdom, Sirach, Baruch, 1 & 2 Maccabees).
  * The frontend must avoid hardcoding a rigid 66-book limit.
* **Proposed Enhancement**:
  * Extend `ReaderBook` in `packages/contracts/reader.ts` to include `testament` and optional `section` metadata so the UI BookPicker can categorize books accurately:
    ```typescript
    export interface ReaderBook {
      book: string;                         // Canonical ID (e.g., 'GEN', 'TOB', 'MAT')
      ordinal: number;                      // Order within the active edition
      name: string;                         // Localized book title
      nameLanguage: string;                 // Language of returned title
      testament: 'OT' | 'NT' | 'DC';        // OT = Old Testament, NT = New Testament, DC = Deuterocanon / Apocrypha
      section?: string;                     // 'Law', 'History', 'Wisdom', 'Prophets', 'Gospels', etc.
      chapters: string[];                   // Edition-local chapter labels, e.g. ["1", "2", ...]
    }
    ```
* **Frontend Component Impact**:
  * `apps/web/components/reader/BookPicker.tsx`:
    * Replace static `BIBLE_BOOKS` with dynamic data from `GET /v1/canons/{id}/books`.
    * Dynamically display the **Deuterocanon** tab pill when the selected translation contains books with `testament === 'DC'`.
    * Retain the existing 66-book catalog as an offline fallback when disconnected.

---

### Item 7: Reader Error and Unavailable-Edition States
* **Status**: **Accepted**
* **Evaluation**:
  * We fully accept the proposed HTTP error status conventions:
    * `400 Bad Request`: Malformed parameters.
    * `401 Unauthorized`: Anonymous position sync (client stays on local storage).
    * `404 Not Found`: Unavailable edition, version, book, or chapter.
    * `409 Conflict`: Stale continuation token on an otherwise available edition.
    * `{ translations: [] }` (200 OK): Empty catalogue is a valid state.
* **Frontend Implementation Specifications**:
  * **On 404 (Unavailable Content)**:
    Render the Sacred & Elegant `ErrorState` card:
    *"This translation or passage is not available in the catalogue."*
    Provide actionable recovery buttons: `[Switch to World English Bible]` and `[Go to Genesis 1]`.
  * **On 409 (Stale Continuation Token)**:
    Silently reset pagination cursor to `from=""` and re-fetch the chapter from row 1, seamlessly refreshing content without interrupting the reader.
  * **On 401 (Anonymous Position Sync)**:
    Suppress error modals. Persist position to `localStorage` and display an unobtrusive profile banner: *"Sign in to synchronize reading position across devices"*.
  * **On Empty Catalogue (`translations: []`)**:
    Render a clean state in `EditionPicker.tsx`: *"No translations available for this language/canon filter"*, with a clear-filter CTA button.
* **Frontend Component Impact**:
  * Handled entirely within `apps/web/lib/api-client.ts` and `apps/web/components/ui/ErrorState.tsx` with zero UI redesign required.

---

## 3. Comprehensive Proposed TypeScript Interfaces (`reader-contracts.ts`)

For incorporation into `packages/contracts/reader.ts`:

```typescript
/**
 * Unified Reader Contract Interfaces
 * Agreed upon by Antigravity and Codex (2026-11-23)
 */

export interface Translation {
  id: string;               // e.g., 'eng-web', 'tel-irv', 'eng-dra', 'hin-irv'
  title: string;
  language: string;         // ISO 639-1 ('en', 'te', 'hi', etc.)
  canon: string;            // 'protestant', 'catholic', 'orthodox'
  version: string;          // Published content checksum/revision
  attribution: string;      // Mandatory publisher/license attribution string
  terms: string;            // Short license summary
  conditions: string[];     // License conditions (e.g., non-commercial, offline allowed)
  sourceUrl: string;
  evidenceUrls: string[];
}

export interface ReaderBook {
  book: string;                     // e.g., 'GEN', 'TOB', 'MAT'
  ordinal: number;                  // 1-based index in this edition's canon
  name: string;                     // Localized name
  nameLanguage: string;             // Language code of name
  testament: 'OT' | 'NT' | 'DC';    // Categorization for picker tabs
  section?: string;                 // 'Law', 'History', 'Wisdom', 'Prophets', 'Gospels', etc.
  chapters: string[];               // Ordered chapter labels (e.g. ["1", "2", ...])
}

export interface ReaderVerse {
  ordinal: number;          // Sequential row index in chapter (1, 2, 3...)
  label: string;            // Source verse label (e.g., "1", "3-4", "16", "1a")
  text: string;             // Verbatim Scripture text
  verseKey?: string;        // Canonical key (e.g., "JHN.3.16" or "JHN.3.3-4")
}

export interface ReaderAnnotation {
  sequence: number;
  kind: 'heading' | 'introduction' | 'footnote' | 'cross_reference';
  precedingLabel: string | null;   // Verse label preceding annotation (null if before v1)
  contentUsj: Record<string, unknown>;
}

export interface ChapterBatch {
  translation: Translation;
  book: string;
  chapter: string;
  totalRows: number;
  verses: ReaderVerse[];
  annotations: ReaderAnnotation[];
  nextFrom: string | null;          // Opaque cursor; null when chapter exhausted
}

export interface ReadingPosition {
  edition: string;          // e.g., 'eng-web', 'tel-irv'
  version: string;          // Edition content version checksum
  book: string;             // e.g., 'JHN'
  chapter: string;          // e.g., '3'
  label: string;            // e.g., '16' or '3-4'
  scrollFraction: number;   // 0.0 to 1.0 vertical scroll position
  updatedAt: string;        // ISO 8601 timestamp
}
```

---

## 4. Component Impact & Readiness Matrix

| Frontend Component | File Path | Impact Assessment | Readiness |
|:---|:---|:---|:---:|
| **Types Definition** | `apps/web/data/bible/types.ts` | Add `label: string` and `ordinal: number` to `Verse`; add `version`, `scrollFraction` to `ReadingPosition`. | Ready |
| **API Client** | `apps/web/lib/api-client.ts` | Map `/api/v1/*` routes to Fastify `/v1/*` endpoints with error handling (400, 401, 404, 409). | Ready |
| **Reader Hook** | `apps/web/lib/reader/useReader.ts` | Switch from numeric offset to opaque cursor `nextFrom`; emit `scrollFraction`. | Ready |
| **Bible Reader UI** | `apps/web/components/reader/BibleReader.tsx` | Render `verse.label` in badges; use `v-${ordinal}` for DOM scroll anchors; preserve comparative layout. | Ready |
| **Book Picker** | `apps/web/components/reader/BookPicker.tsx` | Consume dynamic book lists from `/v1/canons/{id}/books`; support Deuterocanon (`DC`) tab. | Ready |
| **Edition Picker** | `apps/web/components/reader/EditionPicker.tsx` | Display verified editions from `/v1/editions`; enforce comparative eligibility check. | Ready |
| **Home Dashboard** | `apps/web/app/[locale]/today/page.tsx` | Consume canonical reading position schema with backwards-compatible local storage parser. | Ready |

---

## 5. Conclusion & Next Steps

Antigravity **accepts** the core contract proposal with the non-breaking enhancements specified above. No frontend redesign is required, and all existing Sacred & Elegant visual identities, responsive mobile layouts, and local interactive features remain fully preserved.

We await project owner review and Codex's confirmation before binding the live Fastify endpoints.
