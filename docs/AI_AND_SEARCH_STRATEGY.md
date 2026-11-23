# AI AND SEARCH STRATEGY

**Status:** Draft for human review · **Date:** 2026-11-21 · **Implementation owner:** OpenCode (OC-11, OC-14…OC-17, OC-22…OC-24, OC-27) with UI by Antigravity (AG-13…AG-15, AG-21)

Covers the Verse Finder, voice navigation and the UNDERSTAND feature, plus the safeguards that keep AI in its place: **AI retrieves and explains approved source content; it is never the source of Scripture.**

---

## 1. Principles

1. **Retrieval first.** Every verse shown comes from the database. Language models never output verse text; they output *references* and *structured data* that the system resolves against stored text.
2. **Licence-gated inputs.** Only editions with `can_ai_process=true` are sent to a model; only editions with `can_embed=true` are embedded (`BIBLE_LICENSING_MATRIX.md`). In V1 that means public-domain, CC BY and CC BY-SA texts.
3. **Separate fact, context and interpretation** in every explanation, with references and attributions.
4. **Human review before trust.** Explanations display their review status; reviewed content is the goal for every chapter and language.
5. **Disclosure.** Users always know when content is AI-assisted.
6. **Deterministic where possible.** Reference parsing, lexical search and match explanations do not need a model and do not use one.
7. **Provider-neutral.** Models are behind an adapter so we can switch providers or self-host; providers must contractually not train on our inputs and should offer zero/limited data retention (D-017).

## 2. Verse Finder

### 2.1 Query flow

```text
query ──► normalise ──► reference parser ──(parsed)──► REFERENCE result (navigate)
                 │
                 └─(not a reference)──► intent: phrase | keywords | question
                                           │
               ┌───────────────────────────┼─────────────────────────────┐
               ▼                           ▼                             ▼
       exact phrase search        keyword (all-words) + fuzzy      semantic (dense) search
       (normalised text)          (FTS 'simple' + pg_trgm)         (BGE-M3, cross-lingual)
               └───────────────► Reciprocal Rank Fusion ◄─────────────────┘
                                           │
                         group by standard verse key (SVK), keep best edition hit
                                           │
                     optional rerank (cross-encoder) on top 50 → top 20
                                           │
              present in the user's edition (map SVK) + match type + "why it matches"
```

### 2.2 Components

| Component | Approach | Notes |
|---|---|---|
| **Reference parser** (OC-11, shared package) | Grammar + dictionaries: book names, abbreviations and spoken forms per language (`book_name` table), separators (`:`, `.`, `,`, "chapter", "అధ్యాయం", "अध्याय", "capítulo"…), native digits (Telugu ౦–౯, Devanagari ०–९, Tamil ௦–௯, Bengali ০–৯, Kannada ೦–೯, Malayalam ൦–൯, Arabic-Indic ٠–٩), Chinese numerals, ordinals ("2 Kings", "II Kings", "Second Kings", "2 రాజులు") | Deterministic; golden tests in all 14 languages; used by search, voice and deep links |
| **Normalisation for index** | Unicode NFC; case-fold (Latin, Greek, Cyrillic); strip Latin diacritics in a *folded* column; Arabic: remove tashkeel and tatweel, unify alef forms in folded column; Indic: keep ZWJ/ZWNJ in display text, remove them in folded column; Chinese: segment with a dictionary segmenter (e.g. jieba) into a token column | Display text is never altered (data architecture §4) |
| **Exact phrase** | Match normalised phrase within verse and across verse boundaries (window of 2 verses) | Highest precision |
| **Keyword** | PostgreSQL full-text with `simple` config on folded/tokenised columns; BM25-like ranking via `ts_rank_cd`; trigram similarity for typos | No language stemmers for Indic in Postgres; 'simple' + trigram is the honest baseline |
| **Semantic** | **BGE-M3** (MIT licence; 100+ languages; dense, sparse and multi-vector modes) served via a text-embeddings inference server; index **verse** and **3-verse window** vectors per embed-permitted edition in pgvector (HNSW) | Cross-lingual: a Telugu question can match English or Telugu verses; results map back via SVK |
| **Fusion** | Reciprocal Rank Fusion (k≈60) across exact, keyword, semantic lists | Tune on eval set |
| **Rerank (P1)** | Multilingual cross-encoder on top 50 | Only if eval shows gain; licence of reranker to verify |
| **Query rewrite (P1)** | Small LLM turns a question into search phrases in 1–3 languages, returns JSON only | Never returns verses; skipped when lexical results are strong |

