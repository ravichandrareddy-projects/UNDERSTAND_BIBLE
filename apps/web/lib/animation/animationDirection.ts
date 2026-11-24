import { getBookOrder } from '../../data/bible/books';
import type { BibleTradition } from '../../data/bible/types';

export type BibleAnimationDirection =
  | 'forward' // From front toward back (e.g. Genesis -> Matthew). Pages flip right-to-left.
  | 'backward' // From back toward front (e.g. James -> Genesis). Pages flip left-to-right.
  | 'chapter-forward' // Same book, forward chapter (e.g. John 3 -> John 4). Subtle flip.
  | 'chapter-backward' // Same book, backward chapter (e.g. John 4 -> John 3). Subtle flip.
  | 'initial-open' // Initial opening of the Bible from closed state.
  | 'same-location'; // Same chapter (direct verse jump or reload).

export interface AnimationCalculationParams {
  fromBookId?: string | null | undefined;
  toBookId: string;
  fromChapter?: number | null | undefined;
  toChapter: number;
  tradition?: BibleTradition | undefined;
}

export interface AnimationPlan {
  direction: BibleAnimationDirection;
  bookDelta: number;
  chapterDelta: number;
  targetDurationMs: number;
  labelDirection: string;
}

/**
 * Calculates the realistic 3D Bible-opening animation direction based on
 * canonical reading order rather than alphabetical sorting.
 *
 * Examples from product specification:
 * - Yesterday: James (59), Today: Genesis (1) -> 'backward' (back to front, left-to-right).
 * - Yesterday: Genesis (1), Today: Matthew (40) -> 'forward' (front to back, right-to-left).
 * - Same-book: John 3 -> John 4 -> 'chapter-forward' (subtle page turn).
 */
export function calculateAnimationDirection(
  params: AnimationCalculationParams,
): AnimationPlan {
  const tradition = params.tradition ?? 'protestant';
  const toOrder = getBookOrder(params.toBookId, tradition);

  if (!params.fromBookId) {
    return {
      direction: 'initial-open',
      bookDelta: toOrder,
      chapterDelta: params.toChapter,
      targetDurationMs: 2800,
      labelDirection: 'Opening Scripture',
    };
  }

  const fromOrder = getBookOrder(params.fromBookId, tradition);
  const bookDelta = toOrder - fromOrder;
  const fromChap = params.fromChapter ?? 1;
  const chapterDelta = params.toChapter - fromChap;

  if (bookDelta > 0) {
    // Traveling forward deeper into the Bible (Genesis to Matthew)
    return {
      direction: 'forward',
      bookDelta,
      chapterDelta,
      targetDurationMs: Math.min(
        3200,
        Math.max(2400, 2400 + Math.abs(bookDelta) * 15),
      ),
      labelDirection: 'Forward through Canon',
    };
  }

  if (bookDelta < 0) {
    // Traveling backward toward the front (James to Genesis)
    return {
      direction: 'backward',
      bookDelta,
      chapterDelta,
      targetDurationMs: Math.min(
        3200,
        Math.max(2400, 2400 + Math.abs(bookDelta) * 15),
      ),
      labelDirection: 'Backward toward Genesis',
    };
  }

  // Same book: Check chapters
  if (chapterDelta > 0) {
    return {
      direction: 'chapter-forward',
      bookDelta: 0,
      chapterDelta,
      targetDurationMs: 1800,
      labelDirection: 'Advancing Chapter',
    };
  }

  if (chapterDelta < 0) {
    return {
      direction: 'chapter-backward',
      bookDelta: 0,
      chapterDelta,
      targetDurationMs: 1800,
      labelDirection: 'Previous Chapter',
    };
  }

  return {
    direction: 'same-location',
    bookDelta: 0,
    chapterDelta: 0,
    targetDurationMs: 1200,
    labelDirection: 'Refreshing Passage',
  };
}
