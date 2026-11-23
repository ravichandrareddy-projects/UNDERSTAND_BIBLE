# USER JOURNEYS

**Status:** Draft for human review · **Date:** 2026-11-21
Personas are illustrative composites used for design and testing; they are not real people. Requirement IDs refer to `PRODUCT_REQUIREMENTS.md`.

---

## 1. Personas

| ID | Persona | Context | Primary goals | Constraints |
|---|---|---|---|---|
| P1 | **Ravi**, 34, Hyderabad, office worker | Grew up with the Telugu O.V.; reads on an Android phone on the bus | Daily reading in Telugu with English alongside; resume where he stopped | Patchy 4G; small screen; prefers Telugu UI |
| P2 | **Priya**, 22, Lucknow, new believer | Reads Hindi; finds Old Testament chapters confusing | Understand what she just read; find verses she heard in church | No theology background; wants simple language |
| P3 | **Fr. Thomas**, 51, Kochi, Catholic priest | Malayalam and English; Catholic canon | Read Tobit/Sirach; compare Douay-Rheims with modern English; prepare homilies | Expects Catholic book order; wants deuterocanon |
| P4 | **Grace**, 45, London, small-group leader | English; NIV user | Prepare 2 Kings for her group; show family lines and history | Wants her familiar translation (licence-dependent) |
| P5 | **Maria**, 60, São Paulo | Portuguese; large text; uses voice | Navigate by voice; listen if possible | Low vision; not tech-savvy |
| P6 | **Samir**, 29, Cairo | Arabic UI (RTL), Arabic + English parallel | Read Van Dyck and compare with English | RTL + LTR mix |
| P7 | **Mei**, 38, Singapore | Chinese UI; Chinese + English | Search by meaning in Chinese | CJK search segmentation |
| P8 | **Anna**, 19, Thessaloniki | English UI; Eastern Orthodox | Read with the Orthodox canon, Psalm numbering she knows | Wants LXX-based OT |
| P9 | **Reviewer** (internal) | Telugu theology graduate | Review UNDERSTAND drafts efficiently | Needs side-by-side source and draft |

---

## 2. Journeys

### J1 — First visit and setup (P1 Ravi) — FR-I18N-01/02, FR-ED-01/02, FR-PAR-01

1. Ravi opens the site; the language is pre-selected from his browser (English) with a visible language switcher.
2. He chooses **తెలుగు**; the whole interface switches to Telugu immediately, fonts load without flashes of broken glyphs.
3. Onboarding asks three things, each skippable: *Tradition* (Protestant default), *Your Bible* (Telugu IRV suggested for Telugu UI), *Read alongside?* (English KJV suggested).
4. A note explains, in Telugu, that the Telugu O.V. is not yet available and why (permission pending), with an option to be notified.
5. He lands on **Today** with "Start reading: Genesis 1" and "Pick a plan".
**Success:** reading starts within 3 taps; no account required.
**Edge cases:** browser has no Telugu font → bundled Noto Sans/Serif Telugu used; very slow network → text appears before fonts finish (system fallback, then swap).

### J2 — Daily reading and resume (P1) — FR-RDR-03/04/05/06, FR-PAR-05

1. Ravi taps **Continue reading**; Genesis 3 opens at verse 14 where he stopped yesterday.
2. The first 4 verses appear at once; the rest of the chapter loads while he reads.
3. He switches to parallel mode; English KJV appears stacked below, scrolled to Genesis 3:14.
4. He drags the divider to give Telugu more space and increases only the Telugu font size.
5. He closes the app mid-chapter on verse 20; next morning on his work laptop (signed in) the same position opens.
**Success:** resume lands on the verse that was at the top of the screen (±1 verse).

### J3 — Finding a half-remembered verse (P2 Priya) — FR-SRCH-01…09

