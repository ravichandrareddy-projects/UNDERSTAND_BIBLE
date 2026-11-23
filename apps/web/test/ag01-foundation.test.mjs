import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

test('i18n message catalogues exist and have matching keys', () => {
  const enPath = path.join(webRoot, 'messages', 'en.json');
  const tePath = path.join(webRoot, 'messages', 'te.json');
  const arPath = path.join(webRoot, 'messages', 'ar.json');

  assert.ok(fs.existsSync(enPath), 'en.json exists');
  assert.ok(fs.existsSync(tePath), 'te.json exists');
  assert.ok(fs.existsSync(arPath), 'ar.json exists');

  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const te = JSON.parse(fs.readFileSync(tePath, 'utf8'));
  const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

  const enSections = Object.keys(en);
  const teSections = Object.keys(te);
  const arSections = Object.keys(ar);

  assert.deepEqual(
    teSections.sort(),
    enSections.sort(),
    'Telugu has all top-level message sections',
  );
  assert.deepEqual(
    arSections.sort(),
    enSections.sort(),
    'Arabic has all top-level message sections',
  );

  for (const section of enSections) {
    const enKeys = Object.keys(en[section]).sort();
    const teKeys = Object.keys(te[section]).sort();
    const arKeys = Object.keys(ar[section]).sort();

    assert.deepEqual(
      teKeys,
      enKeys,
      `Section "${section}" has identical keys in Telugu`,
    );
    assert.deepEqual(
      arKeys,
      enKeys,
      `Section "${section}" has identical keys in Arabic`,
    );
  }
});

test('Design tokens define Sacred & Elegant and Heritage palettes', () => {
  const tokensPath = path.join(webRoot, 'styles', 'tokens.css');
  assert.ok(fs.existsSync(tokensPath), 'tokens.css exists');

  const css = fs.readFileSync(tokensPath, 'utf8').toLowerCase();
  assert.ok(
    css.includes('--color-primary: #183d32'),
    'Sacred forest green primary defined',
  );
  assert.ok(
    css.includes('--color-accent: #c5a15a'),
    'Sacred muted gold accent defined',
  );
  assert.ok(
    css.includes('--color-bg: #f7f4ea'),
    'Sacred warm ivory bg defined',
  );
  assert.ok(css.includes('--color-text: #292b28'), 'Sacred ink text defined');
  assert.ok(
    css.includes("data-palette='heritage'") ||
      css.includes('data-palette="heritage"'),
    'Alternative heritage palette supported',
  );
  assert.ok(
    css.includes("data-theme='dark'") || css.includes('data-theme="dark"'),
    'Dark theme supported',
  );
  assert.ok(
    css.includes("data-theme='sepia'") || css.includes('data-theme="sepia"'),
    'Sepia theme supported',
  );
  assert.ok(
    css.includes("lang='te'") || css.includes('lang="te"'),
    'Telugu typography override defined',
  );
  assert.ok(
    css.includes("lang='ar'") || css.includes('lang="ar"'),
    'Arabic typography override defined',
  );
});

test('PWA manifest exists and conforms to PWA installability requirements', () => {
  const manifestPath = path.join(webRoot, 'public', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json exists');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.name, 'Understand Bible');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.start_url.includes('today'));
  assert.ok(
    Array.isArray(manifest.icons) && manifest.icons.length > 0,
    'Icons defined in manifest',
  );
});

test('Service worker skeleton exists', () => {
  const swPath = path.join(webRoot, 'public', 'sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js exists');

  const sw = fs.readFileSync(swPath, 'utf8');
  assert.ok(
    sw.includes("addEventListener('install'"),
    'SW has install listener',
  );
  assert.ok(sw.includes("addEventListener('fetch'"), 'SW has fetch listener');
});

test('All 10 AG-01 route skeletons exist', () => {
  const routes = [
    'app/[locale]/welcome/page.tsx',
    'app/[locale]/onboarding/page.tsx',
    'app/[locale]/today/page.tsx',
    'app/[locale]/read/page.tsx',
    'app/[locale]/read/books/page.tsx',
    'app/[locale]/search/page.tsx',
    'app/[locale]/read/understand/page.tsx',
    'app/[locale]/explore/page.tsx',
    'app/[locale]/plans/page.tsx',
    'app/[locale]/settings/page.tsx',
  ];

  for (const route of routes) {
    const fullPath = path.join(webRoot, route);
    assert.ok(fs.existsSync(fullPath), `Route skeleton exists: ${route}`);
  }
});
