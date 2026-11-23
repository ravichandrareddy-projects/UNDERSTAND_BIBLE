"""Run only against an empty disposable project cluster, including its cluster-wide reader role."""

from foundation import db, migration


def check_synthetic_policy():
    rows = db("""BEGIN;
        INSERT INTO content.edition VALUES ('fixture','en','Fixture','Test','fixture',NULL,'https://example.invalid');
        INSERT INTO content.licence VALUES ('fixture','Synthetic','VERIFIED','[]');
        INSERT INTO content.attribution VALUES ('fixture','Synthetic fixture');
        INSERT INTO content.evidence VALUES ('fixture','https://example.invalid',now(),repeat('0',64),repeat('0',64));
        INSERT INTO content.action VALUES ('host'),('display'),('commercial') ON CONFLICT DO NOTHING;
        INSERT INTO content.permission VALUES ('fixture','host','VERIFIED'),('fixture','display','VERIFIED'),
            ('fixture','commercial','VERIFIED');
        INSERT INTO content.version VALUES ('fixture',repeat('1',64),1,now(),current_date,current_date,
            'notice',repeat('0',64),false);
        INSERT INTO content.verse VALUES ('fixture',repeat('1',64),'TST','1',1,'3-4','synthetic');
        SET LOCAL ROLE ub_reader;
        SELECT count(*) FROM reader.verses WHERE edition='fixture';
        RESET ROLE;
        UPDATE content.version SET published=true WHERE edition='fixture';
        SET LOCAL ROLE ub_reader;
        SELECT label FROM reader.verses WHERE edition='fixture';
        RESET ROLE;
        DELETE FROM content.permission WHERE edition='fixture' AND action='display';
        SET LOCAL ROLE ub_reader;
        SELECT count(*) FROM reader.verses WHERE edition='fixture';
        ROLLBACK;""")
    assert rows.splitlines() == ["0", "3-4", "0"], rows


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
    assert db("SELECT count(*) FROM public.ub_migration") == "3"
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
        "PASS: all three migrations up/up/down/up, partitioning, forced RLS, reader access"
    )


if __name__ == "__main__":
    check()
