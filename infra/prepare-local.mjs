import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function prepareLocalSecrets(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  for (const name of ['postgres_password', 'minio_password']) {
    try {
      writeFileSync(join(directory, name), randomBytes(32).toString('hex'), {
        flag: 'wx',
        mode: 0o600,
      });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}

if (import.meta.main) {
  prepareLocalSecrets(
    fileURLToPath(new URL('../.local/secrets/', import.meta.url)),
  );
}
