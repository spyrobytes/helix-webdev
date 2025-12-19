// src/hooks/scrollCards/useCardHover.ts
// Hover and touch effects for cards

import { useEffect, useRef } from 'react';
import { detectTouchDevice } from '@/utils/device';

export interface UseCardHoverOptions {
  /** Refs to card elements */
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** CSS class name to apply when hovered */
  hoverClassName: string;
  /** Callback when hover state changes */
  onHoverChange?: (index: number | null) => void;
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean;
}

export interface CardHoverState {
  /** Currently hovered card index (null if none) */
  hoveredIndex: number | null;
}

export type CardHoverStateRef = React.RefObject<CardHoverState>;

/**
 * Hook for managing card hover/touch states.
 * Handles both mouse hover and touch events.
 * Clears hover state on scroll for touch devices.
 */
export function useCardHover({
  cardRefs,
  hoverClassName,
  onHoverChange,
  enabled = true,
}: UseCardHoverOptions): CardHoverStateRef {
  const stateRef = useRef<CardHoverState>({
    hoveredIndex: null,
  });

  const onHoverChangeRef = useRef(onHoverChange);

  // Update ref in effect to satisfy lint rules
  useEffect(() => {
    onHoverChangeRef.current = onHoverChange;
  }, [onHoverChange]);

  useEffect(() => {
    if (!enabled) return;

    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length === 0) return;

    const isTouchDevice = detectTouchDevice();
    const cleanupHandlers: Array<() => void> = [];
    let scrollTimeout: number | null = null;

    const setHoveredIndex = (index: number | null) => {
      stateRef.current.hoveredIndex = index;
      onHoverChangeRef.current?.(index);
    };

    cards.forEach((card, index) => {
      if (isTouchDevice) {
        // Touch device handlers
        const touchStartHandler = () => {
          setHoveredIndex(index);
          card.classList.add(hoverClassName);
        };

        const touchEndHandler = () => {
          setTimeout(() => {
            setHoveredIndex(null);
            card.classList.remove(hoverClassName);
          }, 150);
        };

        card.addEventListener('touchstart', touchStartHandler, { passive: true });
        card.addEventListener('touchend', touchEndHandler, { passive: true });

        cleanupHandlers.push(() => {
          card.removeEventListener('touchstart', touchStartHandler);
          card.removeEventListener('touchend', touchEndHandler);
        });
      } else {
        // Mouse device handlers
        const mouseEnterHandler = () => {
          setHoveredIndex(index);
          card.style.transition =
            'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s ease';
          card.classList.add(hoverClassName);
        };

        const mouseLeaveHandler = () => {
          setHoveredIndex(null);
          card.style.transition =
            'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s ease-out';
          card.classList.remove(hoverClassName);

          setTimeout(() => {
            if (!card.classList.contains(hoverClassName)) {
              card.style.transition = 'box-shadow 0.22s ease, border-color 0.22s ease';
            }
          }, 200);
        };

        card.addEventListener('mouseenter', mouseEnterHandler);
        card.addEventListener('mouseleave', mouseLeaveHandler);

        cleanupHandlers.push(() => {
          card.removeEventListener('mouseenter', mouseEnterHandler);
          card.removeEventListener('mouseleave', mouseLeaveHandler);
        });
      }
    });

    // Clear hover on scroll for touch devices
    if (isTouchDevice) {
      const scrollHandler = () => {
        if (stateRef.current.hoveredIndex !== null) {
          if (scrollTimeout != null) {
            window.clearTimeout(scrollTimeout);
          }
          scrollTimeout = window.setTimeout(() => {
            setHoveredIndex(null);
            cards.forEach((c) => c.classList.remove(hoverClassName));
          }, 50);
        }
      };

      window.addEventListener('scroll', scrollHandler, { passive: true });
      cleanupHandlers.push(() => {
        window.removeEventListener('scroll', scrollHandler);
        if (scrollTimeout != null) {
          window.clearTimeout(scrollTimeout);
        }
      });
    }

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, [cardRefs, hoverClassName, enabled]);

  return stateRef;
}
