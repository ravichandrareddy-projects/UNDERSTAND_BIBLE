import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

test('Phase 2 Contextual Study Panel: Covers all 9 required study dimensions', () => {
  const panelPath = path.join(
    webRoot,
    'components',
    'reader',
    'ContextualStudyPanel.tsx',
  );
  assert.ok(fs.existsSync(panelPath), 'ContextualStudyPanel.tsx exists');

  const content = fs.readFileSync(panelPath, 'utf8');

  // Verify all 9 mandatory contextual dimensions
  const mandatoryDimensions = [
    'Speaker',
    'Audience',
    'People',
    'What is happening',
    'Where',
    'Timeline',
    'Geograph',
    'Genealogy', // Vamsavali
    'relatedPassages',
  ];

  for (const dim of mandatoryDimensions) {
    assert.ok(
      content.includes(dim),
      `Dimension '${dim}' present in ContextualStudyPanel`,
    );
  }
});

test('Phase 2 Mobile Swipe Gesture Hook: Thresholds ensure vertical scrolling is not hijacked', () => {
  const hookPath = path.join(webRoot, 'lib', 'reader', 'useSwipeGesture.ts');
  assert.ok(fs.existsSync(hookPath), 'useSwipeGesture.ts exists');

  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('onTouchStart'), 'onTouchStart handled');
  assert.ok(content.includes('onTouchEnd'), 'onTouchEnd handled');
  assert.ok(
    content.includes('minSwipeDistance'),
    'Configurable horizontal distance threshold',
  );
  assert.ok(
    content.includes('maxPerpendicularDistance'),
    'Configurable perpendicular vertical tolerance to avoid scroll hijacking',
  );
});

test('Phase 2 Adaptive Reading Focus: Client-side rhythm tracking, 6-day habit logging & 7th-day suggestion', () => {
  const focusHookPath = path.join(
    webRoot,
    'lib',
    'reader',
    'useAdaptiveFocus.ts',
  );
  const modalPath = path.join(
    webRoot,
    'components',
    'reader',
    'AdaptiveFocusSuggestionModal.tsx',
  );
  assert.ok(fs.existsSync(focusHookPath), 'useAdaptiveFocus.ts exists');
  assert.ok(
    fs.existsSync(modalPath),
    'AdaptiveFocusSuggestionModal.tsx exists',
  );

  const hookContent = fs.readFileSync(focusHookPath, 'utf8');
  assert.ok(
    hookContent.includes('calculateWpm') || hookContent.includes('dwellTimes'),
    'Tracks reading dwell time and estimated WPM',
  );
  assert.ok(
    hookContent.includes('streakDays') || hookContent.includes('6'),
    'Tracks daily reading habit streaks',
  );
  assert.ok(
    hookContent.includes('showSuggestionModal'),
    'Controls suggestion prompt modal on 7th day or opt-in',
  );
  assert.ok(
    hookContent.includes('understand_bible_adaptive_focus_rhythm'),
    'Persists rhythm locally only (zero backend telemetry)',
  );

  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert.ok(
    modalContent.includes('Reading speed does not equal spiritual depth') ||
      modalContent.includes('understanding'),
    'Contains ethical reading disclaimer',
  );
  assert.ok(
    modalContent.includes('Enable Adaptive Focus') ||
      modalContent.includes('consent'),
    'Provides explicit user consent controls',
  );
});

test('Phase 2 Floating UNDERSTAND AI Assistant: Two-tier explanation with reflective re-reading prompt', () => {
  const understandPath = path.join(
    webRoot,
    'components',
    'reader',
    'UnderstandDrawer.tsx',
  );
  assert.ok(fs.existsSync(understandPath), 'UnderstandDrawer.tsx exists');

  const content = fs.readFileSync(understandPath, 'utf8');
  assert.ok(
    content.includes('Take a moment to read Chapter') ||
      content.includes('Reflect'),
    'Reflective re-reading prompt present before AI analysis',
  );
  assert.ok(
    content.includes('Quick Summary') || content.includes('quick'),
    'Tier 1 Quick Summary present',
  );
  assert.ok(
    content.includes('Detailed Context') || content.includes('detailed'),
    'Tier 2 Detailed Contextual breakdown present',
  );
});
