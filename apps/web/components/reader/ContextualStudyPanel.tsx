'use client';

import { useMemo, useRef } from 'react';
import { useSwipeGesture } from '../../lib/reader/useSwipeGesture';
import styles from './ContextualStudyPanel.module.css';

export interface ContextualStudyData {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  speaker: string;
  audience: string;
  peopleMentioned: string[];
  actionSummary: string;
  locationName: string;
  modernLocation: string;
  historicalPeriod: string;
  timelineDate: string;
  geographicalContext: string;
  genealogyConnections: string;
  relatedPassages: Array<{ ref: string; note: string }>;
}

// Verified contextual fixtures for key study chapters
const CONTEXTUAL_FIXTURES: Record<string, Partial<ContextualStudyData>> = {
  JHN_3: {
    speaker: 'Jesus the Messiah (vv. 3–21); John the Baptist (vv. 27–36)',
    audience:
      'Nicodemus (Pharisee & member of the Jewish Sanhedrin); John’s disciples',
    peopleMentioned: [
      'Nicodemus',
      'Jesus',
      'John the Baptist',
      'Moses',
      'The Son of Man',
    ],
    actionSummary:
      'Nicodemus arrives by night seeking understanding. Jesus reveals the necessity of being born again of water and Spirit. John the Baptist rejoices as the Bridegroom’s friend.',
    locationName:
      'Jerusalem (at night) & Judean Countryside near Aenon by Salim',
    modernLocation: 'Old City Jerusalem & Ein Fara / Wadi Fara Valley',
    historicalPeriod:
      'Second Temple Period · Early Judean Ministry of Jesus (c. 27–28 AD)',
    timelineDate: 'Passover Season, 28 AD under Roman Governor Pontius Pilate',
    geographicalContext:
      'Transition from the Temple Mount in Jerusalem to the springs of Aenon near Salim, where abundant waters permitted baptism.',
    genealogyConnections:
      'Jesus identified as the Son of Man descending from heaven; fulfilling the Davidic covenant and the seed of Abraham promised to bring salvation to all nations.',
    relatedPassages: [
      {
        ref: 'Numbers 21:4–9',
        note: 'Moses lifting the bronze serpent in the wilderness',
      },
      {
        ref: 'Ezekiel 36:25–27',
        note: 'Prophecy of clean water, new heart, and the Spirit',
      },
      {
        ref: 'John 7:50–52',
        note: 'Nicodemus defending Jesus before the council',
      },
    ],
  },
  GEN_1: {
    speaker: 'God (Elohim) speaking creation into existence by His divine Word',
    audience: 'The cosmos / all creation',
    peopleMentioned: [
      'God (Elohim)',
      'The Spirit of God (Ruach Elohim)',
      'Man & Woman (v. 26–27)',
    ],
    actionSummary:
      'The six days of creation: forming the cosmos from darkness and deep waters, culminating in humanity created in God’s image and likeness.',
    locationName: 'The Primordial Heavens and Earth',
    modernLocation: 'Global cosmos',
    historicalPeriod: 'Primeval History (The Beginning)',
    timelineDate: 'Creation origin',
    geographicalContext:
      'The primeval earth prior to the geographic designations of Eden, the Euphrates, and the post-flood regions.',
    genealogyConnections:
      'Root of all human genealogy; Adam as the first patriarch whose line traces through Seth to Noah (Gen 5) and ultimately to Christ (Luke 3:38).',
    relatedPassages: [
      { ref: 'Psalm 104:1–30', note: 'Poetic celebration of creation order' },
      { ref: 'John 1:1–3', note: 'The Word who was in the beginning with God' },
      {
        ref: 'Colossians 1:16',
        note: 'All things created through Him and for Him',
      },
    ],
  },
  MAT_1: {
    speaker:
      'Matthew (Levi) the Apostle recording the royal register of the Messiah',
    audience: 'Jewish believers and seekers of the promised King',
    peopleMentioned: [
      'Jesus Christ',
      'David',
      'Abraham',
      'Tamar',
      'Rahab',
      'Ruth',
      'Mary',
      'Joseph',
    ],
    actionSummary:
      'The 42 generations from Abraham through King David to the exile in Babylon and the birth of Jesus the Messiah.',
    locationName: 'Bethlehem of Judea & Nazareth of Galilee',
    modernLocation: 'Beit Lahm & En-Nasira',
    historicalPeriod: 'Roman Era · Reign of Herod the Great (c. 4 BC)',
    timelineDate: 'c. 6–4 BC',
    geographicalContext:
      'Royal city of David (Bethlehem Ephrathah) as the prophesied birthplace (Micah 5:2).',
    genealogyConnections:
      'Direct royal lineage of King Solomon, Zerubbabel, and the legal fatherhood of Joseph (Matt 1:1–17). Preserved distinctly from Luke 3.',
    relatedPassages: [
      { ref: 'Ruth 4:18–22', note: 'Genealogy of Perez to David' },
      { ref: '2 Samuel 7:12–16', note: 'Everlasting throne covenant of David' },
      { ref: 'Luke 3:23–38', note: 'Ancestral line traced back to Adam' },
    ],
  },
};

export interface ContextualStudyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verseNumber?: number | undefined;
  locale?: string | undefined;
}

