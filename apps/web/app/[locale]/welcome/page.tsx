'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import { locales, localeNames } from '../../../i18n/config';
import type { Locale } from '../../../i18n/config';
import { Button } from '../../../components/ui/Button';
import styles from '../../../components/pages/pages.module.css';

export default function WelcomePage() {
  const t = useTranslations('welcome');
  const params = useParams();
  const currentLocale = (params?.locale as Locale) ?? 'en';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80dvh',
        padding: 'var(--space-6)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBlockEnd: 'var(--space-8)' }}>
        <div
          style={{
            fontSize: '4rem',
            marginBlockEnd: 'var(--space-4)',
            color: 'var(--color-primary)',
          }}
        >
          📖
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBlockEnd: 'var(--space-3)',
          }}
        >
          {t('title')}
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '28rem',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {t('subtitle')}
        </p>
      </div>

      <div
        style={{
          marginBlockEnd: 'var(--space-8)',
          width: '100%',
          maxWidth: '24rem',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBlockEnd: 'var(--space-4)',
          }}
        >
          {t('chooseLanguage')}
        </h2>
        <div className={styles.languageGrid} style={{ maxWidth: '24rem' }}>
          {locales.map((loc) => (
            <Link
              key={loc}
              href="/welcome"
              locale={loc}
              className={`${styles.languageCard} ${loc === currentLocale ? styles.languageCardActive : ''}`}
            >
              {localeNames[loc]}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/onboarding" locale={currentLocale}>
        <Button variant="primary" size="large">
          {t('getStarted')}
        </Button>
      </Link>
    </div>
  );
}
