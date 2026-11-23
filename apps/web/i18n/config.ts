export const locales = ['en', 'te', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  te: 'తెలుగు',
  ar: 'العربية',
};

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  te: 'ltr',
  ar: 'rtl',
};

export const localeScripts: Record<Locale, string> = {
  en: 'Latin',
  te: 'Telugu',
  ar: 'Arabic',
};
