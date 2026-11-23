'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname } from '../../i18n/navigation';
import type { Locale } from '../../i18n/config';
import styles from './DesktopNav.module.css';

export function DesktopNav({ locale }: { locale: Locale }) {
  const tNav = useTranslations('nav');
  const pathname = usePathname();

  const isHome = pathname === '/today' || pathname === '/';
  const isRead =
    pathname.startsWith('/read') && !pathname.includes('understand');
  const isUnderstand = pathname.includes('understand');
  const isDiscover = pathname.startsWith('/explore');
  const isVamsavali = pathname.startsWith('/vamsavali');
  const isGeography = pathname.startsWith('/geography');
  const isPlans = pathname.startsWith('/plans');
  const isSettings = pathname.startsWith('/settings');

  return (
    <nav
      className={styles.desktopNav}
      aria-label="Main navigation"
      role="navigation"
    >
      {/* Logo Header */}
      <Link href="/today" locale={locale} className={styles.logoArea}>
        <svg
          className={styles.bibleEmblem}
          viewBox="0 0 48 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Open Bible */}
          <path
            d="M24 7C19 3 9 3 3 5V32C9 30 19 30 24 34C29 30 39 30 45 32V5C39 3 29 3 24 7Z"
            stroke="#C5A15A"
            strokeWidth="2.2"
            fill="none"
          />
          <path d="M24 7V34" stroke="#C5A15A" strokeWidth="2.2" />
          {/* Cross on left page */}
          <path
            d="M14 11V21M10 14H18"
            stroke="#C5A15A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <div className={styles.logoTitle}>
          UNDERSTAND
          <br />
          BIBLE
        </div>

        {/* Gold flourish underline */}
        <svg
          className={styles.logoFlourish}
          viewBox="0 0 90 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 3C25 6 65 6 88 3"
            stroke="#C5A15A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </Link>

      {/* Nav List */}
      <div className={styles.navList}>
        {/* Home */}
        <Link
          href="/today"
          locale={locale}
          className={`${styles.navItem} ${isHome ? styles.navItemActive : ''}`}
          aria-current={isHome ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('home')}</span>
        </Link>

        {/* Read Bible */}
        <Link
          href="/read"
          locale={locale}
          className={`${styles.navItem} ${isRead ? styles.navItemActive : ''}`}
          aria-current={isRead ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('read')}</span>
        </Link>

        {/* Understand */}
        <Link
          href="/read/understand"
          locale={locale}
          className={`${styles.navItem} ${isUnderstand ? styles.navItemActive : ''}`}
          aria-current={isUnderstand ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('understand')}</span>
        </Link>

        {/* Discover */}
        <Link
          href="/explore"
          locale={locale}
          className={`${styles.navItem} ${isDiscover ? styles.navItemActive : ''}`}
          aria-current={isDiscover ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('discover')}</span>
          <span className={styles.dropdownArrow} aria-hidden="true">
            ▾
          </span>
        </Link>

        {/* Vamsavali (Genealogy) — Dedicated Top-Level Section */}
        <Link
          href="/vamsavali"
          locale={locale}
          className={`${styles.navItem} ${isVamsavali ? styles.navItemActive : ''}`}
          aria-current={isVamsavali ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="5" r="3" />
              <circle cx="6" cy="19" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('vamsavali')}</span>
        </Link>

        {/* Geography — Dedicated Top-Level Section */}
        <Link
          href="/geography"
          locale={locale}
          className={`${styles.navItem} ${isGeography ? styles.navItemActive : ''}`}
          aria-current={isGeography ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('geography')}</span>
        </Link>

        {/* Reading Plans */}
        <Link
          href="/plans"
          locale={locale}
          className={`${styles.navItem} ${isPlans ? styles.navItemActive : ''}`}
          aria-current={isPlans ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
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
          <span className={styles.navLabel}>{tNav('plans')}</span>
        </Link>

        {/* Bookmarks */}
        <Link href="/read" locale={locale} className={styles.navItem}>
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('bookmarks')}</span>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          locale={locale}
          className={`${styles.navItem} ${isSettings ? styles.navItemActive : ''}`}
          aria-current={isSettings ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span className={styles.navLabel}>{tNav('settings')}</span>
        </Link>
      </div>

      {/* Bottom Olive Tree Silhouette Image from Mockup */}
      <div className={styles.sidebarFooter} aria-hidden="true">
        <Image
          src="/images/sidebar_tree.png"
          alt=""
          fill
          sizes="256px"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority
        />
      </div>
    </nav>
  );
}
