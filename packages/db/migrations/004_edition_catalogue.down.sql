DROP VIEW reader.book_catalogue;
DROP TABLE content.version_book;
ALTER TABLE content.canon_book DROP COLUMN membership;
ALTER TABLE content.canon DROP COLUMN description, DROP COLUMN definition_status;
