# BIBLE DATA ARCHITECTURE

**Status:** Draft for human review · **Date:** 2026-11-21 · **Implementation owner:** OpenCode (OC-02…OC-08, OC-14, OC-15, OC-18…OC-21)

This document defines how Bible text, canons, versification, licences, study data and user data are modelled, imported, validated and served. It is the contract both agents build against.

---

## 1. Design goals

1. **Verbatim text.** Store exactly what the source provides (after lossless parsing); never "correct" Scripture in place.
2. **Stable identity.** Every verse has an edition-independent **standard verse key** so positions, highlights, plans, search hits and explanations survive translation switches and re-imports.
3. **Edition truth preserved.** Each edition keeps its own numbering, bridges, headings, footnotes and book names.
4. **Provenance everywhere.** Each stored verse can be traced to source file, checksum, import run and licence record.
5. **Licence-aware by construction.** Permissions are columns, enforced by a policy engine, not comments.
6. **Re-importable.** New source versions can be imported side by side and switched atomically.

## 2. Identifiers

| Thing | Format | Example | Notes |
|---|---|---|---|
| Book | USFM 3 book code | `GEN`, `2KI`, `TOB`, `ESG`, `PS2`, `ENO` | Same codes in all traditions; names are labels |
| Standard verse key (**SVK**) | `BOOK.C.V` in the internal standard scheme (`std`) | `2KI.10.1` | `std` = the NRSV-A–based English scheme used as the hub in STEPBible TVTMS (confirm exact definition in OC-05) |
| SVK integer | `book_ordinal * 1_000_000 + chapter * 1_000 + verse` | `12010001` | For range queries and compact storage |
| Edition | `{lang}-{abbr}[-{year}]` | `tel-irv`, `eng-kjv`, `eng-dra` | Internal; matches catalogue `internal_id` |
| Edition-local reference | `edition:BOOK.c.v[seg]` | `eng-dra:PSA.22.1`, `tel-irv:ACT.8.36-37` | As printed in that edition |
| Content version | `{edition}@{source_date}+{sha8}` | `tel-irv@2023-04-19+3fa2c1d9` | Each import run |
| Person / place / event | `person:{slug}-{n}` etc. | `person:jehu-1` | Disambiguated; aligned with TIPNR/Theographic IDs where possible |

Sub-verse segments (`a`, `b`) are allowed in `std` only where TVTMS requires them (e.g. KJV Rev 13:1a ↔ NRSV Rev 12:18).

## 3. Content model (PostgreSQL)

DDL below is a planning sketch; OpenCode owns the real migrations (OC-07).

