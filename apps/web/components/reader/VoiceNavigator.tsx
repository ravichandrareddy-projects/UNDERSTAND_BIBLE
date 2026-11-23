'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BIBLE_BOOKS } from '../../data/bible/books';
import styles from './VoiceNavigator.module.css';

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult:
    | ((event: {
        results: { [key: number]: { [key: number]: { transcript: string } } };
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface VoiceNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (bookId: string, chapter: number, verse?: number) => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export function VoiceNavigator({
  isOpen,
  onClose,
  onNavigate,
  onNextChapter,
  onPrevChapter,
}: VoiceNavigatorProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(
    'Tap microphone and say a book & chapter (e.g. "John 3", "Genesis 1:1")',
  );
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const parseVoiceCommand = useCallback(
    (text: string) => {
      const clean = text.toLowerCase().trim();

      // Check next/prev
      if (clean.includes('next') || clean.includes('forward')) {
        setFeedback('Command recognized: Next Chapter');
        setTimeout(() => {
          onNextChapter();
          onClose();
        }, 600);
        return;
      }
      if (clean.includes('previous') || clean.includes('back')) {
        setFeedback('Command recognized: Previous Chapter');
        setTimeout(() => {
          onPrevChapter();
          onClose();
        }, 600);
        return;
      }

      // Match Book and Chapter (:Verse)
      // e.g. "john 3", "genesis 1:1", "psalm 23", "1 corinthians 13"
      for (const book of BIBLE_BOOKS) {
        const bookName = book.names.en.toLowerCase();
        if (
          clean.includes(bookName) ||
          book.abbreviations.en.some((a) => clean.includes(a.toLowerCase()))
        ) {
          // Extract chapter and verse numbers
          const match = clean.match(/(\d+)[:\s]*(\d*)/);
          const ch = match && match[1] ? parseInt(match[1], 10) : 1;
          const v = match && match[2] ? parseInt(match[2], 10) : 1;

          setFeedback(
            `Navigating to ${book.names.en} ${ch}${v > 1 ? `:${v}` : ''}`,
          );
          setTimeout(() => {
            onNavigate(book.id, ch, v);
            onClose();
          }, 700);
          return;
        }
      }

      setFeedback(
        `Could not match "${text}". Try tapping one of the suggestions below.`,
      );
    },
    [onNavigate, onNextChapter, onPrevChapter, onClose],
  );

  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const speechWindow = window as unknown as WindowWithSpeech;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback(
        'Speech recognition is not supported in this browser. Please tap a suggestion chip below.',
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setFeedback('Listening... speak now');
        };

        recognition.onresult = (event) => {
          const result = event.results[0]?.[0]?.transcript ?? '';
          setTranscript(result);
          parseVoiceCommand(result);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setFeedback(
            'Could not capture audio. Please select a suggestion below.',
          );
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        setIsListening(false);
        setFeedback(
          'Microphone access unavailable. Please tap a command below.',
        );
      }
    }
  }, [isListening, parseVoiceCommand]);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setFeedback('Tap microphone or select a voice shortcut below');
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-nav-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="voice-nav-title" className={styles.title}>
            Voice Scripture Navigation
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close voice navigator"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <button
            type="button"
            className={`${styles.micCircle} ${isListening ? styles.micCircleListening : ''}`}
            onClick={toggleListening}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>

          <div className={styles.statusText}>
            {isListening ? 'Listening...' : 'Voice Search'}
          </div>

          {transcript && (
            <div className={styles.transcriptText}>“{transcript}”</div>
          )}

          <div className={styles.hintText}>{feedback}</div>

          <div className={styles.suggestionsRow}>
            {[
              'John 3',
              'John 3:16',
              'Genesis 1',
              'Psalm 23',
              'Romans 8',
              'Next Chapter',
              'Previous Chapter',
            ].map((cmd) => (
              <button
                key={cmd}
                type="button"
                className={styles.suggestionChip}
                onClick={() => {
                  setTranscript(cmd);
                  parseVoiceCommand(cmd);
                }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
