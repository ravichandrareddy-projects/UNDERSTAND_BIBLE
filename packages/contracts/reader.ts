/** Proposed reader wire types. Edition IDs and source labels are opaque strings. */
export interface Translation {
  id: string;
  title: string;
  language: string;
  canon: string;
  version: string;
  attribution: string;
  terms: string;
  conditions: string[];
  sourceUrl: string;
  evidenceUrls: string[];
}

export interface ReaderBook {
  book: string;
  ordinal: number;
  name: string;
  nameLanguage: string;
  chapters: string[];
}

export interface ReaderVerse {
  ordinal: number;
  label: string;
  text: string;
}

export interface ReaderAnnotation {
  sequence: number;
  kind: 'heading' | 'introduction' | 'footnote' | 'cross_reference';
  precedingLabel: string | null;
  contentUsj: Record<string, unknown>;
}

export interface ChapterBatch {
  translation: Translation;
  book: string;
  chapter: string;
  totalRows: number;
  verses: ReaderVerse[];
  annotations: ReaderAnnotation[];
  nextFrom: string | null;
}

export interface ReadingPosition {
  edition: string;
  version: string;
  book: string;
  chapter: string;
  label: string;
  scrollFraction: number;
  updatedAt: string;
}
