'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../i18n/navigation';
import { locales, localeNames } from '../../i18n/config';
import type { Locale } from '../../i18n/config';
import styles from './TopBar.module.css';

export function TopBar({ locale }: { locale: Locale }) {
  const tHeader = useTranslations('header');
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        {/* Hand-drawn Golden Olive Branch vector */}
        <div className={styles.oliveBranch} aria-hidden="true">
          <svg
            width="34"
            height="42"
            viewBox="0 0 34 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 40C16 30 14 14 28 4"
              stroke="#C5A15A"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M15 30C10 27 4 28 2 33C7 35 13 34 15 30Z"
              fill="#C5A15A"
              opacity="0.9"
            />
            <path
              d="M16 22C21 19 27 21 29 26C24 27 18 26 16 22Z"
              fill="#C5A15A"
              opacity="0.9"
            />
            <path
              d="M14 13C9 10 4 11 2 16C7 18 13 17 14 13Z"
              fill="#C5A15A"
              opacity="0.9"
            />
            <path
              d="M20 7C24 4 30 5 32 10C27 11 22 10 20 7Z"
              fill="#C5A15A"
              opacity="0.9"
            />
          </svg>
        </div>

        <div>
          <h1 className={styles.greetingTitle}>{tHeader('greeting')}</h1>
          <p className={styles.greetingDate}>{tHeader('date')}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Language selector dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.langButton}
            onClick={() => setLangOpen(!langOpen)}
            aria-expanded={langOpen}
            aria-label="Select language"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="#5A5D58"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{localeNames[locale]}</span>
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {langOpen && (
            <div className={styles.langDropdown}>
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  className={`${styles.langItem} ${loc === locale ? styles.langItemActive : ''}`}
                  onClick={() => setLangOpen(false)}
                >
                  {localeNames[loc]}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#292B28"
            strokeWidth="2"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className={styles.notifDot} />
        </button>

        {/* Profile Avatar */}
        <Link
          href="/settings"
          locale={locale}
          style={{ textDecoration: 'none' }}
        >
          <div
            className={styles.avatarButton}
            aria-label="Profile and Settings"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
        </Link>
      </div>
    </header>
  );
}
