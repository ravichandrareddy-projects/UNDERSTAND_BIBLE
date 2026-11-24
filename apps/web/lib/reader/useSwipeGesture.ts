import { useEffect, useRef, useCallback } from 'react';

export interface SwipeGestureOptions {
  onSwipeRight?: () => void; // Left-to-right swipe (e.g. opens contextual drawer)
  onSwipeLeft?: () => void; // Right-to-left swipe (e.g. closes contextual drawer)
  minDistance?: number; // Minimum distance in px (default: 50)
  minSwipeDistance?: number; // Alias for minDistance
  maxPerpendicular?: number; // Maximum vertical tolerance (default: 60)
  maxPerpendicularDistance?: number; // Alias for maxPerpendicular
  enabled?: boolean;
}

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent | TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent | TouchEvent) => void;
}

/**
 * Custom hook to detect horizontal swipe gestures on mobile without
 * interfering with standard vertical document scrolling.
 *
 * Supports two usage patterns:
 * 1. Ref attachment: useSwipeGesture(elementRef, options)
 * 2. Prop spread: const handlers = useSwipeGesture(options); <div {...handlers} />
 */
export function useSwipeGesture(
  optionsOrRef: SwipeGestureOptions | React.RefObject<HTMLElement | null>,
  maybeOptions?: SwipeGestureOptions,
): SwipeHandlers {
  const isRef =
    optionsOrRef &&
    typeof optionsOrRef === 'object' &&
    'current' in optionsOrRef;

  const targetRef = isRef
    ? (optionsOrRef as React.RefObject<HTMLElement | null>)
    : null;

  const options: SwipeGestureOptions = isRef
    ? maybeOptions || {}
    : (optionsOrRef as SwipeGestureOptions) || {};

  const {
    onSwipeRight,
    onSwipeLeft,
    minDistance = 50,
    minSwipeDistance,
    maxPerpendicular = 60,
    maxPerpendicularDistance,
    enabled = true,
  } = options;

  const effectiveMinDistance = minSwipeDistance ?? minDistance;
  const effectiveMaxPerpendicular =
    maxPerpendicularDistance ?? maxPerpendicular;

  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isTracking = useRef<boolean>(false);

  const onTouchStart = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!enabled || e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (!touch) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      isTracking.current = true;
    },
    [enabled],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!enabled || !isTracking.current) return;
      isTracking.current = false;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      // Only trigger if horizontal movement exceeds vertical movement threshold
      if (Math.abs(deltaY) > effectiveMaxPerpendicular) return;

      if (deltaX >= effectiveMinDistance && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX <= -effectiveMinDistance && onSwipeLeft) {
        onSwipeLeft();
      }
    },
    [
      enabled,
      effectiveMinDistance,
      effectiveMaxPerpendicular,
      onSwipeRight,
      onSwipeLeft,
    ],
  );

  useEffect(() => {
    if (!targetRef) return;
    const el = targetRef.current;
    if (!el || !enabled) return;

    const handleNativeTouchStart = (e: TouchEvent) => onTouchStart(e);
    const handleNativeTouchEnd = (e: TouchEvent) => onTouchEnd(e);

    el.addEventListener('touchstart', handleNativeTouchStart, {
      passive: true,
    });
    el.addEventListener('touchend', handleNativeTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleNativeTouchStart);
      el.removeEventListener('touchend', handleNativeTouchEnd);
    };
  }, [targetRef, enabled, onTouchStart, onTouchEnd]);

  return { onTouchStart, onTouchEnd };
}
