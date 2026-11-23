# CANON AND TRADITION RESEARCH

**Status:** Draft for human review · **Research date:** 2026-11-21
**Purpose:** Give the product and data teams an accurate model of how Christian traditions differ in *which books* they read (canon), *what they call them* (naming), *how they number them* (versification), and *which editions* serve each tradition — so the Platform never confuses a translation with a canon and never silently forces one tradition's structure on another.

---

## 1. Three concepts the product must keep separate

| Concept | Definition | Example | Product setting |
|---|---|---|---|
| **Canon** | The list (and order) of books a tradition treats as Scripture | Catholic canon = 73 books | *Tradition* selector (FR-ED-01) |
| **Translation / edition** | A particular wording of some books in some language, with its own copyright | Telugu IRV 2019; Douay-Rheims 1899 | *Edition* selector |
| **Versification** | How chapters and verses are divided and numbered | Psalm 23 in Hebrew/English numbering is Psalm 22 in Greek/Latin numbering | Hidden mapping layer; visible only as notes |

A translation may cover fewer or more books than a canon (Telugu IRV has 66 books; WEB with Deuterocanon has 66 + 15). The Platform shows the **intersection** and clearly marks gaps (FR-ED-03).

## 2. Canon overview

### 2.1 Book counts by tradition

| Tradition | Total books | OT | NT | Notes |
|---|---|---|---|---|
| Protestant | 66 | 39 | 27 | Many historic Protestant Bibles (e.g. KJV 1611, Luther) printed the Apocrypha in a separate section, not as canon |
| Roman Catholic | 73 | 46 | 27 | 7 deuterocanonical books + Greek additions in Esther and Daniel; canon defined at the Council of Trent (1546) |
| Eastern Orthodox (Greek usage) | about 76 (counts vary by how additions are counted) | ~49 | 27 | Adds 1 Esdras, 3 Maccabees, Prayer of Manasseh, Psalm 151; 4 Maccabees in an appendix |
| Slavonic / Russian Orthodox usage | varies | — | 27 | Includes 2 and 3 Esdras (Slavonic numbering); 4 Maccabees generally not accepted by the Russian Church |
| Ethiopian & Eritrean Orthodox Tewahedo | 81 | 46 | 35 (broader count) | Unique books: Enoch, Jubilees, 1–3 Meqabyan, Paralipomena of Jeremiah (4 Baruch); 1–2 Maccabees are *not* included (Meqabyan are different books) |
| Syriac tradition (Peshitta) | — | — | 22 traditional | Traditional Peshitta NT lacks 2 Peter, 2–3 John, Jude, Revelation; these were added in the Harklean version (616) and modern printed Syriac Bibles include all 27 |
| Armenian, Coptic | — | — | — | **NOT VERIFIED** — not researched in this round (gap G-5) |

**Do not assume all Orthodox traditions share one collection.** The Greek and Russian churches differ (e.g. 4 Maccabees, 2/3 Esdras), and the Oriental Orthodox churches (Ethiopian, Eritrean, Syriac, Coptic, Armenian, Malankara) form a separate family with their own canons.

### 2.2 Book-by-book presence (books beyond the 66)

`●` canonical · `◐` in an appendix or of disputed/secondary status · `—` not included · `?` not verified