```sql
-- Languages and scripts
CREATE TABLE language (
  code        text PRIMARY KEY,          -- BCP 47: 'te', 'hi', 'ar', 'zh-Hans'
  name_en     text NOT NULL,
  name_native text NOT NULL,
  script      text NOT NULL,             -- ISO 15924: 'Telu', 'Deva', 'Arab', 'Hans'
  direction   text NOT NULL CHECK (direction IN ('ltr','rtl')),
  digits      text                       -- native digit set id, nullable
);

-- Books and canons
CREATE TABLE book (
  code        text PRIMARY KEY,          -- USFM code
  kind        text NOT NULL,             -- 'ot','nt','dc','apocrypha','addition'
  default_ordinal int NOT NULL
);
CREATE TABLE canon (
  id          text PRIMARY KEY,          -- 'protestant','catholic','orthodox-greek','orthodox-slavonic','ethiopian'
  status      text NOT NULL,             -- 'active','metadata-only'
  notes       text
);
CREATE TABLE canon_book (
  canon_id    text REFERENCES canon,
  book_code   text REFERENCES book,
  ordinal     int  NOT NULL,
  section     text NOT NULL,             -- 'law','history','wisdom','prophets','gospels','appendix',...
  status      text NOT NULL,             -- 'canonical','appendix','disputed'
  PRIMARY KEY (canon_id, book_code)
);
CREATE TABLE book_name (                 -- localized labels per tradition
  book_code   text REFERENCES book,
  language    text REFERENCES language,
  canon_id    text NULL REFERENCES canon,-- null = default
  name        text NOT NULL,
  short_name  text NOT NULL,
  abbreviations text[] NOT NULL,         -- for reference parsing
  spoken_forms  text[] NOT NULL DEFAULT '{}', -- for voice grammar
  PRIMARY KEY (book_code, language, canon_id)
);

-- Licences and evidence
CREATE TABLE licence (
  id            text PRIMARY KEY,        -- 'pd','cc-by-4.0','cc-by-sa-4.0','pub-biblica-niv-2027',...
  name          text NOT NULL,
  url           text
);
CREATE TABLE edition_rights (
  edition_id    text PRIMARY KEY,
  licence_id    text REFERENCES licence,
  status        text NOT NULL CHECK (status IN ('VERIFIED','NOT VERIFIED','RESTRICTED','PERMISSION REQUIRED')),
  can_display   boolean NOT NULL,
  can_host      boolean NOT NULL,
  can_offline   boolean NOT NULL,
  can_commercial boolean NOT NULL,
  can_ai_process boolean NOT NULL,
  can_embed     boolean NOT NULL,
  can_tts       boolean NOT NULL,
  verse_display_limit int NULL,          -- e.g. 500 for API editions
  cache_ttl_days int NULL,               -- e.g. 30 for API.Bible
  attribution_short text NOT NULL,
  attribution_full  text NOT NULL,
  evidence_url  text NOT NULL,
  evidence_sha256 text NOT NULL,         -- hash of stored snapshot of licence page/agreement
  checked_on    date NOT NULL,
  approved_by   text NOT NULL
);

-- Editions
CREATE TABLE edition (
  id             text PRIMARY KEY,       -- 'tel-irv'
  language       text REFERENCES language,
  title_native   text NOT NULL,
  title_en       text NOT NULL,
  abbreviation   text NOT NULL,
  publisher      text NOT NULL,
  copyright      text NOT NULL,
  tradition_hint text NOT NULL,          -- 'protestant','catholic',...
  versification  text NOT NULL REFERENCES versification_scheme,
  source_kind    text NOT NULL,          -- 'local','api'
  provider       text NULL,              -- 'ebible','api.bible','youversion',...
  active_version text NULL,              -- content version currently served
  status         text NOT NULL           -- 'draft','validated','live','retired'
);
CREATE TABLE edition_book (
  edition_id   text REFERENCES edition,
  book_code    text REFERENCES book,
  name         text NOT NULL,            -- from \h / \toc
  long_name    text,
  chapters     int  NOT NULL,
  PRIMARY KEY (edition_id, book_code)
);

-- Text (partitioned by edition)
CREATE TABLE verse (
  content_version text NOT NULL,
  edition_id   text NOT NULL,
  book_code    text NOT NULL,
  chapter      int  NOT NULL,            -- edition-local
  verse_label  text NOT NULL,            -- '4', '4-5', '12a' as printed
  seq          int  NOT NULL,            -- order within chapter
  svk_from     int  NOT NULL,            -- first standard key covered
  svk_to       int  NOT NULL,            -- last standard key covered (bridges)
  text_plain   text NOT NULL,            -- verbatim words, markup stripped
  content_usj  jsonb NOT NULL,           -- formatted content (poetry, words of Jesus, etc.)
  source_hash  text NOT NULL,            -- hash of the source fragment
  PRIMARY KEY (content_version, book_code, chapter, seq)
) PARTITION BY LIST (edition_id);
CREATE TABLE heading  (content_version text, edition_id text, book_code text, chapter int, before_seq int, level int, text text);
CREATE TABLE footnote (content_version text, edition_id text, book_code text, chapter int, seq int, caller text, kind text, content_usj jsonb);
```

### 3.1 Versification tables

```sql
CREATE TABLE versification_scheme (id text PRIMARY KEY, description text, source text);  -- 'std','eng','org','lxx','vul','rsc','rso', or edition-specific
CREATE TABLE versification_map (
  scheme_id    text REFERENCES versification_scheme,
  local_ref    text NOT NULL,            -- 'PSA.22.1'
  svk_from     int  NOT NULL,
  svk_to       int  NOT NULL,
  kind         text NOT NULL,            -- 'identity','renumber','split','merge','absent','extra'
  source       text NOT NULL,            -- 'TVTMS:<row>', 'vrs:<file>', 'manual:<reviewer>'
  PRIMARY KEY (scheme_id, local_ref)
);
CREATE TABLE edition_versification_override (  -- edition-specific deviations found in data (bridges, omissions)
  edition_id text, local_ref text, svk_from int, svk_to int, kind text, evidence text, reviewer text,
  PRIMARY KEY (edition_id, local_ref)
);
```

