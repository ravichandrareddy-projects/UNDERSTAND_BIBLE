'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Link } from '../../../i18n/navigation';
import type { Locale } from '../../../i18n/config';
import styles from './today.module.css';

export default function TodayPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';

  const tHero = useTranslations('hero');
  const tContinue = useTranslations('continueReading');
  const tTodayReading = useTranslations('todaysReading');
  const tProgress = useTranslations('readingProgress');
  const tDiscover = useTranslations('discover');
  const tPalette = useTranslations('paletteBar');

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mainGrid}>
        {/* ============================================================
            LEFT MAIN COLUMN
            ============================================================ */}
        <div className={styles.leftColumn}>
          {/* 1. HERO BANNER CARD */}
          <div className={styles.heroCard}>
            {/* Mountain sunrise & open Bible photorealistic artwork */}
            <div className={styles.heroArtwork} aria-hidden="true">
              <Image
                src="/images/hero_landscape_pure.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className={styles.heroImg}
                priority
              />
              <div className={styles.heroArtOverlay} />
            </div>

            {/* Hero Text Content */}
            <div className={styles.heroContent}>
              <div className={styles.quoteMark} aria-hidden="true">
                “
              </div>
              <blockquote className={styles.quoteText}>
                {tHero('quote')}
              </blockquote>
              <div className={styles.quoteRefRow}>
                <span className={styles.quoteDash} aria-hidden="true" />
                <cite className={styles.quoteRef}>{tHero('reference')}</cite>
              </div>
              <div>
                <Link
                  href="/read"
                  locale={locale}
                  className={styles.heroButton}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span>{tHero('readPassage')}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. CONTINUE READING SECTION */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>{tContinue('title')}</span>
              </h2>
              <Link href="/read" locale={locale} className={styles.viewAllLink}>
                <span>{tContinue('viewAll')}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className={styles.continueCard}>
              {/* Boat on Sea of Galilee Photographic Thumbnail */}
              <div className={styles.continueThumb}>
                <Image
                  src="/images/boat_galilee.png"
                  alt="Sea of Galilee"
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Info & Progress */}
              <div className={styles.continueInfo}>
                <div className={styles.continueBook}>
                  {tContinue('bookTitle')}
                </div>
                <div className={styles.continueChapter}>
                  {tContinue('chapterProgress')}
                </div>
                <div className={styles.progressRow}>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: '14%' }}
                    />
                  </div>
                  <span className={styles.progressPercent}>
                    {tContinue('progressPercent')}
                  </span>
                </div>
              </div>

              {/* Continue CTA */}
              <Link
                href="/read"
                locale={locale}
                className={styles.continueButton}
              >
                <span>{tContinue('continue')}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 3. DISCOVER SECTION */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <span>{tDiscover('title')}</span>
              </h2>
              <Link
                href="/explore"
                locale={locale}
                className={styles.viewAllLink}
              >
                <span>{tDiscover('exploreAll')}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className={styles.discoverGrid}>
              {/* Card 1: People of the Bible */}
              <Link
                href="/explore"
                locale={locale}
                className={styles.discoverCard}
              >
                <div className={styles.discoverThumb}>
                  <Image
                    src="/images/people_bible.png"
                    alt={tDiscover('peopleTitle')}
                    fill
                    sizes="(max-width: 640px) 100vw, 220px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.discoverBody}>
                  <div className={styles.discoverTitleRow}>
                    <h3 className={styles.discoverCardTitle}>
                      {tDiscover('peopleTitle')}
                    </h3>
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={styles.discoverArrow}
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <p className={styles.discoverCardDesc}>
                    {tDiscover('peopleDesc')}
                  </p>
                </div>
              </Link>

              {/* Card 2: Places & Geography */}
              <Link
                href="/explore"
                locale={locale}
                className={styles.discoverCard}
              >
                <div className={styles.discoverThumb}>
                  <Image
                    src="/images/places_geography.png"
                    alt={tDiscover('placesTitle')}
                    fill
                    sizes="(max-width: 640px) 100vw, 220px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.discoverBody}>
                  <div className={styles.discoverTitleRow}>
                    <h3 className={styles.discoverCardTitle}>
                      {tDiscover('placesTitle')}
                    </h3>
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={styles.discoverArrow}
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <p className={styles.discoverCardDesc}>
                    {tDiscover('placesDesc')}
                  </p>
                </div>
              </Link>

              {/* Card 3: Themes & Topics */}
              <Link
                href="/explore"
                locale={locale}
                className={styles.discoverCard}
              >
                <div className={styles.discoverThumb}>
                  <Image
                    src="/images/themes_topics.png"
                    alt={tDiscover('themesTitle')}
                    fill
                    sizes="(max-width: 640px) 100vw, 220px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.discoverBody}>
                  <div className={styles.discoverTitleRow}>
                    <h3 className={styles.discoverCardTitle}>
                      {tDiscover('themesTitle')}
                    </h3>
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={styles.discoverArrow}
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                  <p className={styles.discoverCardDesc}>
                    {tDiscover('themesDesc')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN (SIDEBAR CARDS)
            ============================================================ */}
        <div className={styles.rightColumn}>
          {/* CARD 1: TODAY'S READING */}
          <div className={styles.readingCard}>
            {/* Mountain Sketch Header Artwork */}
            <div className={styles.readingCardHeaderImg} aria-hidden="true">
              <Image
                src="/images/reading_mountain_clean.png"
                alt=""
                fill
                sizes="150px"
                style={{ objectFit: 'contain', objectPosition: 'top right' }}
              />
            </div>

            <div className={styles.readingCardContent}>
              <div className={styles.readingHeaderRow}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#8B7038"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
                <span className={styles.readingCardHeading}>
                  {tTodayReading('title')}
                </span>
              </div>

              <div className={styles.readingCardTop}>
                <span className={styles.readingBadge}>
                  {tTodayReading('dayBadge')}
                </span>
              </div>

              <h3 className={styles.planTitle}>{tTodayReading('planTitle')}</h3>

              <div className={styles.readingDetailsList}>
                <div className={styles.readingDetailItem}>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span>{tTodayReading('passage')}</span>
                </div>
                <div className={styles.readingDetailItem}>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>{tTodayReading('keyTheme')}</span>
                </div>
                <div className={styles.readingDetailItem}>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{tTodayReading('duration')}</span>
                </div>
              </div>

              <Link
                href="/read"
                locale={locale}
                className={styles.startReadingBtn}
              >
                <span>{tTodayReading('startButton')}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          {/* CARD 2: READING PROGRESS */}
          <div className={styles.progressCard}>
            <div className={styles.progressHeaderRow}>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="#C5A15A"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <h3 className={styles.progressCardTitle}>{tProgress('title')}</h3>
            </div>
            <p className={styles.progressSubtitle}>{tProgress('subtitle')}</p>

            {/* Days Circle Strip */}
            <div className={styles.weekDaysRow}>
              {[
                { key: 'mon', checked: true },
                { key: 'tue', checked: true },
                { key: 'wed', checked: true },
                { key: 'thu', checked: true },
                { key: 'fri', checked: false },
                { key: 'sat', checked: false },
                { key: 'sun', checked: false },
              ].map((day) => (
                <div key={day.key} className={styles.dayCol}>
                  <div
                    className={`${styles.dayCircle} ${day.checked ? styles.dayCircleChecked : styles.dayCircleEmpty}`}
                  >
                    {day.checked && (
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={styles.dayLabel}>
                    {tProgress(
                      `days.${day.key as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'}`,
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={styles.progressStatRow}>
              <div className={styles.statLeft}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>{tProgress('thisWeek')}</span>
              </div>
              <div className={styles.statRight}>{tProgress('weekRatio')}</div>
            </div>

            <div className={styles.progressStatRow}>
              <div className={styles.statLeft}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{tProgress('overall')}</span>
              </div>
              <div className={styles.statRight}>
                {tProgress('overallPercent')}
              </div>
            </div>

            <div
              className={styles.progressBarTrack}
              style={{ marginTop: 'var(--space-3)' }}
            >
              <div
                className={styles.progressBarFill}
                style={{ width: '12%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          APPROVED DESIGN COLOUR PALETTE FOOTER BAR
          ============================================================ */}
      <footer className={styles.paletteBar} aria-label="Design colour palette">
        <div className={styles.paletteTitle}>
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="#C5A15A"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="#C5A15A" />
            <circle cx="17.5" cy="10.5" r=".5" fill="#C5A15A" />
            <circle cx="8.5" cy="7.5" r=".5" fill="#C5A15A" />
            <circle cx="6.5" cy="12.5" r=".5" fill="#C5A15A" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
          <span>{tPalette('title')}</span>
        </div>

        <div className={styles.swatchGroup}>
          {/* Swatch 1: Warm Ivory */}
          <div className={styles.swatchItem}>
            <div
              className={styles.swatchColor}
              style={{
                backgroundColor: '#F7F4EA',
                border: '1px solid #DED8CA',
              }}
            />
            <div className={styles.swatchText}>
              <span className={styles.swatchName}>{tPalette('warmIvory')}</span>
              <span className={styles.swatchHex}>
                {tPalette('warmIvoryHex')}
              </span>
              <span className={styles.swatchRole}>
                {tPalette('warmIvoryRole')}
              </span>
            </div>
          </div>

          {/* Swatch 2: Forest Green */}
          <div className={styles.swatchItem}>
            <div
              className={styles.swatchColor}
              style={{ backgroundColor: '#183D32' }}
            />
            <div className={styles.swatchText}>
              <span className={styles.swatchName}>
                {tPalette('forestGreen')}
              </span>
              <span className={styles.swatchHex}>
                {tPalette('forestGreenHex')}
              </span>
              <span className={styles.swatchRole}>
                {tPalette('forestGreenRole')}
              </span>
            </div>
          </div>

          {/* Swatch 3: Muted Gold */}
          <div className={styles.swatchItem}>
            <div
              className={styles.swatchColor}
              style={{ backgroundColor: '#C5A15A' }}
            />
            <div className={styles.swatchText}>
              <span className={styles.swatchName}>{tPalette('mutedGold')}</span>
              <span className={styles.swatchHex}>
                {tPalette('mutedGoldHex')}
              </span>
              <span className={styles.swatchRole}>
                {tPalette('mutedGoldRole')}
              </span>
            </div>
          </div>

          {/* Swatch 4: Ink */}
          <div className={styles.swatchItem}>
            <div
              className={styles.swatchColor}
              style={{ backgroundColor: '#292B28' }}
            />
            <div className={styles.swatchText}>
              <span className={styles.swatchName}>{tPalette('ink')}</span>
              <span className={styles.swatchHex}>{tPalette('inkHex')}</span>
              <span className={styles.swatchRole}>{tPalette('inkRole')}</span>
            </div>
          </div>

          {/* Swatch 5: Sand */}
          <div className={styles.swatchItem}>
            <div
              className={styles.swatchColor}
              style={{
                backgroundColor: '#E5E0D3',
                border: '1px solid #DED8CA',
              }}
            />
            <div className={styles.swatchText}>
              <span className={styles.swatchName}>{tPalette('sand')}</span>
              <span className={styles.swatchHex}>{tPalette('sandHex')}</span>
              <span className={styles.swatchRole}>{tPalette('sandRole')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
