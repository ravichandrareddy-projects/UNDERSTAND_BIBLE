import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { prepareLocalSecrets } from './prepare-local.mjs';

test('local services receive independent passwords that survive restarts', (t) => {
  const temporary = mkdtempSync(join(tmpdir(), 'understand-bible-oc01-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const directory = join(temporary, 'secrets');
  const passwords = () =>
    ['postgres_password', 'minio_password'].map((name) =>
      readFileSync(join(directory, name), 'utf8'),
    );

  prepareLocalSecrets(directory);
  const first = passwords();
  for (const password of first) assert.match(password, /^[a-f0-9]{64}$/);
  assert.notEqual(first[0], first[1]);
  prepareLocalSecrets(directory);
  assert.deepEqual(passwords(), first);
});
