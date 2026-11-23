'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '../../../../i18n/navigation';
import type { Locale } from '../../../../i18n/config';
import { PageHeader } from '../../../../components/layout/PageHeader';
import { PageContent } from '../../../../components/layout/PageContent';
import { BIBLE_BOOKS } from '../../../../data/bible/books';
import styles from '../../../../components/pages/pages.module.css';

export default function BookPickerPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';
  const t = useTranslations('bookPicker');

  const [query, setQuery] = useState('');
  const [testament, setTestament] = useState<'all' | 'OT' | 'NT'>('all');

  const filteredBooks = useMemo(() => {
    let list = BIBLE_BOOKS;
    if (testament !== 'all') {
      list = list.filter((b) => b.testament === testament);
    }
    if (!query.trim()) return list;

    const q = query.toLowerCase().trim();
    return list.filter((b) => {
      if (b.id.toLowerCase().includes(q)) return true;
      if (b.names[locale]?.toLowerCase().includes(q)) return true;
      if (b.names.en.toLowerCase().includes(q)) return true;
      if (b.abbreviations[locale]?.some((a) => a.toLowerCase().includes(q)))
        return true;
      return false;
    });
  }, [testament, query, locale]);

  return (
    <>
      <PageHeader title={t('title')} />
      <PageContent>
        {/* Search & Filters */}
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div className={styles.searchBox}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="#8B7038"
              strokeWidth="2"
              className={styles.searchIcon}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('searchPlaceholder')}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`${styles.tab} ${testament === 'all' ? styles.tabActive : ''}`}
              onClick={() => setTestament('all')}
            >
              {locale === 'te'
                ? 'అన్నీ (66)'
                : locale === 'ar'
                  ? 'الكل (66)'
                  : 'All Books (66)'}
            </button>
            <button
              type="button"
              className={`${styles.tab} ${testament === 'OT' ? styles.tabActive : ''}`}
              onClick={() => setTestament('OT')}
            >
              {t('otTab')}
            </button>
            <button
              type="button"
              className={`${styles.tab} ${testament === 'NT' ? styles.tabActive : ''}`}
              onClick={() => setTestament('NT')}
            >
              {t('ntTab')}
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              href="/read"
              locale={locale}
              style={{
                textDecoration: 'none',
                backgroundColor: '#FAF8F3',
                border: '1px solid #EBE4D5',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                color: '#292B28',
                transition: 'all 0.15s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  {book.names[locale] || book.names.en}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    backgroundColor: '#EFE8D6',
                    color: '#8B7038',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {book.testament}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#71716A' }}>
                {book.chaptersCount}{' '}
                {locale === 'te'
                  ? 'అధ్యాయములు'
                  : locale === 'ar'
                    ? 'أصحاح'
                    : 'Chapters'}{' '}
                · {book.names.en}
              </div>
            </Link>
          ))}
        </div>
      </PageContent>
    </>
  );
}
