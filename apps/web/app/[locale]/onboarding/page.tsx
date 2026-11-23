'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import type { Locale } from '../../../i18n/config';
import { Button } from '../../../components/ui/Button';
import { Card, CardTitle } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <div className={styles.onboardingSteps}>
          <div className={`${styles.stepDot} ${styles.stepDotActive}`} />
          <div className={styles.stepDot} />
          <div className={styles.stepDot} />
        </div>

        {/* Step 1: Tradition */}
        <section style={{ marginBlockEnd: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              marginBlockEnd: 'var(--space-2)',
            }}
          >
            {t('tradition')}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBlockEnd: 'var(--space-4)',
            }}
          >
            {t('traditionDesc')}
          </p>
          <div
            className={`${styles.grid} ${styles.grid2}`}
            style={{ maxWidth: '32rem' }}
          >
            {(['protestant', 'catholic', 'orthodox'] as const).map(
              (tradition) => (
                <Card key={tradition} interactive>
                  <CardTitle>{t(tradition)}</CardTitle>
                </Card>
              ),
            )}
          </div>
        </section>

        {/* Step 2: Edition */}
        <section style={{ marginBlockEnd: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              marginBlockEnd: 'var(--space-2)',
            }}
          >
            {t('edition')}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBlockEnd: 'var(--space-4)',
            }}
          >
            {t('editionDesc')}
          </p>
          <div className={styles.placeholderBox}>
            [Edition list from API — not yet connected]
          </div>
        </section>

        {/* Step 3: Parallel */}
        <section style={{ marginBlockEnd: 'var(--space-8)' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              marginBlockEnd: 'var(--space-2)',
            }}
          >
            {t('parallel')}
          </h2>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginBlockEnd: 'var(--space-4)',
            }}
          >
            {t('parallelDesc')}
          </p>
          <div className={styles.placeholderBox}>
            [Parallel edition selector — not yet connected]
          </div>
        </section>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'space-between',
            maxWidth: '32rem',
          }}
        >
          <Link href="/today" locale={locale}>
            <Button variant="ghost">{t('skip')}</Button>
          </Link>
          <Link href="/today" locale={locale}>
            <Button variant="primary">{t('finish')}</Button>
          </Link>
        </div>
      </PageContent>
    </>
  );
}
