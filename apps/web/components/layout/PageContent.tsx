import type { ReactNode } from 'react';
import styles from './PageContent.module.css';

export function PageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.content} ${className ?? ''}`}>{children}</div>
  );
}
