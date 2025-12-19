// src/hooks/scrollCards/useCardFlip.ts
// Card flip interactions and back-side scroll handling

import { useEffect, useRef } from 'react';

export interface UseCardFlipClassNames {
  /** Class applied when flip is allowed */
  allowFlip: string;
  /** Class applied when card is flipped */
  isFlipped: string;
}

export interface UseCardFlipOptions {
  /** Refs to card elements */
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** CSS class names for flip states */
  classNames: UseCardFlipClassNames;
  /** Callback when a card is flipped */
  onFlip?: (index: number, isFlipped: boolean) => void;
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Hook for managing card flip interactions.
 * Handles click/keyboard flip, click-outside-to-close, and card back scrolling.
 */
export function useCardFlip({
  cardRefs,
  classNames,
  onFlip,
  enabled = true,
}: UseCardFlipOptions): void {
  const onFlipRef = useRef(onFlip);

  // Update ref in effect to satisfy lint rules
  useEffect(() => {
    onFlipRef.current = onFlip;
  }, [onFlip]);

  useEffect(() => {
    if (!enabled) return;

    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (cards.length === 0) return;

    const cleanupHandlers: Array<() => void> = [];

    // Setup flip handlers for each card
    cards.forEach((card, index) => {
      const clickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Don't flip when clicking links or back button
        if (target.closest('a') || target.closest('[class*="flipBackBtn"]')) {
          return;
        }

        // Only flip when animation is complete
        if (!card.classList.contains(classNames.allowFlip)) {
          return;
        }

        // Unflip all other cards
        cards.forEach((otherCard) => {
          if (otherCard !== card && otherCard.classList.contains(classNames.isFlipped)) {
            otherCard.classList.remove(classNames.isFlipped);
            const otherIndex = cards.indexOf(otherCard);
            onFlipRef.current?.(otherIndex, false);
          }
        });

        // Toggle this card
        const willBeFlipped = !card.classList.contains(classNames.isFlipped);
        card.classList.toggle(classNames.isFlipped);
        onFlipRef.current?.(index, willBeFlipped);

        // Prevent event from bubbling to document click handler
        e.stopPropagation();
      };

      const keydownHandler = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;

        // Enter/Space to flip
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          card.classList.contains(classNames.allowFlip)
        ) {
          if (!target?.closest('a') && !target?.closest('button')) {
            e.preventDefault();
            card.click();
          }
        }

        // Escape to unflip
        if (e.key === 'Escape' && card.classList.contains(classNames.isFlipped)) {
          card.classList.remove(classNames.isFlipped);
          onFlipRef.current?.(index, false);
        }
      };

      card.addEventListener('click', clickHandler, false);
      card.addEventListener('keydown', keydownHandler);

      // Flip back button
      const flipBackBtn = card.querySelector<HTMLButtonElement>('[class*="flipBackBtn"]');
      let flipBackHandler: ((e: MouseEvent) => void) | undefined;

      if (flipBackBtn) {
        flipBackHandler = (e: MouseEvent) => {
          e.stopPropagation();
          card.classList.remove(classNames.isFlipped);
          onFlipRef.current?.(index, false);
        };
        flipBackBtn.addEventListener('click', flipBackHandler);
      }

      cleanupHandlers.push(() => {
        card.removeEventListener('click', clickHandler);
        card.removeEventListener('keydown', keydownHandler);
        if (flipBackBtn && flipBackHandler) {
          flipBackBtn.removeEventListener('click', flipBackHandler);
        }
      });
    });

    // Click outside to unflip all
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      cards.forEach((card, index) => {
        if (card.classList.contains(classNames.isFlipped) && !card.contains(target)) {
          card.classList.remove(classNames.isFlipped);
          onFlipRef.current?.(index, false);
        }
      });
    };

    document.addEventListener('click', handleDocumentClick);
    cleanupHandlers.push(() => {
      document.removeEventListener('click', handleDocumentClick);
    });

    // Setup card back scroll handling
    // Note: 3D transforms interfere with native scroll, so we manually handle scrollTop
    cards.forEach((card) => {
      const cardBack = card.querySelector('[class*="cardBack"]') as HTMLElement;
      if (!cardBack) return;

      // Make cardBack focusable for keyboard scrolling
      cardBack.setAttribute('tabindex', '0');

      const wheelHandler = (e: WheelEvent) => {
        // Only handle if card is flipped
        if (!card.classList.contains(classNames.isFlipped)) return;

        const target = e.currentTarget as HTMLElement;
        const isScrollable = target.scrollHeight > target.clientHeight;

        if (!isScrollable) return;

        // Always prevent default and stop propagation to take full control
        e.preventDefault();
        e.stopPropagation();

        // Check boundaries
        const isAtTop = target.scrollTop <= 0;
        const isAtBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
        const scrollingUp = e.deltaY < 0;
        const scrollingDown = e.deltaY > 0;

        // Only scroll if not at boundary in scroll direction
        if ((scrollingUp && !isAtTop) || (scrollingDown && !isAtBottom)) {
          target.scrollTop += e.deltaY;
        }
      };

      // Handle keyboard scrolling
      const cardBackKeydownHandler = (e: KeyboardEvent) => {
        if (!card.classList.contains(classNames.isFlipped)) return;

        const target = e.currentTarget as HTMLElement;
        const isScrollable = target.scrollHeight > target.clientHeight;

        if (
          isScrollable &&
          ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)
        ) {
          // Let browser handle scrolling but prevent page scroll
          e.stopPropagation();
        }
      };

      cardBack.addEventListener('wheel', wheelHandler, { passive: false });
      cardBack.addEventListener('keydown', cardBackKeydownHandler);

      cleanupHandlers.push(() => {
        cardBack.removeEventListener('wheel', wheelHandler);
        cardBack.removeEventListener('keydown', cardBackKeydownHandler);
      });
    });

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup());
    };
  }, [cardRefs, classNames.allowFlip, classNames.isFlipped, enabled]);
}
