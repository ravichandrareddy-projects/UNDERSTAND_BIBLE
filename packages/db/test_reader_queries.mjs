/** Runs the TypeScript queries against seeded PostgreSQL. Each visibility change rolls back. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { bookCatalogue, translations } from './reader.ts';

const connection = {
  async query(sql, values) {
    const args = values.map((v) => "'" + String(v).replaceAll("'", "''") + "'");
    const parameters = args.length ? '(' + args.join(',') + ')' : '';
    const script = `BEGIN;
      SET LOCAL standard_conforming_strings=on;
      UPDATE content.version SET published=true WHERE edition IN ('eng-dra','tel-irv');
      SET LOCAL ROLE ub_reader;
      PREPARE ub_test AS SELECT to_jsonb(r)::text FROM (${sql}) r;
      EXECUTE ub_test${parameters};
      ROLLBACK;`;
    const output = execFileSync(
      process.env.PSQL || 'psql',
      ['-XqAt', '-v', 'ON_ERROR_STOP=1', '-f', '-'],
      {
        input: script,
        encoding: 'utf8',
        env: { ...process.env, PGCLIENTENCODING: 'UTF8' },
      },
    );
    return {
      rows: output
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .map((row) => JSON.parse(row)),
    };
  },
};

const editions = await translations(connection);
assert.deepEqual(
  editions.map((t) => t.id),
  ['eng-dra', 'tel-irv'],
);
for (const edition of editions) {
  assert.deepEqual(edition.rights, { action: 'display', status: 'VERIFIED' });
  assert.ok(edition.attribution && edition.evidenceUrls.length > 0);
  const native = await bookCatalogue(
    connection,
    edition.id,
    edition.version,
    edition.canon,
  );
  assert.deepEqual(native.translation, edition);
  assert.equal(native.books.length, edition.id === 'eng-dra' ? 73 : 66);
  assert.ok(
    native.books.every(
      (book, i) => book.available && book.sourceOrder === i + 1,
    ),
  );
}
const irv = editions.find((e) => e.id === 'tel-irv');
const catholic = await bookCatalogue(
  connection,
  irv.id,
  irv.version,
  'catholic',
);
assert.equal(catholic.selectedCanon, 'catholic');
assert.equal(
  catholic.books.filter((book) => !book.available && book.verseRows === null)
    .length,
  7,
);
for (const selection of [
  [irv.id, irv.version, 'orthodox-greek'],
  [irv.id, irv.version, 'orthodox-slavonic'],
  [irv.id, '0'.repeat(64), 'protestant'],
  ['eng-kjv', irv.version, 'protestant'],
]) {
  assert.equal(await bookCatalogue(connection, ...selection), null);
}
console.log(
  'PASS: typed edition and catalogue queries, rights envelopes, canon coverage, held and unavailable selections',
);
