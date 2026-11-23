/** Queries for the API's dedicated reader connection. The role only has access to gated views. */
import type {
  BookCatalogue,
  CatalogueEntry,
  ReaderVerse,
  Translation,
} from '../contracts/reader.ts';

interface Connection {
  query<T>(sql: string, values: unknown[]): Promise<{ rows: T[] }>;
}

const visibleTranslations = `SELECT id, title, language, canon, checksum AS version, notice AS attribution,
            terms, conditions, source_url AS "sourceUrl", evidence_urls AS "evidenceUrls",
            json_build_object('action','display','status','VERIFIED') AS rights
       FROM reader.translations`;

export async function translations(db: Connection): Promise<Translation[]> {
  const result = await db.query<Translation>(
    `${visibleTranslations} ORDER BY language, id`,
    [],
  );
  return result.rows;
}

/** Read the catalogue and its rights in one database snapshot. OC-06 supplies localized names. */
export async function bookCatalogue(
  db: Connection,
  edition: string,
  version: string,
  selectedCanon: string,
): Promise<BookCatalogue<CatalogueEntry> | null> {
  const result = await db.query<BookCatalogue<CatalogueEntry>>(
    `WITH translation AS (${visibleTranslations}),
          entries AS (
            SELECT book, ordinal, source_order AS "sourceOrder", available, membership,
                   chapter_count AS "chapterCount", verse_rows AS "verseRows"
              FROM reader.book_catalogue
             WHERE edition=$1 AND checksum=$2 AND selected_canon=$3
          )
     SELECT row_to_json(t) AS translation, $3::text AS "selectedCanon",
            (SELECT json_agg(e ORDER BY e.ordinal) FROM entries e) AS books
       FROM translation t
      WHERE t.id=$1 AND t.version=$2 AND EXISTS (SELECT FROM entries)`,
    [edition, version, selectedCanon],
  );
  return result.rows[0] ?? null;
}

export async function verseBatch(
  db: Connection,
  edition: string,
  version: string,
  book: string,
  chapter: string,
  afterOrdinal: number,
  limit: number,
): Promise<ReaderVerse[]> {
  if (
    !Number.isSafeInteger(afterOrdinal) ||
    afterOrdinal < 0 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new RangeError('Invalid verse page boundary');
  }
  const result = await db.query<ReaderVerse>(
    `SELECT ordinal, label, text_plain AS text FROM reader.verses
       WHERE edition=$1 AND checksum=$2 AND book=$3 AND chapter=$4 AND ordinal>$5
       ORDER BY ordinal LIMIT $6`,
    [edition, version, book, chapter, afterOrdinal, limit],
  );
  return result.rows;
}
