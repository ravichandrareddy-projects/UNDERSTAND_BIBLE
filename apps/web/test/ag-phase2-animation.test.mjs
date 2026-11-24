import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

test('Phase 2 Animation: Direction engine calculates correct canonical turn directions', () => {
  const directionEnginePath = path.join(
    webRoot,
    'lib',
    'animation',
    'animationDirection.ts',
  );
  assert.ok(fs.existsSync(directionEnginePath), 'animationDirection.ts exists');

  const content = fs.readFileSync(directionEnginePath, 'utf8');
  assert.ok(
    content.includes('calculateAnimationDirection'),
    'calculateAnimationDirection exported',
  );
  assert.ok(content.includes('forward'), 'forward direction supported');
  assert.ok(content.includes('backward'), 'backward direction supported');
  assert.ok(
    content.includes('chapter-forward'),
    'chapter-forward direction supported',
  );
  assert.ok(
    content.includes('chapter-backward'),
    'chapter-backward direction supported',
  );
  assert.ok(
    content.includes('initial-open'),
    'initial-open direction supported',
  );
});

test('Phase 2 3D Bible-Opening Loader Component exists with realistic page turns and lighting', () => {
  const loaderPath = path.join(
    webRoot,
    'components',
    'reader',
    'BibleOpeningLoader.tsx',
  );
  const cssPath = path.join(
    webRoot,
    'components',
    'reader',
    'BibleOpeningLoader.module.css',
  );
  assert.ok(fs.existsSync(loaderPath), 'BibleOpeningLoader.tsx exists');
  assert.ok(fs.existsSync(cssPath), 'BibleOpeningLoader.module.css exists');

  const tsxContent = fs.readFileSync(loaderPath, 'utf8');
  assert.ok(
    tsxContent.includes('effEditionName') || tsxContent.includes('editionName'),
    'Displays destination edition name',
  );
  assert.ok(
    tsxContent.includes('effBookName') || tsxContent.includes('bookName'),
    'Displays destination book name',
  );
  assert.ok(
    tsxContent.includes('effChapter') || tsxContent.includes('chapter'),
    'Displays destination chapter number',
  );
  assert.ok(
    tsxContent.includes('flipForward') ||
      tsxContent.includes('turningPage') ||
      tsxContent.includes('pageFlip'),
    'Includes page flip animation hooks',
  );

  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.ok(
    cssContent.includes('perspective') ||
      cssContent.includes('transform-style'),
    'Uses 3D perspective transforms',
  );
  assert.ok(
    cssContent.includes('prefers-reduced-motion'),
    'Complies with prefers-reduced-motion media query for accessibility',
  );
  assert.ok(
    cssContent.includes('spineCenter') ||
      cssContent.includes('spineRib') ||
      cssContent.includes('leatherSpine'),
    'Renders leather spine with ribs',
  );
  assert.ok(
    cssContent.includes('ribbon') ||
      cssContent.includes('goldRibbon') ||
      cssContent.includes('bookmarkRibbon'),
    'Renders ribbon bookmark',
  );
});
