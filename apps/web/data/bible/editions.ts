import type { BibleEdition } from './types';

export const BIBLE_EDITIONS: BibleEdition[] = [
  {
    id: 'web',
    name: 'World English Bible',
    code: 'WEB',
    language: 'en',
    direction: 'ltr',
    year: 2000,
    license: 'public_domain',
    licenseLabel: 'Public Domain',
    copyright: 'Rainbow Missions, Inc. · Dedicated to the Public Domain',
  },
  {
    id: 'kjv',
    name: 'King James Version',
    code: 'KJV',
    language: 'en',
    direction: 'ltr',
    year: 1769,
    license: 'public_domain',
    licenseLabel: 'Public Domain',
    copyright: 'Authorized King James Version · Public Domain (Worldwide)',
  },
  {
    id: 'irv-te',
    name: 'Indian Revised Version (Telugu)',
    code: 'IRV-TE',
    language: 'te',
    direction: 'ltr',
    year: 2019,
    license: 'cc_by_sa',
    licenseLabel: 'CC BY-SA 4.0',
    copyright:
      'Bridge Connectivity Solutions · Creative Commons Attribution-ShareAlike 4.0',
  },
  {
    id: 'ar-svd',
    name: 'Smith & Van Dyck (Arabic)',
    code: 'SVD',
    language: 'ar',
    direction: 'rtl',
    year: 1865,
    license: 'public_domain',
    licenseLabel: 'Public Domain',
    copyright: 'Smith & Van Dyck Arabic Bible · Public Domain',
  },
];

export const DEFAULT_PRIMARY_EDITION = 'web';
export const DEFAULT_PARALLEL_EDITION = 'kjv';

export function getEdition(id: string): BibleEdition {
  return (BIBLE_EDITIONS.find((e) => e.id === id) ??
    BIBLE_EDITIONS[0]) as BibleEdition;
}