### 2.3 Match types and explanations

| Label shown | Rule | "Why it matches" text (template, localised) |
|---|---|---|
| **Reference** | Parser resolved a reference | "You typed a reference." |
| **Exact phrase** | Normalised phrase found | Highlight the phrase in the verse |
| **All words** | All query keywords (after stop-word removal) present | Highlight the words |
| **Similar meaning** | Came from semantic retrieval, no lexical match | "Close in meaning to your question" + highlighted overlapping concepts when any; P1: one-sentence reason generated *only from the retrieved verse text* and validated to contain no new references or quotations |

Results with the same SVK from several editions collapse into one card showing the user's edition text (or the matching edition if the user's edition is display-only) with "also matched in: KJV, WEB".

### 2.4 Evaluation (OC-17)

- **Gold set:** ≥300 queries — at least 15 per interface language plus 100 English — covering references, exact quotes, paraphrases ("love is patient", "do not be afraid", "the way, the truth and the life"), story descriptions ("the man who climbed a tree to see Jesus"), and cross-lingual queries. Each query lists acceptable SVKs.
- **Metrics:** Recall@10, MRR@10, nDCG@10, latency p95.
- **Proposed release gates:** English Recall@10 ≥ 0.90; each Indic language ≥ 0.80; others ≥ 0.85; no regression > 2 points between releases. (Targets for approval; baseline after first run.)
- **Fallback decision (D-010):** if Postgres-based lexical search misses gates for CJK or Indic languages, evaluate Meilisearch/OpenSearch with ICU analysis before launch.

## 3. Voice navigation

| Step | V1 design | V1.1 |
|---|---|---|
| Capture | Push-to-talk mic button; browser **Web Speech API** `SpeechRecognition` with `lang` = UI language (user can switch to edition language) | Server fallback |
| On-device | Set `processLocally=true` where the browser supports on-device recognition; otherwise warn that the browser vendor's cloud service may process audio | — |
| Support matrix | Speech recognition is supported (partially) in Chromium browsers and Safari; Firefox does not ship it by default (Mozilla posted an intent to prototype and ship a strictly on-device implementation in Sept 2026); Edge on mobile lacks it. The UI detects support per locale and explains | Server ASR covers gaps |
| Understanding | Transcript → reference parser using **spoken forms** (e.g. "John chapter three verse sixteen", "యోహాను మూడవ అధ్యాయం పదహారవ వచనం", "उत्पत्ति अध्याय पाँच") incl. number words 1–176 per language | Commands: next/previous chapter, read aloud |
| Confirmation | If parse confidence < threshold or alternatives exist, show "John 3:16?" with Yes / choose | — |
| Server fallback | — | Evaluate Bhashini (Government of India language platform with ASR APIs), self-hosted AI4Bharat IndicConformer, and Whisper-class models on a Telugu/Hindi/Tamil/Kannada/Malayalam/Bengali command test set; choose by accuracy, latency, cost, licence and data-residency |
| Privacy | Platform never stores audio; transcripts discarded after navigation | Server ASR deletes audio immediately after transcription |

## 4. UNDERSTAND

### 4.1 Pipeline

```text
[Grounding packet] → [Draft (LLM, JSON)] → [Fill quotes from DB] → [Automatic validators] → [Faithfulness check]
        → status 'auto_checked' → [Human review queue] → 'reviewed' → [Publish] → [Translate] → [Language review] → [Publish]
```

### 4.2 Grounding packet (per standard chapter)

| Input | Source | Licence gate |
|---|---|---|
| Chapter text | 2 open editions in the source language (English: BSB + WEB; KJV for archaic-term checks) | `can_ai_process` |
| Previous/next chapter context | Published quick overviews of adjacent chapters (or their text if not yet written) | — |
| People in chapter | `person_mention` (TIPNR + curated) incl. relationships with confidence | CC BY / CC BY-SA attribution |
| Places | OpenBible geocoding with identification confidence | CC BY |
| Period & dates | Curated timeline (`event_dating` with default chronology + alternatives) | Own data |
| Cross-references | Top-voted OpenBible cross-refs for verses in the chapter | CC BY |
| Background notes | Curated, sourced notes (e.g. from public-domain reference works, used cautiously because older scholarship can be outdated; each note carries a citation) | PD / own |
| Sensitive-passage register | List of chapters where Christian traditions interpret differently (e.g. Gen 1–3, Isa 7, Matt 16, John 6, Rom 9, 1 Cor 11, Revelation) | Own data, theologically reviewed |

