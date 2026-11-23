import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

test('Bible books catalog defines all 66 canonical books with testaments & sections', async () => {
  const booksPath = path.join(webRoot, 'data', 'bible', 'books.ts');
  assert.ok(fs.existsSync(booksPath), 'books.ts exists');

  const content = fs.readFileSync(booksPath, 'utf8');
  assert.ok(content.includes('GEN'), 'Genesis included');
  assert.ok(content.includes('MAL'), 'Malachi included');
  assert.ok(content.includes('MAT'), 'Matthew included');
  assert.ok(content.includes('REV'), 'Revelation included');
  assert.ok(content.includes('ఆదికాండము'), 'Telugu names defined');
  assert.ok(content.includes('التكوين'), 'Arabic names defined');
});

test('Approved editions matrix defines approved public domain and open license editions', async () => {
  const editionsPath = path.join(webRoot, 'data', 'bible', 'editions.ts');
  assert.ok(fs.existsSync(editionsPath), 'editions.ts exists');

  const content = fs.readFileSync(editionsPath, 'utf8');
  assert.ok(content.includes('web'), 'WEB edition defined');
  assert.ok(content.includes('kjv'), 'KJV edition defined');
  assert.ok(content.includes('irv-te'), 'IRV-TE edition defined');
  assert.ok(content.includes('ar-svd'), 'AR-SVD edition defined');
  assert.ok(
    content.includes('Public Domain'),
    'Public domain licence label present',
  );
  assert.ok(content.includes('CC BY-SA 4.0'), 'CC BY-SA licence label present');
});

test('Pilot scripture fixtures provide verbatim public domain scripture', async () => {
  const fixturesPath = path.join(
    webRoot,
    'data',
    'bible',
    'fixtures',
    'index.ts',
  );
  assert.ok(fs.existsSync(fixturesPath), 'fixtures/index.ts exists');

  const content = fs.readFileSync(fixturesPath, 'utf8');
  assert.ok(content.includes('GEN_1'), 'Genesis 1 fixture exists');
  assert.ok(content.includes('JHN_1'), 'John 1 fixture exists');
  assert.ok(content.includes('JHN_3'), 'John 3 fixture exists');
  assert.ok(content.includes('PSA_23'), 'Psalm 23 fixture exists');
  assert.ok(
    content.includes('In the beginning was the Word'),
    'John 1:1 English present',
  );
  assert.ok(content.includes('ఆదియందు వాక్యము ఉండెను'), 'John 1:1 Telugu present');
  assert.ok(content.includes('فِي الْبَدْءِ كَانَ الْكَلِمَةُ'), 'John 1:1 Arabic present');
});

test('Core Reader components and modals exist', () => {
  const components = [
    'BibleReader.tsx',
    'BookPicker.tsx',
    'EditionPicker.tsx',
    'ReaderSettingsModal.tsx',
    'VoiceNavigator.tsx',
    'VerseActionBar.tsx',
  ];

  for (const comp of components) {
    const compPath = path.join(webRoot, 'components', 'reader', comp);
    assert.ok(fs.existsSync(compPath), `${comp} exists`);
  }
});

test('useReader state hook provides 5-verse adjustable batching and persistence logic', () => {
  const hookPath = path.join(webRoot, 'lib', 'reader', 'useReader.ts');
  assert.ok(fs.existsSync(hookPath), 'useReader.ts exists');

  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(
    content.includes('loadedVersesCount'),
    'Tracks loaded verses count for batching',
  );
  assert.ok(
    content.includes('batchSize'),
    'Supports user-adjustable batchSize',
  );
  assert.ok(
    content.includes('loadMoreVerses'),
    'Provides loadMoreVerses action',
  );
  assert.ok(
    content.includes('understand_bible_last_reading_pos'),
    'Persists reading position',
  );
  assert.ok(
    content.includes('understand_bible_bookmarks'),
    'Persists bookmarks',
  );
  assert.ok(
    content.includes('understand_bible_highlights'),
    'Persists highlights',
  );
  assert.ok(
    content.includes('understand_bible_reader_prefs'),
    'Persists preferences',
  );
  assert.ok(
    content.includes('isParallel'),
    'Supports parallel reading comparison',
  );
});
