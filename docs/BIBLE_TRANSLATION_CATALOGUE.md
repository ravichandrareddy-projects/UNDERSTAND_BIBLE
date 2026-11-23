# BIBLE TRANSLATION CATALOGUE

**Status:** Draft for human review · **Owner:** Chief Product Architect · **Research date:** 2026-11-21 · **Machine-readable copy:** `docs/data/edition_catalogue.csv`

This catalogue lists every Bible edition researched for the platform, what it contains, where it comes from and whether it can enter V1. Licence detail per use is in `BIBLE_LICENSING_MATRIX.md`; canon background is in `CANON_AND_TRADITION_RESEARCH.md`.

## 1. How to read this catalogue

- **Edition, not translation.** A translation (e.g. NIV) can exist in several editions (NIV 1984, NIV 2011, Anglicised). We record the *edition* we would import, because licences, versification and text differ between editions.
- **Tradition** describes the canon the edition is built for, not the translator's denomination. Canon and translation are separate settings in the product (see `PROJECT_DECISIONS.md` D-006).
- **Counts** are the book / chapter / verse-record counts published in eBible.org's own catalogue metadata. They were read from a **mirror snapshot** of `translations.csv` (GitHub `BibleNLP/ebible`, newest row dated 2024-07-18), because the workspace cannot reach ebible.org directly. Live eBible pages read on 2026-11-21 show several editions have newer source files (e.g. Tamil IRV sources dated 12 Mar 2026). **Counts must be recomputed from the downloaded files at import** (OpenCode task OC-03); they are planning figures only.
- A *verse record* is a verse marker in the file. Verse bridges ("\v 4-5") count once, omitted verses count zero — which is why counts differ even between editions with the same versification.
- **Formats:** every eBible edition page offers the same export set (USFM, USFX, VPL+SQL, SWORD module, HTML, ePub, PDF, plain read-aloud text). This was confirmed on the Telugu IRV page; confirm per edition at download time.
- **Licence status** uses the four labels required by the brief: **VERIFIED**, **NOT VERIFIED**, **RESTRICTED**, **PERMISSION REQUIRED** (definitions in the licensing matrix §1).
- **V1 role:** `CORE` = planned for the V1 local corpus · `OPTIONAL` = licence allows V1, include if capacity allows · `CORE-IF-NONCOMMERCIAL` = only if the product is non-commercial and the rights holder confirms · `V1.1-LIC` = needs a licence or API agreement first · `LATER` = not planned before V2 · `GAP` = nothing usable found.

## 2. Headline findings

1. **All 14 interface languages have at least one complete Bible on eBible.org that is marked redistributable.** For 13 of them (all except Indonesian) at least one complete Bible is public domain, CC BY or CC BY-SA, which permit hosting, offline use and commercial use with attribution. This meets the brief's target of ≥10 complete Bible text languages for V1, subject to import-time re-verification.
2. **Indian languages depend mainly on one publisher.** The *Indian Revised Version (IRV)* series by Bridge Connectivity Solutions (CC BY-SA 4.0) is the only open-licence complete Telugu Bible found and the primary open text for Hindi, Tamil, Kannada, Malayalam and Bengali. Biblica's open Contemporary Versions are a second source for those five languages (licence read only for Hindi so far), and Malayalam also has a CC BY-SA edition of the 1910 Sathyavedapusthakam. The traditional Bible Society of India (BSI) O.V. texts that most Indian churches read are **all rights reserved** and need permission.
3. **Indonesian is the weak spot.** The only complete open Indonesian Bible (AYT) has an inconsistent licence statement that is at best non-commercial. The standard Indonesian Bible (LAI Terjemahan Baru) is released for non-profit personal use only.
4. **None of the popular modern English translations requested (NIV, ESV, NLT, NASB, CSB, NKJV, NRSVue, GNT, CEV) can be hosted or AI-processed without a licence.** They can be shown through licensed APIs within quotation limits. KJV, WEB, BSB, ASV and Douay-Rheims are public domain and cover English for V1.
5. **Catholic and Orthodox canons are coverable in V1 for English, Spanish, French and Latin** with public-domain or CC texts (Douay-Rheims, WEB with Deuterocanon, WEB Catholic, Biblia Libre para el Mundo, Néo-Crampon Libre, Brenton LXX, Clementine Vulgate). Catholic Bibles in Indian languages (e.g. POC Malayalam) need permission. No open complete 81-book Ethiopian Orthodox Bible was found.
6. **Verse counts differ even among 'standard' editions** (e.g. Telugu IRV NT has 7,875 verse records, KJV 7,957, BSB 7,941; Louis Segond OT has 23,211 vs 23,145). This confirms the brief's warning: verses must be aligned through a versification map, never by number alone.

### V1 core corpus by language

