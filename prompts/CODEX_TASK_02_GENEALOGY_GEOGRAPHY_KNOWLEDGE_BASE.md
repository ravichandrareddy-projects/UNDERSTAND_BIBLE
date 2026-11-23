# Codex Task 02 — Genealogy, geography and biblical-history knowledge base

Run this only after the Bible import foundation is stable: USFM parsing, the standard verse-key scheme, database migrations and content validation must be implemented and tested. This is not the first task.

You are implementing the biblical knowledge foundation for **Understand Bible**. Read `AGENTS.md`, `docs/GENEALOGY_AND_TIMELINE_PLAN.md`, `docs/BIBLE_DATA_ARCHITECTURE.md`, `docs/CANON_AND_TRADITION_RESEARCH.md`, `docs/OPENCODE_TASKS.md` (OC-18 through OC-21), `docs/PROJECT_DECISIONS.md`, and `docs/LICENCE_EVIDENCE_REGISTER.md` if it exists.

## Source repositories to investigate

1. STEPBible Data: https://github.com/STEPBible/STEPBible-Data
   - Inspect TIPNR for people, names, and relationships.
   - Inspect TVTMS for verse mappings and versification.
   - Check exact dataset licences, attribution and version/commit before importing.

2. Theographic Bible Metadata: https://github.com/robertrouse/theographic-bible-metadata
   - Inspect people, relationships, places, events, groups, chronology and geodata.
   - Check its CC BY-SA terms, attribution and ShareAlike obligations.
   - Keep its own chronology clearly labelled as one chronology model, not universal fact.

3. OpenBible Geocoding Data: https://github.com/openbibleinfo/Bible-Geocoding-Data
   - Inspect ancient and modern places, candidate identifications, geometry, and source/bibliography data.
   - Check CC BY, OpenStreetMap ODbL, image and other third-party obligations separately.
   - Do not bulk-download the optional thumbnail/image archive for this task.

## Phase A — Source audit before import
1. Inspect the actual repository layout and data files; do not guess filenames or schemas.
2. Record exact Git commit SHA, release/tag if available, download date, source URL, licence URL, attribution, and any additional dependencies.
3. Produce a field mapping from each source into our planned model.
4. Identify overlapping entities, duplicate people/place names, source-specific IDs and differing relationship assertions.
5. Do not copy or combine data if its licence or provenance is unclear. Record the blocker.

## Phase B — Model and provenance
Use separate, typed records for:
- Person and name/alias
- Relationship (parent, mother, father, spouse, sibling, half-sibling, adoptive/legal, ancestor, successor, dynasty membership, etc.)
- Place and alternative identification
- Event and event participants
- Timeline/chronology assertion
- Scripture evidence reference
- External source record and licence attribution

Every relationship, place identification and event link must retain:
- Exact source identifier and source dataset
- Supporting Bible reference(s) where supplied
- Confidence or assertion type
- Notes on uncertainty/disagreement
- Import version and provenance

Never merge two people solely because their names match. Do not infer missing parents as facts. Distinguish biological lineage from royal succession and tribal/dynastic membership. Keep Matthew 1 and Luke 3 as separate genealogy accounts.

## Phase C — Pilot datasets
Prepare validated pilot records for:
1. Genesis 5 — Adam-to-Noah genealogy
2. Genesis 10 — Table of Nations
3. Genesis 11–50 — patriarchal families and descendants
4. Matthew 1 and Luke 3 — two distinct genealogical accounts of Jesus
5. 1–2 Kings, especially 2 Kings 9–10 — Ahab's dynasty and Jehu's royal line
6. Abraham's journeys and locations in Genesis 12–25
7. Exodus/wilderness route, with disputed identifications labelled as uncertain
8. Jesus' ministry locations and Paul's missionary journeys, using referenced sources

This is a pilot, not a claim that the entire Bible knowledge graph is complete.

## Phase D — Geography and timelines
- Keep ancient place, modern candidate, coordinates, geometry and confidence as separate fields.
- Do not invent coordinates or force uncertain ancient places to one modern site.
- Preserve multiple candidate identifications and supporting references.
- Store chronology as assertions with date range, calendar convention, source and confidence; support alternative chronologies.
- Do not turn an estimated date into a precise historical date.
- Identify whether a location belongs to a region, city, river, mountain, road, or other category.

## Phase E — Deliverables
Create:
- `docs/GENEALOGY_DATA_SOURCE_AUDIT.md`
- `docs/GEOGRAPHY_DATA_SOURCE_AUDIT.md`
- `docs/CHRONOLOGY_SOURCE_AUDIT.md`
- `docs/KNOWLEDGE_GRAPH_FIELD_MAPPING.md`
- `docs/KNOWLEDGE_GRAPH_CONFLICTS.md`
- `data/manifests/knowledge-sources.json`
- machine-readable pilot records and validation reports under the approved `data/` layout
- unit/integration tests for duplicate detection, provenance, confidence labels, relationship cycles and uncertain locations

## UI coordination
The plan includes People/Genealogy and Timeline UI tasks, but a full interactive geographical map screen needs an explicit scope decision. Create a decision request asking whether the map is V1, V1.1 or a later release. Do not silently expand Antigravity's scope. Provide a stable API contract proposal for Antigravity to review.

## Definition of done
Provide a source-by-source report, import counts, conflicts, provenance coverage, test results, example pilot records, unresolved licensing questions and the exact next tasks. Do not claim a complete Bible genealogy or fully verified biblical map based on these pilot records.
