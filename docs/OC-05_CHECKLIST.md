# OC-05 staging checklist

**2026-11-23.** Engineering checks passed for the five accepted staging versions. Editorial verification and V-07 are open. [Implementation report](OC-05_REPORT.md)

- [x] WP1. Record the pinned NRSV-based TVTMS authority, physical line locators, licence evidence, terms and attribution. Exclude the optional Paratext input pending a separate rights and applicability receipt.
- [x] WP2. Migrate the private PostgreSQL schema, retain edition and ledger checksums, review history and ordered membership, and verify migrations in a disposable cluster.
- [x] WP3. Generate edition-specific candidates with source evidence. Test explicit overrides, reviewer identity, dispute, revocation, segment labels, grouped mappings and fail-closed lookup. Rebuild without duplicating candidates.
- [x] WP4. Count every native row in both directions of every pair. Record per-edition queues, standard-side counts per book, incompatible book catalogues and unresolved cases.
- [x] Exercise all 88 Telugu bridges, all 16 BSB gaps, five WEB note-only markers and all 4,373 native rows in the seven additional DRA books.
- [x] Test rights on either side, mapping-source revocation, stale ledgers, reader-role denial, IRV action holds, the KJV exclusion and zero production rows.
- [ ] Obtain written edition-specific decisions. Genesis 2:25 remains pending in all five editions at the owner's direction.
- [ ] Expand or review evidence for unsupported native rows, titles, moves, splits, additions and absences. Run the full pair and standard-side reports after each reviewed change.
- [ ] Close V-07 only after reviewed mappings and documented absences account for the required scope. Literal tests requiring unavailable editions and reader API/UI integration belong to separately authorized work.
