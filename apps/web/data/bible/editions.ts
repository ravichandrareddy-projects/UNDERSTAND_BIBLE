import type { BibleEdition, BibleTradition } from './types';

export const BIBLE_EDITIONS: BibleEdition[] = [
  {
    id: 'eng-web',
    name: 'World English Bible',
    code: 'WEB',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    tradition: 'protestant',
    booksCount: 66,
    year: 2000,
    license: 'public_domain',
    licenseLabel: 'Public Domain',
    copyright: 'Rainbow Missions, Inc. · Dedicated to the Public Domain',
    available: true,
  },
  {
    id: 'eng-bsb',
    name: 'Berean Standard Bible',
    code: 'BSB',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    tradition: 'protestant',
    booksCount: 66,
    year: 2016,
    license: 'public_domain',
    licenseLabel: 'Public Domain / CC0',
    copyright:
      'Berean Bible · Dedicated to the Public Domain under Creative Commons Zero',
    available: true,
  },
  {
    id: 'eng-dra',
    name: 'Douay-Rheims American 1899',
    code: 'DRA',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    tradition: 'catholic',
    booksCount: 73,
    year: 1899,
    license: 'public_domain',
    licenseLabel: 'Public Domain (Catholic Canon)',
    copyright: 'John Murphy Company (1899) · Public Domain',
    available: true,
  },
  {
    id: 'tel-irv',
    name: 'Indian Revised Version (Telugu)',
    code: 'IRV-TE',
    language: 'te',
    languageName: 'తెలుగు (Telugu)',
    direction: 'ltr',
    tradition: 'protestant',
    booksCount: 66,
    year: 2019,
    license: 'cc_by_sa',
    licenseLabel: 'CC BY-SA 4.0',
    copyright:
      'Bridge Connectivity Solutions · Creative Commons Attribution-ShareAlike 4.0',
    available: true,
  },
  {
    id: 'hin-irv',
    name: 'Indian Revised Version (Hindi)',
    code: 'IRV-HI',
    language: 'hi',
    languageName: 'हिन्दी (Hindi)',
    direction: 'ltr',
    tradition: 'protestant',
    booksCount: 66,
    year: 2019,
    license: 'cc_by_sa',
    licenseLabel: 'CC BY-SA 4.0',
    copyright:
      'Bridge Connectivity Solutions · Creative Commons Attribution-ShareAlike 4.0',
    available: true,
  },
  {
    id: 'ara-svd',
    name: 'Smith & Van Dyck (Arabic)',
    code: 'SVD',
    language: 'ar',
    languageName: 'العربية (Arabic)',
    direction: 'rtl',
    tradition: 'protestant',
    booksCount: 66,
    year: 1865,
    license: 'public_domain',
    licenseLabel: 'Public Domain',
    copyright: 'Smith & Van Dyck Arabic Bible · Public Domain',
    available: true,
  },
  {
    id: 'kjv',
    name: 'King James Version',
    code: 'KJV',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    tradition: 'protestant',
    booksCount: 66,
    year: 1769,
    license: 'pending_review',
    licenseLabel: 'Rights Review Pending',
    copyright:
      'Authorized King James Version · Crown Copyright Review by Codex Pending',
    available: false, // Critical Rule: Do not display KJV as available until Codex confirms its rights
    rightsNote:
      'Rights verification under review by Codex (Crown copyright audit). Unavailable for new selection.',
  },
];

export const DEFAULT_PRIMARY_EDITION = 'eng-web';
export const DEFAULT_PARALLEL_EDITION = 'tel-irv';

/**
 * Returns all editions approved for user selection.
 * Excludes unconfirmed editions such as KJV.
 */
export function getApprovedEditions(
  tradition?: BibleTradition,
  language?: string,
): BibleEdition[] {
  return BIBLE_EDITIONS.filter((edition) => {
    if (!edition.available) return false;
    if (tradition && edition.tradition !== tradition) return false;
    if (language && edition.language !== language) return false;
    return true;
  });
}

/**
 * Normalizes legacy IDs ('web' -> 'eng-web', 'irv-te' -> 'tel-irv', etc.)
 */
export function normalizeEditionId(id: string): string {
  if (id === 'web') return 'eng-web';
  if (id === 'bsb') return 'eng-bsb';
  if (id === 'dra') return 'eng-dra';
  if (id === 'irv-te') return 'tel-irv';
  if (id === 'irv-hi') return 'hin-irv';
  if (id === 'ar-svd') return 'ara-svd';
  return id;
}

export function getEdition(id: string): BibleEdition {
  const normalized = normalizeEditionId(id);
  const found = BIBLE_EDITIONS.find(
    (e) =>
      e.id === normalized ||
      e.id === id ||
      e.code.toLowerCase() === id.toLowerCase(),
  );
  return found ?? BIBLE_EDITIONS[0]!;
}
