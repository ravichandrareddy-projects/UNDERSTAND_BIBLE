# UI-to-API Integration Contracts for Codex

> **Product:** Understand Bible  
> **Target Service:** Fastify Backend (`apps/api`), Contracts (`packages/contracts/openapi.yaml`), and Database (`packages/db`)  
> **Prepared by:** Antigravity (UI/UX Lead)  
> **Recipient:** Codex (Backend & Data Lead)  
> **Date:** 2026-11-23  

This document specifies the exact REST API contracts required by the Understand Bible frontend application (`apps/web`). Codex can implement these endpoints in Fastify (`apps/api`) and register them in `packages/contracts/openapi.yaml`.

---

## 1. Summary of Required Endpoints

| Domain | Method | Endpoint | Description |
|:---|:---:|:---|:---|
| **Bible Text** | `GET` | `/api/v1/bible/books` | Canonical 66 books catalogue with chapter counts and localized names |
| **Bible Text** | `GET` | `/api/v1/bible/text` | Verse text streaming with batching (`batchSize=5`), headings, and footnotes |
| **Translations** | `GET` | `/api/v1/editions` | Licensed and public domain editions with G-LIC-1 verification status |
| **Discovery** | `POST` | `/api/v1/search/query` | Hybrid search (full-text + semantic vector) for remembered phrases & natural queries |
| **User State** | `GET`/`PUT` | `/api/v1/user/position` | Reading position synchronization across devices |
| **User State** | `POST` | `/api/v1/user/progress/log` | Daily reading habit streak & portion completion logging |
| **User State** | `GET`/`POST` | `/api/v1/user/annotations` | Persistent bookmarks, notes, and manual verse highlights |
| **Genealogy** | `GET` | `/api/v1/genealogy/chapter` | Contextual lineages & figures for reader swipe drawer and chapter panel |
| **Genealogy** | `GET` | `/api/v1/genealogy/tree` | Full Vamsavali tree nodes for zoomable interactive explorer |
| **Genealogy** | `GET` | `/api/v1/genealogy/person/:id` | Person profile with biblical references, parents, spouses, and children |
| **UNDERSTAND** | `GET` | `/api/v1/understand/chapter` | Two-tier summary, historical context, themes, and verified scripture citations |
| **Geography** | `GET` | `/api/v1/geography/chapter` | Locations mentioned in active chapter with ancient/modern names and coordinates |
| **Geography** | `GET` | `/api/v1/geography/routes` | Biblical journey waypoints (Exodus, Paul's journeys, Jesus' ministry) |

---

## 2. Detailed TypeScript Interfaces & Schemas

### 2.1 Bible Books & Text Streaming (`/api/v1/bible/...`)

```typescript
export interface BibleBookSummary {
  id: string; // e.g., 'GEN', 'MAT', 'JHN'
  testament: 'OT' | 'NT';
  section: 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Epistles' | 'Apocalypse';
  order: number; // 1 to 66
  name: string;
  shortName: string;
  abbreviations: string[];
  chaptersCount: number;
  totalVerses: number;
}

export interface GetBooksResponse {
  books: BibleBookSummary[];
}

export interface VerseItem {
  verseNumber: number;
  verseKey: string; // e.g., 'JHN.3.16'
  text: string;
  headings?: string[];
  footnotes?: Array<{
    marker: string;
    text: string;
  }>;
}

export interface GetBibleTextResponse {
  editionId: string;
  bookId: string;
  chapter: number;
  verses: VerseItem[];
  pagination: {
    hasMore: boolean;
    nextVerse?: number;
    totalInChapter: number;
  };
}
```

### 2.2 Editions & Licensing (`/api/v1/editions`)

```typescript
export interface EditionSummary {
  id: string; // e.g., 'web', 'kjv', 'irv-te'
  name: string;
  shortName: string;
  languageCode: string; // ISO 639-1 ('en', 'te', 'ar', etc.)
  direction: 'ltr' | 'rtl';
  year: number;
  licenseStatus: 'public_domain' | 'cc_by_sa_4_0' | 'commercial_licensed';
  licenseGatePassed: boolean; // Must be true per G-LIC-1
  attribution: string;
  isComparativeEligible: boolean;
}

export interface GetEditionsResponse {
  editions: EditionSummary[];
}
```

