'use client';

import { useEffect, useState, useRef } from 'react';
import type { BibleAnimationDirection } from '../../lib/animation/animationDirection';
import styles from './BibleOpeningLoader.module.css';

export interface BibleOpeningLoaderProps {
  isOpen: boolean;
  editionName?: string | undefined;
  bookName?: string | undefined;
  chapter?: number | undefined;
  verse?: number | undefined;
  destination?:
    | {
        editionName: string;
        bookName: string;
        chapterNumber: number;
        verseNumber?: number | undefined;
      }
    | undefined;
  direction?: BibleAnimationDirection | undefined;
  durationMs?: number | undefined;
  revealDelayMs?: number | undefined;
  leafCount?: number | undefined;
  labelDirection?: string | undefined;
  reducedMotion?: boolean | undefined;
  onComplete?: (() => void) | undefined;
}

export function BibleOpeningLoader({
  isOpen,
  editionName,
  bookName,
  chapter,
  verse,
  destination,
  direction = 'initial-open',
  durationMs = 2400,
  revealDelayMs,
  leafCount = 3,
  labelDirection,
  reducedMotion = false,
  onComplete,
}: BibleOpeningLoaderProps) {
  const effEditionName =
    destination?.editionName || editionName || 'World English Bible';
  const effBookName = destination?.bookName || bookName || 'Genesis';
  const effChapter = destination?.chapterNumber ?? chapter ?? 1;
  const effVerse = destination?.verseNumber ?? verse ?? 1;

  const effDuration = durationMs;
  const effRevealDelay = revealDelayMs ?? Math.round(effDuration * 0.45);
  const effLeafCount = Math.min(5, Math.max(1, leafCount));

  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(reducedMotion);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Detect system reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      setPrefersReducedMotion(true);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [reducedMotion]);

  // Handle timed exit
  useEffect(() => {
    if (!isOpen) {
      setIsExiting(false);
      return;
    }

    // Reduced motion duration is shorter (1.2s)
    const effectiveDuration = prefersReducedMotion
      ? Math.min(1200, durationMs)
      : durationMs;

    const exitTimer = setTimeout(
      () => {
        setIsExiting(true);
      },
      Math.max(800, effectiveDuration - 500),
    );

    const completeTimer = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, effectiveDuration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isOpen, durationMs, prefersReducedMotion]);

  if (!isOpen) return null;

  const isBackward = direction === 'backward';
  const isChapterFlip =
    direction === 'chapter-forward' || direction === 'chapter-backward';

  return (
    <aside
      className={`${styles.overlay} ${isExiting ? styles.overlayExiting : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Opening ${effBookName}, Chapter ${effChapter} in ${effEditionName}`}
      data-testid="bible-opening-loader"
      data-direction={direction}
    >
      {/* Screen Reader Announcement */}
      <span className="sr-only">
        Opening {effBookName}, Chapter {effChapter}, starting at verse{' '}
        {effVerse}. {effEditionName}.
      </span>

      {/* Floating Centered Glassmorphic Modal Card */}
      <div className={styles.glassModal}>
        <div className={styles.glassReflection} aria-hidden="true" />

        {prefersReducedMotion ? (
          /* Reduced Motion Accessible Display */
          <div
            className={styles.reducedMotionContainer}
            data-testid="reduced-motion-view"
          >
            <svg
              className={styles.reducedMotionEmblem}
              viewBox="0 0 48 38"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M24 7C19 3 9 3 3 5V32C9 30 19 30 24 34C29 30 39 30 45 32V5C39 3 29 3 24 7Z"
                stroke="#C5A15A"
                strokeWidth="2.5"
              />
              <path d="M24 7V34" stroke="#C5A15A" strokeWidth="2.5" />
              <path
                d="M14 11V21M10 14H18"
                stroke="#C5A15A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.editionTag}>{effEditionName}</div>
            <h2 className={styles.bookName}>{effBookName}</h2>
            <div className={styles.chapterVerseDetails}>
              Chapter {effChapter} · Starting at verse {effVerse}
            </div>
          </div>
        ) : (
          /* Full Realistic 3D Curved Bible Stage */
          <div className={styles.stage} data-testid="3d-bible-stage">
            <div className={styles.bible3d}>
              {/* Deep Ambient 3D Shadow */}
              <div className={styles.bibleShadow} aria-hidden="true" />

              {/* Realistic 3D Leather Cover with Gilt Edges */}
              <div className={styles.leatherCoverLeft} aria-hidden="true" />
              <div className={styles.leatherCoverRight} aria-hidden="true" />

              {/* Cylindrically Curved Left Page Stack */}
              <div className={styles.pageStackLeft} aria-hidden="true">
                <div className={styles.fauxLines}>
                  <div className={styles.lineHeading} />
                  <div className={styles.line} />
                  <div className={styles.line} />
                  <div className={styles.lineShort} />
                  <div className={styles.line} />
                </div>
              </div>

              {/* Center Leather Spine & Gold Ribbon */}
              <div className={styles.spineCenter} aria-hidden="true" />
              <div className={styles.ribbon} aria-hidden="true" />

              {/* Cylindrically Curved Right Page Stack */}
              <div className={styles.pageStackRight} aria-hidden="true">
                <div className={styles.fauxLines}>
                  <div className={styles.lineHeading} />
                  <div className={styles.line} />
                  <div className={styles.line} />
                  <div className={styles.line} />
                  <div className={styles.lineShort} />
                </div>
              </div>

              {/* Rotating Dynamic 3D Curved Pages */}
              {!isChapterFlip && (
                <>
                  <div
                    className={`${styles.turningPage} ${styles.turningPage1} ${
                      isBackward
                        ? styles.turningPageBackward
                        : styles.turningPageForward
                    }`}
                    aria-hidden="true"
                  >
                    <div className={styles.pageShine} />
                  </div>
                  {effLeafCount >= 2 && (
                    <div
                      className={`${styles.turningPage} ${styles.turningPage2} ${
                        isBackward
                          ? styles.turningPageBackward
                          : styles.turningPageForward
                      }`}
                      aria-hidden="true"
                    >
                      <div className={styles.pageShine} />
                    </div>
                  )}
                  {effLeafCount >= 3 && (
                    <div
                      className={`${styles.turningPage} ${styles.turningPage3} ${
                        isBackward
                          ? styles.turningPageBackward
                          : styles.turningPageForward
                      }`}
                      aria-hidden="true"
                    >
                      <div className={styles.pageShine} />
                    </div>
                  )}
                  {effLeafCount >= 4 && (
                    <div
                      className={`${styles.turningPage} ${styles.turningPage4} ${
                        isBackward
                          ? styles.turningPageBackward
                          : styles.turningPageForward
                      }`}
                      aria-hidden="true"
                    >
                      <div className={styles.pageShine} />
                    </div>
                  )}
                  {effLeafCount >= 5 && (
                    <div
                      className={`${styles.turningPage} ${styles.turningPage5} ${
                        isBackward
                          ? styles.turningPageBackward
                          : styles.turningPageForward
                      }`}
                      aria-hidden="true"
                    >
                      <div className={styles.pageShine} />
                    </div>
                  )}
                </>
              )}

              {/* Subtle Chapter Flip for Same-Book Navigation */}
              {isChapterFlip && (
                <div
                  className={`${styles.turningPage} ${styles.turningPageChapter}`}
                  aria-hidden="true"
                >
                  <div className={styles.pageShine} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Destination Information at Bottom of Glass Modal — Staggered Reveal */}
        <div
          className={styles.destinationBox}
          style={{ animationDelay: `${effRevealDelay}ms` }}
        >
          <div className={styles.editionTag}>{effEditionName}</div>
          <h2 className={styles.bookName}>{effBookName}</h2>
          <div className={styles.goldDivider} aria-hidden="true" />
          <div className={styles.chapterVerseDetails}>
            Chapter {effChapter} · Starting at verse {effVerse}
          </div>
          {labelDirection ? (
            <div className={styles.directionNotice}>{labelDirection}</div>
          ) : direction === 'backward' ? (
            <div className={styles.directionNotice}>
              ◂ Turning back toward earlier Scripture
            </div>
          ) : direction === 'forward' ? (
            <div className={styles.directionNotice}>
              Turning deeper into Scripture ▸
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
