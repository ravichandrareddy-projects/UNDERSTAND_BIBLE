'use client';

import { useTranslations } from 'next-intl';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

export default function SearchPage() {
  const t = useTranslations('search');

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
          />
        </div>
        <p className={styles.searchHint}>{t('examples')}</p>

        <div style={{ marginBlockStart: 'var(--space-12)' }}>
          <EmptyState
            icon="🔍"
            title={t('noResults').split('.')[0] ?? ''}
            description={t('noResults')}
          />
        </div>
      </PageContent>
    </>
  );
}
