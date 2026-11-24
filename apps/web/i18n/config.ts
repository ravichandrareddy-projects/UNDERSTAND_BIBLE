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

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  routingSupported: boolean;
  sampleGreeting: string;
}

/**
 * 14 Proposed Interface Languages for Understand Bible onboarding.
 * Section 2: First-time onboarding language selection.
 */
export const ONBOARDING_LANGUAGES: LanguageOption[] = [
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    routingSupported: true,
    sampleGreeting: 'స్వాగతం',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: true,
    sampleGreeting: 'Welcome',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'स्वागत है',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'வரவேற்கிறோம்',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'ಸ್ವಾಗತ',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'സ്വാഗതം',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'স্বাগতম',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'Bienvenido',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'Bem-vindo',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'Bienvenue',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    script: 'Arabic',
    direction: 'rtl',
    routingSupported: true,
    sampleGreeting: 'أهلاً وسهلاً',
  },
  {
    code: 'zh',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    script: 'Han',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: '欢迎',
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'Selamat datang',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    script: 'Latin',
    direction: 'ltr',
    routingSupported: false,
    sampleGreeting: 'Willkommen',
  },
];
