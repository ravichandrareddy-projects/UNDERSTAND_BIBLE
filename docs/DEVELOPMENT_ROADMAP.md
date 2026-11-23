# DEVELOPMENT ROADMAP

**Status:** Draft for human review · **Date:** 2026-11-21
Durations are in weeks from approval (**Week 0**). They assume: Antigravity and OpenCode working in parallel as coding agents, one human technical lead reviewing PRs daily, part-time native-language reviewers from Phase 2, and an editorial team for UNDERSTAND from Phase 3. Calendar dates are set once the human reviewer approves scope and staffing.

---

## 1. Phase overview

```text
Wk  0    2         8           14           20          24   26
    |P0  |   P1    |    P2     |     P3     |    P4     | P5 |
    Approvals  Foundations  Read & Compare  Find·Understand·Explore  Grow & Harden  Launch
```

| Phase | Weeks | Goal | Exit milestone |
|---|---|---|---|
| **P0 — Approvals & setup** | 0–2 | Decisions made, permissions requested, repo and CI running | **M0:** decisions D-001…D-020 resolved or defaulted; permission letters sent; monorepo + CI green |
| **P1 — Foundations** | 2–8 | Content pipeline, versification, schema, reader API; design system and reader shell | **M1:** 6 core editions (KJV, WEB, BSB, Telugu IRV, Hindi IRV, DRA) imported, validated and readable in the web app via mock-free API |
| **P2 — Read & compare** | 8–14 | All core editions, parallel reading, user data and sync, 14-language UI, lexical search | **M2 (internal alpha):** all CORE editions live; parallel goldens pass; accounts & sync; UI in 14 languages (machine-drafted + under review) |
| **P3 — Find, understand, explore** | 14–20 | Semantic Verse Finder, voice, UNDERSTAND pipeline + review console, genealogy, timeline | **M3 (closed beta):** search gates met in English; UNDERSTAND English quick overviews for ≥50% of chapters; People/timeline live for 66 books |
| **P4 — Grow & harden** | 20–24 | Daily study, reminders, offline, accessibility, performance, security, privacy compliance | **M4 (public beta):** all P0 acceptance criteria pass except content coverage; pen test done |
| **P5 — Launch** | 24–26 | Content coverage completion, final reviews, launch | **M5 (V1 launch):** launch checklist complete |
| **V1.1** | +6–10 wks after launch | Licensed editions (display-only), BSI/POC etc. as permitted, server ASR, audio, UNDERSTAND in remaining languages + deuterocanon | **M6** |
| **V2** | later | Native apps, original-language tools, community features, more languages, Oriental Orthodox canons | — |

## 2. Detailed phase plan

### P0 — Approvals & setup (Weeks 0–2)
| Work | Owner | Depends on |
|---|---|---|
| Review and approve planning docs; answer Q-01…Q-12 | Human reviewer | — |
| Send permission requests: BSI (all O.V. texts), YLSA (AYT), KCBC/POC, LAI, Biblica (open-text AI clarification), YouVersion (AI clause), API.Bible (plan) | Human lead | D-001 |
| Monorepo scaffold, CI, environments | OpenCode OC-01 | — |
| Web scaffold, tokens draft | Antigravity AG-01 | OC-01 |
| Licence registry seeded from catalogue CSV | OpenCode OC-02 | — |

### P1 — Foundations (Weeks 2–8)
| Work | Owner |
|---|---|
| Source acquisition, USFM parse, normalisation | OC-03, OC-04 |
| Versification engine with TVTMS + overrides; diagnose IRV bridges | OC-05 |
| Canon definitions + book names (14 languages) | OC-06 |
| DB schema & migrations; validation suite | OC-07, OC-08 |
| Reader API + contracts; licence policy engine | OC-09, OC-29 |
| Reference parser package | OC-11 |
| Design system, i18n framework, fonts | AG-02, AG-03, AG-04 |
| App shell, book picker, reader view (against mock, then real API) | AG-05, AG-07, AG-08 |

### P2 — Read & compare (Weeks 8–14)
| Work | Owner |
|---|---|
| Import all CORE editions; parallel alignment API | OC-03…OC-08 (repeat), OC-10 |
| Auth, user data & sync APIs | OC-12, OC-13 |
| Lexical search & normalisation | OC-14 |
| Parallel reader (desktop + mobile modes), reader settings | AG-09, AG-10 |
| Bookmarks/highlights/notes UI, attribution UI, onboarding, accounts UI | AG-11, AG-12, AG-06, AG-20 |
| UI translations drafted → native review begins | AG-03 + reviewers |
| Golden tests GT-01…GT-12 green | OC-05/OC-10 + AG-25 |

### P3 — Find, understand, explore (Weeks 14–20)
| Work | Owner |
|---|---|
| Embeddings + semantic search + fusion; eval harness | OC-15, OC-16, OC-17 |
| Spoken-form lexicon; voice UI | OC-27, AG-14 |
| People/places/events import; genealogy & timeline APIs; cross-refs | OC-18, OC-19, OC-20, OC-21 |
| UNDERSTAND pipeline, validators, review workflow backend | OC-22, OC-23 |
| Verse Finder UI, UNDERSTAND panel, People/genealogy UI, timeline UI, review console | AG-13, AG-15, AG-16, AG-17, AG-21 |
| Editorial review of English quick overviews starts (priority order) | Editors |

