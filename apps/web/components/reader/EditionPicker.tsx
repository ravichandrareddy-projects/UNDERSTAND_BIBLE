'use client';

import { useEffect } from 'react';
import type { BibleEdition } from '../../data/bible/types';
import { BIBLE_EDITIONS } from '../../data/bible/editions';
import styles from './EditionPicker.module.css';

interface EditionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEditionId: string;
  onSelect: (editionId: string) => void;
  title?: string;
}

export function EditionPicker({
  isOpen,
  onClose,
  selectedEditionId,
  onSelect,
  title = 'Select Bible Edition',
}: EditionPickerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edition-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="edition-title" className={styles.title}>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#C5A15A"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{title}</span>
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close edition picker"
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

        <div className={styles.list}>
          {BIBLE_EDITIONS.map((ed: BibleEdition) => {
            const isSelected = ed.id === selectedEditionId;
            return (
              <button
                key={ed.id}
                type="button"
                className={`${styles.editionCard} ${isSelected ? styles.editionCardSelected : ''}`}
                onClick={() => {
                  onSelect(ed.id);
                  onClose();
                }}
              >
                <div className={styles.editionHeader}>
                  <span className={styles.editionName}>{ed.name}</span>
                  <span className={styles.licenseBadge}>{ed.licenseLabel}</span>
                </div>
                <div className={styles.editionMeta}>
                  <span>Code: {ed.code}</span> ·{' '}
                  <span>Lang: {ed.language.toUpperCase()}</span> ·{' '}
                  <span>{ed.year ? `Year ${ed.year}` : 'Historical'}</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#88857c',
                    marginTop: '2px',
                  }}
                >
                  {ed.copyright}
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.noticeBox}>
          <strong>Licensing Policy (G-LIC-1):</strong> Only approved
          public-domain and open-licensed pilot editions are displayed.
          Additional verified translations will be added as publisher agreements
          are finalized by Codex.
        </div>
      </div>
    </div>
  );
}
