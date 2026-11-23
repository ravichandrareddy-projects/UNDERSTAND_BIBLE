CREATE SCHEMA content;
CREATE SCHEMA study;
CREATE SCHEMA userdata;
CREATE SCHEMA reader;
CREATE ROLE ub_reader NOLOGIN;
REVOKE ALL ON SCHEMA content, study, userdata, reader FROM PUBLIC;
CREATE DOMAIN content.sha256 AS text CHECK (VALUE ~ '^[0-9a-f]{64}$');
CREATE TABLE content.tradition (id text PRIMARY KEY);
CREATE TABLE content.canon (
    id text PRIMARY KEY, tradition text NOT NULL REFERENCES content.tradition
);
CREATE TABLE content.canon_book (
    canon text REFERENCES content.canon, ordinal integer CHECK (ordinal > 0), book text NOT NULL,
    PRIMARY KEY (canon, ordinal), UNIQUE (canon, book)
);
CREATE TABLE content.edition (
    id text PRIMARY KEY, language text NOT NULL, title text NOT NULL, publisher text NOT NULL,
    source_id text NOT NULL, canon text REFERENCES content.canon, source_url text NOT NULL
);
CREATE TABLE content.licence (
    edition text PRIMARY KEY REFERENCES content.edition, terms text NOT NULL,
    status text NOT NULL, conditions jsonb NOT NULL CHECK (jsonb_typeof(conditions)='array')
);
CREATE TABLE content.attribution (
    edition text PRIMARY KEY REFERENCES content.licence, notice text NOT NULL CHECK (notice <> '')
);
CREATE TABLE content.evidence (
    edition text REFERENCES content.licence, url text NOT NULL, checked_at timestamptz NOT NULL,
    sha256 content.sha256 NOT NULL, review_sha256 content.sha256 NOT NULL,
    PRIMARY KEY (edition, url)
);
CREATE TABLE content.action (id text PRIMARY KEY);
CREATE TABLE content.permission (
    edition text REFERENCES content.licence, action text REFERENCES content.action,
    status text NOT NULL CHECK (status IN ('VERIFIED','REVIEW','UNVERIFIED','TERRITORIAL_REVIEW')),
    PRIMARY KEY (edition, action)
);
CREATE TABLE content.version (
    edition text REFERENCES content.edition, checksum content.sha256, archive_bytes bigint NOT NULL CHECK (archive_bytes>0),
    retrieved_at timestamptz NOT NULL, notice_date date NOT NULL, embedded_date date NOT NULL,
    notice_member text NOT NULL, notice_checksum content.sha256 NOT NULL,
    published boolean NOT NULL DEFAULT false,
    PRIMARY KEY (edition, checksum)
);
CREATE UNIQUE INDEX one_public_version ON content.version (edition) WHERE published;
CREATE TABLE content.verse (
    edition text NOT NULL, checksum content.sha256 NOT NULL, book text NOT NULL,
    chapter text NOT NULL, ordinal integer CHECK (ordinal>0), label text NOT NULL,
    text_plain text NOT NULL,
    PRIMARY KEY (edition, checksum, book, chapter, ordinal),
    FOREIGN KEY (edition,checksum) REFERENCES content.version
) PARTITION BY HASH (edition);
CREATE TABLE content.verse_0 PARTITION OF content.verse FOR VALUES WITH (modulus 2,remainder 0);
CREATE TABLE content.verse_1 PARTITION OF content.verse FOR VALUES WITH (modulus 2,remainder 1);
CREATE TABLE userdata.reading_position (
    user_id uuid PRIMARY KEY, edition text NOT NULL, checksum content.sha256 NOT NULL,
    book text NOT NULL, chapter text NOT NULL, label text NOT NULL,
    progress numeric CHECK (progress BETWEEN 0 AND 1), updated_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (edition,checksum) REFERENCES content.version
);
ALTER TABLE userdata.reading_position ENABLE ROW LEVEL SECURITY;
ALTER TABLE userdata.reading_position FORCE ROW LEVEL SECURITY;
-- No sync grants until a trusted authenticated identity mechanism exists.
CREATE FUNCTION content.allowed(wanted_edition text, wanted_action text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog AS $$
    SELECT EXISTS (SELECT FROM content.permission p JOIN content.licence l USING (edition)
      JOIN content.attribution a USING (edition)
      WHERE p.edition=wanted_edition AND p.action=wanted_action AND p.status='VERIFIED'
        AND l.status='VERIFIED' AND EXISTS (SELECT FROM content.evidence e WHERE e.edition=p.edition))
$$;
-- Fixed reader action. The caller cannot substitute a collection grant for display.
CREATE VIEW reader.translations WITH (security_barrier=true) AS
SELECT e.id,e.language,e.title,e.canon,v.checksum,a.notice,l.terms,l.conditions,e.source_url
FROM content.edition e JOIN content.version v ON v.edition=e.id
JOIN content.licence l ON l.edition=e.id JOIN content.attribution a ON a.edition=e.id
WHERE v.published AND content.allowed(e.id,'host') AND content.allowed(e.id,'display');

CREATE VIEW reader.verses WITH (security_barrier=true) AS
SELECT v.edition,v.checksum,v.book,v.chapter,v.ordinal,v.label,v.text_plain
FROM content.verse v JOIN reader.translations t ON (t.id,t.checksum)=(v.edition,v.checksum);

GRANT USAGE ON SCHEMA reader TO ub_reader;
REVOKE ALL ON FUNCTION content.allowed(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION content.allowed(text,text) TO ub_reader;
GRANT SELECT ON reader.translations,reader.verses TO ub_reader;
