# GENEALOGY AND TIMELINE PLAN

**Status:** Draft for human review · **Date:** 2026-11-21 · **Owners:** OpenCode (data & APIs: OC-18…OC-21) · Antigravity (UI: AG-16, AG-17)

---

## 1. Goals and guardrails

- Respond to the **current chapter**: when a reader opens 2 Kings 10, show the people in that chapter, their families, the royal houses involved and the historical period.
- **Preserve the biblical accounts.** Store what each passage states, where it states it.
- **Never invent relationships.** Unknown stays unknown. Every edge has evidence or is labelled as extra-biblical tradition.
- **Show uncertainty visually** (stated / stated elsewhere / inferred / disputed / tradition).
- **Label dates honestly**: approximate, ranged, attributed to a chronology, and with alternatives where scholars differ.

## 2. Source data

| Dataset | What we take | Licence | Caveats |
|---|---|---|---|
| **STEPBible TIPNR** | Individualised people and places with all references; parents, partners, siblings, offspring; name forms in Hebrew/Greek | CC BY 4.0 | Older STEPBible materials were CC BY-NC; use the current CC BY 4.0 repository release and record the commit |
| **Theographic Bible Metadata** | People, places (1,274), ~450 events with participants and verses, periods | CC BY-SA 4.0 | Its event dates follow one conservative chronology (Floyd Nolen Jones); use for **linkage**, not as our default dates |
| **OpenBible.info Geocoding** | Place identifications with confidence scores | CC BY 4.0 | Modern identifications can be uncertain; show confidence |
| **Curated layer (ours)** | Disambiguation fixes, confidence labels, dynasty/succession data, royal synchronisms, notes | CC BY-SA 4.0 (D-012) | Every change reviewed and sourced |

Reconciliation (OC-18): match TIPNR and Theographic persons by name + reference overlap; conflicts go to a review queue; our `person` ID is stable and stores both upstream IDs.

## 3. Relationship model

| Kind | Meaning | Example |
|---|---|---|
| `father_of`, `mother_of` | Parent as stated | Ahab father of Ahaziah of Israel |
| `ancestor_of` | "Son/daughter of X" where generations may be skipped or the text means descendant | Jesus "son of David" (Matt 1:1) |
| `spouse_of` | Marriage stated | Ahab and Jezebel (1 Kgs 16:31) |
| `sibling_of`, `half_sibling_of` | Stated or implied by shared parent | — |
| `levirate_father_of`, `adoptive_parent_of`, `legal_father_of` | Non-biological lines where the text indicates them | Used carefully with notes |
| `successor_of` | Throne succession (not family) | Jehu succeeded Joram of Israel |
| `member_of_house` | Dynasty membership | House of Omri, House of Jehu, House of David |

**Confidence values** (shown in UI legend):