### 2.3 Search & Natural Discovery (`/api/v1/search/...`)

```typescript
export interface SearchQueryRequest {
  query: string; // Natural language question, incomplete line, or phrase
  editionId: string;
  limit?: number; // Default 10
  locale?: string; // Default 'en'
}

export interface SearchHit {
  verseKey: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  highlights: string[]; // Exact matching substrings for UI emphasis
  score: number; // 0.0 to 1.0 relevance score
}

export interface SearchQueryResponse {
  totalMatches: number;
  results: SearchHit[];
}
```

### 2.4 User Progress & Annotations (`/api/v1/user/...`)

```typescript
export interface ReadingPositionPayload {
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  editionId: string;
}

export interface ProgressLogPayload {
  dayKey: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  portionId?: string;
  completed: boolean;
}

export interface ProgressLogResponse {
  activeDaysCount: number;
  streakDays: number;
  weekRatio: string; // e.g. "5 / 7 days"
  overallProgressPercent: number; // e.g. 71
}

export interface UserAnnotationPayload {
  type: 'bookmark' | 'highlight' | 'note';
  verseKey: string;
  editionId: string;
  color?: 'gold' | 'mint' | 'coral' | 'sky' | 'lavender';
  textRange?: {
    start: number;
    end: number;
  };
  note?: string;
}
```

> [!CAUTION]
> **Adaptive Reading Focus Highlighting**: The adaptive focus engine (which highlights the next verse based on scrolling rhythm) runs **purely client-side**. It does **NOT** write to the annotations database or call `/api/v1/user/annotations`. Only conscious, user-initiated highlights are persisted.

### 2.5 Genealogy (Vamsavali) (`/api/v1/genealogy/...`)

```typescript
export interface ContextualGenealogyResponse {
  chapter: string; // e.g., 'MAT.1'
  connectedLineages: Array<{
    title: string;
    generationCount: number;
    keyFigures: string[];
  }>;
  people: Array<{
    id: string;
    name: string;
    generation?: number;
    father?: string | null;
    mother?: string | null;
    verses: string[];
  }>;
}

export interface TreeNode {
  id: string;
  name: string;
  generation: number;
  era: string;
  children: string[];
  spouses: string[];
}

export interface GenealogyTreeResponse {
  nodes: TreeNode[];
}
```

### 2.6 Chapter UNDERSTAND AI (`/api/v1/understand/chapter`)

```typescript
export interface TheologicalTheme {
  theme: string;
  verses: string[];
}

export interface KeyPerson {
  name: string;
  role: string;
}

export interface ChapterUnderstandResponse {
  chapterKey: string;
  quickSummary: string[]; // 3 to 5 executive bullet points
  theologicalThemes: TheologicalTheme[];
  historicalContext: string;
  keyPeople: KeyPerson[];
}
```

### 2.7 Biblical Geography (`/api/v1/geography/...`)

```typescript
export interface BiblicalPlace {
  id: string;
  ancientName: string;
  modernName: string;
  coordinates: [number, number]; // [lat, lng]
  significance: string;
  certainty: 'definite' | 'probable' | 'possible' | 'traditional';
}

export interface ChapterGeographyResponse {
  chapterKey: string;
  places: BiblicalPlace[];
}

export interface BiblicalRoute {
  id: string;
  title: string;
  description: string;
  waypoints: Array<{
    placeId: string;
    name: string;
    order: number;
    coordinates: [number, number];
    scriptureRef: string;
  }>;
}

export interface GeographyRoutesResponse {
  routes: BiblicalRoute[];
}
```

---

## 3. Mock Fallback in Frontend

The frontend (`apps/web/lib/api-client.ts`) uses fallback fixture data whenever the backend returns an error or is unreachable. As Codex deploys each endpoint in `apps/api`, the frontend will seamlessly switch from local fixtures to live data without breaking user experience.
