'use client';

import { useTranslations } from 'next-intl';
import { Card, CardTitle, CardDescription } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

const exploreItems = [
  { key: 'people' as const, icon: '👥' },
  { key: 'vamsavali' as const, icon: '🌳' },
  { key: 'geography' as const, icon: '🗺' },
  { key: 'timeline' as const, icon: '📅' },
];

export default function ExplorePage() {
  const t = useTranslations('explore');

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <div className={`${styles.grid} ${styles.grid4}`}>
          {exploreItems.map((item) => (
            <Card key={item.key} interactive>
              <div
                style={{ fontSize: '2rem', marginBlockEnd: 'var(--space-3)' }}
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <CardTitle>{t(item.key)}</CardTitle>
              <CardDescription>{t(`${item.key}Desc`)}</CardDescription>
            </Card>
          ))}
        </div>
      </PageContent>
    </>
  );
}
