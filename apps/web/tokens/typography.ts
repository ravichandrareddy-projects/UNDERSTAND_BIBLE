/**
 * Design Tokens: Typography
 * Reusable across Web and React Native / Expo
 */

export interface ScriptTypography {
  fontSerif: string;
  fontSans: string;
  baseFontSize: number;
  scriptureFontSize: number;
  scriptureLineHeight: number;
}

export const scriptTypography: Record<'en' | 'te' | 'ar', ScriptTypography> = {
  en: {
    fontSerif: 'Noto Serif, Georgia, serif',
    fontSans: 'Noto Sans, Segoe UI, system-ui, sans-serif',
    baseFontSize: 16,
    scriptureFontSize: 18,
    scriptureLineHeight: 1.8,
  },
  te: {
    fontSerif: 'Noto Serif Telugu, serif',
    fontSans: 'Noto Sans Telugu, sans-serif',
    baseFontSize: 16,
    scriptureFontSize: 19,
    scriptureLineHeight: 1.85,
  },
  ar: {
    fontSerif: 'Noto Naskh Arabic, serif',
    fontSans: 'Noto Sans Arabic, sans-serif',
    baseFontSize: 16,
    scriptureFontSize: 20,
    scriptureLineHeight: 1.9,
  },
};