### 4.3 Generation rules (prompt contract)

1. Output **JSON only**, matching the schema in §4.4.
2. Do **not** write verse text. To quote, emit `{"quote": "JHN.3.16"}`; the system inserts the verbatim verse from the reader's edition.
3. Every claim has a `type`: `text` (what the chapter says — needs ≥1 reference in this chapter), `context` (needs a `source_id` from the packet), `interpretation` (needs an `attribution` such as "many Christians", "Catholic and Orthodox tradition", "some scholars"), `disputed` (needs ≥2 views).
4. Use only people, places and dates present in the packet; dates always approximate with chronology label.
5. Plain language; short sentences; explain unfamiliar terms once.
6. No exhortation presented as divine speech, no claims of personal revelation, no denominational verdicts.

### 4.4 Explanation schema (abridged)

```json
{
  "chapter": "2KI.10", "depth": "quick", "language": "en",
  "sections": [
    { "id": "what_happens", "claims": [
      { "type": "text", "text": "Jehu has the seventy sons of Ahab in Samaria killed and their heads sent to Jezreel.",
        "refs": ["2KI.10.1-2KI.10.8"] },
      { "type": "text", "text": "He then gathers the worshippers of Baal and destroys them and the temple of Baal.",
        "refs": ["2KI.10.18-2KI.10.28"] } ] },
    { "id": "before", "claims": [ { "type": "text", "text": "Elisha had sent a prophet to anoint Jehu king of Israel.", "refs": ["2KI.9.1-2KI.9.6"] } ] },
    { "id": "views_differ", "claims": [
      { "type": "disputed", "text": "Readers have long asked how Jehu's violence relates to later criticism of it.",
        "refs": ["HOS.1.4", "2KI.10.30-2KI.10.31"],
        "views": [ { "attribution": "Some interpreters", "text": "…" }, { "attribution": "Others", "text": "…" } ] } ] },
    { "id": "key_verses", "quotes": [ { "quote": "2KI.10.30" } ] }
  ],
  "people": ["person:jehu-1", "person:jehonadab-1", "person:ahab-1"],
  "period": "period:divided-kingdom"
}
```

(The sentences above are illustrations of format; real content is generated and reviewed in the pipeline.)

### 4.5 Automatic validators (OC-22)

| ID | Check | On failure |
|---|---|---|
| AV-01 | JSON schema valid; all required sections present for depth | Regenerate |
| AV-02 | Every `text` claim has ≥1 reference inside the chapter (adjacent chapters allowed in before/after sections) | Regenerate section |
| AV-03 | All references parse and exist in the canon/edition | Regenerate |
| AV-04 | No verbatim run of ≥8 consecutive words matching *any* edition in the reference corpus, including restricted editions held only as hashed n-grams (detects memorised copyrighted wording) | Regenerate; log |
| AV-05 | Persons/places/dates mentioned ⊆ grounding packet | Flag for review |
| AV-06 | `interpretation` and `disputed` claims carry attribution / ≥2 views; sensitive-register chapters must include a `views_differ` section | Regenerate |
| AV-07 | Prohibited-pattern lint (e.g. "God is telling you", "the Bible proves", "the true church teaches") | Regenerate |
| AV-08 | Length and readability targets for depth and language | Regenerate |
| AV-09 | Faithfulness: a second model (different from the drafter) checks each `text` claim is supported by its cited verses; score per claim | Low scores → flag for review |
| AV-10 | Language identification matches target language | Regenerate |

### 4.6 Human review

| Role | Responsibility | Minimum for V1 |
|---|---|---|
| Content editor (per language) | Clarity, faithfulness to cited verses, reading level | English: 2; Telugu: 2; Hindi: 2 |
| Theological review panel (ecumenical) | Sensitive-register chapters; interpretation wording; disputed-views balance | 3 reviewers from different traditions, part-time |
| Lead editor | Style guide, sampling QA, escalations | 1 |

