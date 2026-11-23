'use client';

import { useState } from 'react';
import type { HighlightColor } from '../../data/bible/types';
import styles from './VerseActionBar.module.css';

interface VerseActionBarProps {
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  editionCode: string;
  isBookmarked: boolean;
  currentHighlightColor?: HighlightColor | undefined;
  onHighlight: (color: HighlightColor) => void;
  onRemoveHighlight: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
}

const HIGHLIGHT_COLORS: { color: HighlightColor; hex: string; name: string }[] =
  [
    { color: 'gold', hex: '#F7E4A1', name: 'Gold' },
    { color: 'mint', hex: '#BCE8D3', name: 'Mint' },
    { color: 'coral', hex: '#F9C6B8', name: 'Coral' },
    { color: 'sky', hex: '#BCE3F7', name: 'Sky' },
    { color: 'lavender', hex: '#E2CEF7', name: 'Lavender' },
  ];

export function VerseActionBar({
  bookName,
  chapterNumber,
  verseNumber,
  verseText,
  editionCode,
  isBookmarked,
  currentHighlightColor,
  onHighlight,
  onRemoveHighlight,
  onToggleBookmark,
  onClose,
}: VerseActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const formatted = `"${verseText}" — ${bookName} ${chapterNumber}:${verseNumber} (${editionCode})`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const formatted = `"${verseText}" — ${bookName} ${chapterNumber}:${verseNumber} (${editionCode})`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${bookName} ${chapterNumber}:${verseNumber}`,
          text: formatted,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className={styles.actionBar}
      role="toolbar"
      aria-label="Verse action bar"
    >
      <div className={styles.verseLabel}>v. {verseNumber}</div>

      {/* 5 Highlight Colors */}
      <div className={styles.colorPalette} aria-label="Highlight colors">
        {HIGHLIGHT_COLORS.map((hc) => {
          const isSelected = currentHighlightColor === hc.color;
          return (
            <button
              key={hc.color}
              type="button"
              className={styles.colorDot}
              style={{
                backgroundColor: hc.hex,
                borderColor: isSelected ? '#FFFFFF' : 'transparent',
              }}
              onClick={() => onHighlight(hc.color)}
              title={`Highlight with ${hc.name}`}
              aria-label={`Highlight with ${hc.name}`}
            />
          );
        })}
        {currentHighlightColor && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onRemoveHighlight}
            style={{ fontSize: '11px', padding: '2px 4px' }}
            title="Remove highlight"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.divider} />

      {/* Bookmark Button */}
      <button
        type="button"
        className={`${styles.actionBtn} ${isBookmarked ? styles.actionBtnActive : ''}`}
        onClick={onToggleBookmark}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
      </button>

      {/* Copy Button */}
      <button
        type="button"
        className={styles.actionBtn}
        onClick={handleCopy}
        aria-label="Copy verse"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Share Button */}
      <button
        type="button"
        className={styles.actionBtn}
        onClick={handleShare}
        aria-label="Share verse"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>Share</span>
      </button>

      {/* Close Button */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close action bar"
      >
        ✕
      </button>
    </div>
  );
}