### P4 — Grow & harden (Weeks 20–24)
| Work | Owner |
|---|---|
| Plans engine, reminders, offline bundles | OC-25, OC-26, OC-28 |
| Daily study UI, offline UX | AG-18, AG-19 |
| Translation pipeline for explanations (Telugu, Hindi) | OC-24 |
| Privacy features, observability, rate limits, load tests | OC-30, OC-31, OC-32 |
| Accessibility pass, performance budgets, visual regression full matrix, E2E journeys | AG-22, AG-23, AG-24, AG-25, AG-26 |
| Pen test; privacy notice; usability tests (incl. older users, Telugu/Hindi users) | External / human lead / AG |

### P5 — Launch (Weeks 24–26)
Content coverage completion (AC-UND-1), final licence re-checks (G-LIC-1), launch checklist, staged rollout (India first, then global), monitoring.

## 3. Critical path

```text
D-001 decision ─► permission strategy ─► CORE edition list frozen
OC-03/04 parse ─► OC-05 versification ─► OC-10 parallel ─► AG-09 parallel UI ─► M2
OC-05 ─► OC-13 user data (SVK-anchored) ─► sync
OC-15 embeddings ─► OC-16 finder ─► OC-17 gates ─► M3
OC-18 people + OC-20 timeline ─► OC-22 grounding packets ─► generation ─► human review (550+ h English) ─► translation + review ─► M5
```

**The longest pole is UNDERSTAND content review**, not code. Editorial staffing must be confirmed by Week 8 (Q-04).

## 4. Dependencies on people and organisations

| Dependency | Needed by | Impact if late |
|---|---|---|
| Decision D-001 (commercial model) | Week 1 | Blocks provider choices and Indonesian edition |
| Native reviewers for 14 UI languages | Week 10 | UI launches only in reviewed languages |
| Editorial team (English, Telugu, Hindi) | Week 14 | UNDERSTAND coverage shrinks; more "AI-drafted" labels |
| Theological review panel | Week 14 | Sensitive chapters cannot publish |
| BSI permission | V1.1 | Telugu/Hindi O.V. unavailable at launch (IRV still available) |
| Counsel (LR-1…LR-7, privacy notice) | Week 20 | Launch blocked for legal items |

## 5. Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | Permission requests (BSI, publishers) slow or refused | High | Medium | V1 built on open texts; clear "coming soon" messaging; parallel outreach | Human lead |
| R-02 | Licence of an open edition changes or is misrecorded | Low | High | G-LIC-1 re-check at every import; evidence snapshots | OpenCode |
| R-03 | YouVersion/API.Bible AI clauses restrict AI features app-wide | Medium | High | Do not integrate before written clarification (D-009) | Human lead |
| R-04 | Versification mapping errors in IRV and other editions | Medium | High | Bridge diagnosis in OC-05; goldens; reviewer spot checks | OpenCode |
| R-05 | Editorial review capacity insufficient | High | High | Priority ordering; honest status labels; recruit reviewers early; reviewer tooling (AG-21) | Human lead |
| R-06 | Indic/CJK search relevance below gates | Medium | Medium | Eval early (Week 15); fallback engine (D-010) | OpenCode |
| R-07 | Browser speech recognition gaps in Indian languages | High | Low–Medium | Confirmation UI; V1.1 server ASR | Both |
| R-08 | Font/rendering bugs on low-end Android | Medium | Medium | Real-device testing; script test pages | Antigravity |
| R-09 | Theological controversy over an explanation | Medium | High | Sensitive register, ecumenical panel, "Views differ", fast correction process | Human lead |
| R-10 | Agent coordination conflicts (same files) | Medium | Medium | Ownership map; contracts-first; CODEOWNERS | Architect |
| R-11 | Privacy/regulatory non-compliance (DPDP phase III ~May 2027) | Medium | High | Build compliance in P3–P4; counsel review | Human lead |
| R-12 | Single-publisher dependency for Indian open texts (IRV) | Medium | High | Add Biblica open texts as second source where licences verified; maintain relationship with BCS | Human lead |

## 6. V1.1 scope (post-launch)

1. Licensed Edition Adapter (OC-33) and first licensed editions per permissions obtained (NIV/ESV/NLT/NKJV etc.) — display-only.
2. BSI O.V. texts, POC Malayalam, LAI TB, AYT (if not already) — when permitted.
3. Server ASR for Indian languages (OC-35).
4. Audio Bible (OC-36) starting with licensed open audio (Telugu IRV audio, BSB audio).
5. UNDERSTAND in the remaining 11 UI languages; deuterocanon explanations.
6. Interlinear verse-by-verse parallel mode; spelling tolerance improvements.

## 7. V2 candidates

Native iOS/Android apps; Hebrew/Greek word study (STEPBible TAHOT/TAGNT); places and maps; group reading plans; additional UI languages (Urdu, Marathi, Nepali, Swahili, Korean); Ethiopian/Syriac/Armenian canon support when texts exist; community-suggested corrections with moderation.
