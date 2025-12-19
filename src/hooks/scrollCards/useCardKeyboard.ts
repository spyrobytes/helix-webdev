// src/hooks/scrollCards/useCardKeyboard.ts
// Keyboard navigation for card grid

import { useEffect, useRef } from 'react';

export interface UseCardKeyboardOptions {
  /** Refs to card elements */
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Function to get current column count (for arrow up/down navigation) */
  getColumnCount: () => number;
  /** Callback when a card receives focus */
  onCardFocus?: (index: number) => void;
  /** Callback when a card loses focus */
  onCardBlur?: (index: number) => void;
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in a card grid.
 * Supports arrow keys, Home, End for grid-aware navigation.
 */
export function useCardKeyboard({
  cardRefs,
  getColumnCount,
  onCardFocus,
  onCardBlur,
  enabled = true,
}: UseCardKeyboardOptions): void {
  // Store callbacks in refs to avoid effect dependencies
  const onCardFocusRef = useRef(onCardFocus);
  const onCardBlurRef = useRef(onCardBlur);
  const getColumnCountRef = useRef(getColumnCount);

  // Update refs in effect to satisfy lint rules
  useEffect(() => {
    onCardFocusRef.current = onCardFocus;
    onCardBlurRef.current = onCardBlur;
    getColumnCountRef.current = getColumnCount;
  }, [onCardFocus, onCardBlur, getColumnCount]);

  useEffect(() => {
    if (!enabled) return;

    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length === 0) return;

    const cleanupHandlers: Array<() => void> = [];

    cards.forEach((card, index) => {
      const keydownHandler = (e: KeyboardEvent) => {
        const columns = getColumnCountRef.current();
        const totalCards = cards.length;

        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            cards[(index + 1) % totalCards]?.focus();
            break;

          case 'ArrowLeft':
            e.preventDefault();
            cards[(index - 1 + totalCards) % totalCards]?.focus();
            break;

          case 'ArrowDown': {
            e.preventDefault();
            const nextRowIndex = index + columns;
            if (nextRowIndex < totalCards) {
              cards[nextRowIndex]?.focus();
            }
            break;
          }

          case 'ArrowUp': {
            e.preventDefault();
            const prevRowIndex = index - columns;
            if (prevRowIndex >= 0) {
              cards[prevRowIndex]?.focus();
            }
            break;
          }

          case 'Home':
            e.preventDefault();
            cards[0]?.focus();
            break;

          case 'End':
            e.preventDefault();
            cards[totalCards - 1]?.focus();
            break;
        }
      };

      const focusHandler = () => {
        onCardFocusRef.current?.(index);
      };

      const blurHandler = () => {
        onCardBlurRef.current?.(index);
      };

      card.addEventListener('keydown', keydownHandler);
      card.addEventListener('focus', focusHandler);
      card.addEventListener('blur', blurHandler);

      cleanupHandlers.push(() => {
        card.removeEventListener('keydown', keydownHandler);
        card.removeEventListener('focus', focusHandler);
        card.removeEventListener('blur', blurHandler);
      });
    });

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, [cardRefs, enabled]);
}
