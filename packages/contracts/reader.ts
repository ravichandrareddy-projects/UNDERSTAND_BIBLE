/** Proposed reader wire types. Edition IDs and source labels are opaque strings. */
export interface Translation {
  id: string;
  rights: { action: 'display'; status: 'VERIFIED' };
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

/** The selected canon can include books for which this archive has no text. */
export interface CatalogueEntry {
  book: string;
  ordinal: number;
  sourceOrder: number | null;
  available: boolean;
  membership: 'member' | 'appendix' | null;
  chapterCount: number | null;
  verseRows: number | null;
}

export interface BookCatalogue<Book extends CatalogueEntry = ReaderBook> {
  translation: Translation;
  selectedCanon: string;
  books: Book[];
}

export interface ReaderBook extends CatalogueEntry {
  name: string;
  nameLanguage: string;
  testament?: 'OT' | 'NT';
  /** Reviewed picker section for the selected tradition, including deuterocanonical material. */
  section?: string;
  chapters: string[] | null;
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

export interface ReadingPositionResponse {
  translation: Translation;
  position: ReadingPosition;
}

/** The server assigns updatedAt. Initial writes default scrollFraction to zero. */
export type ReadingPositionInput = Omit<
  ReadingPosition,
  'updatedAt' | 'scrollFraction'
> & {
  scrollFraction?: number;
};
