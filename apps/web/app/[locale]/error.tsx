'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../../components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error('Unhandled runtime error in page:', error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60dvh',
        padding: 'var(--space-6)',
        textAlign: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <div
        style={{ fontSize: '3rem', color: 'var(--color-error)' }}
        aria-hidden="true"
      >
        ⚠
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-text)',
        }}
      >
        {t('error')}
      </h2>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '28rem',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {error.message ||
          'An unexpected error occurred while loading this section.'}
      </p>
      <Button variant="primary" onClick={() => reset()}>
        {t('retry')}
      </Button>
    </div>
  );
}
