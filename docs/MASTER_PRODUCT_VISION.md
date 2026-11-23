# MASTER PRODUCT VISION — Interactive Bible Reading & Understanding Platform

**Status:** Draft for human review · **Version:** 0.1 · **Date:** 2026-11-21 · **Owner:** Chief Product Architect (planning lead)

> Working name in these documents: **"the Platform"**. A product name and brand are open decisions (see `PROJECT_DECISIONS.md`, Q-07).

---

## 1. Purpose

Build a multilingual Bible platform that helps people **read** Scripture comfortably, **find** passages they only half-remember, **understand** whole chapters in plain language, **explore** the people and history of the Bible, and **grow** a steady daily reading habit.

The Platform is not a website that only contains Bible text. Its value comes from joining five things that are usually separate products: a good reader, two-translation comparison, meaning-based search, chapter explanations, and connected people/timeline data — all in the reader's own language, including Indian languages that are poorly served today.

## 2. The five pillars

| Pillar | Promise to the user | V1 expression |
|---|---|---|
| **READ** | "I can read comfortably in my language, on any device, and pick up exactly where I stopped." | Fast reader, two-panel parallel reading, bookmarks, highlights, notes, automatic position saving, offline reading of open texts |
| **FIND** | "I remember what the verse says, not where it is — the Platform finds it." | Verse Finder with exact, keyword and meaning-based matches across languages, every result traceable to a real verse; voice navigation to references |
| **UNDERSTAND** | "When I finish a chapter, I can understand what happened, who was involved and why it matters." | The UNDERSTAND button: quick overview and detailed study for each chapter, grounded in the text, every claim referenced |
| **EXPLORE** | "I can see how people are related and where a chapter sits in history." | Chapter-aware people panel and genealogy explorer; interconnected timeline with clearly labelled approximate and disputed dates |
| **GROW** | "I keep a daily habit and can see my progress." | Reading plans, custom schedules, reminders at my chosen time, progress and history |

## 3. Who it is for

| Segment | Example need | Why current tools fall short |
|---|---|---|
| Indian-language readers (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali) | Read in their language while checking English | Most apps have weak Indic typography, little Indic search, and no explanation in their language |
| New or returning readers | "I read the chapter but did not understand it" | Commentaries are long, technical or tradition-specific |
| Bilingual families and diaspora | Parent reads Telugu, child reads English, side by side | Parallel reading is often English-only or misaligned |
| Small-group and youth leaders | Prepare a chapter quickly; show people and context | Information is scattered across books and sites |
| Catholic and Orthodox readers | Read their own canon in their own tradition's order | Many apps assume the 66-book Protestant canon |
| Older readers and low-vision users | Large type, voice navigation, simple controls | Small fonts, cluttered UI |

## 4. Product principles (non-negotiable)

1. **Scripture is the authority; the Platform is not.** Bible text is always shown verbatim from a named, licensed source. AI never generates, completes or "remembers" verses. Every verse on screen is traceable to an edition, book, chapter, verse and source file.
2. **Every explanation is grounded and referenced.** UNDERSTAND content separates *what the text says* (with verse references), *historical/geographical context* (with sources), and *interpretation* (labelled, attributed to traditions or views, never presented as biblical fact). Disputed questions show the main views.
3. **Licence integrity is a feature.** We store only texts we are allowed to store, and each feature (search, embeddings, AI, offline, audio) checks the edition's permissions before using it. We do not bypass API controls or upload copyrighted texts to external AI systems.
4. **Respect for traditions.** Canon (which books) and translation (which wording) are separate choices. Protestant, Catholic, Eastern Orthodox and other canons are modelled honestly; we never silently drop or add books.
5. **Neutral, non-sectarian tone.** The Platform explains; it does not argue for one denomination. Where Christian traditions differ, it says so plainly.
6. **Language parity.** Telugu, Hindi and the other launch languages get the same quality of typography, search and explanation as English — not a machine-translated afterthought.
7. **Accessible and light.** Works on a mid-range Android phone on a slow connection; WCAG 2.2 AA; large-text and voice friendly.
8. **Private by default.** What a person reads, highlights and writes is personal and can reveal religious belief. It is not sold, not used for advertising, and not sent to AI without explicit opt-in.
9. **Preserve, don't force.** Genealogies and chronologies keep the original accounts, mark inferred and disputed links, and never invent relationships.

## 5. What success looks like

| Horizon | Outcome | Indicative measures (to be baselined after beta) |
|---|---|---|
| V1 launch | People in all 14 interface languages can read a complete Bible, compare two editions, find verses by meaning and understand chapters | ≥10 complete Bible text languages live; all 1,189 chapters of the 66-book canon with a published quick overview in English, Telugu and Hindi (reviewed or clearly labelled); Verse Finder Recall@10 ≥0.90 (English gold set) and ≥0.80 (Indic gold sets) |
| 3 months after launch | Daily habit forms | Share of active readers completing ≥4 reading days per week; reminder opt-in rate; 30-day retention |
| 6–12 months | Trusted for understanding | Explanation helpfulness rating; error-report rate per 1,000 explanation views; reviewer-approved coverage in Telugu and Hindi |
| Always | Trust and integrity | Zero licence breaches; zero invented verses; every reported factual error triaged within 7 days |

Measures are proposals for human approval, not commitments.

## 6. Scope summary