| Book (USFM code) | Protestant | Catholic | Greek Orthodox | Russian/Slavonic | Ethiopian Tewahedo |
|---|---|---|---|---|---|
| Tobit (TOB) | — | ● | ● | ● | ● |
| Judith (JDT) | — | ● | ● | ● | ● |
| Esther, Greek additions (ESG) | — | ● | ● | ● | ● |
| Wisdom of Solomon (WIS) | — | ● | ● | ● | ● |
| Sirach / Ecclesiasticus (SIR) | — | ● | ● | ● | ● |
| Baruch (BAR) + Letter of Jeremiah (LJE) | — | ● (LJE = Baruch 6) | ● | ● | ● |
| Daniel additions: Prayer of Azariah & Song of the Three (S3Y), Susanna (SUS), Bel and the Dragon (BEL) | — | ● | ● | ● | ● |
| 1–2 Maccabees (1MA, 2MA) | — | ● | ● | ● | — |
| 1 Esdras (1ES) | — | ◐ Vulgate appendix ("3 Esdras") | ● | ● (as "2 Esdras") | ? |
| Prayer of Manasseh (MAN) | — | ◐ Vulgate appendix | ● / ◐ (often with Odes) | ● | ● |
| Psalm 151 (PS2) | — | — | ● | ● | ● |
| 3 Maccabees (3MA) | — | — | ● | ● | — |
| 4 Maccabees (4MA) | — | — | ◐ appendix | — | — |
| 2 Esdras / 4 Ezra (2ES) | — | ◐ Vulgate appendix ("4 Esdras") | — | ● (as "3 Esdras") | ● (4 Ezra) |
| Enoch (ENO), Jubilees (JUB), 1–3 Meqabyan (1MQ–3MQ), 4 Baruch (4BA) | — | — | — | — | ● |

Sources for this table are listed in §7. Where sources disagree (e.g. how the Greek Church classes the Prayer of Manasseh), the table records the more cautious value and the data model stores per-tradition notes.

### 2.3 The Esdras naming problem

The same name refers to different books depending on tradition — a classic source of data errors.

| Content | Protestant / modern English | Latin Vulgate | Greek (LXX) | Slavonic |
|---|---|---|---|---|
| Ezra | Ezra | 1 Esdras | 2 Esdras (with Nehemiah) | 1 Esdras |
| Nehemiah | Nehemiah | 2 Esdras | part of 2 Esdras | Nehemiah |
| Greek Esdras (1ES) | "1 Esdras" (Apocrypha) | 3 Esdras (appendix) | 1 Esdras | 2 Esdras |
| Latin apocalypse (2ES) | "2 Esdras" (Apocrypha) | 4 Esdras (appendix) | not in Greek | 3 Esdras |

**Rule:** the Platform identifies books by USFM code (`EZR`, `NEH`, `1ES`, `2ES`) and treats every display name as a per-tradition, per-language label.

### 2.4 Other naming differences to support

| USFM | Common English | Catholic (older / Douay) | Orthodox / LXX |
|---|---|---|---|
| 1SA, 2SA | 1–2 Samuel | 1–2 Kings (Douay) | 1–2 Kingdoms |
| 1KI, 2KI | 1–2 Kings | 3–4 Kings (Douay) | 3–4 Kingdoms |
| 1CH, 2CH | 1–2 Chronicles | 1–2 Paralipomenon | 1–2 Paralipomenon / Chronicles |
| SNG | Song of Songs / Song of Solomon | Canticle of Canticles | Song of Songs |
| SIR | Sirach | Ecclesiasticus | Wisdom of Sirach |
| REV | Revelation | Apocalypse | Revelation / Apocalypse |
| HOS, OBA, ZEP, HAG | Hosea, Obadiah, Zephaniah, Haggai | Osee, Abdias, Sophonias, Aggeus (Douay) | — |

## 3. Versification — why verse numbers cannot be matched blindly

### 3.1 Major schemes

Paratext (the Bible-society translation editor) ships standard versification files commonly named `org` (original/Hebrew-Greek), `lxx` (Septuagint), `vul` (Vulgate), `eng` (English), `rsc` (Russian canonical) and `rso` (Russian Orthodox) — from Paratext practice, not re-checked in this research round; OC-05 confirms the files and their licence. STEPBible's **TVTMS** dataset (CC BY 4.0) documents versification differences across Hebrew, Greek, Latin, English and other traditions and how to map them onto a standard (NRSV-A–based) scheme.

### 3.2 Known difference types (with examples)

