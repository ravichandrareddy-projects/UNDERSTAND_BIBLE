import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY_FOCUS = 'understand_bible_adaptive_focus_rhythm';

export interface AdaptiveFocusRhythmData {
  enabled: boolean;
  consentGiven: boolean;
  hasPrompted: boolean;
  daysLogged: string[]; // YYYY-MM-DD
  estimatedWpm: number;
  dwellTimes: Record<number, number>; // verseNumber -> seconds spent
}

const DEFAULT_RHYTHM_DATA: AdaptiveFocusRhythmData = {
  enabled: false,
  consentGiven: false,
  hasPrompted: false,
  daysLogged: [],
  estimatedWpm: 220,
  dwellTimes: {},
};

export interface UseAdaptiveFocusProps {
  totalVerses: number;
  verseBatchSize?: number;
  activeVerseNumber?: number;
  onActiveVerseChange?: (verse: number) => void;
}

/**
 * Phase 2 R&D: Adaptive Reading Focus UI
 *
 * Client-side rhythm tracking (WPM & dwell time estimation).
 * Logs reading habit locally over 6 days; triggers ethical consent suggestion on 7th day.
 * Temporary ambient highlight ([data-focus="active"]) strictly separated from saved highlights.
 * Zero telemetry is sent to backend by default.
 */
export function useAdaptiveFocus(props: UseAdaptiveFocusProps) {
  const { activeVerseNumber = 1, onActiveVerseChange } = props;
  const [rhythmData, setRhythmData] =
    useState<AdaptiveFocusRhythmData>(DEFAULT_RHYTHM_DATA);
  const [focusedVerse, setFocusedVerse] = useState<number>(activeVerseNumber);
  const [showSuggestionModal, setShowSuggestionModal] =
    useState<boolean>(false);

  const dwellStartRef = useRef<number>(Date.now());
  const currentDwellVerseRef = useRef<number>(activeVerseNumber);

  // Load persisted rhythm data from local storage on mount (zero network telemetry)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FOCUS);
      if (stored) {
        const parsed: AdaptiveFocusRhythmData = JSON.parse(stored);
        setRhythmData(parsed);

        // Check if user has established 6 days of habit and hasn't been prompted yet
        const todayStr = new Date().toISOString().split('T')[0]!;
        const updatedDays = parsed.daysLogged.includes(todayStr)
          ? parsed.daysLogged
          : [...parsed.daysLogged, todayStr];

        if (updatedDays.length >= 6 && !parsed.hasPrompted && !parsed.enabled) {
          setShowSuggestionModal(true);
        }
      } else {
        // Initialize with today's first reading habit mark
        const todayStr = new Date().toISOString().split('T')[0]!;
        const initial = { ...DEFAULT_RHYTHM_DATA, daysLogged: [todayStr] };
        setRhythmData(initial);
        localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(initial));
      }
    } catch {
      // Ignore local storage parse errors
    }
  }, []);

  // Sync focused verse when active verse updates
  useEffect(() => {
    if (rhythmData.enabled) {
      setFocusedVerse(activeVerseNumber);
    }
  }, [activeVerseNumber, rhythmData.enabled]);

  // Calculate WPM from dwell times and word estimates
  const calculateWpm = useCallback(
    (verseWords: number, elapsedSec: number): number => {
      if (elapsedSec <= 0) return 220;
      const wpm = Math.round((verseWords / elapsedSec) * 60);
      // Clamp to realistic human reading rates (120 - 380 WPM)
      return Math.min(380, Math.max(120, wpm));
    },
    [],
  );

  // Track dwell time when reader pauses or advances to a verse
  const onVerseDwell = useCallback(
    (verseNumber: number) => {
      const now = Date.now();
      const elapsedSeconds = Math.max(1, (now - dwellStartRef.current) / 1000);
      dwellStartRef.current = now;

      const prevVerse = currentDwellVerseRef.current;
      currentDwellVerseRef.current = verseNumber;

      if (rhythmData.enabled) {
        setFocusedVerse(verseNumber);
      }

      // Record dwell times locally without sending telemetry
      setRhythmData((prev) => {
        const prevDwell = prev.dwellTimes[prevVerse] || 0;
        const newDwellTimes = {
          ...prev.dwellTimes,
          [prevVerse]: prevDwell + elapsedSeconds,
        };

        const estimatedWords = 28; // Average English/multilingual Bible verse words
        const calculated = calculateWpm(estimatedWords, elapsedSeconds);
        const smoothedWpm = Math.round(
          prev.estimatedWpm * 0.75 + calculated * 0.25,
        );

        const updated: AdaptiveFocusRhythmData = {
          ...prev,
          dwellTimes: newDwellTimes,
          estimatedWpm: smoothedWpm,
        };

        try {
          localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(updated));
        } catch {
          // Ignore
        }
        return updated;
      });
    },
    [calculateWpm, rhythmData.enabled],
  );

  // Passive scroll progress tracking
  const recordScrollProgress = useCallback(
    (currentVerse: number) => {
      if (rhythmData.enabled) {
        setFocusedVerse(currentVerse);
        if (onActiveVerseChange) {
          onActiveVerseChange(currentVerse);
        }
      }
    },
    [rhythmData.enabled, onActiveVerseChange],
  );

  // Enable focus
  const enableFocus = useCallback(() => {
    setRhythmData((prev) => {
      const updated: AdaptiveFocusRhythmData = {
        ...prev,
        enabled: true,
        consentGiven: true,
        hasPrompted: true,
      };
      try {
        localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setShowSuggestionModal(false);
  }, []);

  // Disable focus
  const disableFocus = useCallback(() => {
    setRhythmData((prev) => {
      const updated: AdaptiveFocusRhythmData = {
        ...prev,
        enabled: false,
      };
      try {
        localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Dismiss 7th-day suggestion
  const dismissSuggestion = useCallback(() => {
    setRhythmData((prev) => {
      const updated: AdaptiveFocusRhythmData = {
        ...prev,
        hasPrompted: true,
      };
      try {
        localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setShowSuggestionModal(false);
  }, []);

  const triggerSuggestionModal = useCallback(() => {
    setShowSuggestionModal(true);
  }, []);

  const closeSuggestionModal = useCallback(() => {
    setShowSuggestionModal(false);
  }, []);

  const resetRhythmData = useCallback(() => {
    setRhythmData(DEFAULT_RHYTHM_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY_FOCUS);
    } catch {
      // Ignore
    }
  }, []);

  return {
    state: {
      enabled: rhythmData.enabled,
      focusedVerse,
      streakDays: rhythmData.daysLogged.length,
      estimatedWpm: rhythmData.estimatedWpm,
      showSuggestionModal,
      consentGiven: rhythmData.consentGiven,
    },
    // Backwards-compatible aliases
    isFocusEnabled: rhythmData.enabled,
    focusedVerseNumber: rhythmData.enabled ? focusedVerse : null,
    estimatedWpm: rhythmData.estimatedWpm,
    daysLoggedCount: rhythmData.daysLogged.length,
    shouldShowSuggestion: showSuggestionModal,
    // Action methods
    onVerseDwell,
    recordScrollProgress,
    enableFocus,
    disableFocus,
    dismissSuggestion,
    triggerSuggestionModal,
    closeSuggestionModal,
    resetRhythmData,
    toggleFocus: (enable?: boolean) => {
      if (typeof enable === 'boolean') {
        if (enable) enableFocus();
        else disableFocus();
      } else {
        if (rhythmData.enabled) disableFocus();
        else enableFocus();
      }
    },
    acceptSuggestion: enableFocus,
    handleUserReadingRhythm: () => {},
  };
}
