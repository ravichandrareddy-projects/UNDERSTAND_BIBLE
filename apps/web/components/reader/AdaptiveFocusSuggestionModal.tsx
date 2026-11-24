'use client';

import { Button } from '../ui/Button';
import styles from './AdaptiveFocusSuggestionModal.module.css';

export interface AdaptiveFocusSuggestionModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDismiss?: (() => void) | undefined;
  onDecline?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  streakDays?: number | undefined;
  estimatedWpm?: number | undefined;
}

export function AdaptiveFocusSuggestionModal({
  isOpen,
  onAccept,
  onDismiss,
  onDecline,
  onClose,
  streakDays = 6,
  estimatedWpm = 220,
}: AdaptiveFocusSuggestionModalProps) {
  if (!isOpen) return null;

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    else if (onDecline) onDecline();
    else if (onClose) onClose();
  };

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-suggestion-title"
      data-testid="adaptive-focus-suggestion-modal"
    >
      <div className={styles.modalBox}>
        <div className={styles.iconCircle} aria-hidden="true">
          🕯
        </div>

        <h2 id="focus-suggestion-title" className={styles.modalTitle}>
          Adaptive Reading Focus Available
        </h2>

        <p className={styles.modalDesc}>
          You have maintained a steady Scripture reading rhythm over the past{' '}
          {streakDays} days (averaging ~{estimatedWpm} WPM). Would you like to
          turn on <strong>Adaptive Reading Focus</strong>? It gently illuminates
          the next reading line to help you stay immersed and focused on God’s
          Word.
        </p>

        <div className={styles.privacyCallout}>
          <strong>Ethical Reading & Privacy Principle:</strong> Reading pace is
          not comprehension. Understand Bible never claims reading speed equates
          to spiritual understanding. Temporary focus illumination is completely
          separate from your personal highlights, operates purely on your
          device, and is never transmitted to servers.
        </div>

        <div className={styles.actionRow}>
          <Button variant="ghost" onClick={handleDismiss}>
            Maybe Later
          </Button>
          <Button variant="primary" onClick={onAccept}>
            Enable Adaptive Focus ✓
          </Button>
        </div>
      </div>
    </div>
  );
}
