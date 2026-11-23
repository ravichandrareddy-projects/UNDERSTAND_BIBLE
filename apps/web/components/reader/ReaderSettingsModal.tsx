'use client';

import { useEffect } from 'react';
import type { ReaderPreferences } from '../../data/bible/types';
import styles from './ReaderSettingsModal.module.css';

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ReaderPreferences;
  onUpdate: (partial: Partial<ReaderPreferences>) => void;
}

export function ReaderSettingsModal({
  isOpen,
  onClose,
  preferences,
  onUpdate,
}: ReaderSettingsModalProps) {
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
      aria-labelledby="settings-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="settings-title" className={styles.title}>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#C5A15A"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Reader Appearance & Zoom</span>
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close settings"
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

        <div className={styles.body}>
          {/* 1. Font Size / Zoom */}
          <div className={styles.settingGroup}>
            <div className={styles.labelRow}>
              <span>Scripture Font Size</span>
              <span className={styles.valueTag}>{preferences.fontSize}px</span>
            </div>
            <div className={styles.sliderRow}>
              <button
                type="button"
                className={styles.sliderBtn}
                onClick={() =>
                  onUpdate({ fontSize: Math.max(14, preferences.fontSize - 2) })
                }
                aria-label="Decrease font size"
              >
                A-
              </button>
              <input
                type="range"
                min="14"
                max="28"
                step="1"
                value={preferences.fontSize}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                className={styles.slider}
                aria-label="Font size slider"
              />
              <button
                type="button"
                className={styles.sliderBtn}
                onClick={() =>
                  onUpdate({ fontSize: Math.min(28, preferences.fontSize + 2) })
                }
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          {/* 2. Line Spacing */}
          <div className={styles.settingGroup}>
            <div className={styles.labelRow}>
              <span>Line Spacing</span>
              <span className={styles.valueTag}>{preferences.lineSpacing}</span>
            </div>
            <div className={styles.buttonRow}>
              {[
                { label: 'Compact (1.5)', value: 1.5 },
                { label: 'Normal (1.8)', value: 1.8 },
                { label: 'Relaxed (2.2)', value: 2.2 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`${styles.optionBtn} ${preferences.lineSpacing === item.value ? styles.optionBtnActive : ''}`}
                  onClick={() => onUpdate({ lineSpacing: item.value })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Typography Family */}
          <div className={styles.settingGroup}>
            <div className={styles.labelRow}>
              <span>Scripture Typeface</span>
            </div>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={`${styles.optionBtn} ${preferences.fontFamily === 'serif' ? styles.optionBtnActive : ''}`}
                style={{ fontFamily: 'var(--font-serif)', fontSize: '15px' }}
                onClick={() => onUpdate({ fontFamily: 'serif' })}
              >
                Serif (Noto / Garamond)
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${preferences.fontFamily === 'sans' ? styles.optionBtnActive : ''}`}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '14px' }}
                onClick={() => onUpdate({ fontFamily: 'sans' })}
              >
                Sans-Serif (Clean)
              </button>
            </div>
          </div>

          {/* 4. Verse Numbers Style */}
          <div className={styles.settingGroup}>
            <div className={styles.labelRow}>
              <span>Verse Numbers</span>
            </div>
            <div className={styles.buttonRow}>
              {(['superscript', 'inline', 'hidden'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`${styles.optionBtn} ${preferences.verseNumbers === style ? styles.optionBtnActive : ''}`}
                  onClick={() => onUpdate({ verseNumbers: style })}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Parallel Synced Scrolling */}
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Link Parallel Scrolling</div>
              <div className={styles.toggleDesc}>
                Keep both translation columns synchronized while scrolling
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.linkScrolling}
              onChange={(e) => onUpdate({ linkScrolling: e.target.checked })}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#183D32',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