**Resolution order** for a verse in edition E: `edition_versification_override` → `versification_map` for E's scheme → identity. The import fails if any verse cannot be resolved (§6, check V-07).

### 3.2 Study data

```sql
CREATE TABLE person (id text PRIMARY KEY, primary_name_en text, gender text, description_en text, tipnr_id text, theographic_id text);
CREATE TABLE person_name (person_id text, language text, name text, is_primary boolean, source text);
CREATE TABLE relationship (
  id bigserial PRIMARY KEY,
  from_person text REFERENCES person, to_person text REFERENCES person,
  kind text NOT NULL,          -- 'father_of','mother_of','spouse_of','sibling_of','half_sibling_of','ancestor_of','successor_of','levirate_father_of','adoptive_parent_of'
  confidence text NOT NULL,    -- 'stated','stated_elsewhere','inferred','disputed','tradition'
  evidence_svks int[] NOT NULL,-- required unless confidence='tradition' (then source_note required)
  source text NOT NULL,        -- 'TIPNR','Theographic','curated'
  note text,
  reviewer text
);
CREATE TABLE person_mention (person_id text, svk int, role text, source text);   -- drives chapter People panel
CREATE TABLE place (id text PRIMARY KEY, name_en text, lat numeric, lon numeric, confidence text, openbible_id text);
CREATE TABLE period (id text PRIMARY KEY, name_en text, start_year int, end_year int, precision text, ordinal int);
CREATE TABLE event (id text PRIMARY KEY, name_en text, period_id text, svk_refs int[], notes text);
CREATE TABLE event_dating (event_id text, chronology text, start_year int, end_year int, approx boolean, source text, is_default boolean);
CREATE TABLE chapter_period (book_code text, chapter int, period_id text, confidence text);   -- std chapters
CREATE TABLE cross_reference (from_svk int, to_svk_from int, to_svk_to int, votes int, source text);

-- UNDERSTAND content
CREATE TABLE explanation (
  id bigserial PRIMARY KEY,
  book_code text, chapter int,             -- std chapter
  depth text CHECK (depth IN ('quick','detailed')),
  language text, version int,
  status text CHECK (status IN ('draft','auto_checked','in_review','reviewed','published','withdrawn')),
  body jsonb NOT NULL,                     -- sections → claims (see AI strategy §4.4)
  grounding_editions text[] NOT NULL,      -- editions whose text was used
  model text, prompt_version text, validator_report jsonb,
  reviewed_by text, reviewed_at timestamptz, published_at timestamptz
);
```

### 3.3 User data (separate schema, separate encryption key)

```sql
CREATE TABLE app_user (id uuid PRIMARY KEY, created_at timestamptz, ui_language text, tradition text, deleted_at timestamptz);
CREATE TABLE user_setting (user_id uuid, key text, value jsonb, updated_at timestamptz, PRIMARY KEY (user_id, key));
CREATE TABLE reading_position (user_id uuid, device_id text, edition_id text, svk int, updated_at timestamptz, PRIMARY KEY (user_id, device_id));
CREATE TABLE bookmark  (id uuid PRIMARY KEY, user_id uuid, svk_from int, svk_to int, edition_id text, label text, created_at timestamptz, updated_at timestamptz, deleted boolean);
CREATE TABLE highlight (id uuid PRIMARY KEY, user_id uuid, svk_from int, svk_to int, color text, created_at timestamptz, updated_at timestamptz, deleted boolean);
CREATE TABLE note      (id uuid PRIMARY KEY, user_id uuid, svk_from int, svk_to int, edition_id text, body_encrypted bytea, created_at timestamptz, updated_at timestamptz, deleted boolean);
CREATE TABLE reading_event (user_id uuid, svk_from int, svk_to int, edition_id text, read_at timestamptz);
CREATE TABLE plan (id text PRIMARY KEY, owner uuid NULL, definition jsonb);          -- built-in or custom
CREATE TABLE plan_enrolment (id uuid PRIMARY KEY, user_id uuid, plan_id text, start_date date, days_of_week int[], timezone text, reminder_time time);
CREATE TABLE plan_progress (enrolment_id uuid, day_index int, completed_at timestamptz, PRIMARY KEY (enrolment_id, day_index));
```

