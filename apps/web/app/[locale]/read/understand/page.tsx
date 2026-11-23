'use client';

import { useTranslations } from 'next-intl';
import { Tabs } from '../../../../components/ui/Tabs';
import { PageHeader } from '../../../../components/layout/PageHeader';
import { PageContent } from '../../../../components/layout/PageContent';
import { Button } from '../../../../components/ui/Button';
import styles from '../../../../components/pages/pages.module.css';

export default function UnderstandPage() {
  const t = useTranslations('understand');

  const quickContent = (
    <div>
      <div className={styles.placeholderBox}>{t('placeholder')}</div>
    </div>
  );

  const detailedContent = (
    <div>
      <div className={styles.placeholderBox}>{t('placeholder')}</div>
    </div>
  );

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <div style={{ maxWidth: 'var(--max-width-reader)' }}>
          {/* Status badge */}
          <div
            style={{
              marginBlockEnd: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'center',
            }}
          >
            <span className={styles.accentBadge}>{t('aiDrafted')}</span>
          </div>

          <Tabs
            tabs={[
              { id: 'quick', label: t('quick'), content: quickContent },
              {
                id: 'detailed',
                label: t('detailed'),
                content: detailedContent,
              },
            ]}
          />

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              marginBlockStart: 'var(--space-6)',
            }}
          >
            <Button variant="ghost" size="small">
              {t('reportProblem')}
            </Button>
            <Button variant="secondary" size="small">
              {t('readChapter')}
            </Button>
          </div>
        </div>
      </PageContent>
    </>
  );
}
