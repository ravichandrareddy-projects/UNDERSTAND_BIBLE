'use client';

import styles from './ErrorState.module.css';
import { Button } from './Button';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const t = useTranslations('common');
  return (
    <div className={styles.errorState} role="alert">
      <div className={styles.icon} aria-hidden="true">
        ⚠
      </div>
      <h3 className={styles.title}>{t('error')}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('retry')}
        </Button>
      )}
    </div>
  );
}
