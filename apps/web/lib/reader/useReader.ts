'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  BibleBook,
  BibleEdition,
  ChapterContent,
  Highlight,
  HighlightColor,
  Bookmark,
  ReaderPreferences,
  ReadingPosition,
} from '../../data/bible/types';
import { BIBLE_BOOKS, getBook } from '../../data/bible/books';
import {
  BIBLE_EDITIONS,
  DEFAULT_PRIMARY_EDITION,
  DEFAULT_PARALLEL_EDITION,
  getEdition,
} from '../../data/bible/editions';
import { getChapterContent } from '../../data/bible/fixtures';

const STORAGE_KEYS = {
  LAST_POSITION: 'understand_bible_last_reading_pos',
  BOOKMARKS: 'understand_bible_bookmarks',
  HIGHLIGHTS: 'understand_bible_highlights',
  PREFERENCES: 'understand_bible_reader_prefs',
};

const DEFAULT_PREFERENCES: ReaderPreferences = {
  fontSize: 18,
  lineSpacing: 1.8,
  fontFamily: 'serif',
  verseNumbers: 'superscript',
  linkScrolling: true,
  batchSize: 5,
};

export function useReader(
  initialBookId = 'JHN',
  initialChapter = 3,
  initialVerse = 1,
) {
  // Navigation State
  const [bookId, setBookId] = useState<string>(initialBookId);
  const [chapterNumber, setChapterNumber] = useState<number>(initialChapter);
  const [targetVerseNumber, setTargetVerseNumber] =
    useState<number>(initialVerse);
  const [activeVerseNumber, setActiveVerseNumber] =
    useState<number>(initialVerse);

  // Editions & Parallel state
  const [primaryEditionId, setPrimaryEditionId] = useState<string>(
    DEFAULT_PRIMARY_EDITION,
  );
  const [isParallel, setIsParallel] = useState<boolean>(false);
  const [parallelEditionId, setParallelEditionId] = useState<string>(
    DEFAULT_PARALLEL_EDITION,
  );

  // Verses Batching state (default 5 verses, user-adjustable)
  const [loadedVersesCount, setLoadedVersesCount] = useState<number>(5);

  // Reader Preferences
  const [preferences, setPreferences] =
    useState<ReaderPreferences>(DEFAULT_PREFERENCES);

  // User Annotations
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Dialog / Modal Visibility States
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [isEditionPickerOpen, setIsEditionPickerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceNavOpen, setIsVoiceNavOpen] = useState(false);

  // Active selected verse for Action Bar
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(
    null,
  );

  // Current Book & Chapter Content
  const currentBook: BibleBook = useMemo(() => getBook(bookId), [bookId]);
  const primaryEdition: BibleEdition = useMemo(
    () => getEdition(primaryEditionId),
    [primaryEditionId],
  );
  const parallelEdition: BibleEdition = useMemo(
    () => getEdition(parallelEditionId),
    [parallelEditionId],
  );

  const primaryChapterContent: ChapterContent = useMemo(
    () => getChapterContent(bookId, chapterNumber, primaryEditionId),
    [bookId, chapterNumber, primaryEditionId],
  );

  const parallelChapterContent: ChapterContent = useMemo(
    () => getChapterContent(bookId, chapterNumber, parallelEditionId),
    [bookId, chapterNumber, parallelEditionId],
  );

  // Reading Progress percentage (0 - 100)
  const readingProgress = useMemo(() => {
    if (!primaryChapterContent.totalVerses) return 0;
    return Math.min(
      100,
      Math.round((activeVerseNumber / primaryChapterContent.totalVerses) * 100),
    );
  }, [activeVerseNumber, primaryChapterContent.totalVerses]);

  // Load saved state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Restore preferences
      const savedPrefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (savedPrefs) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(savedPrefs) }));
      }

      // 2. Restore bookmarks
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      // 3. Restore highlights
      const savedHighlights = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }

      // 4. Restore last reading position if no explicit URL parameters
      const savedPosition = localStorage.getItem(STORAGE_KEYS.LAST_POSITION);
      if (savedPosition) {
        const pos: ReadingPosition = JSON.parse(savedPosition);
        if (pos.bookId && pos.chapterNumber) {
          setBookId(pos.bookId);
          setChapterNumber(pos.chapterNumber);
          setTargetVerseNumber(pos.verseNumber || 1);
          setActiveVerseNumber(pos.verseNumber || 1);
          if (pos.editionId) setPrimaryEditionId(pos.editionId);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Save reading position (debounced & on unmount/visibility change)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const persistCurrentPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const pos: ReadingPosition = {
        bookId,
        chapterNumber,
        verseNumber: activeVerseNumber,
        editionId: primaryEditionId,
        scrollPercentage: readingProgress,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(pos));
    } catch {
      // Ignore
    }
  }, [
    bookId,
    chapterNumber,
    activeVerseNumber,
    primaryEditionId,
    readingProgress,
  ]);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(persistCurrentPosition, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [persistCurrentPosition]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistCurrentPosition();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', persistCurrentPosition);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', persistCurrentPosition);
    };
  }, [persistCurrentPosition]);

  // Reset batching when changing chapter or book
  useEffect(() => {
    const size = preferences.batchSize || 5;
    setLoadedVersesCount(size);
    setSelectedVerseNumber(null);
  }, [bookId, chapterNumber, preferences.batchSize]);

  // Navigation Handlers
  const navigateTo = useCallback(
    (newBookId: string, newChapter: number, newVerse = 1) => {
      setBookId(newBookId);
      setChapterNumber(newChapter);
      setTargetVerseNumber(newVerse);
      setActiveVerseNumber(newVerse);
      const size = preferences.batchSize || 5;
      setLoadedVersesCount(Math.max(size, Math.ceil(newVerse / size) * size));
      setIsBookPickerOpen(false);
    },
    [preferences.batchSize],
  );

  const nextChapter = useCallback(() => {
    if (chapterNumber < currentBook.chaptersCount) {
      navigateTo(bookId, chapterNumber + 1, 1);
    } else {
      // Go to next book
      const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[bookIndex + 1];
        if (nextBook) {
          navigateTo(nextBook.id, 1, 1);
        }
      }
    }
  }, [chapterNumber, currentBook, bookId, navigateTo]);

  const prevChapter = useCallback(() => {
    if (chapterNumber > 1) {
      navigateTo(bookId, chapterNumber - 1, 1);
    } else {
      // Go to previous book last chapter
      const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        if (prevBook) {
          navigateTo(prevBook.id, prevBook.chaptersCount, 1);
        }
      }
    }
  }, [chapterNumber, currentBook, bookId, navigateTo]);

  // Batching Handler: reveal next batch of verses smoothly
  const loadMoreVerses = useCallback(() => {
    setLoadedVersesCount((prev) => {
      if (prev >= primaryChapterContent.totalVerses) return prev;
      const step = preferences.batchSize || 5;
      return Math.min(prev + step, primaryChapterContent.totalVerses);
    });
  }, [primaryChapterContent.totalVerses, preferences.batchSize]);

  // Highlights & Bookmarks
  const addHighlight = useCallback(
    (vNum: number, color: HighlightColor) => {
      setHighlights((prev) => {
        const filtered = prev.filter(
          (h) =>
            !(
              h.bookId === bookId &&
              h.chapterNumber === chapterNumber &&
              h.verseNumber === vNum
            ),
        );
        const updated = [
          ...filtered,
          {
            id: `${bookId}_${chapterNumber}_${vNum}_${Date.now()}`,
            bookId,
            chapterNumber,
            verseNumber: vNum,
            color,
            editionId: primaryEditionId,
            createdAt: new Date().toISOString(),
          },
        ];
        try {
          localStorage.setItem(
            STORAGE_KEYS.HIGHLIGHTS,
            JSON.stringify(updated),
          );
        } catch {
          // Ignore storage quota/disabled errors
        }
        return updated;
      });
      setSelectedVerseNumber(null);
    },
    [bookId, chapterNumber, primaryEditionId],
  );

  const removeHighlight = useCallback(
    (vNum: number) => {
      setHighlights((prev) => {
        const updated = prev.filter(
          (h) =>
            !(
              h.bookId === bookId &&
              h.chapterNumber === chapterNumber &&
              h.verseNumber === vNum
            ),
        );
        try {
          localStorage.setItem(
            STORAGE_KEYS.HIGHLIGHTS,
            JSON.stringify(updated),
          );
        } catch {
          // Ignore storage quota/disabled errors
        }
        return updated;
      });
      setSelectedVerseNumber(null);
    },
    [bookId, chapterNumber],
  );

  const toggleBookmark = useCallback(
    (vNum: number, note?: string) => {
      setBookmarks((prev) => {
        const existing = prev.find(
          (b) =>
            b.bookId === bookId &&
            b.chapterNumber === chapterNumber &&
            b.verseNumber === vNum,
        );
        let updated: Bookmark[];
        if (existing) {
          updated = prev.filter((b) => b.id !== existing.id);
        } else {
          updated = [
            ...prev,
            {
              id: `${bookId}_${chapterNumber}_${vNum}_${Date.now()}`,
              bookId,
              chapterNumber,
              verseNumber: vNum,
              editionId: primaryEditionId,
              note,
              createdAt: new Date().toISOString(),
            },
          ];
        }
        try {
          localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
        } catch {
          // Ignore storage quota/disabled errors
        }
        return updated;
      });
    },
    [bookId, chapterNumber, primaryEditionId],
  );

  const updatePreferences = useCallback(
    (partial: Partial<ReaderPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...partial };
        try {
          localStorage.setItem(
            STORAGE_KEYS.PREFERENCES,
            JSON.stringify(updated),
          );
        } catch {
          // Ignore storage quota/disabled errors
        }
        return updated;
      });
    },
    [],
  );

  return {
    // Current scripture location
    bookId,
    chapterNumber,
    targetVerseNumber,
    activeVerseNumber,
    setActiveVerseNumber,
    currentBook,
    primaryChapterContent,
    parallelChapterContent,

    // Editions
    allEditions: BIBLE_EDITIONS,
    primaryEdition,
    parallelEdition,
    primaryEditionId,
    setPrimaryEditionId,
    parallelEditionId,
    setParallelEditionId,
    isParallel,
    setIsParallel,
    toggleParallel: () => setIsParallel((p) => !p),

    // 4-verse Batching
    loadedVersesCount,
    loadMoreVerses,
    hasMoreVerses: loadedVersesCount < primaryChapterContent.totalVerses,

    // Preferences & Zoom
    preferences,
    updatePreferences,

    // Annotations
    bookmarks,
    highlights,
    addHighlight,
    removeHighlight,
    toggleBookmark,
    selectedVerseNumber,
    setSelectedVerseNumber,

    // Progress & Navigation
    readingProgress,
    navigateTo,
    nextChapter,
    prevChapter,

    // Modals
    isBookPickerOpen,
    setIsBookPickerOpen,
    isEditionPickerOpen,
    setIsEditionPickerOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isVoiceNavOpen,
    setIsVoiceNavOpen,
  };
}
