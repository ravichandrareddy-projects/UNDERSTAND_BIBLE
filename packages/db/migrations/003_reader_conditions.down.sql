DROP VIEW reader.verses, reader.translations;
CREATE VIEW reader.translations WITH (security_barrier=true) AS
SELECT e.id,e.language,e.title,e.canon,v.checksum,a.notice,l.terms,l.conditions,e.source_url
FROM content.edition e JOIN content.version v ON v.edition=e.id
JOIN content.licence l ON l.edition=e.id JOIN content.attribution a ON a.edition=e.id
WHERE v.published AND content.allowed(e.id,'host') AND content.allowed(e.id,'display');
CREATE VIEW reader.verses WITH (security_barrier=true) AS
SELECT v.edition,v.checksum,v.book,v.chapter,v.ordinal,v.label,v.text_plain
FROM content.verse v JOIN reader.translations t ON (t.id,t.checksum)=(v.edition,v.checksum);
GRANT SELECT ON reader.translations,reader.verses TO ub_reader;