1. Priya types in Hindi: "प्रेम धीरजवन्त है वाला वचन कहाँ है?" ("where is the verse that says love is patient?").
2. Results show **1 Corinthians 13:4** first, labelled *Similar meaning* (or *Exact phrase* if the edition's wording matches), with the matching words highlighted and a one-line reason.
3. Other results (e.g. 1 Cor 13:7, Col 3:12) follow with their labels.
4. She taps the first result; the reader opens Hindi IRV at 1 Cor 13:4 with the verse briefly highlighted.
5. She bookmarks it with the label "Love".
**Edge cases:** query in English while UI is Hindi → results still shown in her edition; nothing relevant → "No close match found" with tips, never a made-up verse.

### J4 — Understanding a chapter (P2) — FR-UND-01…08

1. Priya finishes 2 Kings 10 in Hindi and taps **समझें (UNDERSTAND)**.
2. The *Quick overview* explains, in simple Hindi, that Jehu carries out the destruction of Ahab's house and the Baal worshippers in Samaria, with references like 10:1, 10:11, 10:18–28.
3. "Before this chapter" links to 2 Kings 9 (Jehu anointed and Jezebel's death); "After" mentions 2 Kings 11 (Athaliah in Judah).
4. A labelled *Interpretation* box notes that readers have long discussed how this violence relates to Hosea 1:4; *Views differ* lists the main readings without choosing one.
5. Status line reads "Reviewed — Hindi review team" or "AI-drafted, automatically checked".
6. She taps "Report a problem" to flag a confusing sentence.
**Success:** every statement she checks has a reference that opens the right verse.

### J5 — Exploring the people in a chapter (P4 Grace) — FR-GEN-01…07

1. In 2 Kings 10 Grace opens **People**: Jehu, the seventy sons of Ahab, Jehonadab son of Rechab, the relatives of Ahaziah of Judah, Hazael, Jehoahaz; Ahab, Jezebel and Elijah are listed as referred to.
2. She opens **Jehu**: "son of Jehoshaphat, son of Nimshi" (2 Kgs 9:2), shown with a note that 1 Kgs 19:16 calls him "son of Nimshi" — *Stated elsewhere*, grandson relation inferred.
3. She switches to **Royal lines** and sees the House of Omri ending and the House of Jehu beginning, with Judah's line in parallel.
4. She taps **Athaliah**: the profile shows both "daughter of Ahab" (2 Kgs 8:18 context) and "daughter of Omri" (2 Kgs 8:26) with confidence *Disputed / interpretation differs* ("daughter" can mean female descendant).
**Success:** no relationship appears without a verse; uncertain links are visibly marked.

### J6 — Placing a chapter in history (P4) — FR-TL-01…04

1. From 2 Kings 10 Grace opens **Timeline**; the *Divided Kingdom* period is highlighted with Jehu's reign marked "c. 841–814 BC (Thiele)".
2. A badge "Dates differ" shows alternative reckonings (e.g. Galil, Kitchen) on tap.
3. She zooms out to see the Exile and Return; taps "Fall of Samaria (722/721 BC)" to read 2 Kings 17.
**Success:** dates are never shown without "c." or a source label; she can explain to her group that dates are approximate.

### J7 — Catholic reader with deuterocanon (P3 Fr. Thomas) — FR-ED-01…05, FR-PAR-03

1. Fr. Thomas sets Tradition = **Catholic**; book list shows Tobit, Judith, 1–2 Maccabees, Wisdom, Sirach, Baruch in Catholic order.
2. He selects Malayalam IRV (66 books) as primary; the book list marks Tobit "Not in this edition — open in English (Douay-Rheims / WEB Catholic)".
3. He opens Psalm 23 in parallel: WEB Catholic and Douay-Rheims. The DRA panel shows **Psalm 22** aligned to the same psalm, with a small "numbered 22 in this edition" note.
4. He opens Daniel 3 and sees the Prayer of Azariah in DRA aligned against a gap row in the 66-book edition marked "Not in this edition".
**Success:** canon choice changes book order and availability, not the text.

### J8 — Voice navigation (P5 Maria) — FR-VOICE-01…04

1. Maria taps the microphone and says "Abrir Salmos capítulo vinte e três".
2. Recognised text appears; the parser resolves *Psalms 23*; the reader opens Bíblia Livre at Psalm 23.
3. She says "João três dezesseis"; low confidence → the UI shows "João 3:16?" with a large **Yes** button.
4. On a browser without speech recognition, the mic button explains that voice is unavailable on this browser and suggests one that supports it (V1) or uses the server fallback (V1.1).
**Success:** correct navigation in ≤2 interactions for clear speech.

### J9 — RTL parallel reading (P6 Samir) — FR-I18N-03, FR-PAR-08

1. Arabic UI; layout is mirrored (navigation on the right).
2. Parallel: Van Dyck (RTL) and WEB (LTR). Each panel keeps its own direction; references like "يوحنا 3:16" render with correct bidi isolation.
3. Highlights and notes work identically in both directions.

### J10 — Chinese meaning search (P7 Mei) — FR-SRCH-03

1. Mei searches "不要害怕的经文" ("verses about not being afraid").
2. Results include Isaiah 41:10, Joshua 1:9, John 14:27 from CUV with *Similar meaning* labels; Chinese text is segmented correctly for highlighting.

### J11 — Orthodox reader (P8 Anna) — FR-ED-04

1. Tradition = **Eastern Orthodox**; option "Use Kingdoms naming" shows 1–4 Kingdoms for Samuel/Kings.
2. Primary OT: Brenton LXX English; NT: WEB (an edition pairing rule fills the NT from a chosen companion edition, clearly labelled).
3. Psalm numbering follows the LXX in the Brenton panel; switching to WEB maps Psalm 50 (LXX) ↔ Psalm 51 (Hebrew/English).

### J12 — Reading plan with reminders (P1 Ravi) — FR-DAILY-01…07

1. Ravi chooses "New Testament in 90 days", start tomorrow, reminder 6:30 am IST.
2. The browser asks for notification permission; if refused, email reminders are offered.
3. Each day, Today shows the portion; reading to the end marks it complete automatically.
4. Weekly view shows 5/7 days; missed days offer "Catch up" or "Shift plan".

### J13 — Offline travel (P1) — FR-DAILY-09, NFR-REL-02

1. Before a train journey Ravi downloads Telugu IRV and English KJV (sizes shown).
2. Offline, he reads, highlights and writes notes; changes sync when back online.
3. UNDERSTAND content for downloaded chapters is available offline if he enabled "Download explanations".

### J14 — Reviewer workflow (P9) — FR-UND-08/11

1. The reviewer opens the review console, filtered to Telugu / Genesis.
2. Left: chapter text (Telugu IRV) with verse numbers; right: draft explanation with each claim linked to its references and validator results.
3. She edits two sentences, marks one interpretive statement as needing theological review, approves the rest.
4. The published version shows "Reviewed"; the audit log records editor, time and changes.

---

## 3. Journey-to-test mapping

Each journey becomes an end-to-end test in `TESTING_AND_ACCEPTANCE_CRITERIA.md` (§5) and is owned by Antigravity task AG-25 with backend fixtures from OpenCode task OC-08.
