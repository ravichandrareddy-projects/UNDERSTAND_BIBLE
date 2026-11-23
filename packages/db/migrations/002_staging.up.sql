CREATE SCHEMA staging;
REVOKE ALL ON SCHEMA staging FROM PUBLIC;
CREATE TABLE staging.import (
    edition text NOT NULL, checksum content.sha256 NOT NULL, parser_version text NOT NULL,
    ledger_sha256 content.sha256 NOT NULL, evidence_at timestamptz NOT NULL, result jsonb NOT NULL,
    PRIMARY KEY (edition, checksum), FOREIGN KEY (edition,checksum) REFERENCES content.version
);
CREATE TABLE staging.book (
    edition text, checksum content.sha256, book text, canonical boolean NOT NULL,
    member_name text NOT NULL, member_sha256 content.sha256 NOT NULL, usj_gzip bytea NOT NULL,
    PRIMARY KEY (edition,checksum,book),
    FOREIGN KEY (edition,checksum) REFERENCES staging.import ON DELETE CASCADE
);
CREATE TABLE staging.verse (
    edition text, checksum content.sha256, book text, chapter text, ordinal integer CHECK (ordinal>0),
    label text NOT NULL, text_plain text NOT NULL, text_nfc text NOT NULL, plain_sha256 content.sha256 NOT NULL,
    PRIMARY KEY (edition,checksum,book,chapter,ordinal), UNIQUE (edition,checksum,book,chapter,label),
    FOREIGN KEY (edition,checksum,book) REFERENCES staging.book ON DELETE CASCADE
);
CREATE TABLE staging.annotation (
    edition text, checksum content.sha256, book text, seq integer CHECK (seq>0),
    chapter text, preceding_label text, kind text NOT NULL, node jsonb NOT NULL,
    PRIMARY KEY (edition,checksum,book,seq),
    FOREIGN KEY (edition,checksum,book) REFERENCES staging.book ON DELETE CASCADE
);
