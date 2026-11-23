"""Run only against an empty disposable project cluster, including its cluster-wide reader role."""

from foundation import db, migration


def check_synthetic_policy():
    rows = db("""BEGIN;
        INSERT INTO content.tradition VALUES ('fixture') ON CONFLICT DO NOTHING;
        INSERT INTO content.canon (id,tradition,definition_status)
          VALUES ('fixture-native','fixture','reviewed'),('fixture-other','fixture','reviewed'),
                 ('fixture-pending','fixture','metadata_only');
        INSERT INTO content.canon_book (canon,ordinal,book,membership)
          VALUES ('fixture-native',1,'TST','member'),('fixture-native',2,'XTR','appendix'),
                 ('fixture-other',1,'ABS','member'),('fixture-other',2,'TST','member'),
                 ('fixture-pending',1,'TST','member');
        INSERT INTO content.edition VALUES ('fixture','en','Fixture','Test','fixture','fixture-native','https://example.invalid');
        INSERT INTO content.licence VALUES ('fixture','Synthetic','VERIFIED','[]');
        INSERT INTO content.attribution VALUES ('fixture','Synthetic fixture');
        INSERT INTO content.evidence VALUES ('fixture','https://example.invalid',now(),repeat('0',64),repeat('0',64));
        INSERT INTO content.action VALUES ('host'),('display'),('commercial') ON CONFLICT DO NOTHING;
        INSERT INTO content.permission VALUES ('fixture','host','VERIFIED'),('fixture','display','VERIFIED'),
            ('fixture','commercial','VERIFIED');
        INSERT INTO content.version VALUES ('fixture',repeat('1',64),1,now(),current_date,current_date,
            'notice',repeat('0',64),false);
        INSERT INTO staging.versification_scheme VALUES (repeat('2',64),'{}','{}',true);
        INSERT INTO staging.versification_map VALUES (repeat('3',64),repeat('2',64),'fixture',repeat('1',64),
            repeat('4',64),'TST','1','3-4','bridge',ARRAY['TST.1.3','TST.1.4'],'{"anchor":"fixture"}','editorial',true);
        DO $$ BEGIN
          BEGIN
            INSERT INTO staging.versification_review (claim,decision,reviewer,reviewed_at,receipt,locator)
                VALUES (repeat('3',64),'APPROVED','',now(),repeat('5',64),'fixture only');
            RAISE EXCEPTION 'blank reviewer accepted';
          EXCEPTION WHEN check_violation THEN NULL; END;
          IF EXISTS (SELECT FROM staging.versification_review) THEN RAISE EXCEPTION 'failed review persisted'; END IF;
        END $$;
        INSERT INTO staging.versification_review (claim,decision,reviewer,reviewed_at,receipt,locator)
          SELECT repeat('3',64),'APPROVED','fixture reviewer',now(),repeat('5',64),'synthetic decision'
          FROM generate_series(1,2) ON CONFLICT (claim,receipt) DO NOTHING;
        SELECT count(*) FROM staging.versification_review WHERE decision='APPROVED';
        INSERT INTO staging.versification_review (claim,decision,reviewer,reviewed_at,receipt,locator)
          VALUES (repeat('3',64),'REVOKED','fixture reviewer',now(),repeat('6',64),'synthetic revocation');
        SELECT decision FROM staging.versification_review ORDER BY reviewed_at DESC,sequence DESC LIMIT 1;
        INSERT INTO content.verse VALUES ('fixture',repeat('1',64),'TST','1',1,'3-4','synthetic');
        INSERT INTO content.version_book VALUES ('fixture',repeat('1',64),'XTR',1,1,1),
            ('fixture',repeat('1',64),'TST',2,1,1);
        SET LOCAL ROLE ub_reader;
        SELECT count(*) FROM reader.verses WHERE edition='fixture';
        RESET ROLE;
        UPDATE content.version SET published=true WHERE edition='fixture';
        SET LOCAL ROLE ub_reader;
        SELECT label FROM reader.verses WHERE edition='fixture';
        SELECT book,membership FROM reader.book_catalogue WHERE edition='fixture'
            AND selected_canon='fixture-native' ORDER BY ordinal;
        SELECT book,available,chapter_count FROM reader.book_catalogue WHERE edition='fixture'
            AND selected_canon='fixture-other' ORDER BY ordinal;
        SELECT count(*) FROM reader.book_catalogue WHERE edition='fixture' AND selected_canon='fixture-pending';
        RESET ROLE;
        DELETE FROM content.permission WHERE edition='fixture' AND action='display';
        SET LOCAL ROLE ub_reader;
        SELECT count(*) FROM reader.verses WHERE edition='fixture';
        SELECT count(*) FROM reader.book_catalogue WHERE edition='fixture';
        ROLLBACK;""")
    assert rows.splitlines() == [
        "1",
        "REVOKED",
        "0",
        "3-4",
        "XTR|appendix",
        "TST|member",
        "ABS|f|",
        "TST|t|1",
        "0",
        "0",
        "0",
    ], rows


def check():
    if (
        db(
            "SELECT to_regnamespace('content') IS NOT NULL OR to_regnamespace('staging') IS NOT NULL OR to_regrole('ub_reader') IS NOT NULL"
        )
        != "f"
    ):
        raise RuntimeError(
            "migration rollback test requires a fresh disposable cluster"
        )
    migration("up")
    migration("up")
    assert db("SELECT count(*) FROM public.ub_migration") == "5"
    assert (
        db("SELECT count(*) FROM pg_partition_tree('content.verse') WHERE isleaf")
        == "2"
    )
    assert (
        db(
            "SELECT relrowsecurity AND relforcerowsecurity FROM pg_class WHERE oid='userdata.reading_position'::regclass"
        )
        == "t"
    )
    assert db("SET ROLE ub_reader; SELECT count(*) FROM reader.verses") == "0"
    check_synthetic_policy()
    migration("down")
    assert (
        db(
            "SELECT to_regnamespace('content') IS NULL AND to_regnamespace('staging') IS NULL AND to_regrole('ub_reader') IS NULL"
        )
        == "t"
    )
    migration("up")
    print(
        "PASS: five migrations up/up/down/up, partitioning, forced RLS, gated verses and edition-specific catalogues"
    )


if __name__ == "__main__":
    check()
