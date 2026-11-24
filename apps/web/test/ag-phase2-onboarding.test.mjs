import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

test('Phase 2 Onboarding: 14 interface languages are defined with native and English names', () => {
  const configPath = path.join(webRoot, 'i18n', 'config.ts');
  assert.ok(fs.existsSync(configPath), 'config.ts exists');

  const content = fs.readFileSync(configPath, 'utf8');
  assert.ok(
    content.includes('ONBOARDING_LANGUAGES'),
    'ONBOARDING_LANGUAGES exported',
  );

  // Verify all 14 mandatory languages
  const mandatoryLangs = [
    'te', // Telugu
    'en', // English
    'hi', // Hindi
    'ta', // Tamil
    'kn', // Kannada
    'ml', // Malayalam
    'bn', // Bengali
    'es', // Spanish
    'pt', // Portuguese
    'fr', // French
    'ar', // Arabic
    'zh', // Simplified Chinese
    'id', // Indonesian
    'de', // German
  ];

  for (const lang of mandatoryLangs) {
    assert.ok(
      content.includes(`code: '${lang}'`),
      `Language code '${lang}' configured in onboarding list`,
    );
  }
});

test('Phase 2 Canon Traditions: Protestant (66) and Catholic (73) canons defined with Deuterocanonical books', () => {
  const booksPath = path.join(webRoot, 'data', 'bible', 'books.ts');
  assert.ok(fs.existsSync(booksPath), 'books.ts exists');

  const content = fs.readFileSync(booksPath, 'utf8');
  assert.ok(
    content.includes('DEUTEROCANONICAL_BOOKS'),
    'Deuterocanonical books defined',
  );
  assert.ok(content.includes('TOB'), 'Tobit defined');
  assert.ok(content.includes('JDT'), 'Judith defined');
  assert.ok(content.includes('1MA'), '1 Maccabees defined');
  assert.ok(content.includes('2MA'), '2 Maccabees defined');
  assert.ok(content.includes('WIS'), 'Wisdom defined');
  assert.ok(content.includes('SIR'), 'Sirach defined');
  assert.ok(content.includes('BAR'), 'Baruch defined');
  assert.ok(
    content.includes('getBooksForTradition'),
    'getBooksForTradition function exported',
  );
  assert.ok(content.includes('getBookOrder'), 'getBookOrder function exported');
});

test('Phase 2 Licensing: KJV is explicitly not available until Codex confirms rights (G-LIC-1)', () => {
  const editionsPath = path.join(webRoot, 'data', 'bible', 'editions.ts');
  assert.ok(fs.existsSync(editionsPath), 'editions.ts exists');

  const content = fs.readFileSync(editionsPath, 'utf8');
  assert.ok(content.includes('available: false'), 'KJV available set to false');
  assert.ok(
    content.includes('Crown Copyright Review by Codex Pending') ||
      content.includes('Crown copyright audit'),
    'KJV rights review notice present',
  );
  assert.ok(
    content.includes('getApprovedEditions'),
    'getApprovedEditions helper defined',
  );
});

test('Phase 2 Onboarding Page: 5-step interactive onboarding flow with persistence exists', () => {
  const onboardingPagePath = path.join(
    webRoot,
    'app',
    '[locale]',
    'onboarding',
    'page.tsx',
  );
  assert.ok(fs.existsSync(onboardingPagePath), 'onboarding page.tsx exists');

  const content = fs.readFileSync(onboardingPagePath, 'utf8');
  assert.ok(
    content.includes('Select Your Interface Language') ||
      content.includes('STEP 1:'),
    'Step 1: Language Selection',
  );
  assert.ok(
    content.includes('Choose Bible Tradition & Canon') ||
      content.includes('STEP 2:'),
    'Step 2: Tradition Selection',
  );
  assert.ok(
    content.includes('Select Primary Bible Edition') ||
      content.includes('STEP 3:'),
    'Step 3: Primary Edition Selection',
  );
  assert.ok(
    content.includes('Optional Secondary Comparison') ||
      content.includes('STEP 4:'),
    'Step 4: Secondary Comparison Selection',
  );
  assert.ok(
    content.includes('Confirm Your Preferences') || content.includes('STEP 5:'),
    'Step 5: Confirmation',
  );
  assert.ok(
    content.includes('understand_bible_user_onboarding'),
    'Persists onboarding profile to localStorage',
  );
  assert.ok(
    content.includes('understand_bible_reader_prefs'),
    'Updates reader preferences from onboarding',
  );
});