**V1 (first public release)** — see `PRODUCT_REQUIREMENTS.md` for detail:

- 14-language interface (Telugu, English, Hindi, Tamil, Kannada, Malayalam, Bengali, Spanish, Portuguese, French, Arabic RTL, Chinese Simplified, Indonesian, German), independent from the Bible edition chosen.
- Local open-licence corpus of complete Bibles in 13–14 languages (public domain, CC BY, CC BY-SA), plus Catholic and Orthodox-canon editions in English, Spanish, French and Latin.
- Main reader, two-edition parallel reader (desktop side-by-side; mobile stacked/swipe/landscape split) with versification-aware alignment.
- Verse Finder (exact + keyword + meaning, multilingual, explained, traceable).
- Voice navigation to references in browsers that support speech recognition.
- UNDERSTAND (quick overview + detailed study) for the 66-book canon, English first, with Telugu and Hindi as the first translated languages; other languages and deuterocanonical books follow in V1.x.
- Chapter-aware people panel, genealogy explorer and timeline.
- Daily study: plans, custom schedules, reminders, progress, history; offline reading of open texts.
- Accounts with sync (optional — the reader works without an account).

**V1.1** — licensed translations via API (display-only), BSI and other permission-based texts as permissions arrive, server-side speech recognition for Indian languages, audio Bible where licensed, UNDERSTAND in remaining languages and deuterocanon.

**V2** — native mobile apps, community/group features, original-language tools (Hebrew/Greek word study), Oriental Orthodox full canons when sources exist, more languages (Urdu, Marathi, Nepali, Swahili, Korean…).

**Non-goals (all versions unless re-decided):** generating new translations or paraphrases; AI chat that answers as a pastor or as God; denominational doctrinal rulings; selling user data or advertising based on reading behaviour.

## 7. Key constraints discovered in research

1. **Licensing shapes the product.** Popular modern translations (NIV, ESV, NLT, NASB, CSB, NKJV, NRSVue, GNT, CEV) cannot be hosted, embedded or sent to AI without licences; providers add caching windows, non-commercial limits and AI prohibitions. V1 is therefore built on an open-licence corpus with licensed editions added later as display-only. (`BIBLE_LICENSING_MATRIX.md`)
2. **Indian-language open texts come mainly from one series (IRV, CC BY-SA 4.0).** The traditional Bible Society of India texts need permission. (`BIBLE_TRANSLATION_CATALOGUE.md`)
3. **Commercial vs non-commercial is the single biggest decision.** It decides which providers, translations and AI terms are available. (`PROJECT_DECISIONS.md`, D-001)
4. **Versification differs** between traditions and even between editions with the same tradition; alignment must use a mapping layer. (`CANON_AND_TRADITION_RESEARCH.md`, `BIBLE_DATA_ARCHITECTURE.md`)
5. **Human review capacity limits UNDERSTAND.** 1,189 chapters × 2 depths × N languages is a large editorial workload; the plan stages it and labels review status honestly. (`AI_AND_SEARCH_STRATEGY.md`)

## 8. Document map

| # | Document | Purpose |
|---|---|---|
| 1 | MASTER_PRODUCT_VISION.md | This document |
| 2 | PRODUCT_REQUIREMENTS.md | Functional and non-functional requirements with IDs and V1/V1.1/V2 priority |
| 3 | USER_JOURNEYS.md | Personas and step-by-step journeys |
| 4 | BIBLE_TRANSLATION_CATALOGUE.md | Every researched edition, coverage, source and V1 role |
| 5 | BIBLE_LICENSING_MATRIX.md | Per-edition, per-use permissions and provider terms |
| 6 | CANON_AND_TRADITION_RESEARCH.md | Canons, book naming, versification |
| 7 | BIBLE_DATA_ARCHITECTURE.md | Content model, IDs, versification mapping, ingest, validation |
| 8 | AI_AND_SEARCH_STRATEGY.md | Verse Finder, voice, UNDERSTAND pipeline, AI safeguards |
| 9 | GENEALOGY_AND_TIMELINE_PLAN.md | People, relationships, chronology model and UX |
| 10 | UI_UX_DESIGN_REQUIREMENTS.md | Screens, typography, RTL, mobile, accessibility |
| 11 | TECHNICAL_ARCHITECTURE.md | Stack, services, deployment, repository layout |
| 12 | SECURITY_AND_PRIVACY_REQUIREMENTS.md | Threats, controls, DPDP/GDPR, AI safety |
| 13 | TESTING_AND_ACCEPTANCE_CRITERIA.md | Test strategy and feature acceptance criteria |
| 14 | DEVELOPMENT_ROADMAP.md | Phases, milestones, dependencies, risks |
| 15 | ANTIGRAVITY_TASKS.md | Frontend / design / browser-validation work packages |
| 16 | OPENCODE_TASKS.md | Backend / data / search / AI / testing work packages |
| 17 | PROJECT_DECISIONS.md | Decision log and questions for the human reviewer |

## 9. What happens next

1. Human reviewer reads `PROJECT_DECISIONS.md` and answers the open questions — above all **D-001 (commercial model)**.
2. Human lead sends the permission requests listed in `BIBLE_LICENSING_MATRIX.md` §6 (BSI first).
3. On approval, OpenCode starts Phase 1 data foundations and Antigravity starts the design system and reader shell, as sequenced in `DEVELOPMENT_ROADMAP.md`.
