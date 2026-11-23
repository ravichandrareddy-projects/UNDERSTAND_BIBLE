import { readFileSync } from 'node:fs';
import { afterAll, expect, it } from 'vitest';
import { parse } from 'yaml';
import { buildApp } from '../src/app.ts';

const app = buildApp();
afterAll(() => app.close());

it('serves the documented liveness response without external services', async () => {
  const spec = parse(
    readFileSync(
      new URL('../../../packages/contracts/openapi.yaml', import.meta.url),
      'utf8',
    ),
  );
  const response = await app.inject({ method: 'GET', url: '/health' });
  const expected =
    spec.paths['/health'].get.responses['200'].content['application/json'];
  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toMatch(/^application\/json/);
  expect(response.json()).toEqual(expected.example);
  expect(response.json()).toEqual({ status: 'ok' });
});