| Type | Example | What the reader must do |
|---|---|---|
| Chapter boundary differs | English **Malachi 4:1–6** = Hebrew **Malachi 3:19–24**; English **Joel 2:28–32** = Hebrew **Joel 3:1–5**, English Joel 3 = Hebrew Joel 4 | Align by content; show each edition's own numbers |
| Psalm titles counted as verses | Hebrew-numbered editions count superscriptions as verse 1 (e.g. English Psalm 51:1 = Hebrew 51:3) | Offset mapping per psalm |
| Psalm numbering (Greek/Latin vs Hebrew) | LXX/Vulgate join Ps 9–10 and 114–115, split 116 and 147 → most psalms are one lower (Hebrew Ps 23 = LXX/Vulgate Ps 22; Hebrew Ps 51 = LXX Ps 50) | Map whole psalms; show "numbered 22 in this edition" |
| Additions inside books | Vulgate Daniel 3:24–90 (Prayer of Azariah, Song of the Three), Daniel 13 (Susanna), 14 (Bel); Vulgate Esther 10:4–16:24 | Rows exist in one edition and not the other |
| Verses omitted by textual basis | Modern critical-text editions omit or bracket e.g. Matt 17:21, 18:11, 23:14; Mark 7:16, 9:44, 9:46, 11:26, 15:28; Luke 17:36, 23:17; John 5:4; Acts 8:37, 15:34, 24:7, 28:29; Rom 16:24 | "Not in this edition" rows with the edition's footnote |
| Small numbering splits | 3 John 14 (KJV) = 3 John 14–15 (NRSV); Rev 12:18 (NRSV) = KJV Rev 13:1a; 2 Cor 13:12–14 vs 12–13 | Split/merge mapping |
| Verse bridges in translations | Translations combine verses for natural language ("\v 4-5") | One row spanning two keys |
| Doxology placement | Romans 16:25–27 appears after 14:23 in some Greek manuscripts and traditions | Map by content where an edition follows this |

### 3.3 Evidence from our candidate editions

eBible metadata (mirror snapshot, see catalogue §1) already shows the effect:

| Edition | NT verse records | OT verse records | Interpretation (to confirm at import) |
|---|---|---|---|
| KJV | 7,957 | 23,145 | Reference |
| BSB | 7,941 | 23,145 | −16 NT = matches the 16 commonly omitted verses listed above |
| Telugu IRV | 7,875 | 23,129 | −82 NT: likely verse bridges and omissions — must be diagnosed (OC-05) |
| Kannada IRV | 7,890 | 23,141 | Similar pattern |
| Douay-Rheims | 7,951 | 23,487 (937 chapters) | Vulgate structure: Esther 16 chapters, Daniel 14 chapters; Vulgate Psalm numbering |
| Louis Segond 1910 | 7,959 | 23,211 | French/Hebrew-style numbering in places |
| Chinese Union Version | 7,940 | 23,081 | Differences to diagnose |

**Conclusion:** every imported edition needs (a) a declared or detected versification scheme and (b) a verified mapping to the internal standard key before it can be used in parallel reading, search hand-off, highlights or reading plans.

## 4. Editions available per tradition (V1 corpus)

| Tradition | English | Indian languages | Other languages | Gaps |
|---|---|---|---|---|
| Protestant (66) | KJV, WEB, BSB, ASV | IRV in Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali; Malayalam 1910 | RV1909 (es), Bíblia Livre (pt), LSG (fr), Van Dyck (ar), CUV (zh), Luther 1912 (de), AYT (id, conditional) | BSI O.V. texts (permission) |
| Catholic (73) | Douay-Rheims, WEB Catholic, WEB+DC | none open | Néo-Crampon Libre (fr), Biblia Libre para el Mundo (es, 15 DC), Clementine Vulgate (la) | POC Malayalam and other Indian Catholic Bibles; NABRE/RSV-2CE (permission) |
| Eastern Orthodox | Brenton LXX (OT+DC) + a PD NT; WEB+DC (includes 1 Esdras, 3–4 Macc, Prayer of Manasseh, Ps 151) | none open | Greek LXX (Brenton text), Byzantine Greek NT; Spanish/French "Free Bible for the World" with 15 DC | Orthodox Study Bible (permission); Malayalam Orthodox (Malankara) liturgical texts not researched |
| Oriental Orthodox | — | — | Amharic NT (licence not verified), Coptic NT (PD) | Full Ethiopian 81-book text; Syriac Peshitta; Armenian |

