'use client';

import { useParams } from 'next/navigation';
import type { Locale } from '../../../i18n/config';
import { BibleReader } from '../../../components/reader/BibleReader';

export default function ReaderPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';

  return <BibleReader locale={locale} />;
}
