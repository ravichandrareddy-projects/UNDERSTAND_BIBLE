'use client';

import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/config';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';
import { TopBar } from './TopBar';
import styles from './AppShell.module.css';

interface AppShellProps {
  locale: Locale;
  children: ReactNode;
}

export function AppShell({ locale, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <DesktopNav locale={locale} />
      <div className={styles.main}>
        <TopBar locale={locale} />
        <main id="main-content" style={{ flex: 1 }} role="main">
          {children}
        </main>
      </div>
      <BottomNav locale={locale} />
    </div>
  );
}
