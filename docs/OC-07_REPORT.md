# OC-07 · Rights-first database foundation

**Owner review, 2026-11-23.** PostgreSQL 17.12 ran locally on Windows. Before any scripture parsing, the migrations ran, the approved rights registry was seeded twice, and live reader-role allow/deny checks passed. All five real content versions are private.

## Database and access

| Registry | Seeded result |
| --- | --- |
| Edition and translation metadata | Six named editions including held KJV, three languages, source identity, title, publisher and attribution. |
| Canon and tradition | Protestant and Catholic pilot traditions, ordered 66- and 73-book canons. These are source-edition coverage records. |
| Licences and actions | Six licence records, conditions, evidence URLs, verification timestamps and hashes, 15 actions and 90 edition/action decisions. |
| Source versions | Five checksum-addressed versions with byte size, retrieval date, source notice dates and embedded notice checksums. KJV has no version. |
| Publication and user data | Zero published versions or production verses. The production verse table has two hash partitions. RLS is forced on reading positions. |
| Staging | Separate private schema linked to the approved archive version. Each import is a single transaction. [Parsing results](OC-04_REPORT.md) |

The restricted database role can select only rights-filtered reader views. A caller cannot switch the chapter query's action from display to collection. The SQL tests used a synthetic verse to exercise unpublished, published, revoked and absent grants, missing evidence and the territorial hold. Deleting the hosting grant made the previously visible synthetic translation disappear in the same transaction. The test rolls back all synthetic changes.

The owner approved CC BY-SA-covered uses for the IRVs. The separate external AI, embeddings and synthesized-speech holds remain in force. D-001 remains open. While it is open, reader visibility also requires affirmative commercial-use permission. The rights records retain the independent statuses for every other action. The privileged seed and migration accounts are for administration. The future API login must only inherit the reader role.

## Implementation and verification

- Three up/down SQL migration pairs, the Python migration/seed runner, two live database tests, the ERD and typed SQL reader queries are in [packages/db](../packages/db). The seed draws on [edition rights](../data/rights/edition_rights.json) and [source manifests](../data/manifests/bible).
- The browser-to-service mapping and wire types are under [contracts](../packages/contracts/reader-proposal.md). The API test covers HTTP 404 for unpublished resource paths. CI now includes a disposable PostgreSQL migration job and parser fixtures.
- `python -B packages/db/foundation.py up` and `seed` succeeded on the live cluster. Repeating both preserved counts. `python -B packages/db/test_rights.py` passed before parsing and again against the final schema. `python -B packages/db/test_migrations.py` passed up/up/down/up on a second empty PostgreSQL 17.12 cluster, including both partitions, forced RLS and an empty reader view.
- `node node_modules/vitest/vitest.mjs run` in `apps/api` passed all five tests. The first sandboxed attempt could not spawn the worker. The permitted retry passed. Targeted ESLint, API TypeScript and strict TypeScript checks for the reader query and wire types passed.
- The disposable CI policy fixture also passed locally. Publishing its synthetic bridge made one row readable, and removing its display grant hid it immediately. Targeted Prettier and Ruff checks passed, as did Python indentation checks. CI configuration was exercised locally through its test commands. GitHub Actions has not run this checkpoint.
- The live run used EDB's portable Windows PostgreSQL tools inside ignored `.local/`, bound to loopback with SCRAM authentication. No Windows service was installed. Redis, MinIO, pgvector and cloud services were outside the exercise. Database and import runtime dependencies are Python's standard library and PostgreSQL. Ruff was downloaded from PyPI into ignored tooling for development formatting. [EDB portable distribution](https://www.enterprisedb.com/download-postgresql-binaries)

## Owner and frontend review

The local review cluster persists under ignored `.local/oc07/cluster`. To reopen it on this workstation, run `& .local/oc07/pgsql/bin/pg_ctl.exe -D .local/oc07/cluster -l .local/oc07/server.log -o "-h 127.0.0.1 -p 55437" -w start` from the workspace. Use database `postgres` and the local administrative account `ub_owner` for the verification scripts. Stop it with `& .local/oc07/pgsql/bin/pg_ctl.exe -D .local/oc07/cluster -m fast -w stop`. Secrets and cluster files are ignored by Git.

Antigravity's `7ca0d22` handoff arrived during the work. Codex accepts its browser route names and mapped them to the planned service resources. Source-label strings, content versions, pagination and DRA coverage require frontend acknowledgement. The public Fastify contract still exposes only health. Next decision is review of the database/staging evidence and contract changes before alignment or publication.
