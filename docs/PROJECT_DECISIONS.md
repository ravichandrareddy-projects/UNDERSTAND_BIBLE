# PROJECT DECISIONS

**Status:** Draft for human review · **Date:** 2026-11-21
Each decision has a status: **PROPOSED** (architect recommends; needs approval), **OPEN** (needs the human's answer), **ACCEPTED** (fixed by the brief or approved). Changing an accepted decision requires a new entry that supersedes it.

---

## Part A — Questions for the human reviewer (please answer first)

| ID | Question | Why it matters | Architect's default if no answer |
|---|---|---|---|
| **Q-01** | Will the Platform be **free and non-commercial** (no ads, no paid tiers, no sponsorships) or **commercial** in any way? | Decides access to YouVersion Platform (non-commercial only), API.Bible Starter, ESV API, AYT (Indonesian), and the licence terms for every publisher request (D-001) | Non-commercial for V1 |
| Q-02 | Which **legal entity** will sign permission requests and own the service (ministry, trust, company)? Country? | Publishers and API providers require a counterparty; affects DPDP/GDPR roles | Human lead to confirm |
| Q-03 | Monthly **budget envelope** for hosting, AI generation and speech services? | Shapes provider choices (D-017) and scale of UNDERSTAND generation | Lean: batch AI only, CPU embeddings |
| **Q-04** | Who will **review content**: native UI reviewers (14 languages), UNDERSTAND editors (English, Telugu, Hindi first), and an **ecumenical theological panel**? | Review capacity is the critical path (Roadmap §3) | Recruit 2 editors per first language + 3-person panel by Week 14 |
| Q-05 | Priority order for **permission outreach**: BSI O.V. texts first? Then which? | BSI texts matter most to Indian users | BSI → KCBC/POC → YLSA/LAI → API.Bible plan → YouVersion AI clarification |
| Q-06 | Should the Platform present itself as **ecumenical** (Protestant, Catholic, Orthodox equally) or start Protestant-first with other canons secondary? | Affects defaults, review panel, marketing | Ecumenical model; Protestant default for Indian-language editions because those are what exist openly |
| Q-07 | **Product name and brand** | Needed before public beta | Working name "the Platform" |
| Q-08 | Target **launch window** and any fixed date (e.g. a church season)? | Roadmap assumes ~26 weeks from approval | No fixed date |
| Q-09 | Are **native mobile apps** required for V1? | Plan is PWA first | No (V2) |
| Q-10 | Include **Biblica open texts** (Hindi/Tamil/Kannada/Malayalam/Bengali/Arabic Contemporary Versions) given trademark conditions and Biblica's AI policy posture? | Second source for Indian languages; reduces single-publisher risk (R-12) | Yes as OPTIONAL editions; AI use only after Biblica clarifies |
| Q-11 | Minimum **age** for accounts (18+ or allow minors with parental consent)? | DPDP verifiable parental consent duties | 18+ for accounts; reading without account open to all |
| Q-12 | Should UNDERSTAND content marked "AI-drafted, automatically checked" be **public at launch**, or only reviewed content? | Coverage vs caution (D-008) | Public with clear label, except sensitive chapters |

---

## Part B — Decision log

### D-001 Operating model — **OPEN** (see Q-01)
- **Context:** API.Bible defines commercial use broadly (ads, licensing fees, freemium, sponsorships); YouVersion Platform is non-commercial only; ESV API non-commercial only; AYT is at best non-commercial.
- **Recommendation:** run V1 as a **free, non-commercial ministry service** (donations only, if any, and only where provider terms allow). Revisit for V2.
- **Consequences:** maximises licensing options; any future monetisation requires re-licensing and must be planned with providers in advance.

### D-002 V1 content strategy — **PROPOSED**
- **Decision:** V1 serves a **local corpus of public-domain, CC BY and CC BY-SA editions only** (catalogue `CORE` list). Licensed editions come in V1.1 through a display-only adapter after written permission.
- **Why:** these are the only texts we may host, index, embed, send to AI, read offline and voice. Meets the ≥10 language target (13 languages + Indonesian conditional).
- **Trade-off:** NIV/ESV/NLT and BSI O.V. readers must wait; mitigated by honest messaging and outreach.

### D-003 Platform form — **PROPOSED**
- **Decision:** responsive web app + installable PWA for V1; native apps in V2.
- **Why:** one codebase, fast iteration, offline support via service worker; mobile parallel modes work on the web.

### D-004 Technology stack — **PROPOSED**
- **Decision:** TypeScript monorepo (pnpm + Turborepo); Next.js web; Fastify API on Node.js LTS; PostgreSQL 17+ with pgvector and pg_trgm; pg-boss jobs; Redis; S3-compatible storage; BGE-M3 embeddings via an inference server; OpenAPI contracts.
- **Why:** single language for both agents; Postgres covers content, user data and search for V1; minimal moving parts.

### D-005 Standard verse key — **PROPOSED**
- **Decision:** internal **standard scheme `std`** aligned with the standard used by STEPBible TVTMS (NRSV-A–based English versification incl. apocrypha); every edition maps to it; user data, plans, search and explanations reference standard keys.
- **Why:** TVTMS provides open (CC BY 4.0) mapping data across Hebrew, Greek, Latin and English traditions.
- **Follow-up:** OC-05 documents the exact scheme definition.

### D-006 Canon and edition are independent settings — **ACCEPTED** (brief §3)
- **Decision:** users pick a tradition/canon and an edition separately; the UI shows gaps explicitly.

### D-007 UI language and Bible language are independent — **ACCEPTED** (brief §2)

### D-008 UNDERSTAND publication policy — **PROPOSED** (see Q-12)
- **Decision:** explanations are **pre-generated** (batch), grounded in open texts and open datasets, validated automatically (AV-01…AV-10), and labelled **Reviewed** or **AI-drafted, automatically checked**. Sensitive-register chapters publish only after human theological review. No live free-form generation in V1.
- **Why:** coverage at launch without presenting unreviewed content as authoritative; predictable cost.

### D-009 YouVersion Platform — **PROPOSED**
- **Decision:** **do not integrate** until YouVersion confirms in writing that its AI clause does not restrict AI features that never use YouVersion-delivered text, and confirms caching/offline rules. Prefer API.Bible or direct publisher licences for licensed English texts.
- **Why:** reported terms restrict AI-generated output in apps using YouVersion tools; primary terms page could not be verified.

### D-010 Search engine — **PROPOSED**
- **Decision:** PostgreSQL FTS (`simple` + per-script folding) + `pg_trgm` + pgvector (BGE-M3), fused with RRF. **Trigger:** if evaluation gates fail for CJK or Indic languages by Week 17, evaluate Meilisearch (hybrid) or OpenSearch (ICU) before launch.

### D-011 Voice recognition — **PROPOSED**
- **Decision:** V1 uses the browser Web Speech API (prefer on-device), only for navigation commands; server ASR for Indian languages in V1.1 after evaluation. No audio stored.

### D-012 Licence of derived study data — **PROPOSED**
- **Decision:** publish combined genealogy/places/events data under **CC BY-SA 4.0** with full attribution (required by Theographic's ShareAlike); keep STEPBible and OpenBible attributions.

### D-013 Default chronologies — **PROPOSED**
- **Decision:** Exodus shows **both** early (c. 1446 BC) and late (13th century BC) options with neither as sole default (timeline shows a span note); Divided Kingdom uses **Thiele** as the default with alternatives available; primeval history undated; Jesus' birth c. 6–4 BC and crucifixion AD 30 or 33 shown as alternatives; Theographic (Jones) dates kept as a separate labelled chronology.

### D-014 Hosting region — **PROPOSED**
- **Decision:** primary hosting in an India region of a major cloud; global CDN; documented cross-border transfers.

### D-015 Accounts optional — **PROPOSED**
- **Decision:** full reading features without an account; sign-in only to sync; email magic link + Google at launch, passkeys P1.

### D-016 Analytics and tracking — **PROPOSED**
- **Decision:** no ad/tracking SDKs; privacy-preserving aggregate analytics; no per-user reading-content analytics.

### D-017 AI provider policy — **PROPOSED**
- **Decision:** provider-neutral adapter; providers must not train on inputs/outputs and should offer zero/limited retention; choose via a 50-chapter benchmark (faithfulness, readability, Indic quality, cost); store model/prompt version per explanation.

### D-018 Initial reading portion — **ACCEPTED** (brief §5)
- **Decision:** render 4 verses first (configurable), then stream the rest of the chapter; add a "show whole chapter immediately" setting for users who prefer it.

### D-019 Ownership split between agents — **PROPOSED**
- **Decision:** ownership map in `TECHNICAL_ARCHITECTURE.md` §4 enforced with CODEOWNERS; OpenCode owns contracts and shared parser; Antigravity owns UI, i18n catalogues and E2E/visual tests; docs owned by the architect.

### D-020 Licence policy as code — **PROPOSED**
- **Decision:** every feature that touches text calls the policy engine; default deny; tests generated from the licensing catalogue.

---

## Part C — Assumptions (to be confirmed or corrected)

| ID | Assumption |
|---|---|
| A-01 | eBible.org licence statements for CORE editions remain as read on 2026-11-21 (re-checked at import, G-LIC-1). |
| A-02 | CC BY-SA 4.0 permits our hosting, offline, indexing, embedding and AI-assisted explanation uses, subject to attribution and ShareAlike on adaptations (legal review LR-1/LR-2). |
| A-03 | Browser speech recognition support is sufficient for English and several other languages at launch; Indian-language voice may require V1.1 server ASR. |
| A-04 | One human technical lead is available daily for PR review; reviewers can be recruited as per Q-04. |
| A-05 | Traffic at launch is modest (thousands to tens of thousands of daily readers); architecture scales horizontally beyond that. |

## Part D — Change log

| Date | Change |
|---|---|
| 2026-11-21 | Initial decision log created with research results |
