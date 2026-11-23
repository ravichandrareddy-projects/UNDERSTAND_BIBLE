import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirection } from '../../i18n/config';
import type { Locale } from '../../i18n/config';
import { AppShell } from '../../components/layout/AppShell';
import { ServiceWorkerRegister } from '../../components/pwa/ServiceWorkerRegister';
import '../../styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Understand Bible',
    default: 'Understand Bible',
  },
  description: 'A peaceful space for reading and understanding Scripture.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Understand Bible',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F4EA' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1D1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={dir} data-theme="light">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <AppShell locale={locale as Locale}>{children}</AppShell>
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