User data references **SVKs**, never edition-local numbers, so a highlight made on KJV Psalm 23:1 appears on Douay-Rheims Psalm 22:1.

## 4. Ingest pipeline (OpenCode)

```text
[Acquire] → [Rights check G-LIC-1] → [Parse USFM→USJ] → [Normalise structure] → [Versify] → [Validate] → [Stage] → [Index] → [Publish]
```

| Stage | Details | Output |
|---|---|---|
| Acquire (OC-03) | Download official files (eBible USFM zip) or receive DBL bundles; record URL, timestamp, SHA-256; store originals read-only in object storage | `sources/{edition}/{date}/` + `manifest.json` |
| Rights check (OC-02) | Fetch live licence page, snapshot + hash, compare with approved `edition_rights`; stop on mismatch | `rights_check.json` |
| Parse (OC-04) | Error-tolerant USFM 3 parser → USJ; capture `\v` labels incl. bridges, `\s` headings, `\f`/`\x` notes, `\q` poetry, `\wj` words of Jesus, `\h`/`\toc` book names | USJ per book + parser diagnostics |
| Normalise | Unicode NFC; keep original code points in `text_plain` (no character substitutions); separate notes/headings from verse text | Canonical JSON |
| Versify (OC-05) | Detect scheme from book/chapter/verse shape; apply TVTMS map + overrides; flag unresolved | SVK assignments + report |
| Validate (OC-08) | Checks V-01…V-12 below | Validation report (blocking) |
| Stage | Load into `verse` partition under new `content_version` | Staged edition |
| Index (OC-14/15) | Search columns; embeddings only if `can_embed` | Index rows |
| Publish | Flip `edition.active_version` in one transaction; purge CDN keys | Live edition |

### 4.1 Validation checks (blocking unless noted)

| ID | Check |
|---|---|
| V-01 | Every book listed in the source manifest parsed with zero fatal diagnostics |
| V-02 | Book, chapter and verse-record counts equal counts computed independently from the raw files (second parser or regex count) |
| V-03 | No empty verse text unless the source marks the verse empty/omitted (then `kind='absent'`) |
| V-04 | No duplicate edition-local references; `seq` strictly increasing |
| V-05 | Every verse's `source_hash` matches a re-hash of the source fragment |
| V-06 | Text round-trip: concatenated `text_plain` per chapter equals the parser's plain-text rendering of the source |
| V-07 | 100% of verses resolve to SVKs; every SVK in the edition's books is either covered or explicitly `absent` |
| V-08 | Bridges: `svk_to − svk_from` matches the label (e.g. "4-5" covers 2 keys) |
| V-09 | Spot-check sample (≥50 verses/edition, stratified) matches the provider's online reader — human or browser-assisted (Antigravity AG-23 helps) |
| V-10 | Script check: ≥99% of letters in verse text belong to the edition's declared script(s) (catches encoding errors) |
| V-11 | Licence record exists, status allows hosting, attribution templates present |
| V-12 | (warning) Comparison with previous content version: list changed verses for human review |

## 5. Serving model

| API (OpenCode) | Purpose | Caching |
|---|---|---|
| `GET /v1/editions?lang=&canon=` | Edition list with coverage and licence badges | CDN 1 h |
| `GET /v1/canons/{id}/books?lang=&edition=` | Ordered books with availability per edition | CDN 1 h |
| `GET /v1/editions/{ed}/chapters/{book}.{ch}?from=&limit=4` | First portion (default 4 verses) then pages; includes headings/notes | CDN, immutable per content version |
| `GET /v1/parallel?left=&right=&book=&ch=` | Aligned rows for two editions | CDN per version pair |
| `GET /v1/resolve?ref=&edition=` | Edition-local ref ↔ SVK | CDN |
| `GET /v1/search?q=&lang=&edition=` | Verse Finder | Short TTL, per-query cache |
| `GET /v1/explanations/{book}.{ch}?depth=&lang=` | UNDERSTAND | CDN per version |
| `GET /v1/people?chapter=` · `/v1/people/{id}` · `/v1/people/{id}/graph?up=&down=` | Genealogy | CDN |
| `GET /v1/timeline?focus=` | Periods/events | CDN |
| `GET /v1/offline/{ed}/manifest` | Offline bundle list (open editions only) | CDN |
| `/v1/me/*` | User data, sync | Private, no CDN |

