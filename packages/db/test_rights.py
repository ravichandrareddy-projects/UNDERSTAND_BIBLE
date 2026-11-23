"""Integration assertions. Requires a seeded PostgreSQL database; synthetic changes roll back."""

from foundation import APPROVED, db, manifest


def run():
    total = db("SELECT count(*) FROM content.version")
    assert total == "5", total
    assert db("SELECT count(*) FROM content.permission") == "90"
    assert db("SELECT count(*) FROM reader.translations") == "0"
    for edition in APPROVED:
        assert db(f"SELECT content.allowed('{edition}','validate_text')") == "t"
        m = manifest(edition)
        order = m["inventory"]["books_in_source_index_order"]
        counts = m["inventory"]["chapter_verse_marker_counts"]
        expected = [f"{book}|{len(counts[book])}|{sum(counts[book])}" for book in order]
        rows = db(f"""SELECT book,chapter_count,verse_rows FROM content.version_book
                    WHERE edition='{edition}' AND checksum='{m["sha256"]}' ORDER BY source_order""")
        assert rows.splitlines() == expected, edition
    assert (
        db("SELECT count(*) FROM content.version_book WHERE edition='eng-kjv'") == "0"
    )
    assert db("SELECT count(*) FROM reader.book_catalogue") == "0"
    catalogues = db("""BEGIN;
        UPDATE content.version SET published=true WHERE edition IN ('eng-dra','tel-irv');
        SET LOCAL ROLE ub_reader;
        SELECT count(*) FROM reader.book_catalogue WHERE edition='eng-dra' AND selected_canon='catholic';
        SELECT count(*) FROM reader.book_catalogue WHERE edition='tel-irv' AND selected_canon='protestant';
        SELECT count(*) FROM reader.book_catalogue WHERE edition='tel-irv' AND selected_canon='catholic' AND NOT available;
        SELECT count(*) FROM reader.book_catalogue WHERE selected_canon IN ('orthodox-greek','orthodox-slavonic');
        ROLLBACK;""")
    assert catalogues.splitlines() == ["73", "66", "7", "0"], catalogues
    assert (
        db("""SELECT count(*) FROM content.permission WHERE
        (edition='eng-kjv' OR (edition IN ('tel-irv','hin-irv') AND action IN
        ('external_ai','embed','synthesize_speech'))) AND content.allowed(edition,action)""")
        == "0"
    )
    assert (
        db(
            "SELECT content.allowed('missing','display') OR content.allowed('eng-web','missing')"
        )
        == "f"
    )
    result = db("""BEGIN;
      INSERT INTO content.verse SELECT edition,checksum,'TST','1',1,'1','synthetic' FROM content.version
      WHERE edition='eng-web';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.verses;
      SELECT has_schema_privilege(current_user,'content','USAGE') OR
             has_schema_privilege(current_user,'staging','USAGE') OR
             has_table_privilege(current_user,(SELECT oid FROM pg_class WHERE relname='verse' AND relkind='p'),'SELECT');
      RESET ROLE;
      UPDATE content.version SET published=true WHERE edition='eng-web';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.verses;
      RESET ROLE;
      UPDATE content.permission SET status='REVIEW' WHERE edition='eng-web' AND action='display';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.verses;
      RESET ROLE;
      UPDATE content.permission SET status='VERIFIED' WHERE edition='eng-web' AND action='display';
      DELETE FROM content.permission WHERE edition='eng-web' AND action='host';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.translations;
      RESET ROLE;
      INSERT INTO content.permission VALUES ('eng-web','host','VERIFIED');
      UPDATE content.permission SET status='REVIEW' WHERE edition='eng-web' AND action='commercial';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.translations;
      RESET ROLE;
      UPDATE content.permission SET status='VERIFIED' WHERE edition='eng-web' AND action='commercial';
      DELETE FROM content.evidence WHERE edition='eng-web';
      INSERT INTO content.version SELECT 'eng-kjv',checksum,archive_bytes,retrieved_at,notice_date,
        embedded_date,notice_member,notice_checksum,true FROM content.version WHERE edition='eng-web';
      SET LOCAL ROLE ub_reader;
      SELECT count(*) FROM reader.translations;
      ROLLBACK;""")
    assert result.splitlines() == ["0", "f", "1", "0", "0", "0", "0"], result
    print(
        "PASS: seed totals, approved acquisition, territorial and IRV holds, unknown grants, private tables, unpublished, published, revoked, and missing grants"
    )


if __name__ == "__main__":
    run()
