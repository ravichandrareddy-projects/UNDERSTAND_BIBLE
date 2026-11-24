'use client';

import { useState } from 'react';
import styles from './UnderstandDrawer.module.css';

export interface UnderstandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookId?: string | undefined;
  bookName: string;
  chapterNumber: number;
  editionCode?: string | undefined;
  locale?: string | undefined;
}

export function UnderstandDrawer(props: UnderstandDrawerProps) {
  const {
    isOpen,
    onClose,
    bookId,
    bookName,
    chapterNumber,
    editionCode = 'WEB',
  } = props;
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>('quick');

  if (!isOpen) return null;

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Understand ${bookName} Chapter ${chapterNumber}`}
      data-testid="understand-drawer"
    >
      <div
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        data-book-id={bookId}
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleArea}>
            <span className={styles.headerSupertag}>
              Chapter UNDERSTAND Experience ({editionCode})
            </span>
            <h2 className={styles.headerTitle}>
              {bookName} {chapterNumber}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close assistant"
          >
            ✕
          </button>
        </div>

        {/* Reflective Re-Reading Prompt */}
        <div className={styles.rereadCallout}>
          <strong>Reflective Reading Principle:</strong> If a passage feels
          difficult, take a quiet moment to slowly re-read the chapter once more
          in its broader context before turning to analysis.
        </div>

        {/* Two-Tier Tabs */}
        <div className={styles.tabsRow} role="tablist">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'quick' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('quick')}
            role="tab"
            aria-selected={activeTab === 'quick'}
          >
            Quick Summary
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'detailed' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('detailed')}
            role="tab"
            aria-selected={activeTab === 'detailed'}
          >
            Detailed Breakdown
          </button>
        </div>

        {/* Content */}
        <div className={styles.drawerContent}>
          <div className={styles.devBadge}>
            Verified Theological Summary Fixture · Awaiting Codex Model
            Integration
          </div>

          {activeTab === 'quick' ? (
            /* Quick Executive Summary */
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  💡
                </span>
                <h3 className={styles.sectionHeading}>Key Chapter Takeaways</h3>
              </div>
              <ul className={styles.bulletList}>
                <li>
                  Nicodemus, a ruler of the Jews, acknowledges Jesus’ divine
                  signs by night.
                  <span className={styles.citationAnchor}>vv. 1–2</span>
                </li>
                <li>
                  Jesus reveals the foundation of the Kingdom: one must be born
                  from above of water and Spirit.
                  <span className={styles.citationAnchor}>vv. 3–8</span>
                </li>
                <li>
                  The bronze serpent in the wilderness foreshadows the Son of
                  Man being lifted up on the cross.
                  <span className={styles.citationAnchor}>vv. 14–15</span>
                </li>
                <li>
                  God’s supreme redemptive motive: eternal life through faith in
                  His one and only Son.
                  <span className={styles.citationAnchor}>vv. 16–17</span>
                </li>
                <li>
                  John the Baptist’s enduring humility:{' '}
                  <em>“He must increase, but I must decrease.”</em>
                  <span className={styles.citationAnchor}>v. 30</span>
                </li>
              </ul>
            </div>
          ) : (
            /* Detailed Structural Breakdown */
            <>
              {/* Who, What, Where, Why */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon} aria-hidden="true">
                    📜
                  </span>
                  <h3 className={styles.sectionHeading}>
                    Contextual Framework
                  </h3>
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div>
                    <strong style={{ color: '#8B7038' }}>WHO:</strong> Jesus,
                    Nicodemus (Sanhedrin scholar), John the Baptist, and Judean
                    disciples.
                  </div>
                  <div>
                    <strong style={{ color: '#8B7038' }}>WHAT:</strong>{' '}
                    Discourse on spiritual regeneration versus natural birth;
                    the paradox of the cross and light versus darkness.
                  </div>
                  <div>
                    <strong style={{ color: '#8B7038' }}>WHERE:</strong>{' '}
                    Jerusalem city (evening discourse) transitioning to Judean
                    countryside near Aenon by Salim.
                  </div>
                  <div>
                    <strong style={{ color: '#8B7038' }}>WHY:</strong> To
                    demonstrate that religious pedigree cannot substitute for
                    spiritual renewal by God’s Holy Spirit.
                  </div>
                </div>
              </div>

              {/* Historical Context */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon} aria-hidden="true">
                    🏛
                  </span>
                  <h3 className={styles.sectionHeading}>
                    Historical & Theological Setting
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text)',
                    lineHeight: 1.6,
                  }}
                >
                  Occurs during Jesus’ first recorded Passover in Jerusalem (c.
                  28 AD). Nicodemus represents the highest rabbinic scholarship
                  of the Second Temple period. Jesus challenges rabbinic
                  assumptions regarding lineage by invoking Ezekiel 36 (water
                  and Spirit).
                </p>
              </div>

              {/* Scripture Citations */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon} aria-hidden="true">
                    📖
                  </span>
                  <h3 className={styles.sectionHeading}>Scripture Anchors</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className={styles.citationAnchor}>Numbers 21:9</span>
                  <span className={styles.citationAnchor}>Ezekiel 36:26</span>
                  <span className={styles.citationAnchor}>John 1:12–13</span>
                  <span className={styles.citationAnchor}>Romans 8:14</span>
                  <span className={styles.citationAnchor}>Titus 3:5</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
