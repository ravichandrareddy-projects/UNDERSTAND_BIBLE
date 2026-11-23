'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import styles from '../../../components/pages/pages.module.css';

export default function ReaderPage() {
  const t = useTranslations('reader');

  return (
    <>
      {/* Reader toolbar */}
      <div className={styles.readerToolbar}>
        <Button variant="ghost" size="small">
          {t('bookChapter')}
        </Button>
        <div className={styles.toolbarSpacer} />
        <Button variant="ghost" size="small">
          {t('parallel')}
        </Button>
        <Button variant="ghost" size="small">
          {t('understand')}
        </Button>
      </div>

      {/* Reading surface */}
      <article className={styles.readerSurface} aria-label="Scripture reader">
        <div style={{ marginBlockEnd: 'var(--space-6)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              marginBlockEnd: 'var(--space-4)',
              color: 'var(--color-primary)',
            }}
          >
            Genesis 1
          </h2>

          {/* Placeholder verses — clearly labelled as not real scripture */}
          <div
            style={{
              padding: 'var(--space-4)',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBlockEnd: 'var(--space-4)',
              border: '1px dashed var(--color-border)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {t('placeholderNote')}
            </p>
          </div>

          {/* Simulated verse layout */}
          {[1, 2, 3, 4].map((v) => (
            <p key={v} style={{ marginBlockEnd: 'var(--space-4)' }}>
              <sup
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  marginInlineEnd: 'var(--space-1)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {v}
              </sup>
              <span
                style={{
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                }}
              >
                {t('placeholder')}
              </span>
            </p>
          ))}

          {/* Loading indicator for remaining verses */}
          <div style={{ marginBlockStart: 'var(--space-6)' }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="85%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      </article>

      {/* Credit line */}
      <div className={styles.creditLine}>{t('creditLine')}</div>

      {/* Chapter navigation */}
      <div className={styles.chapterNav}>
        <Button variant="ghost" size="small" disabled>
          {t('prevChapter')}
        </Button>
        <Button variant="ghost" size="small">
          {t('nextChapter')}
        </Button>
      </div>
    </>
  );
}
