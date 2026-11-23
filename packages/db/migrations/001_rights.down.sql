DROP VIEW reader.verses, reader.translations;
DROP SCHEMA reader;
DROP TABLE userdata.reading_position;
DROP SCHEMA userdata, study;
DROP FUNCTION content.allowed(text,text);
DROP TABLE content.verse, content.version, content.permission, content.action,
    content.evidence, content.attribution, content.licence, content.edition,
    content.canon_book, content.canon, content.tradition;
DROP DOMAIN content.sha256;
DROP SCHEMA content;
DROP ROLE ub_reader;
