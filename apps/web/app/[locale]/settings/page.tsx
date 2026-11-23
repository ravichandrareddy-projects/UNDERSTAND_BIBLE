'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import { locales, localeNames } from '../../../i18n/config';
import type { Locale } from '../../../i18n/config';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import styles from '../../../components/pages/pages.module.css';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const params = useParams();
  const currentLocale = (params?.locale as Locale) ?? 'en';

  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'sepia'>(
    'light',
  );
  const [activePalette, setActivePalette] = useState<'sacred' | 'heritage'>(
    'sacred',
  );

  const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
    setActiveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handlePaletteChange = (palette: 'sacred' | 'heritage') => {
    setActivePalette(palette);
    document.documentElement.setAttribute('data-palette', palette);
  };

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        <div style={{ maxWidth: '32rem' }}>
          {/* Language Selection */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('language')}</div>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginBlockStart: 'var(--space-2)',
                flexWrap: 'wrap',
              }}
            >
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href="/settings"
                  locale={loc}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className={`${styles.themeBtn} ${loc === currentLocale ? styles.themeBtnActive : ''}`}
                  >
                    {localeNames[loc]}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Color Palette Switcher (Interchangeable theme palettes) */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>Color Palette</div>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBlockEnd: 'var(--space-2)',
              }}
            >
              Changeable design themes: Sacred &amp; Elegant (Warm Ivory &amp;
              Forest Green) or Heritage (Parchment &amp; Navy)
            </p>
            <div className={styles.themeButtons}>
              <button
                className={`${styles.themeBtn} ${activePalette === 'sacred' ? styles.themeBtnActive : ''}`}
                onClick={() => handlePaletteChange('sacred')}
              >
                Sacred &amp; Elegant
              </button>
              <button
                className={`${styles.themeBtn} ${activePalette === 'heritage' ? styles.themeBtnActive : ''}`}
                onClick={() => handlePaletteChange('heritage')}
              >
                Heritage
              </button>
            </div>
          </div>

          {/* Theme Mode (Light / Dark / Sepia) */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('theme')}</div>
            <div className={styles.themeButtons}>
              {(['light', 'dark', 'sepia'] as const).map((theme) => (
                <button
                  key={theme}
                  className={`${styles.themeBtn} ${activeTheme === theme ? styles.themeBtnActive : ''}`}
                  onClick={() => handleThemeChange(theme)}
                >
                  {t(theme)}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('textSize')}</div>
            <div className={styles.settingValue}>100% (18px)</div>
          </div>

          {/* Line Spacing */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('lineSpacing')}</div>
            <div className={styles.settingValue}>1.8 (Comfortable reading)</div>
          </div>

          {/* Font Selection */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('font')}</div>
            <div className={styles.themeButtons}>
              <button className={`${styles.themeBtn} ${styles.themeBtnActive}`}>
                {t('serif')}
              </button>
              <button className={styles.themeBtn}>{t('sansSerif')}</button>
            </div>
          </div>

          {/* Tradition */}
          <div className={styles.settingGroup}>
            <div className={styles.settingLabel}>{t('tradition')}</div>
            <div className={styles.settingValue}>Protestant (66 books)</div>
          </div>

          {/* Other Settings */}
          {(
            [
              'verseNumbers',
              'notifications',
              'offlineDownloads',
              'privacy',
              'about',
            ] as const
          ).map((key) => (
            <div key={key} className={styles.settingGroup}>
              <div className={styles.settingLabel}>{t(key)}</div>
              <div className={styles.settingValue}>→</div>
            </div>
          ))}
        </div>
      </PageContent>
    </>
  );
}
