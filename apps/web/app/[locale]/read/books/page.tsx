'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '../../../../components/layout/PageHeader';
import { PageContent } from '../../../../components/layout/PageContent';
import styles from '../../../../components/pages/pages.module.css';

const sampleOT = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
];
const sampleNT = [
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
];

export default function BookPickerPage() {
  const t = useTranslations('bookPicker');

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        {/* Search */}
        <div
          className={styles.searchBox}
          style={{ marginBlockEnd: 'var(--space-6)' }}
        >
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t('search')}
            aria-label={t('search')}
          />
        </div>

        {/* OT */}
        <section style={{ marginBlockEnd: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              marginBlockEnd: 'var(--space-4)',
              color: 'var(--color-primary)',
            }}
          >
            {t('oldTestament')}
          </h2>
          <div className={styles.bookGrid}>
            {sampleOT.map((book) => (
              <div
                key={book}
                className={styles.bookItem}
                role="button"
                tabIndex={0}
              >
                {book}
              </div>
            ))}
          </div>
        </section>

        {/* NT */}
        <section>
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              marginBlockEnd: 'var(--space-4)',
              color: 'var(--color-primary)',
            }}
          >
            {t('newTestament')}
          </h2>
          <div className={styles.bookGrid}>
            {sampleNT.map((book) => (
              <div
                key={book}
                className={styles.bookItem}
                role="button"
                tabIndex={0}
              >
                {book}
              </div>
            ))}
          </div>
        </section>
      </PageContent>
    </>
  );
}
