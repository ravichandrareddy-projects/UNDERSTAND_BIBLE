'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { BibleBook } from '../../data/bible/types';
import { BIBLE_BOOKS, getBook } from '../../data/bible/books';
import { getChapterContent } from '../../data/bible/fixtures';
import styles from './BookPicker.module.css';

interface BookPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookId: string;
  currentChapter: number;
  currentVerse: number;
  onSelect: (bookId: string, chapter: number, verse?: number) => void;
  locale?: 'en' | 'te' | 'ar';
}

type TabMode = 'books' | 'chapters' | 'verses';
type TestamentFilter = 'all' | 'OT' | 'NT';

export function BookPicker({
  isOpen,
  onClose,
  currentBookId,
  currentChapter,
  currentVerse,
  onSelect,
  locale = 'en',
}: BookPickerProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('books');
  const [selectedBookId, setSelectedBookId] = useState<string>(currentBookId);
  const [selectedChapter, setSelectedChapter] =
    useState<number>(currentChapter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testamentFilter, setTestamentFilter] =
    useState<TestamentFilter>('all');

  // Reset local selection when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedBookId(currentBookId);
      setSelectedChapter(currentChapter);
      setActiveTab('books');
      setSearchQuery('');
    }
  }, [isOpen, currentBookId, currentChapter]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedBook: BibleBook = useMemo(
    () => getBook(selectedBookId),
    [selectedBookId],
  );

  // Filtered books
  const filteredBooks = useMemo(() => {
    let list = BIBLE_BOOKS;

    if (testamentFilter !== 'all') {
      list = list.filter((b) => b.testament === testamentFilter);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((b) => {
      if (b.id.toLowerCase().includes(q)) return true;
      if (b.names[locale]?.toLowerCase().includes(q)) return true;
      if (b.names.en.toLowerCase().includes(q)) return true;
      if (b.abbreviations[locale]?.some((a) => a.toLowerCase().includes(q)))
        return true;
      if (b.abbreviations.en.some((a) => a.toLowerCase().includes(q)))
        return true;
      return false;
    });
  }, [testamentFilter, searchQuery, locale]);

  // Chapter count for selected book
  const chaptersArray = useMemo(() => {
    const count = selectedBook.chaptersCount || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedBook]);

  // Verses count for selected book & chapter
  const versesArray = useMemo(() => {
    const content = getChapterContent(selectedBookId, selectedChapter, 'web');
    const total = content.totalVerses || 20;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [selectedBookId, selectedChapter]);

  const handleBookClick = useCallback((book: BibleBook) => {
    setSelectedBookId(book.id);
    setSelectedChapter(1);
    setActiveTab('chapters');
  }, []);

  const handleChapterClick = useCallback((ch: number) => {
    setSelectedChapter(ch);
    setActiveTab('verses');
  }, []);

  const handleVerseClick = useCallback(
    (v: number) => {
      onSelect(selectedBookId, selectedChapter, v);
      onClose();
    },
    [onSelect, selectedBookId, selectedChapter, onClose],
  );

  const handleConfirmDirect = useCallback(() => {
    onSelect(selectedBookId, selectedChapter, 1);
    onClose();
  }, [onSelect, selectedBookId, selectedChapter, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 id="picker-title" className={styles.title}>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#C5A15A"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>
              {locale === 'te'
                ? 'లేఖన భాగమును ఎంచుకోండి'
                : locale === 'ar'
                  ? 'اختر السفر والأصحاح'
                  : 'Select Scripture'}
            </span>
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close picker"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs: Books -> Chapters -> Verses */}
        <div className={styles.tabsRow} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'books'}
            className={`${styles.tabBtn} ${activeTab === 'books' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('books')}
          >
            {locale === 'te'
              ? 'గ్రంథములు'
              : locale === 'ar'
                ? 'الأسفار'
                : '1. Books'}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'chapters'}
            className={`${styles.tabBtn} ${activeTab === 'chapters' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('chapters')}
          >
            {locale === 'te'
              ? 'అధ్యాయములు'
              : locale === 'ar'
                ? 'الأصحاحات'
                : '2. Chapters'}{' '}
            ({selectedBook.names[locale] || selectedBook.names.en})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'verses'}
            className={`${styles.tabBtn} ${activeTab === 'verses' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('verses')}
          >
            {locale === 'te'
              ? 'వచనములు'
              : locale === 'ar'
                ? 'الآيات'
                : '3. Verses'}{' '}
            ({selectedChapter})
          </button>
        </div>

        {/* Tab 1: Books */}
        {activeTab === 'books' && (
          <>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <svg
                  className={styles.searchIcon}
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={
                    locale === 'te'
                      ? 'గ్రంథాన్ని వెతకండి (ఉదా: ఆది, యోహా, కీర్తనలు)...'
                      : locale === 'ar'
                        ? 'ابحث عن سفر (مثال: تكوين، يوحنا، مزمور)...'
                        : 'Search book name or abbreviation (e.g. Gen, John, Ps)...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearch}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className={styles.filterPills}>
                <button
                  type="button"
                  className={`${styles.pill} ${testamentFilter === 'all' ? styles.pillActive : ''}`}
                  onClick={() => setTestamentFilter('all')}
                >
                  {locale === 'te'
                    ? 'అన్నీ (66)'
                    : locale === 'ar'
                      ? 'الكل (66)'
                      : 'All Books (66)'}
                </button>
                <button
                  type="button"
                  className={`${styles.pill} ${testamentFilter === 'OT' ? styles.pillActive : ''}`}
                  onClick={() => setTestamentFilter('OT')}
                >
                  {locale === 'te'
                    ? 'పాత నిబంధన (39)'
                    : locale === 'ar'
                      ? 'العهد القديم (39)'
                      : 'Old Testament (39)'}
                </button>
                <button
                  type="button"
                  className={`${styles.pill} ${testamentFilter === 'NT' ? styles.pillActive : ''}`}
                  onClick={() => setTestamentFilter('NT')}
                >
                  {locale === 'te'
                    ? 'క్రొత్త నిబంధన (27)'
                    : locale === 'ar'
                      ? 'العهد الجديد (27)'
                      : 'New Testament (27)'}
                </button>
              </div>
            </div>

            <div className={styles.contentArea}>
              <div className={styles.booksGrid}>
                {filteredBooks.map((book) => {
                  const isSelected = book.id === selectedBookId;
                  return (
                    <button
                      key={book.id}
                      type="button"
                      className={`${styles.bookCard} ${isSelected ? styles.bookCardSelected : ''}`}
                      onClick={() => handleBookClick(book)}
                    >
                      <span className={styles.bookName}>
                        {book.names[locale] || book.names.en}
                      </span>
                      <div className={styles.bookMeta}>
                        <span>
                          {book.chaptersCount}{' '}
                          {locale === 'te'
                            ? 'అధ్యా.'
                            : locale === 'ar'
                              ? 'إصحاح'
                              : 'ch.'}
                        </span>
                        <span className={styles.testamentBadge}>
                          {book.testament}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Chapters */}
        {activeTab === 'chapters' && (
          <div className={styles.contentArea}>
            <div className={styles.selectionSummary}>
              <span>Selected:</span>
              <span className={styles.summaryHighlight}>
                {selectedBook.names[locale] || selectedBook.names.en}
              </span>
              <span>· Choose chapter or</span>
              <button
                type="button"
                className={styles.pill}
                onClick={handleConfirmDirect}
                style={{
                  marginLeft: 'auto',
                  fontWeight: 600,
                  color: '#183D32',
                }}
              >
                Read Ch. {selectedChapter} →
              </button>
            </div>

            <div className={styles.numbersGrid}>
              {chaptersArray.map((ch) => {
                const isActive =
                  ch === selectedChapter && selectedBook.id === currentBookId;
                return (
                  <button
                    key={ch}
                    type="button"
                    className={`${styles.numberButton} ${isActive ? styles.numberButtonActive : ''} ${ch === currentChapter && selectedBook.id === currentBookId ? styles.numberButtonCurrent : ''}`}
                    onClick={() => handleChapterClick(ch)}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Verses */}
        {activeTab === 'verses' && (
          <div className={styles.contentArea}>
            <div className={styles.selectionSummary}>
              <span>Selected:</span>
              <span className={styles.summaryHighlight}>
                {selectedBook.names[locale] || selectedBook.names.en}{' '}
                {selectedChapter}
              </span>
              <span>· Jump to verse:</span>
            </div>

            <div className={styles.numbersGrid}>
              {versesArray.map((v) => {
                const isActive =
                  v === currentVerse &&
                  selectedChapter === currentChapter &&
                  selectedBook.id === currentBookId;
                return (
                  <button
                    key={v}
                    type="button"
                    className={`${styles.numberButton} ${isActive ? styles.numberButtonActive : ''}`}
                    onClick={() => handleVerseClick(v)}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
