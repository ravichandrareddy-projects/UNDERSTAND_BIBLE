# BIBLE LICENSING MATRIX

**Status:** Draft for human review · **Research date:** 2026-11-21 · **Not legal advice** — the human lead should have counsel review items marked LR-n before launch.

## 1. Status definitions

| Label | Meaning | What the platform may do |
|---|---|---|
| **VERIFIED** | The licence statement was read on the rights holder's or official distributor's page (or eBible's own catalogue) and the intended uses are permitted, subject to attribution | Import into the local corpus after the import-time re-check (gate G-LIC-1) |
| **NOT VERIFIED** | No primary licence text was read (page not found, unreadable, or only secondary sources) | Nothing beyond linking out. Must be resolved before import |
| **RESTRICTED** | Licence read; use is allowed only within limits (non-commercial, verse caps, caching windows, DRM, no AI) | Only the uses the limits allow; enforced by the licence policy engine |
| **PERMISSION REQUIRED** | Rights holder known; the intended use (full-text hosting, app use, AI, offline, commercial) needs a written licence | Short quotations within the publisher's gratis limit at most; full use only after a signed licence is stored in the repository |

**Cell codes:** `Y` permitted · `C` conditional — see notes · `PR` written permission/licence required · `N` not permitted · `?` not verified.

**Import-time gate G-LIC-1:** licences change (eBible itself warns that owner data may be out of date). The import pipeline must fetch the edition's live licence page, store a dated copy and hash, and refuse import if the licence text differs from the approved record until a human re-approves (OpenCode task OC-02).

## 2. How the open licences apply to our features

| Feature | Public domain | CC BY 4.0 | CC BY-SA 4.0 | CC BY-NC / ND variants |
|---|---|---|---|---|
| Display online, host, offline download | Yes | Yes, with attribution | Yes, with attribution; redistributed copies stay CC BY-SA | Non-commercial only; ND forbids adaptations |
| Commercial product | Yes (UK print caveat for KJV) | Yes | Yes | **No** (NC) |
| Search index (exact/keyword) | Yes | Yes | Yes — index is internal processing | Non-commercial only |
| Embeddings / vector index | Yes | Yes (LR-1) | Yes; whether vectors are 'adapted material' is untested — treat embeddings as internal and never redistribute them (LR-1) | Unclear → ask rights holder |
| Sending text to an LLM to write explanations | Yes | Yes; attribute quoted text (LR-2) | Yes; quoted verses keep CC BY-SA attribution; explanations are new commentary, but if an output reproduces or adapts the text substantially it may be ShareAlike material (LR-2). External AI providers must be contractually barred from training on submitted text | Ask rights holder |
| Text-to-speech audio | Yes | Yes, attribute in audio and on page | Yes; resulting audio is an adaptation → release under CC BY-SA with attribution (LR-4) | ND forbids; NC limits |
| Modifying text (normalising punctuation, fixing markup) | Yes | Allowed; mark changes | Allowed; mark changes; ShareAlike | ND forbids |

Platform rule regardless of licence: **Scripture text is displayed verbatim from the stored source.** Normalisation for search is done in separate index columns and never shown as the text.

## 3. Matrix — all researched editions

| Edition | Lang | Owner | Licence | Status | Display online | Host on our servers | Offline redistribution | Commercial use | AI retrieval & processing | Embedding / vector index | Audio / TTS | Attribution | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **KJV** King James Version (1769 standard text) | en | Public domain (Crown rights in the UK) | Public domain outside the UK; UK Crown letters patent | **VERIFIED** | Y | Y | Y | C | Y | Y | Y | None required; show 'KJV (public domain)' | eBible about/copyright pages; Cambridge UP copyright page |
| **KJVA** King James Version + Apocrypha | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | C | Y | Y | Y | None required | eBible copyright page |
| **WEB** World English Bible | en | Public domain (eBible.org) | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None required; do not call a modified text 'WEB' (trademark note — confirm on ebible.org) | eBible catalogue |
| **WEB+DC** World English Bible with Deuterocanon | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None required | eBible catalogue |
| **WEBC** World English Bible (Catholic) | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None required | eBible catalogue |
| **BSB** Berean Standard Bible | en | BSB Publishing / Berean Bible committee — dedicated to public domain 30 Apr 2023 | Public domain dedication | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | Appreciated, not required | berean.bible terms page |
| **ASV** American Standard Version (1901) | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **DRA** Douay-Rheims (1899 American edition) | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **LXX-E** Brenton English Septuagint | en | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **NET** New English Translation (NET Bible) | en | Biblical Studies Press, L.L.C. | Publisher 'ministry first' terms; commercial use via HarperCollins Christian | **RESTRICTED** | C | ? | ? | PR | ? | ? | C | '(NET)' after quotes; hyperlink 'NET' to netbible.org in internet apps; full notice | netbible.com copyright pages; HarperCollins permissions page |
| **NIV** New International Version (2011) | en | Biblica, Inc. | All rights reserved; ≤500 verses gratis; express licence via YouVersion Platform; commercial via HarperCollins (US/CA) / Hodder (UK/EU) | **PERMISSION REQUIRED** | C | N | N | PR | PR | PR | PR | Biblica notice; '(NIV)' after quotes | biblica.com/permissions; Biblica AI & ML policy v1.2 (eff. 1 Jun 2026) |
| **ESV** English Standard Version | en | Crossway (Good News Publishers) | All rights reserved; ESV API free for non-commercial use | **RESTRICTED** | C | N | N | PR | PR | N | PR | Copyright notice sent with text; '(ESV)' with quotations | api.esv.org; crossway.org permissions |
| **NLT** New Living Translation | en | Tyndale House Publishers | All rights reserved; ≤500 verses fair use | **PERMISSION REQUIRED** | C | N | PR | PR | PR | PR | C | Tyndale notice; '(NLT)' | tyndale.com/permissions; Tyndale FAQ; API.Bible T&C §9.10 |
| **NASB** New American Standard Bible (1995 / 2020) | en | The Lockman Foundation | All rights reserved; up to 1,000 verses without permission (current lockman.org text) | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | Full notice; on web/apps 'lockman.org' must be a clickable link | lockman.org permission-to-quote page |
| **CSB** Christian Standard Bible | en | Holman Bible Publishers (Lifeway) | All rights reserved; HCSB notice allows ≤1,000 verses — current CSB policy not read | **NOT VERIFIED** | C | PR | PR | PR | PR | PR | PR | CSB credit line | bible.com HCSB notice (secondary for CSB) |
| **NKJV** New King James Version | en | Thomas Nelson (HarperCollins Christian) | All rights reserved; ≤500 verses; API.Bible non-commercial use capped at 5,000 monthly end users | **RESTRICTED** | C | N | C | PR | PR | PR | PR | Thomas Nelson notice | HarperCollins Christian permissions; API.Bible T&C §9.11 |
| **NRSVue** New Revised Standard Version Updated Edition | en | National Council of Churches (Friendship Press) | All rights reserved; gratis use ≤500 verses incl. web | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | NRSVue notice; initials after quotes | friendshippress.org/bible-licensing |
| **GNT** Good News Translation | en | American Bible Society | All rights reserved; ABS fair-use ≤500 verses; apps/websites need written permission | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | C | ABS notice | ABS policy as published for CEV (cev.bible); API.Bible T&C §9.10 |
| **CEV** Contemporary English Version | en | American Bible Society | All rights reserved; ≤500 verses; mobile apps and websites need written permission | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | C | ABS notice | cev.bible licensing page; API.Bible T&C §9.10 |
| **NABRE** New American Bible, Revised Edition | en | Confraternity of Christian Doctrine (USCCB) | All rights reserved | **NOT VERIFIED** | C | PR | PR | PR | PR | PR | PR | — | Not read this session |
| **RSV-2CE** Revised Standard Version, Second Catholic Edition | en | Ignatius Press (licensed from NCC) | All rights reserved | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | friendshippress.org (refers RSV-2CE to Ignatius) |
| **OSB** Orthodox Study Bible (SAAS OT + NKJV NT) | en | St Athanasius Academy / Thomas Nelson | All rights reserved; SAAS OT quotable within stated limits | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | SAAS / NKJV notices | OSB front matter sample (christianbook.com PDF) |
| **EOB-NT** Eastern / Greek Orthodox Bible: New Testament | en | Laurent Cleenewerck (ed.) | Unknown | **NOT VERIFIED** | ? | ? | ? | ? | ? | ? | ? | — | Copies circulate (archive.org); licence not found |
| **IRVTel** Indian Revised Version (IRV) Telugu 2019 | te | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21); bible.com version page |
| **TELUBSI** Telugu Old Version (పరిశుద్ధ గ్రంథము O.V.) | te | Bible Society of India | 'Used by permission. All rights reserved worldwide.' | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | BSI notice | bible.com version & audio pages |
| **TERV** Telugu Easy-to-Read Version | te | World Bible Translation Center | Copyright; not marked redistributable on eBible | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | eBible catalogue |
| **IRVHin** Indian Revised Version (IRV) Hindi 2019 | hi | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21) |
| **HCV** Hindi Contemporary Version | hi | Biblica, Inc. | CC BY-SA 4.0 + Biblica trademark conditions | **VERIFIED** | Y | Y | Y | Y | C | C | C | Keep Biblica® mark only on unmodified copies; if modified remove mark, describe changes and use Biblica's attribution sentence | eBible about page (live) |
| **HOV** Hindi O.V. (BSI) | hi | Bible Society of India | Not read | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | Rights holder known; terms not read |
| **HERV** Hindi Easy-to-Read Version | hi | World Bible Translation Center | Copyright; not redistributable on eBible | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | eBible catalogue |
| **IRVTam** Indian Revised Version (IRV) Tamil | ta | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21) (source files dated 12 Mar 2026) |
| **TCV** Biblica Open Tamil Contemporary Version | ta | Biblica, Inc. | Expected CC BY-SA 4.0 (Biblica open text) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | As Biblica open texts | eBible catalogue only |
| **TAOVBSI** Tamil O.V. (BSI, Union Version lineage) | ta | Bible Society of India | 'Used by permission'; BSI custodian of text | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | BSI notice | bible.com version page |
| **IRVKan** Indian Revised Version (IRV) Kannada | kn | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21) |
| **KCV** Kannada Open Contemporary Version | kn | Biblica, Inc. | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | As Biblica open texts | eBible catalogue only |
| **KANBSI** Kannada Bible (BSI) | kn | Bible Society of India | Not read | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | Rights holder known; terms not read |
| **IRVMal** Indian Revised Version (IRV) Malayalam | ml | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21) |
| **MAL1910** Sathyavedapusthakam 1910 (contemporary orthography) | ml | The Free Bible Foundation (revision); 1910 base text public domain | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright/source line; mark changes; ShareAlike | eBible about page (live) |
| **MCV** Malayalam Contemporary Bible | ml | Biblica, Inc. | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | As Biblica open texts | eBible catalogue only |
| **POC** POC Bible (Revised 2025) | ml | Kerala Catholic Bishops' Council — Pastoral Orientation Centre | Not read | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | Rights holder known (KCBC/POC); terms not read |
| **MALOV** Malayalam O.V. (BSI Kerala Auxiliary) | ml | Bible Society of India | Not read | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | Rights holder known |
| **IRVBen** Indian Revised Version (IRV) Bengali | bn | Bridge Connectivity Solutions Pvt. Ltd. | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible about page (live, read 2026-11-21) |
| **OBCV** Open Bengali Contemporary Version | bn | Biblica, Inc. | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | As Biblica open texts | eBible catalogue only |
| **BENBSI** Bengali Bible (BSI) | bn | Bible Society of India | Not read | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | Rights holder known |
| **RV1909** Reina-Valera 1909 | es | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **BLM** Biblia Libre para el Mundo (Spanish Free Bible for the World) | es | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **BES** La Biblia en Español Sencillo | es | AudioBiblia.org / Irma Flores | Labelled 'Public Domain' on eBible; no rights statement from publisher found | **NOT VERIFIED** | ? | ? | ? | ? | ? | ? | ? | — | eBible about page (live) |
| **RVR1960** Reina-Valera 1960 | es | Sociedades Bíblicas Unidas (trademark) | All rights reserved; trademark used only under licence | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | SBU notice | biblegateway.com version page |
| **LBLA** La Biblia de las Américas | es | The Lockman Foundation | Copyright; not redistributable | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | eBible catalogue |
| **BLIVRE** Bíblia Livre | pt | Diego Santos, Mario Sérgio, Marco Teles | CC BY 4.0 Brasil | **VERIFIED** | Y | Y | Y | Y | C | C | C | Credit holders and source; cite version date; mark changes | eBible about page (live) |
| **WPB** World Portuguese Bible | pt | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **ARA** Almeida (ARA / ARC / NAA) editions | pt | Sociedade Bíblica do Brasil | Not read | **NOT VERIFIED** | C | PR | PR | PR | PR | PR | PR | — | Not read this session |
| **LSG** Louis Segond 1910 | fr | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **NCL** Néo-Crampon Libre | fr | Fraternité de Tibériade | CC BY-SA 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright/source line; mark changes; ShareAlike | eBible about page (live) |
| **OST** Ostervald | fr | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **SBLM** Sainte Bible Libre pour le Monde | fr | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **SVD** Smith & Van Dyck | ar | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **NAV** New Arabic Version (Ketab El Hayat) | ar | Biblica, Inc. | CC BY-SA 4.0 + Biblica trademark conditions | **VERIFIED** | Y | Y | Y | Y | C | C | C | As Biblica open texts | eBible about page (live) |
| **CUVS** Chinese Union Version (simplified) | zh-Hans | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **CUVT** Chinese Union Version (traditional) | zh-Hant | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **CNV** Chinese New Version | zh-Hans | Worldwide Bible Society | Copyright; not redistributable | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | — | eBible catalogue |
| **AYT** Alkitab Yang Terbuka | id | Yayasan Lembaga SABDA (YLSA) | eBible page inconsistent: names CC BY-ND 4.0, links CC BY-NC 4.0, lists BY-NC-SA | **RESTRICTED** | C | C | C | N | ? | ? | ? | Copyright/source line; 'AYT' is a trademark | eBible about page (live) |
| **TB** Terjemahan Baru | id | Lembaga Alkitab Indonesia | 'Released for non-profit scholarly and personal use. Not to be sold for profit.' | **PERMISSION REQUIRED** | C | PR | PR | PR | PR | PR | PR | Acknowledge LAI as copyright holder | copyright.sabda.org |
| **TSI** Terjemahan Sederhana Indonesia (TSI) | id | Yayasan Alkitab BahasaKita (Albata) | Not read | **NOT VERIFIED** | ? | ? | ? | ? | ? | ? | ? | — | eBible catalogue only |
| **LUT1912** Lutherbibel 1912 | de | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **ELB1905** Elberfelder (unrevised, 1905) | de | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **SCH1951** Schlachter 1951 | de | Genfer Bibelgesellschaft | CC BY 4.0 | **VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright/source line; mark changes | eBible about page (live) |
| **IRVUrd** Indian Revised Version (IRV) Urdu | ur | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **IRVMar** Indian Revised Version (IRV) Marathi | mr | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **IRVGuj** Indian Revised Version (IRV) Gujarati | gu | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **IRVPan** Indian Revised Version (IRV) Punjabi | pa | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **IRVOdi** Indian Revised Version (IRV) Odia | or | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **IRVAsm** Indian Revised Version (IRV) Assamese | as | Bridge Connectivity Solutions Pvt. Ltd. | Expected CC BY-SA 4.0 (same series) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | Copyright and source line required; mark changes; ShareAlike on redistribution | eBible catalogue; bible.com shows 'Creative Commons License' |
| **NPIULB** Nepali Bible (Unlocked) | ne | Door43 World Missions Community | Expected CC BY-SA 4.0 (Door43) — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | — | eBible catalogue only |
| **SWHULB** Swahili Unlocked Literal Bible | sw | Door43 World Missions Community | Expected CC BY-SA 4.0 — page not read | **NOT VERIFIED** | Y | Y | Y | Y | C | C | C | — | eBible catalogue only |
| **—** (No open complete Korean Bible found in the eBible snapshot) | ko | Korean Bible Society holds the main editions | — | **NOT VERIFIED** | ? | ? | ? | ? | ? | ? | ? | — | eBible catalogue search returned no Korean rows |
| **VUL** Clementine Vulgate (1598) | la | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **LXX** Septuagint (Brenton's Greek text) | grc | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **BYZ** Byzantine Greek New Testament | grc | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **WLC** Westminster Leningrad Codex | hbo | Public domain | Public domain | **VERIFIED** | Y | Y | Y | Y | Y | Y | Y | None | eBible catalogue |
| **AMHNT** Amharic New Testament | am | United Bible Societies | Copyright © 1962, 2003 UBS; marked redistributable on eBible; licence not read | **NOT VERIFIED** | ? | ? | ? | ? | ? | ? | ? | — | eBible catalogue only |

### 3.1 Restrictions, notes and rights-holder contacts

| Edition | Restrictions / notes | Rights holder contact |
|---|---|---|
| **KJV** (English) | Printing or importing printed copies in the UK needs permission (Crown letters patent; Cambridge UP administers UK rights). eBible's note addresses printing only; whether UK digital display or print-to-PDF is affected is legal question LR-3. | Cambridge University Press (UK permissions) |
| **KJVA** (English) | Includes 14 Apocrypha books; useful for canon comparison. | — |
| **WEB** (English) | Modern-English PD text; good default for AI and search. | — |
| **WEB+DC** (English) | 15 deuterocanon/apocrypha books incl. Orthodox extras (1 Esdras, 3–4 Maccabees, Prayer of Manasseh, Ps 151) — allows Catholic and Eastern Orthodox canon views in English. | — |
| **WEBC** (English) | Catholic book order; Esther/Daniel with additions. | — |
| **BSB** (English) | Modern English; PD audio narration also announced (YouVersion audio page). | — |
| **DRA** (English) | Catholic; follows Vulgate numbering (e.g. Psalms numbered like the LXX/Vulgate) — strong test case for alignment. | — |
| **LXX-E** (English) | OT + deuterocanon only (no NT). Eastern Orthodox OT reading; pair with a PD NT. | — |
| **NET** (English) | Free non-commercial app use described; commercial use handled by HarperCollins (Thomas Nelson). Full-text hosting and AI use not addressed — ask BSP. | Biblical Studies Press permissions (netbible.com) |
| **NIV** (English) | Biblica says its texts are not licensed for offline/downloadable use in mobile apps and permits only latest editions. AI policy allows study tools and summaries under a licence, but forbids fully automated publishing without human review and requires AI disclosure. | Biblica (biblica.com/permissions); HarperCollins Christian Publishing; Hodder & Stoughton |
| **ESV** (English) | API: ≤500 verses per query or half a book; may not store more than 500 verses or half a book; ≤500 verses per page; non-commercial site only; users must align with Crossway's doctrinal statement. Embedding a full index is therefore not possible without a licence. | Crossway online permission form (crossway.org/permissions) |
| **NLT** (English) | Tyndale FAQ says NLT web use is limited to a few select sites. API.Bible allows ephemeral in-app TTS for NLT only while licensed. | permission@tyndale.com / Permissions Questionnaire |
| **NASB** (English) | Older editions' notices say 500 verses — use current lockman.org wording. | The Lockman Foundation permissions form |
| **CSB** (English) | — | Holman Bible Publishers, Nashville |
| **NKJV** (English) | — | HarperCollins Christian Publishing permissions |
| **NRSVue** (English) | Ecumenical; editions with Apocrypha exist. RSV-2CE permissions are with Ignatius Press, not NCC. | Friendship Press |
| **GNT** (English) | GNT-specific page not read; ABS policy assumed identical to CEV until confirmed. | American Bible Society permissions |
| **CEV** (English) | — | American Bible Society |
| **NABRE** (English) | Main US Catholic liturgical-study Bible; terms to be requested. | USCCB / CCD permissions |
| **RSV-2CE** (English) | — | Ignatius Press |
| **OSB** (English) | Most-used English Orthodox Bible; LXX-based OT. Study notes are separate copyrighted content. | Thomas Nelson / St Athanasius Academy |
| **EOB-NT** (English) | Based on the 1904 Patriarchal Greek text. Do not use until licence confirmed. | — |
| **IRVTel** (Telugu) | Only open-licence complete Telugu Bible found. NT has 7,875 verse records vs KJV 7,957 — verse bridges/omissions must be mapped, not assumed. Audio: 'Telugu Indian Revised Audio Version' listed as CC BY-SA 4.0 (Davar Partners Intl. & BCS, 2022) on bible.com. | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **TELUBSI** (Telugu) | Traditional Telugu Bible (Jewett lineage, 1880s; BSI editions). Highest-value permission request for Telugu users. | Bible Society of India (Andhra Pradesh Auxiliary, Hyderabad; HQ Bangalore) |
| **TERV** (Telugu) | — | Bible League International / WBTC |
| **IRVHin** (Hindi) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **HCV** (Hindi) | Treat AI use conservatively: apply Biblica AI policy principles (human review, disclosure, verbatim quotes) even though this is a CC text. | Biblica (open.bible) |
| **HOV** (Hindi) | — | Bible Society of India |
| **IRVTam** (Tamil) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **TAOVBSI** (Tamil) | — | The Archives, Bible Society of India, 206 M.G. Road, Bangalore |
| **IRVKan** (Kannada) | NT 7,890 verse records vs 7,957 (KJV) — check bridges. | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **KCV** (Kannada) | eBible copyright string shows '1999, 2929, 2922' — a data-entry error to report. | — |
| **IRVMal** (Malayalam) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **MAL1910** (Malayalam) | Closest open text to the traditional Malayalam O.V. used by many Protestant and Syrian churches. | — |
| **POC** (Malayalam) | Main Catholic Malayalam Bible; revised edition published 3 June 2025 (news report). | KCBC / POC, Palarivattom, Kochi |
| **IRVBen** (Bengali) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **BLM** (Spanish) | Includes 15 deuterocanon books — gives Spanish Catholic/Orthodox canon coverage. | — |
| **RVR1960** (Spanish) | Most widely used Spanish Protestant Bible. | Sociedades Bíblicas Unidas / American Bible Society |
| **ARA** (Portuguese) | Most familiar Portuguese texts; request terms. | — |
| **LSG** (French) | OT has 23,211 verse records vs 23,145 KJV — French/Hebrew-style numbering in places. | — |
| **NCL** (French) | Catholic (7 deuterocanon books). Source maintained on GitLab (CrossWire). | — |
| **SBLM** (French) | 15 deuterocanon books. | — |
| **SVD** (Arabic) | Right-to-left; classical Arabic; widely used. | — |
| **CUVS** (Chinese (Simplified)) | 1919 text. Later re-punctuated/revised CUV editions are separately copyrighted — import only the eBible PD file. | — |
| **AYT** (Indonesian) | Only complete open Indonesian Bible found. Non-commercial at best. Ask YLSA to confirm licence and AI/embedding use before import. | YLSA (sabda.org) |
| **TB** (Indonesian) | Standard Indonesian Protestant Bible. | Lembaga Alkitab Indonesia, Jakarta |
| **TSI** (Indonesian) | Partial OT (14 books) + NT. | — |
| **LUT1912** (German) | Later Luther revisions (1984, 2017) are copyrighted by the Deutsche Bibelgesellschaft. | — |
| **SCH1951** (German) | Commercial use not addressed explicitly on the page; CC BY 4.0 itself permits it. | — |
| **IRVUrd** (Urdu) | bible.com lists Urdu IRV as 'Urdu (Devanagari)' — it is not in Perso-Arabic script. A Perso-Arabic Urdu text (Urdu Geo Version, urdgvu) exists; licence not read. | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **IRVMar** (Marathi) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **IRVGuj** (Gujarati) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **IRVPan** (Punjabi) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **IRVOdi** (Odia) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **IRVAsm** (Assamese) | — | Bridge Connectivity Solutions Pvt. Ltd. (bridgeconn.com); VachanOnline |
| **VUL** (Latin) | Reference for Vulgate versification. | — |
| **WLC** (Hebrew) | Hebrew (MT) versification reference; right-to-left with vowel points. | — |
| **AMHNT** (Amharic) | No open complete 81-book Ethiopian Orthodox Bible found. | — |

## 4. Provider and API terms that override edition licences

Using a provider adds the provider's terms **on top of** the edition licence.

| Provider | Commercial | Caching / storage | Offline | AI / LLM | TTS / audio | Other duties | Status |
|---|---|---|---|---|---|---|---|
| API.Bible | Starter = non-commercial only; commercial needs Pro/Enterprise plus per-translation commercial licences; NIV not available for commercial licensing there | Cache allowed, must refresh ≤30 days; delete within 24 h on request, 72 h after termination; no systematic extraction to populate databases | Must stay ≤30 days current; DRM required; print ≤100 verses | Generative AI / LLM training **prohibited** for copyright content (incl. CC) without written consent of API.Bible **and** IP holder; embeddings not addressed | AI TTS not allowed for copyright content without consent; ephemeral TTS allowed for PD, permitted CC, and listed ABS/Tyndale texts while licensed; third-party TTS must not train on text | FUMS reporting on every web display; visible api.bible citation on Starter; no sub-licensing; no modification; NKJV ≤5,000 MAU on non-commercial plans | **RESTRICTED** (VERIFIED terms) |
| YouVersion Platform | Non-commercial only: free to users, no paywalls, no ads or sponsorships (secondary sources); new-app form reportedly says commercial applications not accepted | Not stated in docs read | Not stated | Terms reportedly say apps using a YouVersion tool shall not use AI technology that generates output for users without YouVersion's prior written approval — this could cover our UNDERSTAND feature even for open texts | Not stated | Accept per-Bible licence agreements in the portal; version credit when displaying HTML | **NOT VERIFIED** (primary terms page is JavaScript-rendered and could not be read) |
| ESV API | Non-commercial only | ≤500 verses or half a book stored | Not permitted beyond storage cap | Not addressed → ask | Not addressed | Copyright notice with each use; doctrinal-alignment condition; key revocable | **RESTRICTED** (VERIFIED terms) |
| Bible Brain (FCBH) | Licence text not read in full | Not read | Offline only where API marks content downloadable | Not read | Audio is the core offer | — | **NOT VERIFIED** |
| Biblica (licensed works) | Via HarperCollins / Hodder or Biblica | Latest editions only | Not licensed for offline/downloadable app use | AI policy v1.2: AI study tools, summaries, cross-references allowed under licence; forbids new translations/derivatives, training that can reproduce text, fully automated publishing without human review, presenting AI as God or a pastor, speculative or 'doctrinally innovative' content; requires AI disclosure, verbatim quotes, logging; 48-hour takedown | Per licence | Trademark rules | **PERMISSION REQUIRED** |

## 5. Recommended V1 licensing posture

1. **Local corpus = public domain + CC BY + CC BY-SA only** (all `CORE` editions). These are the only texts that may be stored, searched, embedded, sent to AI, read offline and turned into speech.
2. **Licensed / API editions are display-only** (V1.1) through a *Licensed Edition Adapter*: fetched live within each provider's caching rules, never embedded, never sent to an LLM, never cached offline, AI features disabled with a visible notice ("Explanations use the open-licence text; this translation is shown for reading only").
3. **Do not integrate YouVersion Platform until YouVersion confirms in writing** whether its AI clause applies to AI features that never touch YouVersion-delivered text. Until then, API.Bible or direct publisher licences are the safer route for licensed English texts (D-009).
4. **Attribution is data, not decoration.** Each edition carries its attribution template; the reader shows a short credit under each panel and a full copyright page per edition (FR-RDR-14).
5. **ShareAlike outputs:** publish our derived datasets that combine CC BY-SA sources (e.g. genealogy data merged from Theographic) under CC BY-SA 4.0 with attribution (D-012).
6. **Store evidence.** For each edition: licence URL, dated HTML/PDF snapshot, SHA-256, reviewer, date. Signed permissions go in a private `rights/` store, not the public repo.

## 6. Permission request template (for BSI, KCBC/POC, YLSA, LAI, publishers)

```text
Subject: Permission request — <edition name> in a free multilingual Bible reading platform

1. Who we are: <organisation, country, contact person>.
2. Product: web platform (and later mobile apps) for reading, comparing two translations
   side by side, searching, and daily reading plans. Operating model: <non-commercial / commercial>.
3. Edition requested: <exact title, year, edition>.
4. Uses requested (please confirm each separately):
   a. Display of the full text online, with your copyright notice on every page.
   b. Hosting the text on our own servers (no public download of the files).
   c. Offline reading inside our app (encrypted, not exportable).
   d. Full-text and meaning-based search over the text (internal index).
   e. Creating vector embeddings of verses for search (internal, never shared).
   f. Quoting verses inside AI-assisted chapter explanations that are reviewed by people
      before publication; the AI provider may not train on the text.
   g. Text-to-speech playback inside the app (not downloadable).
   h. Audio recordings you hold (if any).
5. Attribution: <proposed credit line and link>.
6. Territory: worldwide. Term: <n> years, renewable.
7. We will not alter the text; corrections will be reported to you.
8. Please tell us if a fee, reporting, or approval process applies.
```

## 7. Legal review items

| ID | Question | Why | Decision needed by |
|---|---|---|---|
| LR-1 | Are verse embeddings of CC BY-SA text 'adapted material'? | Determines whether vectors may be shared or must be CC BY-SA | Before semantic search launch |
| LR-2 | Are AI chapter explanations that quote CC BY-SA verses ShareAlike adaptations? | Determines licence of the explanation corpus | Before UNDERSTAND publication |
| LR-3 | UK Crown patent on KJV — any impact on digital display or print-to-PDF features in the UK? | eBible notes UK printing/importing restriction | Before any print/PDF export |
| LR-4 | TTS audio from CC BY-SA text — licence and attribution form | Audio derivative | Before TTS feature |
| LR-5 | YouVersion Platform AI clause scope | Could block AI features app-wide | Before any YouVersion integration |
| LR-6 | Commercial definition (donations, sponsorship, a future paid tier) under API.Bible and YouVersion terms | Both treat indirect revenue as commercial | With D-001 |
| LR-7 | Biblica open-text trademark rules for UI labels (e.g. showing 'Biblica®' in edition picker) | Trademark conditions on CC texts | Before import of Biblica open texts |

## 8. Sources (checked 2026-11-21)

- API.Bible Terms & Conditions — https://api.bible/terms-and-conditions
- API.Bible caching — https://care.api.bible/article/401-caching-content ; licensing quick reference — https://care.api.bible/article/396-licensing-policies-quick-reference ; PD/CC status — https://care.api.bible/article/388-how-to-find-copyright-and-public-domain-status-of-bibles ; express licensing FAQ — https://care.api.bible/article/405-express-licensing-faqs
- YouVersion developer docs — https://developers.youversion.com/overview ; https://developers.youversion.com/api-usage ; Platform terms (not machine-readable) — https://platform.youversion.com/terms
- Secondary on YouVersion terms — https://faith.tools/app/youversion-platform-services ; https://community.scripture.software.sil.org/t/youversion-and-ai/7110 ; https://github.com/asvirts/aenon/issues/3
- ESV API — https://api.esv.org/ ; Crossway — https://www.crossway.org/rights-and-permissions/esv/
- Biblica — https://www.biblica.com/permissions/ ; AI policy — https://www.biblica.com/?p=31960
- Tyndale — https://www.tyndale.com/permissions ; Lockman — https://lockman.org/?p=3 ; Friendship Press — https://friendshippress.org/bible-licensing ; NET — https://netbible.com/?p=530 ; ABS/CEV — https://cev.bible/?p=161 ; HarperCollins — https://www.harpercollinschristian.com/permissions/
- Bible Brain — https://www.faithcomesbyhearing.com/bible-brain/core-concepts ; licence — https://www.faithcomesbyhearing.com/bible-brain/license
- eBible copyright list and per-edition about pages — https://ebible.org/Scriptures/copyright.php
- Cambridge UP KJV notice — https://assets.cambridge.org/97805212/28626/copyright/9780521228626_copyright_info.pdf
- Berean — https://berean.bible/terms.htm ; LAI — https://copyright.sabda.org/content.php ; RVR1960 — https://m.biblegateway.com/versions/Reina-Valera-1960-RVR1960-Biblia/
