-- Administrative staging only. No public or reader grants.
CREATE TABLE staging.versification_scheme (
    revision content.sha256 PRIMARY KEY, definition jsonb NOT NULL,
    source_manifest jsonb NOT NULL, permitted boolean NOT NULL DEFAULT false
);
CREATE TABLE staging.versification_map (
    claim content.sha256 PRIMARY KEY, scheme content.sha256 NOT NULL REFERENCES staging.versification_scheme,
    edition text NOT NULL, checksum content.sha256 NOT NULL, ledger content.sha256 NOT NULL,
    book text NOT NULL, chapter text NOT NULL, label text NOT NULL,
    kind text NOT NULL CHECK (kind IN ('identity','renumber','bridge','split','merge','complex','absence')),
    standard_members text[] NOT NULL CHECK (cardinality(standard_members)>0 AND array_position(standard_members,NULL) IS NULL),
    evidence jsonb NOT NULL CHECK (jsonb_typeof(evidence)='object' AND evidence<>'{}'),
    confidence text NOT NULL CHECK (confidence IN ('structural','corroborated','editorial')),
    active boolean NOT NULL DEFAULT true,
    FOREIGN KEY (edition,checksum) REFERENCES content.version
);
CREATE INDEX versification_scope ON staging.versification_map(edition,checksum,book,chapter,label) WHERE active;
CREATE TABLE staging.edition_versification_override (
    claim content.sha256 PRIMARY KEY REFERENCES staging.versification_map, justification text NOT NULL CHECK (trim(justification)<>'')
);
CREATE TABLE staging.versification_review (
    sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    claim content.sha256 NOT NULL REFERENCES staging.versification_map,
    decision text NOT NULL CHECK (decision IN ('APPROVED','DISPUTED','REVOKED')),
    reviewer text NOT NULL CHECK (trim(reviewer)<>''), reviewed_at timestamptz NOT NULL,
    receipt content.sha256 NOT NULL, locator text NOT NULL CHECK (trim(locator)<>''),
    UNIQUE(claim,receipt)
);
CREATE INDEX versification_latest_review ON staging.versification_review(claim,reviewed_at DESC,sequence DESC);
