'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../i18n/navigation';
import type { Locale } from '../../i18n/config';
import styles from './BottomNav.module.css';

export function BottomNav({ locale }: { locale: Locale }) {
  const tNav = useTranslations('nav');
  const pathname = usePathname();

  const isHome = pathname === '/today' || pathname === '/';
  const isRead = pathname.startsWith('/read');
  const isSearch = pathname.startsWith('/search');
  const isExplore = pathname.startsWith('/explore');
  const isPlans = pathname.startsWith('/plans');
  const isSettings = pathname.startsWith('/settings');

  return (
    <nav
      className={styles.bottomNav}
      aria-label="Mobile navigation"
      role="navigation"
    >
      {/* Home */}
      <Link
        href="/today"
        locale={locale}
        className={`${styles.navItem} ${isHome ? styles.active : ''}`}
        aria-current={isHome ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span>{tNav('home')}</span>
      </Link>

      {/* Read */}
      <Link
        href="/read"
        locale={locale}
        className={`${styles.navItem} ${isRead ? styles.active : ''}`}
        aria-current={isRead ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </span>
        <span>{tNav('read')}</span>
      </Link>

      {/* Search */}
      <Link
        href="/search"
        locale={locale}
        className={`${styles.navItem} ${isSearch ? styles.active : ''}`}
        aria-current={isSearch ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <span>{tNav('search')}</span>
      </Link>

      {/* Explore */}
      <Link
        href="/explore"
        locale={locale}
        className={`${styles.navItem} ${isExplore ? styles.active : ''}`}
        aria-current={isExplore ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </span>
        <span>{tNav('explore')}</span>
      </Link>

      {/* Plans */}
      <Link
        href="/plans"
        locale={locale}
        className={`${styles.navItem} ${isPlans ? styles.active : ''}`}
        aria-current={isPlans ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <span>{tNav('plans')}</span>
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        locale={locale}
        className={`${styles.navItem} ${isSettings ? styles.active : ''}`}
        aria-current={isSettings ? 'page' : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
        <span>{tNav('settings')}</span>
      </Link>
    </nav>
  );
}
