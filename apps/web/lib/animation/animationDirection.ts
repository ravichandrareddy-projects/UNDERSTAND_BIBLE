import { getBookOrder } from '../../data/bible/books';
import type { BibleTradition } from '../../data/bible/types';

export type BibleAnimationDirection =
  | 'forward' // From front toward back (e.g. Genesis -> Matthew). Pages flip right-to-left.
  | 'backward' // From back toward front (e.g. James -> Genesis). Pages flip left-to-right.
  | 'chapter-forward' // Same book, forward chapter (e.g. John 3 -> John 4). Subtle flip.
  | 'chapter-backward' // Same book, backward chapter (e.g. John 4 -> John 3). Subtle flip.
  | 'initial-open' // Initial opening of the Bible from closed state.
  | 'same-location'; // Same chapter (direct verse jump or reload).

export type OpeningStrategy =
  | 'front' // Opening near the beginning (Genesis - Deuteronomy)
  | 'center' // Opening from the center (Psalms, Proverbs, Wisdom)
  | 'new-testament' // Opening past OT into Gospels / Epistles
  | 'back' // Opening from the very back (Revelation)
  | 'sequential-flip' // Standard inter-book page turning
  | 'single-leaf'; // Single chapter flip

export interface AnimationCalculationParams {
  fromBookId?: string | null | undefined;
  toBookId: string;
  fromChapter?: number | null | undefined;
  toChapter: number;
  tradition?: BibleTradition | undefined;
}

export interface AnimationPlan {
  direction: BibleAnimationDirection;
  strategy: OpeningStrategy;
  bookDelta: number;
  chapterDelta: number;
  targetDurationMs: number;
  revealDelayMs: number;
  leafCount: number;
  labelDirection: string;
}

/**
 * Calculates realistic 3D Bible-opening animation pacing and direction based on
 * canonical reading order and physical book dynamics.
 *
 * Real physical principles:
 * - Genesis -> Matthew (39 books apart): Takes longer (~2.9s) with 4 turning leaves.
 * - Genesis -> Revelation (65 books apart): Full book traverse (~3.6s) with 5 turning leaves.
 * - Same-book adjacent chapter (John 3 -> John 4): Quick single page turn (~1.1s).
 * - Opening from closed: People naturally open Psalms/Proverbs from the center,
 *   Genesis from the front, or Revelation from the back.
 * - Destination reveal delay: Staggered so the destination book/chapter smoothly
 *   emerges after pages begin turning, rather than appearing instantly.
 */