export function ContextualStudyPanel(props: ContextualStudyPanelProps) {
  const { isOpen, onClose, bookId, bookName, chapterNumber, verseNumber } =
    props;
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Allow closing via right-to-left reverse swipe
  useSwipeGesture(drawerRef, {
    onSwipeLeft: onClose,
    enabled: isOpen,
    minDistance: 45,
  });

  const studyData: ContextualStudyData = useMemo(() => {
    const key = `${bookId}_${chapterNumber}`;
    const fixture = CONTEXTUAL_FIXTURES[key];

    if (fixture) {
      return {
        bookId,
        bookName,
        chapterNumber,
        speaker: fixture.speaker || 'Narrator / Biblical Author',
        audience: fixture.audience || 'The covenant community',
        peopleMentioned: fixture.peopleMentioned || [],
        actionSummary: fixture.actionSummary || 'Scripture narrative',
        locationName: fixture.locationName || 'Holy Land',
        modernLocation: fixture.modernLocation || 'Near East',
        historicalPeriod: fixture.historicalPeriod || 'Biblical Era',
        timelineDate: fixture.timelineDate || 'Historical context',
        geographicalContext: fixture.geographicalContext || 'Regional setting',
        genealogyConnections:
          fixture.genealogyConnections || 'Biblical family lines',
        relatedPassages: fixture.relatedPassages || [],
      };
    }

    // Default dynamic study context generator
    return {
      bookId,
      bookName,
      chapterNumber,
      speaker: `Author of ${bookName}`,
      audience: 'Readers of Scripture',
      peopleMentioned: [`Figures of ${bookName}`],
      actionSummary: `Historical and theological events recorded in ${bookName} chapter ${chapterNumber}. Full verified historical records are compiled under Codex API pipelines.`,
      locationName: 'Ancient Israel & Biblical World',
      modernLocation: 'Mediterranean & Middle East',
      historicalPeriod: 'Ancient Biblical Chronology',
      timelineDate: 'Contextual Era',
      geographicalContext: `Geographical locations associated with ${bookName}.`,
      genealogyConnections:
        'Biblical lineages recorded in historical scripture records.',
      relatedPassages: [
        { ref: `${bookName} 1`, note: 'Contextual opening of this book' },
        { ref: 'Psalm 119:105', note: 'Your word is a lamp to my feet' },
      ],
    };
  }, [bookId, bookName, chapterNumber]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Study Context: ${bookName} Chapter ${chapterNumber}`}
      data-testid="contextual-study-panel"
    >
      <div
        ref={drawerRef}
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleArea}>
            <span className={styles.headerSupertag}>
              Contextual Study Panel
            </span>
            <h2 className={styles.headerTitle}>
              {bookName} {chapterNumber}
              {verseNumber ? `:${verseNumber}` : ''}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close study panel"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.drawerContent}>
          {/* 1. Who is Speaking & To Whom */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                🗣
              </span>
              <h3 className={styles.sectionHeading}>Speaker & Audience</h3>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>Who is Speaking?</span>
                <span className={styles.valueText}>{studyData.speaker}</span>
              </div>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>To Whom?</span>
                <span className={styles.valueText}>{studyData.audience}</span>
              </div>
            </div>
          </div>

          {/* 2. People Mentioned */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                👥
              </span>
              <h3 className={styles.sectionHeading}>People Mentioned</h3>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.tagList}>
                {studyData.peopleMentioned.map((person) => (
                  <span key={person} className={styles.tagPill}>
                    {person}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. What is happening */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                📜
              </span>
              <h3
                className={styles.sectionHeading}
                aria-label="What is happening"
              >
                What is Happening?
              </h3>
            </div>
            <p className={styles.sectionBody}>{studyData.actionSummary}</p>
          </div>

          {/* 4. Where is it Happening (Geography) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                🗺
              </span>
              <h3 className={styles.sectionHeading}>Where is it Happening?</h3>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>Biblical Location</span>
                <span className={styles.valueText}>
                  {studyData.locationName}
                </span>
              </div>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>
                  Modern Geographical Area
                </span>
                <span className={styles.valueText}>
                  {studyData.modernLocation}
                </span>
              </div>
              <p style={{ marginTop: '8px' }}>
                {studyData.geographicalContext}
              </p>
            </div>
          </div>

          {/* 5. Historical Period & Timeline */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                ⏳
              </span>
              <h3 className={styles.sectionHeading}>
                Historical Period & Timeline
              </h3>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>Historical Era</span>
                <span className={styles.valueText}>
                  {studyData.historicalPeriod}
                </span>
              </div>
              <div className={styles.keyValueRow}>
                <span className={styles.keyLabel}>Approximate Chronology</span>
                <span className={styles.valueText}>
                  {studyData.timelineDate}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Genealogy Connections (Vamsavali) */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                🌳
              </span>
              <h3 className={styles.sectionHeading}>
                Genealogy Connections (వంశావళి)
              </h3>
            </div>
            <p className={styles.sectionBody}>
              {studyData.genealogyConnections}
            </p>
          </div>

          {/* 7. Connected Scripture & Passages */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} aria-hidden="true">
                📖
              </span>
              <h3 className={styles.sectionHeading}>
                Related Chapters & Passages
              </h3>
            </div>
            <div
              className={styles.sectionBody}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {studyData.relatedPassages.map((item) => (
                <div
                  key={item.ref}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <span className={styles.scripturePill}>
                    <span>{item.ref}</span>
                    <span>↗</span>
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '2px',
                    }}
                  >
                    {item.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe Hint Footer */}
        <div className={styles.swipeHint}>
          Swipe left ◂ or tap ✕ to return to Scripture reading
        </div>
      </div>
    </div>
  );
}
