/** Queries for the API's dedicated reader connection. The role only has access to gated views. */
import type { ReaderVerse, Translation } from '../contracts/reader.ts';

interface Connection {
  query<T>(sql: string, values: unknown[]): Promise<{ rows: T[] }>;
}

export async function translations(db: Connection): Promise<Translation[]> {
  const result = await db.query<Translation>(
    `SELECT id, title, language, canon, checksum AS version, notice AS attribution,
            terms, conditions, source_url AS "sourceUrl", evidence_urls AS "evidenceUrls"
       FROM reader.translations ORDER BY language, id`,
    [],
  );
  return result.rows;
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