| Language | V1 core editions | Licence basis |
|---|---|---|
| English | KJV, WEB, WEB+DC, WEBC, BSB, DRA | Public domain; Public domain dedication; Public domain outside the UK |
| Telugu | IRVTel | CC BY-SA 4.0 |
| Hindi | IRVHin | CC BY-SA 4.0 |
| Tamil | IRVTam | CC BY-SA 4.0 |
| Kannada | IRVKan | CC BY-SA 4.0 |
| Malayalam | IRVMal, MAL1910 | CC BY-SA 4.0 |
| Bengali | IRVBen | CC BY-SA 4.0 |
| Spanish | RV1909, BLM | Public domain |
| Portuguese | BLIVRE | CC BY 4.0 Brasil |
| French | LSG, NCL | CC BY-SA 4.0; Public domain |
| Arabic | SVD | Public domain |
| Chinese (Simplified) | CUVS | Public domain |
| Indonesian | AYT | eBible page inconsistent: names CC BY-ND 4.0, links CC BY-NC 4.0, lists BY-NC-SA |
| German | LUT1912 | Public domain |

## 3. Source providers researched

| Provider | What it offers | Access model | Key constraint for us | Evidence |
|---|---|---|---|---|
| **eBible.org** | ~1,300+ translations; PD and open-licence texts downloadable in USFM, USFX, VPL/SQL, SWORD, HTML, ePub, PDF | Free download | Each text has its own licence page; eBible warns owner data may be outdated | ebible.org/Scriptures/copyright.php; per-edition about pages |
| **YouVersion Platform** | REST API + SDKs (JS, Swift, Kotlin, React, React Native); 1,000+ licensed versions incl. NIV; 'Sign in with YouVersion' | Free App Key; accept per-Bible licence agreements in portal | Non-commercial only (no ads, paywalls, sponsorships); terms reportedly restrict AI output to users without written approval — **primary terms page could not be read (JavaScript-rendered) → NOT VERIFIED** | developers.youversion.com; platform.youversion.com/terms (unreadable); secondary: faith.tools, SIL community forum |
| **API.Bible (American Bible Society)** | Text/audio API for many licensed and open Bibles | Starter (non-commercial), Pro, Enterprise; commercial licences per translation | Cache ≤30 days; no bulk extraction; generative-AI/LLM use of copyright content prohibited without consent of API.Bible and the IP holder; AI TTS not allowed for copyright content without consent; FUMS reporting required on web; offline needs DRM; no sub-licensing | api.bible/terms-and-conditions; care.api.bible articles |
| **ESV API (Crossway)** | ESV text/HTML | Free, non-commercial, API key | ≤500 verses per query; store ≤500 verses; doctrinal-alignment condition | api.esv.org |
| **Bible Brain / Digital Bible Platform (Faith Comes By Hearing)** | Audio, text (1,477 languages) and video | API key; licence terms (last modified 2021-04-15) | Offline download only where the API marks content downloadable | faithcomesbyhearing.com/bible-brain |
| **Bible Society of India** | Traditional O.V. texts in Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, etc. | Permission request | All rights reserved; no developer programme found | bible.com BSI version pages |
| **Biblica (open.bible)** | Open Contemporary Versions under Creative Commons; NIV under licence | CC download / licence | Trademark conditions; AI & ML policy v1.2 for licensed works | biblica.com/permissions; eBible about pages |
| **Publishers direct** (Crossway, Tyndale, Lockman, Lifeway, HarperCollins, NCC/Friendship Press, ABS, USCCB, Ignatius, KCBC, LAI, SBU, SBB) | Licences for full-text, offline, audio | Negotiated | Quotation limits of 500–1,000 verses without permission | Per-edition evidence in the matrix |

## 4. Structured formats

| Format | Description | Use in this project |
|---|---|---|
| **USFM 3.x** | Plain-text marker format used by Paratext and Bible societies; one file per book (`\id`, `\c`, `\v`, `\s`, `\f` …) | **Primary import format.** Parse with an error-tolerant USFM 3 parser (e.g. MIT-licensed `usfm3`, available for Rust, Python and npm) into USJ (JSON) |
| **USX 3.x** | XML equivalent of USFM, part of the Digital Bible Library bundle; supports `altnumber` for alternate versification | Accept when a rights holder supplies DBL bundles |
| **USFX** | eBible's XML variant of USFM | Secondary source for cross-checking parses |
| **OSIS** | Older XML standard used by CrossWire | Accept for datasets that only exist in OSIS |
| **SWORD modules** | CrossWire binary modules with built-in versification systems (KJV, Catholic, Orthodox, Vulgate…) | Reference only — useful to cross-check versification, not an import format |
| **VPL / SQL** | One verse per line + SQL dump | Quick completeness checks only |
| **Paratext `.vrs` files** | Versification definitions (`eng`, `org`, `lxx`, `vul`, `rsc`, `rso`) with mappings | Input to the versification model together with STEPBible TVTMS |

## 5. Catalogue by language

Columns: **Coverage** from eBible metadata (DC = deuterocanon/apocrypha books). **Counts** = books / chapters / verse records (eBible snapshot). Full permission breakdown is in the licensing matrix.