**Parallel alignment response (sketch):**

```json
{ "rows": [
  { "svk": [19023001, 19023001], "left":  { "ref": "PSA.23.1", "label": "1", "text": "…" },
                                 "right": { "ref": "PSA.22.1", "label": "1", "text": "…", "note": "numbered 22 in this edition" } },
  { "svk": [44008037, 44008037], "left":  { "ref": "ACT.8.37", "label": "37", "text": "…" },
                                 "right": { "absent": true, "footnote": "Some manuscripts add verse 37…" } }
]}
```

## 6. Licensed (API) editions — V1.1

API editions store **no verse text** beyond what the provider allows. The *Licensed Edition Adapter* (OC-33) fetches on demand, caches within `cache_ttl_days`, reports usage (e.g. FUMS), and returns text with a `display_only=true` flag so the UI disables AI, search hand-off and offline for that panel.

## 7. Offline bundles

Per open edition: one compressed JSON per book (`{edition}/{version}/{BOOK}.json.br`) with verses, headings, notes and SVKs, plus a signed manifest. Bundles are generated only when `can_offline=true`. The PWA stores them in IndexedDB (AG-19). Size estimate: a full Bible is typically a few MB compressed (to measure in OC-28).

## 8. Data lineage and attribution

- Every API response for verse text includes `edition`, `content_version` and `attribution_short`.
- Derived datasets combining CC BY-SA sources (genealogy, places, events) are published as `platform-study-data` under CC BY-SA 4.0 with a sources file (D-012).
- STEPBible (CC BY 4.0), OpenBible.info (CC BY 4.0), Theographic (CC BY-SA 4.0) are credited on the Sources page.

## 9. External datasets to import

| Dataset | Content | Licence (status) | Used for |
|---|---|---|---|
| STEPBible TVTMS | Versification traditions & mappings | CC BY 4.0 (VERIFIED, repo README) | Versification maps |
| STEPBible TIPNR | Every proper name, individualised; parents, partners, siblings, offspring; places geolocated | CC BY 4.0 (VERIFIED) | People, relationships |
| STEPBible TAHOT / TAGNT | Tagged Hebrew OT / Greek NT | CC BY 4.0 (VERIFIED) | V2 word study; name alignment |
| Theographic Bible Metadata | People, places, events (≈450), periods, verse links | CC BY-SA 4.0 (VERIFIED, viz.bible) | Event linkage; cross-check people |
| OpenBible.info Bible Geocoding | Ancient/modern place identifications with confidence | CC BY 4.0 (VERIFIED, repo README via search) | Places |
| OpenBible.info cross-references | Vote-weighted cross-references drawn mostly from the public-domain Treasury of Scripture Knowledge (count to confirm at import) | CC BY (VERIFIED, labs page) | "Connections" |
| Paratext `.vrs` files | Standard versifications | NOT VERIFIED (licence of files to check) | Cross-check TVTMS |
| MACULA / ACAI (Clear Bible / Biblica Aquifer) | Word-level entity annotations | CC BY / CC BY-SA (NOT VERIFIED primary) | V2 entity precision |

## 10. Sources (checked 2026-11-21)

- STEPBible Data README (CC BY 4.0; TIPNR, TVTMS): https://github.com/STEPBible/STEPBible-Data
- Theographic data licence (CC BY-SA 4.0) and contents: https://viz.bible/bible-data/
- OpenBible.info Bible Geocoding Data (CC BY 4.0): https://github.com/openbibleinfo/Bible-Geocoding-Data
- OpenBible.info cross references (CC BY): https://www.openbible.info/labs/cross-references/
- USX element reference (versification, `altnumber`): https://app.thedigitalbiblelibrary.org/static/docs/usx/elements.html
- USFM specification: https://ubsicap.github.io/usfm/
- usfm3 parser (MIT; Rust/Python/npm): https://pypi.org/project/usfm3/ ; https://docs.rs/crate/usfm3/0.1.8/source/README.md
- ACAI dataset licence: https://github.com/BibleAquifer/ACAI
