ALTER TABLE content.canon
    ADD COLUMN definition_status text NOT NULL DEFAULT 'metadata_only'
        CHECK (definition_status IN ('metadata_only', 'edition_sourced', 'reviewed')),
    ADD COLUMN description text NOT NULL DEFAULT '';
ALTER TABLE content.canon_book
    ADD COLUMN membership text NOT NULL DEFAULT 'member' CHECK (membership IN ('member', 'appendix'));

-- Source coverage and order belong to an archive version, independently of the selected tradition.
CREATE TABLE content.version_book (
    edition text, checksum content.sha256, book text, source_order integer NOT NULL CHECK (source_order > 0),
    chapter_count integer NOT NULL CHECK (chapter_count > 0),
    verse_rows integer NOT NULL CHECK (verse_rows > 0),
    PRIMARY KEY (edition, checksum, book), UNIQUE (edition, checksum, source_order),
    FOREIGN KEY (edition, checksum) REFERENCES content.version
);

CREATE VIEW reader.book_catalogue WITH (security_barrier=true) AS
-- The native list follows the archived edition. An alternate tradition follows its own order.
SELECT t.id AS edition, t.checksum, t.canon AS selected_canon, b.book,
       b.source_order AS ordinal, b.source_order, b.chapter_count, b.verse_rows,
       true AS available, cb.membership
FROM reader.translations t
JOIN content.version_book b ON (b.edition,b.checksum)=(t.id,t.checksum)
JOIN content.canon c ON c.id=t.canon AND c.definition_status <> 'metadata_only'
LEFT JOIN content.canon_book cb ON (cb.canon,cb.book)=(c.id,b.book)
UNION ALL
SELECT t.id, t.checksum, c.id, cb.book, cb.ordinal, b.source_order, b.chapter_count,
       b.verse_rows, b.book IS NOT NULL, cb.membership
FROM reader.translations t
JOIN content.canon c ON c.id <> t.canon AND c.definition_status <> 'metadata_only'
JOIN content.canon_book cb ON cb.canon=c.id
LEFT JOIN content.version_book b ON (b.edition,b.checksum,b.book)=(t.id,t.checksum,cb.book);
GRANT SELECT ON reader.book_catalogue TO ub_reader;