**Workflow:** `auto_checked` content may be published with the label "AI-drafted, automatically checked" (decision D-008), *except* sensitive-register chapters, which require review before publication. Review proceeds in priority order: chapters in built-in reading plans' first 30 days, most-read chapters (Genesis 1–3, Psalm 23, Isaiah 53, Matthew 5–7, John 1–3, Romans 8, 1 Corinthians 13…), then canonical order.

**Workload estimate:** 1,189 chapters × 2 depths ≈ 2,378 English items. At ~8 quick or ~3 detailed reviews per reviewer-hour, English needs roughly 150 + 400 ≈ 550 reviewer-hours; each translated language needs a similar order of magnitude. This is the main scheduling constraint for UNDERSTAND (roadmap risk R-05).

### 4.7 Languages and reading level

- **Master + translate:** English master explanations are translated into each language with a terminology glossary; person and place names use the spelling of the reader's edition (from `person_name` / edition text); quotes are filled from the target edition. Native-speaker review is required before the "Reviewed" label.
- **Readability targets:** English quick overviews at roughly grade 6–8 (Flesch–Kincaid); for other languages, average sentence length ≤ 18 words and a reviewer checklist (no rare Sanskritised/literary vocabulary where a common word exists, etc.).

### 4.8 Depths

| Depth | Length | Sections |
|---|---|---|
| Quick overview | 150–250 words | What happens · Who · Why it matters · Before/After (one line each) · 1–3 key verses |
| Detailed study | 800–1,500 words | All FR-UND-03 sections incl. context, relationships, themes, connections, views differ |

### 4.9 Licensed editions and UNDERSTAND

If the reader's edition is display-only (e.g. NIV via API), explanations still work: claims reference SVKs; quoted verses are filled from an open edition in the same language with a visible note ("Quotation from WEB"). No licensed text is sent to a model.

## 5. AI provider policy (D-017)

| Requirement | Detail |
|---|---|
| No training on inputs/outputs | Contractual; verified in provider terms before use |
| Data retention | Zero or minimal retention option preferred; no user personal data sent to models in V1 |
| Region | Prefer processing in India or the EU where available; document transfers |
| Structured output | Native JSON-schema output support |
| Evaluation | Shortlist 2–3 providers (hosted and open-weight); compare on a 50-chapter benchmark for faithfulness (AV-09), readability, Indic-language quality and cost |
| Versioning | Model ID, prompt version and packet hash stored with each explanation |

## 6. Safety and abuse

- **Prompt injection:** user queries are passed to models only as data inside a fixed template; model outputs are parsed as JSON and validated; free text from models is never rendered as Scripture or executed.
- **Rate limiting:** per-IP and per-account limits on search and any live AI call (OC-30).
- **Reporting:** "Report a problem" on every explanation and search result; reports create review tasks.
- **Sensitive users:** UNDERSTAND is study content, not counselling; if a user's search suggests crisis (e.g. self-harm terms), show a gentle support message with helpline links (localised list to be curated, owner: human lead).

## 7. Sources (checked 2026-11-21)

- BGE-M3 model card (MIT; 100+ languages; dense/sparse/multi-vector): https://huggingface.co/BAAI/bge-m3 ; paper: https://arxiv.org/abs/2402.03216
- Meilisearch language support / Charabia (fallback option): https://www.meilisearch.com/docs/learn/what_is_meilisearch/language ; https://docs.rs/crate/charabia/0.10.0
- Speech Recognition API support: https://caniuse.com/speech-recognition ; MDN on-device `processLocally`: https://developer.mozilla.org/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API ; Mozilla intent to ship on-device SpeechRecognition (Sept 2026): https://groups.google.com/a/mozilla.org/g/dev-platform/c/6f4l8P9hO6o ; Chromium on-device intent: https://groups.google.com/a/chromium.org/g/blink-dev/c/VNOok2dbmHM
- Bhashini overview: https://pib.gov.in/PressReleasePage.aspx?PRID=2239132 ; AI4Bharat IndicConformer (via VEXYL-STT write-up): https://medium.com/@anilmathewm/vexyl-stt-free-self-hosted-indian-language-speech-to-text-server-f2909003aaf6
- Biblica AI & ML policy v1.2 (human review, disclosure, verbatim quotation norms): https://www.biblica.com/?p=31960
- API.Bible AI restrictions (§9.1, §9.2): https://api.bible/terms-and-conditions
- OpenBible.info cross references: https://www.openbible.info/labs/cross-references/
- STEPBible TIPNR: https://github.com/STEPBible/STEPBible-Data
