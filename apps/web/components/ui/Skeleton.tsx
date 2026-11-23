import styles from './Skeleton.module.css';

type SkeletonVariant = 'text' | 'heading' | 'block' | 'circle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  const classes = [styles.skeleton, styles[variant], className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={classes}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    />
  );
}