| Value | Rule | UI style |
|---|---|---|
| `stated` | A verse states the relationship directly | Solid line |
| `stated_elsewhere` | Stated in another passage than the one being read | Solid line + "elsewhere" tag |
| `inferred` | Follows logically from stated facts (e.g. grandson via two stated links) — inference recorded | Dashed line |
| `disputed` | Passages or readings differ, or the kinship term is ambiguous | Amber dotted line + "Views differ" |
| `tradition` | Extra-biblical tradition (e.g. names of Mary's parents) — only shown when the user turns on "Show traditions" | Grey, labelled "Tradition, not in the Bible" |

## 4. Hard cases the model must handle

| Case | Handling |
|---|---|
| **Same name, different people** (e.g. Joram/Jehoram of Israel and Jehoram of Judah reign in the same years; many Zechariahs) | Separate `person` records with disambiguators ("Joram, king of Israel, son of Ahab"); reference lists never merged |
| **Jehu's ancestry** — "son of Jehoshaphat, son of Nimshi" (2 Kgs 9:2) vs "son of Nimshi" (1 Kgs 19:16) | Store both; Nimshi → Jehoshaphat → Jehu as `stated`; Nimshi as grandfather; 1 Kgs 19:16 shown as `ancestor_of` usage |
| **Athaliah** — wife of Jehoram of Judah, "daughter of Ahab" context (2 Kgs 8:18) and "daughter of Omri" (2 Kgs 8:26) | Edge to Ahab `disputed` (or `inferred` per reviewer), edge to Omri as `ancestor_of`; note that "daughter" can mean female descendant |
| **Two genealogies of Jesus** (Matthew 1, Luke 3) | Two separate lineage paths, each with references; explanation of main views (e.g. Joseph's line vs Mary's line; legal vs natural descent) under "Views differ" |
| **Skipped generations / telescoped lists** (e.g. Matthew 1:8 compared with 1 Chronicles 3) | Do not create direct parent edges where a list skips; use `ancestor_of` |
| **Numbers and lifespans** (Genesis 5, 11) | Stored as text facts with references; no birth-year computation shown as history |
| **Variant names across languages** | `person_name` per language from edition text (e.g. Telugu IRV spelling), with transliteration aliases for search |

## 5. Chapter context (People panel)

For each standard chapter (OC-19):

1. **Named in this chapter** — from `person_mention` (TIPNR references), sorted by first appearance, with role tags (king, prophet, priest, family member).
2. **Referred to** — people mentioned by relation or recalled (e.g. "the house of Ahab", Elijah's earlier word in 2 Kgs 10:10, 17).
3. **Groups** — e.g. "the seventy sons of Ahab", "the worshippers of Baal", "relatives of Ahaziah king of Judah" (2 Kgs 10:13–14) as group entities with references.

**Worked example — 2 Kings 10** (data to be generated and reviewed; references from the text):

| Entity | Role in chapter | Key references | Family / dynasty context |
|---|---|---|---|
| Jehu | King of Israel; carries out judgement on Ahab's house | 2 Kgs 10:1–36 | Son of Jehoshaphat son of Nimshi (2 Kgs 9:2); founder of the House of Jehu; son Jehoahaz succeeds (10:35) |
| Seventy sons of Ahab | Killed in Samaria | 10:1–8 | House of Omri |
| Relatives of Ahaziah king of Judah | Killed at Beth-eked | 10:12–14 | Link to House of David via Ahaziah of Judah |
| Jehonadab son of Rechab | Joins Jehu | 10:15–16, 23 | Rechabites (Jer 35) |
| Worshippers and priests of Baal | Destroyed in the temple of Baal | 10:18–28 | — |
| Hazael | King of Aram; reduces Israel's territory | 10:32–33 | Anointed per 1 Kgs 19:15; 2 Kgs 8:7–15 |
| Jehoahaz | Jehu's son and successor | 10:35 | House of Jehu |
| Ahab, Jezebel, Elijah | Referred to | 10:10, 17, 30 | House of Omri; prophetic word |

## 6. Genealogy explorer UX (AG-16)

- **Entry points:** People panel in reader; person chips in UNDERSTAND; search results for names; profile deep links.
- **Views:**
  1. *Family* — focal person centred; parents above, spouses beside, children below; expand one generation at a time; vertical scroll moves between generations; on mobile a generation list with swipe left/right between siblings.
  2. *Lineage path* — shortest documented path between two people (e.g. Abraham → David), each edge with its reference and confidence; skipped generations shown as "…".
  3. *Royal lines* — succession timeline for Israel and Judah side by side with dynasties coloured; synchronisms from Kings/Chronicles; links to chapters.
- **Every edge** opens a popover with the verses (in the user's edition) and the confidence label.
- **Accessibility:** tree has a list/outline alternative with full keyboard and screen-reader support.

## 7. Timeline model

### 7.1 Periods (default spine)

| Period | Dating approach (default display) | Notes |
|---|---|---|
| Primeval history (Gen 1–11) | **Undated** | No year scale shown |
| Patriarchs (Abraham → Joseph) | Approximate, wide range; "Dates differ" | Depends on Exodus date and other reckonings |
| Egypt and Exodus | Show both **early date (c. 1446 BC)** and **late date (13th century BC, c. 1270–1260 BC)** | 1 Kgs 6:1 (480 years) underpins the early date; late date is linked to Ramesses-era evidence |
| Wilderness & Conquest | Follows Exodus option | |
| Judges | Approximate | Overlapping judgeships likely |
| United Monarchy (Saul, David, Solomon) | c. 1050–930 BC | Solomon's 4th year often placed c. 966/967 BC |
| Divided Kingdom (Israel & Judah) | Default **Thiele** dates, with alternatives (e.g. Albright, Galil, Kitchen) | Accession/non-accession reckoning and coregencies explain differences |
| Fall of Samaria | 722/721 BC | |
| Fall of Jerusalem / Exile | 587/586 BC | Both years shown |
| Return and Second Temple | From 538 BC | |
| Between the Testaments (incl. Maccabean period for deuterocanon) | Approximate | Important for Catholic/Orthodox canon readers |
| Life and ministry of Jesus | Birth c. 6–4 BC; crucifixion c. AD 30 or 33 | Two common dates shown |
| Early church (Acts, letters, Revelation) | Ranges per book | Authorship/date debates labelled |

### 7.2 Data rules

- `event_dating` holds one or more datings per event, each with chronology name, range, `approx` flag and source; one is marked `is_default`.
- The UI never shows a bare year: always "c." or a range, plus the chronology name on tap.
- `chapter_period` maps every standard chapter to one or more periods with confidence (e.g. Psalms map to multiple periods; prophets to their stated reigns).
- Theographic event dates are imported into a separate chronology (`theographic-jones`) for transparency, not as default.

### 7.3 Timeline UX (AG-17)

- Horizontal zoomable band (desktop) / vertical scroll (mobile) with period bands and event markers.
- Opening from the reader highlights the current chapter's period and scrolls to it.
- "Dates differ" badge opens a small comparison (e.g. Early Exodus vs Late Exodus) with references and a neutral one-paragraph explanation.
- Events link to chapters, people and places; people show reign bars for kings.

## 8. Quality checks (OC-18…OC-20)

| ID | Check |
|---|---|
| G-01 | No cycles in parent edges; no person is their own ancestor |
| G-02 | Every non-tradition edge has ≥1 evidence verse that exists |
| G-03 | Persons with identical names never share reference lists |
| G-04 | Parent lifespans/reign synchronisms: warnings only (no auto-fix) |
| G-05 | Review sample: 100 random edges and all `disputed` edges reviewed by a human before launch |
| T-01 | Every event has ≥1 reference; dated events have ≥1 dating with source |
| T-02 | Every standard chapter of the 66 books maps to ≥1 period |
| T-03 | Default chronology chosen for each disputed span is documented in `PROJECT_DECISIONS.md` (D-013) |

## 9. Sources (checked 2026-11-21)

- STEPBible Data (TIPNR: parents, partners, siblings, offspring; CC BY 4.0): https://github.com/STEPBible/STEPBible-Data ; older CC BY-NC notice: https://stepweb.atlassian.net/wiki/x/C4C_
- Theographic / viz.bible data (CC BY-SA 4.0; events follow Floyd Nolen Jones' chronology): https://viz.bible/bible-data/
- OpenBible.info Bible Geocoding Data (CC BY 4.0): https://github.com/openbibleinfo/Bible-Geocoding-Data
- Dating the Exodus (early vs late): https://library.biblicalarchaeology.org/sidebar/dating-the-exodus/ ; https://biblicalstudies.org.uk/article_exodus_date.html ; Hoffmeier, JETS 50/2: https://etsjets.org/wp-content/uploads/2010/06/files_JETS-PDFs_50_50-2_JETS_50-2_225-247_Hoffmeier.pdf
- Kings chronologies (Albright, Thiele, Galil, Kitchen): https://EN.wikipedia.com/wiki/King_of_Judah ; Thiele overview: https://wikiwand.com/en/articles/The_Mysterious_Numbers_of_the_Hebrew_Kings ; McFall, AUSS 1992: https://www.andrews.edu/library/car/cardigital/Periodicals/AUSS/1992-1/1992-1-03.pdf
