/**
 * Design Tokens: Color Palettes (Portable for Web and React Native / Expo)
 *
 * Supports interchangeable palettes (e.g. Sacred & Elegant, Heritage, etc.)
 * with Light, Dark, and Sepia modes for each.
 */

export interface ColorScale {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  accent: string;
  accentHover: string;
  accentActive: string;

  bg: string;
  bgSecondary: string;
  bgElevated: string;
  surface: string;
  surfaceHover: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnAccent: string;

  border: string;
  borderSubtle: string;

  error: string;
  success: string;
  warning: string;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type PaletteName = 'sacred' | 'heritage';

/**
 * 1. Sacred & Elegant (Approved Default)
 * Warm Ivory, Forest Green, Muted Gold, Ink, Sand
 */
export const sacredPalette: Record<ThemeMode, ColorScale> = {
  light: {
    primary: '#183D32',
    primaryHover: '#1A4A3B',
    primaryActive: '#0F2E24',
    accent: '#C5A15A',
    accentHover: '#D4B06A',
    accentActive: '#B8944D',

    bg: '#F7F4EA',
    bgSecondary: '#E5E0D3',
    bgElevated: '#FFFFFF',
    surface: '#F7F4EA',
    surfaceHover: '#F0ECE0',

    text: '#292B28',
    textSecondary: '#5A5D58',
    textMuted: '#8A8D86',
    textOnPrimary: '#F7F4EA',
    textOnAccent: '#292B28',

    border: '#D4CFC2',
    borderSubtle: '#E5E0D3',

    error: '#B33A3A',
    success: '#2E7D3E',
    warning: '#C5A15A',
  },
  dark: {
    primary: '#2D6B55',
    primaryHover: '#358062',
    primaryActive: '#245848',
    accent: '#C5A15A',
    accentHover: '#D4B06A',
    accentActive: '#B8944D',

    bg: '#1A1D1A',
    bgSecondary: '#242724',
    bgElevated: '#2E322E',
    surface: '#1A1D1A',
    surfaceHover: '#2E322E',

    text: '#E8E5DC',
    textSecondary: '#B0ADA4',
    textMuted: '#787570',
    textOnPrimary: '#E8E5DC',
    textOnAccent: '#1A1D1A',

    border: '#3A3D3A',
    borderSubtle: '#2E322E',

    error: '#E06060',
    success: '#4CAF50',
    warning: '#D4B06A',
  },
  sepia: {
    primary: '#183D32',
    primaryHover: '#1A4A3B',
    primaryActive: '#0F2E24',
    accent: '#C5A15A',
    accentHover: '#D4B06A',
    accentActive: '#B8944D',

    bg: '#F4E8D1',
    bgSecondary: '#E8DCC5',
    bgElevated: '#FAF0DD',
    surface: '#F4E8D1',
    surfaceHover: '#EDE1CA',

    text: '#3D3027',
    textSecondary: '#6B5D50',
    textMuted: '#9A8C7F',
    textOnPrimary: '#F4E8D1',
    textOnAccent: '#3D3027',

    border: '#D4C6B0',
    borderSubtle: '#E8DCC5',

    error: '#B33A3A',
    success: '#2E7D3E',
    warning: '#C5A15A',
  },
};

/**
 * 2. Heritage (Alternative Theme Palette)
 * Deep Byzantine Navy, Parchment, Burnished Bronze, Charcoal
 */
export const heritagePalette: Record<ThemeMode, ColorScale> = {
  light: {
    primary: '#1C2D42',
    primaryHover: '#273C57',
    primaryActive: '#121E2D',
    accent: '#B8860B',
    accentHover: '#C9971C',
    accentActive: '#9E7206',

    bg: '#FAF7F0',
    bgSecondary: '#EDE7DC',
    bgElevated: '#FFFFFF',
    surface: '#FAF7F0',
    surfaceHover: '#F2ECE0',

    text: '#1F2421',
    textSecondary: '#555B57',
    textMuted: '#848C86',
    textOnPrimary: '#FAF7F0',
    textOnAccent: '#1F2421',

    border: '#D8D1C5',
    borderSubtle: '#EDE7DC',

    error: '#C0392B',
    success: '#27AE60',
    warning: '#B8860B',
  },
  dark: {
    primary: '#345277',
    primaryHover: '#3F638F',
    primaryActive: '#2A4362',
    accent: '#D4AF37',
    accentHover: '#E0BF4E',
    accentActive: '#BD9C2B',

    bg: '#14181E',
    bgSecondary: '#1D222B',
    bgElevated: '#262D38',
    surface: '#14181E',
    surfaceHover: '#262D38',

    text: '#EAE6DF',
    textSecondary: '#A8A49C',
    textMuted: '#747069',
    textOnPrimary: '#EAE6DF',
    textOnAccent: '#14181E',

    border: '#2E3542',
    borderSubtle: '#222832',

    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#D4AF37',
  },
  sepia: {
    primary: '#1C2D42',
    primaryHover: '#273C57',
    primaryActive: '#121E2D',
    accent: '#B8860B',
    accentHover: '#C9971C',
    accentActive: '#9E7206',

    bg: '#F5ECE1',
    bgSecondary: '#E9DDD0',
    bgElevated: '#FCF5ED',
    surface: '#F5ECE1',
    surfaceHover: '#EFE3D5',

    text: '#382F2D',
    textSecondary: '#665B58',
    textMuted: '#948885',
    textOnPrimary: '#F5ECE1',
    textOnAccent: '#382F2D',

    border: '#D3C4B6',
    borderSubtle: '#E9DDD0',

    error: '#C0392B',
    success: '#27AE60',
    warning: '#B8860B',
  },
};

export const palettes: Record<PaletteName, Record<ThemeMode, ColorScale>> = {
  sacred: sacredPalette,
  heritage: heritagePalette,
};
