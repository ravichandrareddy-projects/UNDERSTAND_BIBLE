'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useReader } from '../../lib/reader/useReader';
import { BookPicker } from './BookPicker';
import { EditionPicker } from './EditionPicker';
import { ReaderSettingsModal } from './ReaderSettingsModal';
import { VoiceNavigator } from './VoiceNavigator';
import { VerseActionBar } from './VerseActionBar';
import type { HighlightColor, VerseContent } from '../../data/bible/types';
import styles from './BibleReader.module.css';

interface BibleReaderProps {
  locale?: 'en' | 'te' | 'ar';
}

export function BibleReader({ locale = 'en' }: BibleReaderProps) {
  const {
    bookId,
    chapterNumber,
    activeVerseNumber,
    setActiveVerseNumber,
    currentBook,
    primaryChapterContent,
    parallelChapterContent,
    primaryEdition,
    parallelEdition,
    primaryEditionId,
    setPrimaryEditionId,
    parallelEditionId,
    setParallelEditionId,
    isParallel,
    toggleParallel,
    loadedVersesCount,
    loadMoreVerses,
    hasMoreVerses,
    preferences,
    updatePreferences,
    bookmarks,
    highlights,
    addHighlight,
    removeHighlight,
    toggleBookmark,
    selectedVerseNumber,
    setSelectedVerseNumber,
    readingProgress,
    navigateTo,
    nextChapter,
    prevChapter,
    isBookPickerOpen,
    setIsBookPickerOpen,
    isEditionPickerOpen,
    setIsEditionPickerOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isVoiceNavOpen,
    setIsVoiceNavOpen,
  } = useReader();

  const [pickingParallelEdition, setPickingParallelEdition] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Keyboard navigation: ← prev chapter, → next chapter, J/K verse navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside an input or modal
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isBookPickerOpen ||
        isEditionPickerOpen ||
        isSettingsOpen ||
        isVoiceNavOpen
      ) {
        return;
      }

      if (e.key === 'ArrowRight' && !e.altKey && !e.ctrlKey) {
        if (locale === 'ar') prevChapter();
        else nextChapter();
      } else if (e.key === 'ArrowLeft' && !e.altKey && !e.ctrlKey) {
        if (locale === 'ar') nextChapter();
        else prevChapter();
      } else if (e.key === 'j' || e.key === 'J') {
        setActiveVerseNumber((prev) =>
          Math.min(prev + 1, primaryChapterContent.totalVerses),
        );
      } else if (e.key === 'k' || e.key === 'K') {
        setActiveVerseNumber((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nextChapter,
    prevChapter,
    setActiveVerseNumber,
    primaryChapterContent.totalVerses,
    isBookPickerOpen,
    isEditionPickerOpen,
    isSettingsOpen,
    isVoiceNavOpen,
    locale,
  ]);

  // IntersectionObserver for 4-verse smooth streaming continuation
  useEffect(() => {
    if (!sentinelRef.current || !hasMoreVerses) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreVerses();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMoreVerses, hasMoreVerses, loadedVersesCount]);

  // Selected verse details for Action Bar
  const selectedVerseObj = useMemo(() => {
    if (selectedVerseNumber === null) return null;
    return (
      primaryChapterContent.verses.find(
        (v) => v.verseNumber === selectedVerseNumber,
      ) || null
    );
  }, [selectedVerseNumber, primaryChapterContent.verses]);

  const isSelectedVerseBookmarked = useMemo(() => {
    if (!selectedVerseNumber) return false;
    return bookmarks.some(
      (b) =>
        b.bookId === bookId &&
        b.chapterNumber === chapterNumber &&
        b.verseNumber === selectedVerseNumber,
    );
  }, [bookmarks, bookId, chapterNumber, selectedVerseNumber]);

  const selectedVerseHighlight = useMemo(() => {
    if (!selectedVerseNumber) return undefined;
    const h = highlights.find(
      (h) =>
        h.bookId === bookId &&
        h.chapterNumber === chapterNumber &&
        h.verseNumber === selectedVerseNumber,
    );
    return h?.color;
  }, [highlights, bookId, chapterNumber, selectedVerseNumber]);

  // Visible verses based on 4-verse batching
  const visiblePrimaryVerses = useMemo(() => {
    return primaryChapterContent.verses.slice(0, loadedVersesCount);
  }, [primaryChapterContent.verses, loadedVersesCount]);

  const visibleParallelVerses = useMemo(() => {
    return parallelChapterContent.verses.slice(0, loadedVersesCount);
  }, [parallelChapterContent.verses, loadedVersesCount]);

  // Typography styles from preferences
  const dynamicTextStyle = useMemo(() => {
    return {
      fontSize: `${preferences.fontSize}px`,
      lineHeight: preferences.lineSpacing,
      fontFamily:
        preferences.fontFamily === 'serif'
          ? 'var(--font-serif)'
          : 'var(--font-sans)',
    };
  }, [preferences]);

  return (
    <div className={styles.readerContainer}>
      {/* ============================================================
          1. STICKY READER TOOLBAR
          ============================================================ */}
      <div
        className={styles.toolbar}
        role="toolbar"
        aria-label="Bible reader controls"
      >
        <div className={styles.toolbarLeft}>
          {/* Location Chip */}
          <button
            type="button"
            className={styles.locationChip}
            onClick={() => setIsBookPickerOpen(true)}
            aria-label="Select book, chapter and verse"
          >
            <span>
              {currentBook.names[locale] || currentBook.names.en}{' '}
              {chapterNumber}
            </span>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Primary Edition Chip */}
          <button
            type="button"
            className={styles.editionChip}
            onClick={() => {
              setPickingParallelEdition(false);
              setIsEditionPickerOpen(true);
            }}
            title="Change primary Bible translation"
            aria-label={`Current translation: ${primaryEdition.name}`}
          >
            <span>{primaryEdition.code}</span>
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Parallel Comparison Toggle */}
          <button
            type="button"
            className={`${styles.toolButton} ${isParallel ? styles.toolButtonActive : ''}`}
            onClick={toggleParallel}
            aria-pressed={isParallel}
            aria-label="Toggle parallel comparison view"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="18" rx="1" />
              <rect x="14" y="3" width="7" height="18" rx="1" />
            </svg>
            <span>Parallel</span>
          </button>

          {/* If parallel is active, show comparison edition selector */}
          {isParallel && (
            <button
              type="button"
              className={styles.editionChip}
              onClick={() => {
                setPickingParallelEdition(true);
                setIsEditionPickerOpen(true);
              }}
              title="Change parallel Bible translation"
              aria-label={`Parallel translation: ${parallelEdition.name}`}
            >
              <span>vs {parallelEdition.code}</span>
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {/* Voice Navigation Button */}
          <button
            type="button"
            className={styles.toolButton}
            onClick={() => setIsVoiceNavOpen(true)}
            aria-label="Voice scripture navigation"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            <span>Voice</span>
          </button>

          {/* Appearance & Zoom Button */}
          <button
            type="button"
            className={styles.toolButton}
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Adjust font size and reading settings"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            <span>{preferences.fontSize}px</span>
          </button>
        </div>

        {/* Slim Reading Progress Bar at Toolbar Edge */}
        <div className={styles.progressBarTrack} aria-hidden="true">
          <div
            className={styles.progressBarFill}
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* ============================================================
          2. READING SURFACE
          ============================================================ */}
      <article
        className={`${styles.readingSurface} ${isParallel ? styles.readingSurfaceParallel : ''}`}
        aria-label="Scripture text surface"
      >
        {/* Chapter Title Header */}
        <header className={styles.chapterHeader}>
          <h1 className={styles.chapterTitle}>
            {currentBook.names[locale] || currentBook.names.en} {chapterNumber}
          </h1>
          <div className={styles.chapterSubtitle}>
            {primaryEdition.name} ({primaryEdition.code}) ·{' '}
            {primaryChapterContent.totalVerses} Verses
          </div>
        </header>

        {/* ------------------------------------------------------------
            SINGLE TRANSLATION VIEW
            ------------------------------------------------------------ */}
        {!isParallel && (
          <div>
            {visiblePrimaryVerses.map((verse: VerseContent) => {
              const isSelected = selectedVerseNumber === verse.verseNumber;
              const isBookmarked = bookmarks.some(
                (b) =>
                  b.bookId === bookId &&
                  b.chapterNumber === chapterNumber &&
                  b.verseNumber === verse.verseNumber,
              );
              const highlight = highlights.find(
                (h) =>
                  h.bookId === bookId &&
                  h.chapterNumber === chapterNumber &&
                  h.verseNumber === verse.verseNumber,
              );

              return (
                <div key={verse.verseNumber}>
                  {verse.heading && (
                    <h3 className={styles.sectionHeading}>{verse.heading}</h3>
                  )}
                  <div
                    id={`verse-${verse.verseNumber}`}
                    className={`${styles.verseBlock} ${isSelected ? styles.verseBlockSelected : ''}`}
                    onClick={() => {
                      setSelectedVerseNumber(verse.verseNumber);
                      setActiveVerseNumber(verse.verseNumber);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedVerseNumber(verse.verseNumber);
                        setActiveVerseNumber(verse.verseNumber);
                      }
                    }}
                    aria-label={`Verse ${verse.verseNumber}: ${verse.text}`}
                  >
                    {preferences.verseNumbers === 'superscript' && (
                      <sup className={styles.verseSuperscript}>
                        {verse.verseNumber}
                      </sup>
                    )}
                    {preferences.verseNumbers === 'inline' && (
                      <span className={styles.verseInlineNumber}>
                        {verse.verseNumber}.
                      </span>
                    )}

                    <span
                      className={`${styles.verseText} ${highlight ? styles[`highlight_${highlight.color}`] : ''}`}
                      style={dynamicTextStyle}
                    >
                      {verse.text}
                    </span>

                    {isBookmarked && (
                      <span
                        className={styles.bookmarkRibbon}
                        title="Bookmarked verse"
                      >
                        🔖
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------
            PARALLEL TRANSLATION VIEW (Side-by-side desktop, stacked mobile)
            ------------------------------------------------------------ */}
        {isParallel && (
          <div className={styles.parallelDesktopGrid}>
            {/* Left Column: Primary Edition */}
            <div className={styles.parallelColumn}>
              <div className={styles.parallelColHeader}>
                <span className={styles.colEditionTitle}>
                  {primaryEdition.name} ({primaryEdition.code})
                </span>
                <span style={{ fontSize: '12px', color: '#8b7038' }}>
                  {primaryEdition.licenseLabel}
                </span>
              </div>
              {visiblePrimaryVerses.map((v) => {
                const isSelected = selectedVerseNumber === v.verseNumber;
                return (
                  <div
                    key={`p1_${v.verseNumber}`}
                    className={`${styles.verseBlock} ${isSelected ? styles.verseBlockSelected : ''}`}
                    onClick={() => {
                      setSelectedVerseNumber(v.verseNumber);
                      setActiveVerseNumber(v.verseNumber);
                    }}
                    style={dynamicTextStyle}
                  >
                    {preferences.verseNumbers !== 'hidden' && (
                      <sup className={styles.verseSuperscript}>
                        {v.verseNumber}
                      </sup>
                    )}
                    <span>{v.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Comparison Edition */}
            <div className={styles.parallelColumn}>
              <div className={styles.parallelColHeader}>
                <span className={styles.colEditionTitle}>
                  {parallelEdition.name} ({parallelEdition.code})
                </span>
                <span style={{ fontSize: '12px', color: '#8b7038' }}>
                  {parallelEdition.licenseLabel}
                </span>
              </div>
              {visibleParallelVerses.map((v) => {
                const isSelected = selectedVerseNumber === v.verseNumber;
                return (
                  <div
                    key={`p2_${v.verseNumber}`}
                    className={`${styles.verseBlock} ${isSelected ? styles.verseBlockSelected : ''}`}
                    onClick={() => {
                      setSelectedVerseNumber(v.verseNumber);
                      setActiveVerseNumber(v.verseNumber);
                    }}
                    style={dynamicTextStyle}
                  >
                    {preferences.verseNumbers !== 'hidden' && (
                      <sup className={styles.verseSuperscript}>
                        {v.verseNumber}
                      </sup>
                    )}
                    <span>{v.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            3. 4-VERSE BATCHING CONTROLS & SENTINEL
            ============================================================ */}
        {hasMoreVerses && (
          <div className={styles.batchContainer}>
            <div className={styles.batchStatus}>
              Showing verses 1–{loadedVersesCount} of{' '}
              {primaryChapterContent.totalVerses}
            </div>
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={loadMoreVerses}
              aria-label={`Load next ${preferences.batchSize || 5} verses`}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span>
                Load Next Verses ({loadedVersesCount + 1}–
                {Math.min(
                  loadedVersesCount + (preferences.batchSize || 5),
                  primaryChapterContent.totalVerses,
                )}
                )
              </span>
            </button>
            {/* Smooth IntersectionObserver sentinel */}
            <div ref={sentinelRef} style={{ height: '1px' }} />
          </div>
        )}

        {/* End of Chapter Continuation Card */}
        {!hasMoreVerses && (
          <div className={styles.nextChapterCard}>
            <div
              style={{ fontSize: '13px', color: '#8B7038', fontWeight: 600 }}
            >
              End of Chapter {chapterNumber}
            </div>
            <div className={styles.nextChapterTitle}>
              Continue reading{' '}
              {currentBook.names[locale] || currentBook.names.en}{' '}
              {chapterNumber + 1}?
            </div>
            <button
              type="button"
              className={styles.nextChapterBtn}
              onClick={nextChapter}
              aria-label="Advance to next chapter"
            >
              <span>Next Chapter →</span>
            </button>
          </div>
        )}

        {/* Edition Attribution & Licensing Credit */}
        <footer className={styles.creditLine}>
          <div>
            <strong>{primaryEdition.name}</strong> ·{' '}
            {primaryEdition.licenseLabel} · {primaryEdition.copyright}
          </div>
          {isParallel && (
            <div style={{ marginTop: '4px' }}>
              <strong>{parallelEdition.name}</strong> ·{' '}
              {parallelEdition.licenseLabel} · {parallelEdition.copyright}
            </div>
          )}
        </footer>
      </article>

      {/* ============================================================
          4. BOTTOM CHAPTER NAVIGATION PILL BAR
          ============================================================ */}
      <div
        className={styles.bottomNavBar}
        role="navigation"
        aria-label="Chapter navigation"
      >
        <button
          type="button"
          className={styles.navArrowBtn}
          onClick={prevChapter}
          aria-label="Go to previous chapter"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Prev</span>
        </button>

        <div className={styles.navCenterLabel}>
          {currentBook.names[locale] || currentBook.names.en} {chapterNumber}
        </div>

        <button
          type="button"
          className={styles.navArrowBtn}
          onClick={nextChapter}
          aria-label="Go to next chapter"
        >
          <span>Next</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ============================================================
          5. FLOATING VERSE ACTION BAR (When verse selected)
          ============================================================ */}
      {selectedVerseObj && (
        <VerseActionBar
          bookName={currentBook.names[locale] || currentBook.names.en}
          chapterNumber={chapterNumber}
          verseNumber={selectedVerseObj.verseNumber}
          verseText={selectedVerseObj.text}
          editionCode={primaryEdition.code}
          isBookmarked={isSelectedVerseBookmarked}
          currentHighlightColor={selectedVerseHighlight}
          onHighlight={(color: HighlightColor) =>
            addHighlight(selectedVerseObj.verseNumber, color)
          }
          onRemoveHighlight={() =>
            removeHighlight(selectedVerseObj.verseNumber)
          }
          onToggleBookmark={() => toggleBookmark(selectedVerseObj.verseNumber)}
          onClose={() => setSelectedVerseNumber(null)}
        />
      )}

      {/* ============================================================
          6. MODALS & PICKERS
          ============================================================ */}
      <BookPicker
        isOpen={isBookPickerOpen}
        onClose={() => setIsBookPickerOpen(false)}
        currentBookId={bookId}
        currentChapter={chapterNumber}
        currentVerse={activeVerseNumber}
        onSelect={(bId, ch, v) => navigateTo(bId, ch, v || 1)}
        locale={locale}
      />

      <EditionPicker
        isOpen={isEditionPickerOpen}
        onClose={() => setIsEditionPickerOpen(false)}
        selectedEditionId={
          pickingParallelEdition ? parallelEditionId : primaryEditionId
        }
        onSelect={(edId) => {
          if (pickingParallelEdition) setParallelEditionId(edId);
          else setPrimaryEditionId(edId);
        }}
        title={
          pickingParallelEdition
            ? 'Select Parallel Translation'
            : 'Select Primary Translation'
        }
      />

      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdate={updatePreferences}
      />

      <VoiceNavigator
        isOpen={isVoiceNavOpen}
        onClose={() => setIsVoiceNavOpen(false)}
        onNavigate={(bId, ch, v) => navigateTo(bId, ch, v || 1)}
        onNextChapter={nextChapter}
        onPrevChapter={prevChapter}
      />
    </div>
  );
}