### English

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| King James Version (1769 standard text) (**KJV**) | Public domain (Crown rights in the UK) | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `eng-kjv2006`](https://ebible.org/details.php?id=eng-kjv2006) | eBible set | Public domain outside the UK; UK Crown letters patent | **VERIFIED** | CORE |
| King James Version + Apocrypha (**KJVA**) | Public domain | Ecumenical / with Apocrypha | Full Bible +14 DC | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957; DC 14 / 173 / 5,720 | [eBible `eng-kjv`](https://ebible.org/details.php?id=eng-kjv) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| World English Bible (**WEB**) | Public domain (eBible.org) | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958 | [eBible `engwebp`](https://ebible.org/details.php?id=engwebp) | eBible set | Public domain | **VERIFIED** | CORE |
| World English Bible with Deuterocanon (**WEB+DC**) | Public domain | Ecumenical / with Apocrypha | Full Bible +15 DC | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958; DC 15 / 213 / 6,955 | [eBible `eng-web`](https://ebible.org/details.php?id=eng-web) | eBible set | Public domain | **VERIFIED** | CORE |
| World English Bible (Catholic) (**WEBC**) | Public domain | Catholic (73) | OT (partial) + NT +9 DC | OT 37 bk / 907 ch / 22,621 v; NT 27 / 260 / 7,958; DC 9 / 161 / 4,829 | [eBible `eng-web-c`](https://ebible.org/details.php?id=eng-web-c) | eBible set | Public domain | **VERIFIED** | CORE |
| Berean Standard Bible (**BSB**) | BSB Publishing / Berean Bible committee — dedicated to public domain 30 Apr 2023 | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,941 | [eBible `engbsb`](https://ebible.org/details.php?id=engbsb) | eBible set | Public domain dedication | **VERIFIED** | CORE |
| American Standard Version (1901) (**ASV**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `eng-asv`](https://ebible.org/details.php?id=eng-asv) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Douay-Rheims (1899 American edition) (**DRA**) | Public domain | Catholic (73) | Full Bible +7 DC | OT 39 bk / 937 ch / 23,487 v; NT 27 / 260 / 7,951; DC 7 / 137 / 4,373 | [eBible `engDRA`](https://ebible.org/details.php?id=engDRA) | eBible set | Public domain | **VERIFIED** | CORE |
| Brenton English Septuagint (**LXX-E**) | Public domain | Eastern Orthodox (LXX-based) | OT only +16 DC | OT 37 bk / 921 ch / 22,970 v; NT 0 / 0 / 0; DC 16 / 196 / 6,034 | [eBible `eng-Brenton`](https://ebible.org/details.php?id=eng-Brenton) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| New English Translation (NET Bible) (**NET**) | Biblical Studies Press, L.L.C. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `engnet`](https://ebible.org/details.php?id=engnet) | eBible set | Publisher 'ministry first' terms; commercial use via HarperCollins Christian | **RESTRICTED** | V1.1-LIC |
| New International Version (2011) (**NIV**) | Biblica, Inc. | Protestant (66) | Not checked | — | API (YouVersion Platform, API.Bible non-commercial tiers) | — | All rights reserved; ≤500 verses gratis; express licence via YouVersion Platform; commercial via HarperCollins (US/CA) / Hodder (UK/EU) | **PERMISSION REQUIRED** | V1.1-LIC |
| English Standard Version (**ESV**) | Crossway (Good News Publishers) | Protestant (66) | Not checked | — | ESV API (text/HTML) | — | All rights reserved; ESV API free for non-commercial use | **RESTRICTED** | V1.1-LIC |
| New Living Translation (**NLT**) | Tyndale House Publishers | Protestant (66) | Not checked | — | NLT API; API.Bible | — | All rights reserved; ≤500 verses fair use | **PERMISSION REQUIRED** | V1.1-LIC |
| New American Standard Bible (1995 / 2020) (**NASB**) | The Lockman Foundation | Protestant (66) | Not checked | — | API / print only | — | All rights reserved; up to 1,000 verses without permission (current lockman.org text) | **PERMISSION REQUIRED** | V1.1-LIC |
| Christian Standard Bible (**CSB**) | Holman Bible Publishers (Lifeway) | Protestant (66) | Not checked | — | API / print only | — | All rights reserved; HCSB notice allows ≤1,000 verses — current CSB policy not read | **NOT VERIFIED** | V1.1-LIC |
| New King James Version (**NKJV**) | Thomas Nelson (HarperCollins Christian) | Protestant (66) | Not checked | — | API.Bible | — | All rights reserved; ≤500 verses; API.Bible non-commercial use capped at 5,000 monthly end users | **RESTRICTED** | V1.1-LIC |
| New Revised Standard Version Updated Edition (**NRSVue**) | National Council of Churches (Friendship Press) | Ecumenical / with Apocrypha | Not checked | — | API / print only | — | All rights reserved; gratis use ≤500 verses incl. web | **PERMISSION REQUIRED** | V1.1-LIC |
| Good News Translation (**GNT**) | American Bible Society | Ecumenical / with Apocrypha | Not checked | — | API.Bible | — | All rights reserved; ABS fair-use ≤500 verses; apps/websites need written permission | **PERMISSION REQUIRED** | V1.1-LIC |
| Contemporary English Version (**CEV**) | American Bible Society | Protestant (66) | Not checked | — | API.Bible | — | All rights reserved; ≤500 verses; mobile apps and websites need written permission | **PERMISSION REQUIRED** | V1.1-LIC |
| New American Bible, Revised Edition (**NABRE**) | Confraternity of Christian Doctrine (USCCB) | Catholic (73) | Not checked | — | API / print only | — | All rights reserved | **NOT VERIFIED** | LATER |
| Revised Standard Version, Second Catholic Edition (**RSV-2CE**) | Ignatius Press (licensed from NCC) | Catholic (73) | Not checked | — | API / print only | — | All rights reserved | **PERMISSION REQUIRED** | LATER |
| Orthodox Study Bible (SAAS OT + NKJV NT) (**OSB**) | St Athanasius Academy / Thomas Nelson | Eastern Orthodox (LXX-based) | Not checked | — | API / print only | — | All rights reserved; SAAS OT quotable within stated limits | **PERMISSION REQUIRED** | LATER |
| Eastern / Greek Orthodox Bible: New Testament (**EOB-NT**) | Laurent Cleenewerck (ed.) | Eastern Orthodox (LXX-based) | Not checked | — | API / print only | — | Unknown | **NOT VERIFIED** | LATER |

- **KJV:** Printing or importing printed copies in the UK needs permission (Crown letters patent; Cambridge UP administers UK rights). eBible's note addresses printing only; whether UK digital display or print-to-PDF is affected is legal question LR-3.
- **KJVA:** Includes 14 Apocrypha books; useful for canon comparison.
- **WEB:** Modern-English PD text; good default for AI and search.
- **WEB+DC:** 15 deuterocanon/apocrypha books incl. Orthodox extras (1 Esdras, 3–4 Maccabees, Prayer of Manasseh, Ps 151) — allows Catholic and Eastern Orthodox canon views in English.
- **WEBC:** Catholic book order; Esther/Daniel with additions.
- **BSB:** Modern English; PD audio narration also announced (YouVersion audio page).
- **DRA:** Catholic; follows Vulgate numbering (e.g. Psalms numbered like the LXX/Vulgate) — strong test case for alignment.
- **LXX-E:** OT + deuterocanon only (no NT). Eastern Orthodox OT reading; pair with a PD NT.
- **NET:** Free non-commercial app use described; commercial use handled by HarperCollins (Thomas Nelson). Full-text hosting and AI use not addressed — ask BSP.
- **NIV:** Biblica says its texts are not licensed for offline/downloadable use in mobile apps and permits only latest editions. AI policy allows study tools and summaries under a licence, but forbids fully automated publishing without human review and requires AI disclosure.
- **ESV:** API: ≤500 verses per query or half a book; may not store more than 500 verses or half a book; ≤500 verses per page; non-commercial site only; users must align with Crossway's doctrinal statement. Embedding a full index is therefore not possible without a licence.
- **NLT:** Tyndale FAQ says NLT web use is limited to a few select sites. API.Bible allows ephemeral in-app TTS for NLT only while licensed.
- **NASB:** Older editions' notices say 500 verses — use current lockman.org wording.
- **NRSVue:** Ecumenical; editions with Apocrypha exist. RSV-2CE permissions are with Ignatius Press, not NCC.
- **GNT:** GNT-specific page not read; ABS policy assumed identical to CEV until confirmed.
- **NABRE:** Main US Catholic liturgical-study Bible; terms to be requested.
- **OSB:** Most-used English Orthodox Bible; LXX-based OT. Study notes are separate copyrighted content.
- **EOB-NT:** Based on the 1904 Patriarchal Greek text. Do not use until licence confirmed.

### Telugu

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Telugu 2019 (**IRVTel**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,129 v; NT 27 / 260 / 7,875 | [eBible `tel2017`](https://ebible.org/details.php?id=tel2017) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Telugu Old Version (పరిశుద్ధ గ్రంథము O.V.) (**TELUBSI**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | 'Used by permission. All rights reserved worldwide.' | **PERMISSION REQUIRED** | V1.1-LIC |
| Telugu Easy-to-Read Version (**TERV**) | World Bible Translation Center | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 22,851 v; NT 27 / 260 / 7,901 | [eBible `tel2010`](https://ebible.org/details.php?id=tel2010) | eBible set | Copyright; not marked redistributable on eBible | **PERMISSION REQUIRED** | LATER |

- **IRVTel:** Only open-licence complete Telugu Bible found. NT has 7,875 verse records vs KJV 7,957 — verse bridges/omissions must be mapped, not assumed. Audio: 'Telugu Indian Revised Audio Version' listed as CC BY-SA 4.0 (Davar Partners Intl. & BCS, 2022) on bible.com.
- **TELUBSI:** Traditional Telugu Bible (Jewett lineage, 1880s; BSI editions). Highest-value permission request for Telugu users.

### Hindi

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Hindi 2019 (**IRVHin**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `hin2017`](https://ebible.org/details.php?id=hin2017) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Hindi Contemporary Version (**HCV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,132 v; NT 27 / 260 / 7,955 | [eBible `hincv`](https://ebible.org/details.php?id=hincv) | eBible set | CC BY-SA 4.0 + Biblica trademark conditions | **VERIFIED** | OPTIONAL |
| Hindi O.V. (BSI) (**HOV**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | Not read | **PERMISSION REQUIRED** | V1.1-LIC |
| Hindi Easy-to-Read Version (**HERV**) | World Bible Translation Center | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 22,849 v; NT 27 / 260 / 7,923 | [eBible `hin2010`](https://ebible.org/details.php?id=hin2010) | eBible set | Copyright; not redistributable on eBible | **PERMISSION REQUIRED** | LATER |

- **HCV:** Treat AI use conservatively: apply Biblica AI policy principles (human review, disclosure, verbatim quotes) even though this is a CC text.

### Tamil

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Tamil (**IRVTam**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958 | [eBible `tam2017`](https://ebible.org/details.php?id=tam2017) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Biblica Open Tamil Contemporary Version (**TCV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,144 v; NT 27 / 260 / 7,958 | [eBible `tamtcv`](https://ebible.org/details.php?id=tamtcv) | eBible set | Expected CC BY-SA 4.0 (Biblica open text) — page not read | **NOT VERIFIED** | OPTIONAL |
| Tamil O.V. (BSI, Union Version lineage) (**TAOVBSI**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | 'Used by permission'; BSI custodian of text | **PERMISSION REQUIRED** | V1.1-LIC |

### Kannada

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Kannada (**IRVKan**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,141 v; NT 27 / 260 / 7,890 | [eBible `kan2017`](https://ebible.org/details.php?id=kan2017) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Kannada Open Contemporary Version (**KCV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,138 v; NT 27 / 260 / 7,952 | [eBible `kanokcv`](https://ebible.org/details.php?id=kanokcv) | eBible set | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | OPTIONAL |
| Kannada Bible (BSI) (**KANBSI**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | Not read | **PERMISSION REQUIRED** | V1.1-LIC |

- **IRVKan:** NT 7,890 verse records vs 7,957 (KJV) — check bridges.
- **KCV:** eBible copyright string shows '1999, 2929, 2922' — a data-entry error to report.

### Malayalam

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Malayalam (**IRVMal**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,139 v; NT 27 / 260 / 7,955 | [eBible `mal`](https://ebible.org/details.php?id=mal) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Sathyavedapusthakam 1910 (contemporary orthography) (**MAL1910**) | The Free Bible Foundation (revision); 1910 base text public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,142 v; NT 27 / 260 / 7,956 | [eBible `mal2015`](https://ebible.org/details.php?id=mal2015) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Malayalam Contemporary Bible (**MCV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,061 v; NT 27 / 260 / 7,879 | [eBible `malc`](https://ebible.org/details.php?id=malc) | eBible set | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | OPTIONAL |
| POC Bible (Revised 2025) (**POC**) | Kerala Catholic Bishops' Council — Pastoral Orientation Centre | Catholic (73) | Not checked | — | API / print only | — | Not read | **PERMISSION REQUIRED** | V1.1-LIC |
| Malayalam O.V. (BSI Kerala Auxiliary) (**MALOV**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | Not read | **PERMISSION REQUIRED** | LATER |

- **MAL1910:** Closest open text to the traditional Malayalam O.V. used by many Protestant and Syrian churches.
- **POC:** Main Catholic Malayalam Bible; revised edition published 3 June 2025 (news report).

### Bengali

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Bengali (**IRVBen**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,951 | [eBible `benirv`](https://ebible.org/details.php?id=benirv) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Open Bengali Contemporary Version (**OBCV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,144 v; NT 27 / 260 / 7,956 | [eBible `benobcv`](https://ebible.org/details.php?id=benobcv) | eBible set | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | OPTIONAL |
| Bengali Bible (BSI) (**BENBSI**) | Bible Society of India | Protestant (66) | Not checked | — | API / print only | — | Not read | **PERMISSION REQUIRED** | LATER |

### Spanish

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Reina-Valera 1909 (**RV1909**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `spaRV1909`](https://ebible.org/details.php?id=spaRV1909) | eBible set | Public domain | **VERIFIED** | CORE |
| Biblia Libre para el Mundo (Spanish Free Bible for the World) (**BLM**) | Public domain | Ecumenical / with Apocrypha | Full Bible +15 DC | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958; DC 15 / 213 / 6,955 | [eBible `spablm`](https://ebible.org/details.php?id=spablm) | eBible set | Public domain | **VERIFIED** | CORE |
| La Biblia en Español Sencillo (**BES**) | AudioBiblia.org / Irma Flores | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,144 v; NT 27 / 260 / 7,957 | [eBible `spabes`](https://ebible.org/details.php?id=spabes) | eBible set | Labelled 'Public Domain' on eBible; no rights statement from publisher found | **NOT VERIFIED** | LATER |
| Reina-Valera 1960 (**RVR1960**) | Sociedades Bíblicas Unidas (trademark) | Protestant (66) | Not checked | — | API / print only | — | All rights reserved; trademark used only under licence | **PERMISSION REQUIRED** | V1.1-LIC |
| La Biblia de las Américas (**LBLA**) | The Lockman Foundation | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958 | [eBible `spaLBLA`](https://ebible.org/details.php?id=spaLBLA) | eBible set | Copyright; not redistributable | **PERMISSION REQUIRED** | LATER |

- **BLM:** Includes 15 deuterocanon books — gives Spanish Catholic/Orthodox canon coverage.
- **RVR1960:** Most widely used Spanish Protestant Bible.

### Portuguese

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Bíblia Livre (**BLIVRE**) | Diego Santos, Mario Sérgio, Marco Teles | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `porbr2018`](https://ebible.org/details.php?id=porbr2018) | eBible set | CC BY 4.0 Brasil | **VERIFIED** | CORE |
| World Portuguese Bible (**WPB**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958 | [eBible `porbrbsl`](https://ebible.org/details.php?id=porbrbsl) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Almeida (ARA / ARC / NAA) editions (**ARA**) | Sociedade Bíblica do Brasil | Protestant (66) | Not checked | — | API / print only | — | Not read | **NOT VERIFIED** | LATER |

- **ARA:** Most familiar Portuguese texts; request terms.

### French

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Louis Segond 1910 (**LSG**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,211 v; NT 27 / 260 / 7,959 | [eBible `fraLSG`](https://ebible.org/details.php?id=fraLSG) | eBible set | Public domain | **VERIFIED** | CORE |
| Néo-Crampon Libre (**NCL**) | Fraternité de Tibériade | Catholic (73) | Full Bible +7 DC | OT 39 bk / 937 ch / 23,487 v; NT 27 / 260 / 7,957; DC 7 / 137 / 4,085 | [eBible `francl`](https://ebible.org/details.php?id=francl) | eBible set | CC BY-SA 4.0 | **VERIFIED** | CORE |
| Ostervald (**OST**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,149 v; NT 27 / 260 / 7,958 | [eBible `fra_fob`](https://ebible.org/details.php?id=fra_fob) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Sainte Bible Libre pour le Monde (**SBLM**) | Public domain | Ecumenical / with Apocrypha | Full Bible +15 DC | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958; DC 15 / 214 / 6,955 | [eBible `frasbl`](https://ebible.org/details.php?id=frasbl) | eBible set | Public domain | **VERIFIED** | OPTIONAL |

- **LSG:** OT has 23,211 verse records vs 23,145 KJV — French/Hebrew-style numbering in places.
- **NCL:** Catholic (7 deuterocanon books). Source maintained on GitLab (CrossWire).
- **SBLM:** 15 deuterocanon books.

### Arabic

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Smith & Van Dyck (**SVD**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `arb-vd`](https://ebible.org/details.php?id=arb-vd) | eBible set | Public domain | **VERIFIED** | CORE |
| New Arabic Version (Ketab El Hayat) (**NAV**) | Biblica, Inc. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,958 | [eBible `arbnav`](https://ebible.org/details.php?id=arbnav) | eBible set | CC BY-SA 4.0 + Biblica trademark conditions | **VERIFIED** | OPTIONAL |

- **SVD:** Right-to-left; classical Arabic; widely used.

### Chinese (Simplified)

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Chinese Union Version (simplified) (**CUVS**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,081 v; NT 27 / 260 / 7,940 | [eBible `cmn-cu89s`](https://ebible.org/details.php?id=cmn-cu89s) | eBible set | Public domain | **VERIFIED** | CORE |
| Chinese Union Version (traditional) (**CUVT**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,081 v; NT 27 / 260 / 7,940 | [eBible `cmn-cu89t`](https://ebible.org/details.php?id=cmn-cu89t) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Chinese New Version (**CNV**) | Worldwide Bible Society | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,134 v; NT 27 / 260 / 7,942 | [eBible `cmn-ncvs`](https://ebible.org/details.php?id=cmn-ncvs) | eBible set | Copyright; not redistributable | **PERMISSION REQUIRED** | LATER |

- **CUVS:** 1919 text. Later re-punctuated/revised CUV editions are separately copyrighted — import only the eBible PD file.

### Indonesian

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Alkitab Yang Terbuka (**AYT**) | Yayasan Lembaga SABDA (YLSA) | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `indayt`](https://ebible.org/details.php?id=indayt) | eBible set | eBible page inconsistent: names CC BY-ND 4.0, links CC BY-NC 4.0, lists BY-NC-SA | **RESTRICTED** | CORE-IF-NONCOMMERCIAL |
| Terjemahan Baru (**TB**) | Lembaga Alkitab Indonesia | Protestant (66) | Not checked | — | API / print only | — | 'Released for non-profit scholarly and personal use. Not to be sold for profit.' | **PERMISSION REQUIRED** | V1.1-LIC |
| Terjemahan Sederhana Indonesia (TSI) (**TSI**) | Yayasan Alkitab BahasaKita (Albata) | Protestant (66) | OT (partial) + NT | OT 14 bk / 308 ch / 8,163 v; NT 27 / 260 / 7,690 | [eBible `ind`](https://ebible.org/details.php?id=ind) | eBible set | Not read | **NOT VERIFIED** | LATER |

- **AYT:** Only complete open Indonesian Bible found. Non-commercial at best. Ask YLSA to confirm licence and AI/embedding use before import.
- **TB:** Standard Indonesian Protestant Bible.
- **TSI:** Partial OT (14 books) + NT.

### German

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Lutherbibel 1912 (**LUT1912**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `deu1912`](https://ebible.org/details.php?id=deu1912) | eBible set | Public domain | **VERIFIED** | CORE |
| Elberfelder (unrevised, 1905) (**ELB1905**) | Public domain | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `deuelo`](https://ebible.org/details.php?id=deuelo) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Schlachter 1951 (**SCH1951**) | Genfer Bibelgesellschaft | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `deu1951`](https://ebible.org/details.php?id=deu1951) | eBible set | CC BY 4.0 | **VERIFIED** | OPTIONAL |

- **LUT1912:** Later Luther revisions (1984, 2017) are copyrighted by the Deutsche Bibelgesellschaft.
- **SCH1951:** Commercial use not addressed explicitly on the page; CC BY 4.0 itself permits it.

### Urdu

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Urdu (**IRVUrd**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `urd`](https://ebible.org/details.php?id=urd) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

- **IRVUrd:** bible.com lists Urdu IRV as 'Urdu (Devanagari)' — it is not in Perso-Arabic script. A Perso-Arabic Urdu text (Urdu Geo Version, urdgvu) exists; licence not read.

### Marathi

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Marathi (**IRVMar**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,143 v; NT 27 / 260 / 7,944 | [eBible `mar`](https://ebible.org/details.php?id=mar) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

### Gujarati

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Gujarati (**IRVGuj**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `guj2017`](https://ebible.org/details.php?id=guj2017) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

### Punjabi

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Punjabi (**IRVPan**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `pan`](https://ebible.org/details.php?id=pan) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

### Odia

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Odia (**IRVOdi**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,959 | [eBible `ory`](https://ebible.org/details.php?id=ory) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

### Assamese

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Indian Revised Version (IRV) Assamese (**IRVAsm**) | Bridge Connectivity Solutions Pvt. Ltd. | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,137 v; NT 27 / 260 / 7,955 | [eBible `asmfb`](https://ebible.org/details.php?id=asmfb) | eBible set | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | LATER |

### Nepali

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Nepali Bible (Unlocked) (**NPIULB**) | Door43 World Missions Community | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,145 v; NT 27 / 260 / 7,957 | [eBible `npiulb`](https://ebible.org/details.php?id=npiulb) | eBible set | Expected CC BY-SA 4.0 (Door43) — page not read | **NOT VERIFIED** | LATER |

### Swahili

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Swahili Unlocked Literal Bible (**SWHULB**) | Door43 World Missions Community | Protestant (66) | Full Bible | OT 39 bk / 929 ch / 23,143 v; NT 27 / 260 / 7,958 | [eBible `swhulb`](https://ebible.org/details.php?id=swhulb) | eBible set | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | LATER |

### Korean

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| (No open complete Korean Bible found in the eBible snapshot) (**—**) | Korean Bible Society holds the main editions | Protestant (66) | Not checked | — | API / print only | — | — | **NOT VERIFIED** | GAP |

### Latin

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Clementine Vulgate (1598) (**VUL**) | Public domain | Catholic (73) | Full Bible +7 DC | OT 39 bk / 937 ch / 23,483 v; NT 27 / 260 / 7,951; DC 7 / 137 / 4,375 | [eBible `latVUC`](https://ebible.org/details.php?id=latVUC) | eBible set | Public domain | **VERIFIED** | OPTIONAL |

- **VUL:** Reference for Vulgate versification.

### Greek (Koine)

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Septuagint (Brenton's Greek text) (**LXX**) | Public domain | Eastern Orthodox (LXX-based) | OT only +16 DC | OT 36 bk / 908 ch / 22,561 v; NT 0 / 0 / 0; DC 16 / 196 / 6,036 | [eBible `grcbrent`](https://ebible.org/details.php?id=grcbrent) | eBible set | Public domain | **VERIFIED** | OPTIONAL |
| Byzantine Greek New Testament (**BYZ**) | Public domain | Eastern Orthodox (LXX-based) | NT only | OT 0 bk / 0 ch / 0 v; NT 27 / 260 / 7,958 | [eBible `grcbyz`](https://ebible.org/details.php?id=grcbyz) | eBible set | Public domain | **VERIFIED** | OPTIONAL |

### Hebrew

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Westminster Leningrad Codex (**WLC**) | Public domain | Hebrew Bible (Tanakh) | OT only | OT 39 bk / 929 ch / 23,213 v; NT 0 / 0 / 0 | [eBible `hboWLC`](https://ebible.org/details.php?id=hboWLC) | eBible set | Public domain | **VERIFIED** | OPTIONAL |

- **WLC:** Hebrew (MT) versification reference; right-to-left with vowel points.

### Amharic

| Edition (abbr) | Copyright owner / publisher | Tradition | Coverage | Counts (eBible snapshot) | Source / download | Formats | Licence | Status | V1 role |
|---|---|---|---|---|---|---|---|---|---|
| Amharic New Testament (**AMHNT**) | United Bible Societies | Oriental Orthodox | NT only | OT 0 bk / 0 ch / 0 v; NT 27 / 260 / 7,369 | [eBible `amh`](https://ebible.org/details.php?id=amh) | eBible set | Copyright © 1962, 2003 UBS; marked redistributable on eBible; licence not read | **NOT VERIFIED** | LATER |

- **AMHNT:** No open complete 81-book Ethiopian Orthodox Bible found.

## 6. Gaps and follow-up research

| # | Gap | Why it matters | Next step | Owner |
|---|---|---|---|---|
| G-1 | BSI O.V. texts (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali) | These are the Bibles most Indian Protestant congregations read aloud; many users will expect them | Formal permission request to Bible Society of India (template in `BIBLE_LICENSING_MATRIX.md` §6) | Human lead |
| G-2 | Indonesian open Bible with a clear licence | Only AYT (licence inconsistent, non-commercial) is available | Ask YLSA to confirm AYT terms; ask LAI about TB licensing | Human lead |
| G-3 | Modern English (NIV/ESV/NLT etc.) | Many English readers expect them; brief's examples include NIV | Decide commercial model first (D-001), then apply via YouVersion Platform / API.Bible / publishers | Human lead |
| G-4 | Indian-language Catholic Bibles (POC Malayalam; Telugu, Hindi, Tamil Catholic editions) | Catholic users need their canon in their language | Contact KCBC/POC and the CBCI Commission for the Bible | Human lead |
| G-5 | Ethiopian (81-book), Syriac (Peshitta), Armenian, Coptic full Bibles | Required to honour Oriental Orthodox canons beyond metadata | Research partners; V2 | Research |
| G-6 | Korean | Listed as a future UI language; no open complete Bible found | Contact Korean Bible Society; consider later | Research |
| G-7 | Licence pages for Biblica open versions in Tamil/Kannada/Malayalam/Bengali, the other IRV languages, Door43 texts | Marked NOT VERIFIED | Read each eBible about page at import; gate import on result (OC-02) | OpenCode |
| G-8 | Audio | Telugu IRV audio is CC BY-SA 4.0 per bible.com; other audio rights unknown | Build audio catalogue in V1.1 (Bible Brain, IRV audio, BSB audio) | Research |

## 7. Sources (checked 2026-11-21)

- eBible.org copyright list — https://ebible.org/Scriptures/copyright.php
- eBible Telugu IRV details — https://ebible.org/details.php?id=tel2017 ; about — https://ebible.org/study/content/texts/tel2017/about.html
- eBible about pages read live: hin2017, tam2017, kan2017, mal, benirv, hincv, arbnav, francl, deu1951, mal2015, porbr2018, indayt, spabes — https://ebible.org/study/content/texts/{id}/about.html
- eBible catalogue metadata mirror — https://raw.githubusercontent.com/BibleNLP/ebible/main/metadata/translations.csv (snapshot; newest row 2024-07-18)
- eBible KJV notes — https://ebible.org/engkjvcpb/copyright.htm ; https://ebible.org/study/content/texts/eng-kjv2006/about.html
- Cambridge University Press KJV rights statement — https://assets.cambridge.org/97805212/28626/copyright/9780521228626_copyright_info.pdf
- YouVersion Telugu IRV — https://bible.com/versions/1895 ; audio — https://www.bible.com/gu/audio-bible-app-versions/1895-irvtel-indian-revised-version-(irv)-telugu---2019
- YouVersion BSI Telugu O.V. — https://www.bible.com/versions/1787 ; Tamil O.V. — https://www.bible.com/da/versions/339
- YouVersion Platform developer docs — https://developers.youversion.com/overview ; https://developers.youversion.com/api-usage
- API.Bible terms — https://api.bible/terms-and-conditions ; caching — https://care.api.bible/article/401-caching-content ; licensing — https://care.api.bible/article/396-licensing-policies-quick-reference
- ESV API — https://api.esv.org/ ; Crossway permissions — https://www.crossway.org/rights-and-permissions/esv/
- Biblica permissions — https://www.biblica.com/permissions/ ; Biblica AI & ML policy v1.2 — https://www.biblica.com/?p=31960
- Tyndale permissions — https://www.tyndale.com/permissions
- Lockman Foundation — https://lockman.org/?p=3
- Friendship Press (NRSVue) — https://friendshippress.org/bible-licensing
- NET Bible copyright — https://netbible.com/?p=530 ; HarperCollins Christian permissions — https://www.harpercollinschristian.com/permissions/
- ABS CEV licensing — https://cev.bible/?p=161
- Berean Bible terms — https://berean.bible/terms.htm
- Bible Brain — https://www.faithcomesbyhearing.com/bible-brain ; licence — https://www.faithcomesbyhearing.com/bible-brain/license
- Reina-Valera 1960 notice — https://m.biblegateway.com/versions/Reina-Valera-1960-RVR1960-Biblia/
- LAI Terjemahan Baru notice — https://copyright.sabda.org/content.php
- Malayalam translations overview — https://en.wikipedia.org/wiki/Bible_translations_into_Malayalam ; Revised POC Bible news — https://www.syromalankara.church/revised-poc-bible-published-a-historic-moment-for-the-kerala-catholic-community-2025-06-03.html
- Telugu translations overview — https://en.wikipedia.org/wiki/Bible_translations_into_Telugu
- Orthodox Study Bible front matter — https://g.christianbook.com/g/netstorage/pdf/sample/003590.pdf
- USFM / USX / USFX — https://ubsicap.github.io/usfm/ ; https://ebible.org/usfx/ ; usfm3 parser — https://pypi.org/project/usfm3/

## OC-02 pilot catalogue addendum · 2026-11-23

The original 81-edition research snapshot above is preserved. The official book indexes confirmed 66 books each for KJV, WEB, BSB, Telugu IRV and Hindi IRV, and 73 for the 1899 American Douay-Rheims. The pilot acquired the unchanged USFM archives for WEB, BSB, Douay-Rheims and the two IRVs. The KJV 1769 source includes Strong's numbers and has a UK territorial hold. Full archive hashes, measured counts, publisher credits, source dates and exact edition URLs are in the [OC-02 report](OC-02_REPORT.md) and [rights registry](../data/rights/edition_rights.json).