export function calculateAnimationDirection(
  params: AnimationCalculationParams,
): AnimationPlan {
  const tradition = params.tradition ?? 'protestant';
  const toOrder = getBookOrder(params.toBookId, tradition);

  // 1. Initial Opening from Closed Bible State
  if (!params.fromBookId) {
    if (toOrder <= 5) {
      // Front of Bible (Pentateuch / Law)
      return {
        direction: 'initial-open',
        strategy: 'front',
        bookDelta: toOrder,
        chapterDelta: params.toChapter,
        targetDurationMs: 1800,
        revealDelayMs: 700,
        leafCount: 2,
        labelDirection: 'Opening from the Front (Genesis & Law)',
      };
    }
    if (toOrder >= 18 && toOrder <= 24) {
      // Natural center of Bible (Psalms, Proverbs, Ecclesiastes)
      return {
        direction: 'initial-open',
        strategy: 'center',
        bookDelta: toOrder,
        chapterDelta: params.toChapter,
        targetDurationMs: 2200,
        revealDelayMs: 900,
        leafCount: 3,
        labelDirection: 'Opening from the Center (Psalms & Wisdom)',
      };
    }
    if (toOrder >= 39 && toOrder <= 43) {
      // Opening into the New Testament Gospels
      return {
        direction: 'initial-open',
        strategy: 'new-testament',
        bookDelta: toOrder,
        chapterDelta: params.toChapter,
        targetDurationMs: 2800,
        revealDelayMs: 1200,
        leafCount: 4,
        labelDirection: 'Opening into the New Testament (Gospels)',
      };
    }
    if (toOrder >= 60) {
      // Back of Bible (General Epistles / Revelation)
      return {
        direction: 'initial-open',
        strategy: 'back',
        bookDelta: toOrder,
        chapterDelta: params.toChapter,
        targetDurationMs: 3400,
        revealDelayMs: 1500,
        leafCount: 5,
        labelDirection: 'Opening from the Back (Apocalypse & Epistles)',
      };
    }

    return {
      direction: 'initial-open',
      strategy: 'sequential-flip',
      bookDelta: toOrder,
      chapterDelta: params.toChapter,
      targetDurationMs: 2400,
      revealDelayMs: 1000,
      leafCount: 3,
      labelDirection: 'Opening Scripture',
    };
  }

  const fromOrder = getBookOrder(params.fromBookId, tradition);
  const bookDelta = toOrder - fromOrder;
  const fromChap = params.fromChapter ?? 1;
  const chapterDelta = params.toChapter - fromChap;
  const absDelta = Math.abs(bookDelta);

  // 2. Traveling Forward Deeper into the Bible (e.g. Genesis -> Matthew or Revelation)
  if (bookDelta > 0) {
    let targetDurationMs = 1800;
    let leafCount = 2;
    let label = `Forward ${bookDelta} books`;

    if (absDelta === 1) {
      targetDurationMs = 1400;
      leafCount = 1;
      label = 'Advancing to next book';
    } else if (absDelta <= 5) {
      targetDurationMs = 1800;
      leafCount = 2;
      label = `Advancing ${absDelta} books forward`;
    } else if (absDelta <= 15) {
      targetDurationMs = 2300;
      leafCount = 3;
      label = `Turning forward ${absDelta} books`;
    } else if (absDelta <= 40) {
      // E.g. Genesis (1) -> Matthew (40): delta = 39
      targetDurationMs = 2900;
      leafCount = 4;
      label = `Turning through ${absDelta} books into New Testament`;
    } else {
      // Deep traverse, e.g. Genesis (1) -> Revelation (66): delta = 65
      targetDurationMs = 3600;
      leafCount = 5;
      label = `Traversing across ${absDelta} books to Revelation`;
    }

    return {
      direction: 'forward',
      strategy: 'sequential-flip',
      bookDelta,
      chapterDelta,
      targetDurationMs,
      revealDelayMs: Math.round(targetDurationMs * 0.45),
      leafCount,
      labelDirection: label,
    };
  }

  // 3. Traveling Backward Toward the Front (e.g. Revelation -> Genesis or James -> Psalms)
  if (bookDelta < 0) {
    let targetDurationMs = 1800;
    let leafCount = 2;
    let label = `Turning back ${absDelta} books`;

    if (absDelta === 1) {
      targetDurationMs = 1400;
      leafCount = 1;
      label = 'Returning to previous book';
    } else if (absDelta <= 5) {
      targetDurationMs = 1800;
      leafCount = 2;
      label = `Turning back ${absDelta} books`;
    } else if (absDelta <= 15) {
      targetDurationMs = 2300;
      leafCount = 3;
      label = `Flipping backward ${absDelta} books`;
    } else if (absDelta <= 40) {
      targetDurationMs = 2900;
      leafCount = 4;
      label = `Flipping back ${absDelta} books toward Old Testament`;
    } else {
      targetDurationMs = 3600;
      leafCount = 5;
      label = `Returning through ${absDelta} books to Genesis`;
    }

    return {
      direction: 'backward',
      strategy: 'sequential-flip',
      bookDelta,
      chapterDelta,
      targetDurationMs,
      revealDelayMs: Math.round(targetDurationMs * 0.45),
      leafCount,
      labelDirection: label,
    };
  }

  // 4. Same Book Navigation (Chapter flips)
  const absChapterDelta = Math.abs(chapterDelta);

  if (chapterDelta > 0) {
    const targetDurationMs =
      absChapterDelta === 1 ? 1100 : absChapterDelta <= 5 ? 1350 : 1600;
    return {
      direction: 'chapter-forward',
      strategy: 'single-leaf',
      bookDelta: 0,
      chapterDelta,
      targetDurationMs,
      revealDelayMs: Math.round(targetDurationMs * 0.4),
      leafCount: 1,
      labelDirection:
        absChapterDelta === 1
          ? 'Next chapter'
          : `Advancing ${absChapterDelta} chapters`,
    };
  }

  if (chapterDelta < 0) {
    const targetDurationMs =
      absChapterDelta === 1 ? 1100 : absChapterDelta <= 5 ? 1350 : 1600;
    return {
      direction: 'chapter-backward',
      strategy: 'single-leaf',
      bookDelta: 0,
      chapterDelta,
      targetDurationMs,
      revealDelayMs: Math.round(targetDurationMs * 0.4),
      leafCount: 1,
      labelDirection:
        absChapterDelta === 1
          ? 'Previous chapter'
          : `Back ${absChapterDelta} chapters`,
    };
  }

  // 5. Same location (verse repositioning or refresh)
  return {
    direction: 'same-location',
    strategy: 'single-leaf',
    bookDelta: 0,
    chapterDelta: 0,
    targetDurationMs: 900,
    revealDelayMs: 300,
    leafCount: 1,
    labelDirection: 'Refreshing passage',
  };
}
