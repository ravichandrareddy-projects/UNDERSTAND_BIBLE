'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Tabs } from '../../../components/ui/Tabs';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

export default function PlansPage() {
  const t = useTranslations('plans');

  const myPlansContent = (
    <EmptyState
      icon="📋"
      title={t('noPlans')}
      action={<Button variant="primary">{t('startPlan')}</Button>}
    />
  );

  const browseContent = (
    <div className={styles.placeholderBox}>
      [Plan catalogue — not yet connected to API]
    </div>
  );

  const customContent = (
    <div className={styles.placeholderBox}>
      [Custom plan builder — not yet connected to API]
    </div>
  );

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <Tabs
          tabs={[
            { id: 'my', label: t('myPlans'), content: myPlansContent },
            { id: 'browse', label: t('browse'), content: browseContent },
            { id: 'custom', label: t('custom'), content: customContent },
          ]}
        />
      </PageContent>
    </>
  );
}
