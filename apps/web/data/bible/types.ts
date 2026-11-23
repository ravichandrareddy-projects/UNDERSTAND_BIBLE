export type CanonSection =
  | 'law'
  | 'history'
  | 'wisdom'
  | 'major_prophets'
  | 'minor_prophets'
  | 'gospels'
  | 'acts'
  | 'epistles'
  | 'revelation';

export type Testament = 'OT' | 'NT';

export interface BibleBook {
  id: string; // e.g. 'GEN', 'JHN', 'PSA'
  slug: string; // e.g. 'genesis', 'john', 'psalms'
  testament: Testament;
  section: CanonSection;
  chaptersCount: number;
  names: {
    en: string;
    te: string;
    ar: string;
  };
  abbreviations: {
    en: string[];
    te: string[];
    ar: string[];
  };
}

export interface BibleEdition {
  id: string; // e.g. 'web', 'kjv', 'irv-te', 'ar-svd'
  name: string;
  code: string;
  language: 'en' | 'te' | 'ar';
  direction: 'ltr' | 'rtl';
  year?: number;
  license: 'public_domain' | 'cc_by_sa' | 'pilot_licensed';
  licenseLabel: string;
  copyright: string;
}

export interface VerseContent {
  verseNumber: number;
  text: string;
  heading?: string | undefined;
  hasFootnote?: boolean | undefined;
  footnoteText?: string | undefined;
}

export interface ChapterContent {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  editionId: string;
  verses: VerseContent[];
  totalVerses: number;
}

export interface ReadingPosition {
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  editionId: string;
  scrollPercentage: number;
  updatedAt: string;
}

export type HighlightColor = 'gold' | 'mint' | 'coral' | 'sky' | 'lavender';

export interface Highlight {
  id: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  color: HighlightColor;
  editionId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  editionId: string;
  note?: string | undefined;
  createdAt: string;
}

export interface ReaderPreferences {
  fontSize: number; // in pixels, default 18
  lineSpacing: number; // e.g. 1.8
  fontFamily: 'serif' | 'sans';
  verseNumbers: 'superscript' | 'inline' | 'hidden';
  linkScrolling: boolean;
}
