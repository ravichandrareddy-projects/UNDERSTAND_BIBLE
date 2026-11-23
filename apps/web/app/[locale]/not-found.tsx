import { Link } from '../../i18n/navigation';
import { Button } from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60dvh',
        padding: 'var(--space-6)',
        textAlign: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <div
        style={{ fontSize: '3rem', color: 'var(--color-text-muted)' }}
        aria-hidden="true"
      >
        📖
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-text)',
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '28rem',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        The requested page or section could not be found.
      </p>
      <Link href="/today">
        <Button variant="primary">Return to Today</Button>
      </Link>
    </div>
  );
}