## 5. Product rules derived from this research

1. **Canon definitions are data.** Each canon = ordered list of book codes + section grouping + per-language names + notes; editions declare which book codes they contain (OC-06).
2. **Tradition selection changes order and availability, never wording.**
3. **Mixed-source canons are explicit.** Where a tradition needs books from two editions (e.g. Brenton OT + WEB NT for Orthodox English), the UI labels which edition supplies which part.
4. **Versification is resolved before display.** The reader never aligns by raw numbers; parallel rows come from the mapping service (OC-10).
5. **Psalm and chapter differences are explained, not hidden.** Small notes: "This edition numbers this psalm 22."
6. **Neutral naming.** UI defaults follow the selected tradition (e.g. "1 Kingdoms" for Orthodox if chosen), with common names in brackets for clarity.
7. **No claim about Armenian, Coptic, Syriac or Malankara canons is shown to users** until researched and reviewed (G-5).

## 6. Open questions for reviewers

| ID | Question |
|---|---|
| CQ-1 | Should the Ethiopian canon appear as a selectable tradition in V1 (with most books marked "not available"), or only once texts exist? Recommendation: show it in V2 to avoid an empty experience. |
| CQ-2 | For Indian Orthodox and Syrian churches (Malankara, Mar Thoma, Syro-Malabar), which canon definitions and Malayalam editions should be prioritised? Needs community advisors. |
| CQ-3 | Should "Apocrypha" be offered as a section for Protestant users who want to read it (as in the KJV 1611)? Recommendation: yes, as an optional section labelled "Apocrypha (not in the Protestant canon)". |

## 7. Sources (checked 2026-11-21)

- NRSV Apocrypha introduction (Cambridge University Press PDF) — book groupings by Greek, Slavonic and Vulgate usage: https://www.cambridge.org/us/files/5314/5207/7560/New_Revised_Standard_Version_Apocrypha.pdf
- Oremus Bible Browser, NRSV Apocrypha intro: https://bible.oremus.org/nrsvae/apocrypha-intro.html
- Deuterocanonical books overview: https://en.wikipedia.org/wiki/Deuterocanonical_books
- OrthodoxWiki, Old Testament canon (Synod of Jerusalem 1672; Psalm 151; 4 Maccabees appendix): https://orthodoxwiki.org/Old_Testament_Canon
- St Herman Orthodox church note (4 Maccabees not accepted by the Russian Church): https://www.sthermansoca.org/?p=453
- Bible Gateway, Orthodox OT books: https://www.biblegateway.com/blog/?p=65783 ; Ethiopian Bible: https://www.biblegateway.com/learn/?p=8571
- Orthodox Tewahedo biblical canon: https://en.wikipedia.org/wiki/Orthodox_Tewahedo_biblical_canon
- Catholic Bible (73 books): https://en.wikipedia.com/wiki/Catholic_Bible ; Catholic Answers on Orthodox canon: https://www.catholic.com/qa/do-catholics-and-orthodox-have-the-same-bible
- Peshitta (22-book NT; Harklean additions): https://EN.wikipedia.com/wiki/Peshitta ; https://encyclopedia.pub/entry/28378
- Orthodox Study Bible, books listed and compared: https://azbyka.ru/otechnik/world/the-orthodox-study-bible/4
- STEPBible Data (TVTMS, CC BY 4.0): https://github.com/STEPBible/STEPBible-Data
- SWORD developer discussion of mapping LXX/MT/Vulgate onto NRSVA: https://go.mail-archive.com/sword-devel@crosswire.org/msg34348.html
- USX `altnumber` for alternate versification: https://app.thedigitalbiblelibrary.org/static/docs/usx/elements.html
- eBible catalogue metadata (mirror snapshot): https://raw.githubusercontent.com/BibleNLP/ebible/main/metadata/translations.csv
