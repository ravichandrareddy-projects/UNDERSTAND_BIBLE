'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import type { Locale } from '../../../i18n/config';
import { Card, CardTitle, CardDescription } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

const exploreItems = [
  { key: 'people' as const, icon: '👥', href: '/vamsavali' },
  { key: 'vamsavali' as const, icon: '🌳', href: '/vamsavali' },
  { key: 'geography' as const, icon: '🗺', href: '/geography' },
  { key: 'timeline' as const, icon: '📅', href: '/geography' },
];

export default function ExplorePage() {
  const t = useTranslations('explore');
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle="Discover biblical people, genealogical lines, holy geography, and historical events."
      />
      <PageContent>
        <div className={`${styles.grid} ${styles.grid4}`}>
          {exploreItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              locale={locale}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
              }}
            >
              <Card interactive style={{ width: '100%', cursor: 'pointer' }}>
                <div
                  style={{ fontSize: '2rem', marginBlockEnd: 'var(--space-3)' }}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <CardTitle>{t(item.key)}</CardTitle>
                <CardDescription>{t(`${item.key}Desc`)}</CardDescription>
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#C5A15A',
                    fontWeight: 600,
                  }}
                >
                  Explore →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </PageContent>
    </>
  );
}
