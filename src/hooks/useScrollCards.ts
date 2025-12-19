// src/hooks/useScrollCards.ts
// Scroll-triggered card animation system - Orchestrator

import { useEffect, useRef, useCallback } from 'react';

// Import extracted utilities
import { lerp, easeOutCubic } from '@/utils/animation';
import { isMobileViewport, prefersReducedMotion } from '@/utils/device';
import {
  getCurrentLayout,
  getCardDimensions,
  getGridMetrics,
  getGridPosition,
  getStackedPosition,
  getScrollProgress,
} from '@/utils/cardLayout';

// Import composable hooks
import {
  useSectionVisibility,
  useCardKeyboard,
  useCardHover,
  useCardFlip,
} from './scrollCards';

// Import configuration and types
import type { GridMetrics, CardState, ScrollCardsConfig } from '@/constants/scrollCardsConfig';
import {
  DEFAULT_SCROLL_CARDS_CONFIG,
  DEFAULT_CLASS_NAMES,
  ANIMATION_TIMING,
} from '@/constants/scrollCardsConfig';

/**
 * Options for useScrollCards hook.
 */
export interface UseScrollCardsOptions {
  /** Ref to the section element containing the cards */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Ref to the card deck container */
  cardDeckRef: React.RefObject<HTMLDivElement | null>;
  /** Refs to individual card elements */
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Height of navigation bar in pixels */
  navHeight?: number;
  /** Number of cards - used to re-initialize when cards change */
  cardCount?: number;
  /** Partial config override */
  config?: Partial<ScrollCardsConfig>;
}

/**
 * Internal state tracked by useScrollCards hook.
 */
export interface ScrollCardsState {
  /** Current scroll progress (0-1) */
  progress: number;
  /** Whether section is visible in viewport */
  isSectionVisible: boolean;
  /** Whether spread animation is complete */
  isAnimationComplete: boolean;
  /** Whether using static layout (mobile or reduced motion) */
  isStaticLayout: boolean;
}

/**
 * Return type for useScrollCards hook.
 * Returns a ref to avoid re-renders on every scroll frame.
 * Access state via stateRef.current when needed (e.g., in event handlers).
 */
export type ScrollCardsStateRef = React.RefObject<ScrollCardsState>;

/**
 * Merge partial config with defaults.
 */
function mergeConfig(partial?: Partial<ScrollCardsConfig>): ScrollCardsConfig {
  if (!partial) return DEFAULT_SCROLL_CARDS_CONFIG;

  return {
    ...DEFAULT_SCROLL_CARDS_CONFIG,
    ...partial,
    stacked: {
      ...DEFAULT_SCROLL_CARDS_CONFIG.stacked,
      ...partial.stacked,
    },
    layouts: {
      ...DEFAULT_SCROLL_CARDS_CONFIG.layouts,
      ...partial.layouts,
    },
    cardDimensions: {
      ...DEFAULT_SCROLL_CARDS_CONFIG.cardDimensions,
      ...partial.cardDimensions,
    },
    classNames: {
      ...DEFAULT_CLASS_NAMES,
      ...partial.classNames,
    },
  };
}

/**
 * Hook for scroll-triggered card animations.
 * Orchestrates composable hooks for visibility, keyboard, hover, and flip.
 * Handles the core scroll-to-spread animation.
 *
 * @returns A ref object containing the current state. Access via `.current`.
 *          The ref is updated without causing re-renders for performance.
 */
export function useScrollCards({
  sectionRef,
  cardDeckRef,
  cardRefs,
  navHeight = 80,
  cardCount,
  config: configOverride,
}: UseScrollCardsOptions): ScrollCardsStateRef {
  // Merge config with defaults
  const config = mergeConfig(configOverride);
  const classNames = config.classNames;

  // State ref for return value
  const stateRef = useRef<ScrollCardsState>({
    progress: 0,
    isSectionVisible: false,
    isAnimationComplete: false,
    isStaticLayout: false,
  });

  // Refs for scroll animation state (not exposed)
  const animationStateRef = useRef({
    hoveredIndex: null as number | null,
    lastProgress: -1,
    hasBounced: false,
    previousAnimationProgress: 0,
    isAnimationLocked: false,
    cachedGridMetrics: null as GridMetrics | null,
    cardStates: [] as (CardState | null)[],
  });

  // Ref for update function to pass to composable hooks
  const forceUpdateRef = useRef<(() => void) | null>(null);

  // Get current layout info (memoized callback for child hooks)
  const getColumnCount = useCallback(() => {
    return getCurrentLayout(config).columns;
  }, [config]);

  // Section visibility observer
  const visibilityRef = useSectionVisibility({
    elementRef: sectionRef,
    onVisibilityChange: useCallback((isVisible: boolean) => {
      stateRef.current.isSectionVisible = isVisible;
      if (isVisible && forceUpdateRef.current) {
        forceUpdateRef.current();
      }
    }, []),
  });

  // Keyboard navigation - callbacks stored in refs by the hook
  const handleCardFocus = useCallback((index: number) => {
    animationStateRef.current.hoveredIndex = index;
    forceUpdateRef.current?.();
  }, []);

  const handleCardBlur = useCallback(() => {
    animationStateRef.current.hoveredIndex = null;
    forceUpdateRef.current?.();
  }, []);

  useCardKeyboard({
    cardRefs,
    getColumnCount,
    onCardFocus: handleCardFocus,
    onCardBlur: handleCardBlur,
  });

  // Hover effects
  useCardHover({
    cardRefs,
    hoverClassName: classNames.isHovered,
    onHoverChange: useCallback((index: number | null) => {
      animationStateRef.current.hoveredIndex = index;
      forceUpdateRef.current?.();
    }, [classNames.isHovered]),
  });

  // Card flip interactions
  useCardFlip({
    cardRefs,
    classNames: {
      allowFlip: classNames.allowFlip,
      isFlipped: classNames.isFlipped,
    },
  });

  // Core scroll animation effect
  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    const servicesSection = sectionRef.current;
    const cardDeck = cardDeckRef.current;

    if (cards.length === 0) return;

    let rafId: number | null = null;
    let resizeTimeout: number | null = null;
    let isDestroyed = false;

    let currentLayout = getCurrentLayout(config);
    let currentCardDims = getCardDimensions(config);

    const state = animationStateRef.current;

    // Ensure cards are focusable
    cards.forEach((card) => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });

    // Update flip allowance based on animation progress
    function updateFlipAllowance(progress: number): void {
      const allowFlip = progress >= 0.95;

      cards.forEach((card) => {
        if (allowFlip) {
          card.classList.add(classNames.allowFlip);
        } else {
          card.classList.remove(classNames.allowFlip);
          card.classList.remove(classNames.isFlipped);
        }
      });

      stateRef.current.isAnimationComplete = allowFlip;
    }

    // Optimized hover-only update (no full recalc)
    function updateHoverStateOnly(): void {
      if (isMobileViewport() || prefersReducedMotion(config.respectReducedMotion)) return;

      const totalCards = cards.length;
      const { hoveredIndex, cardStates } = state;

      cards.forEach((card, index) => {
        const isHovered = index === hoveredIndex;
        const cardState = cardStates[index];
        if (!cardState) return;

        const finalScale = isHovered
          ? cardState.currentScale * config.hoverScale
          : cardState.currentScale;
        const finalZIndex = isHovered
          ? totalCards + config.hoverZBoost
          : cardState.currentZIndex;

        card.style.transform = `
          translate3d(${cardState.currentX}px, ${cardState.currentY}px, 0)
          rotate(${cardState.currentRotation}deg)
          scale(${finalScale})
        `;
        card.style.zIndex = String(finalZIndex);
      });
    }

    // Core card position update
    function updateCards(force = false): void {
      if (isDestroyed) return;
      if (state.isAnimationLocked && !force) return;

      // Mobile = static grid, enable flips
      if (isMobileViewport()) {
        if (state.lastProgress !== -2 || force) {
          cards.forEach((card) => {
            card.style.transform = 'none';
            card.style.opacity = '1';
            card.style.zIndex = '';
            card.style.willChange = 'auto';
            card.classList.add(classNames.allowFlip);
          });
          cardDeck?.classList.add(classNames.layoutStatic);
          state.lastProgress = -2;
          stateRef.current.isStaticLayout = true;
          stateRef.current.isAnimationComplete = true;
          stateRef.current.progress = 1;
        }
        return;
      }

      // Reduced motion = snap to grid
      if (prefersReducedMotion(config.respectReducedMotion)) {
        if (state.lastProgress !== -3 || force) {
          const gridMetrics = getGridMetrics(currentLayout, currentCardDims, cards.length, navHeight);

          cards.forEach((card, index) => {
            const grid = getGridPosition(index, gridMetrics, cards.length);
            card.style.transform = `
              translate3d(${grid.x}px, ${grid.y}px, 0)
              scale(${grid.scale})
            `;
            card.style.opacity = '1';
            card.style.zIndex = String(Math.floor(index / currentLayout.columns) + 1);
            card.style.willChange = 'auto';
            card.classList.add(classNames.allowFlip);
          });
          cardDeck?.classList.remove(classNames.layoutStatic);
          state.lastProgress = -3;
          stateRef.current.isStaticLayout = true;
          stateRef.current.isAnimationComplete = true;
          stateRef.current.progress = 1;
        }
        return;
      }

      cardDeck?.classList.remove(classNames.layoutStatic);

      const progress = getScrollProgress(servicesSection);
      if (!force && Math.abs(progress - state.lastProgress) < config.scrollThreshold) {
        return;
      }
      state.lastProgress = progress;
      stateRef.current.progress = progress;
      stateRef.current.isStaticLayout = false;

      const totalCards = cards.length;

      if (!state.cachedGridMetrics || force) {
        state.cachedGridMetrics = getGridMetrics(currentLayout, currentCardDims, totalCards, navHeight);
      }

      const animationProgress = Math.max(
        0,
        Math.min(
          1,
          (progress - config.spreadStartThreshold) /
            (config.spreadEndThreshold - config.spreadStartThreshold),
        ),
      );
      const easedProgress = easeOutCubic(animationProgress);
      const isAnimating = progress > 0 && progress < 1;

      cards.forEach((card, index) => {
        const stacked = getStackedPosition(index, totalCards, config);
        const grid = state.cachedGridMetrics
          ? getGridPosition(index, state.cachedGridMetrics, totalCards)
          : { x: stacked.x, y: stacked.y, scale: 1 };

        const currentX = lerp(stacked.x, grid.x, easedProgress);
        const currentY = lerp(stacked.y, grid.y, easedProgress);
        const currentRotation = lerp(stacked.rotation, 0, easedProgress);
        const baseScale = lerp(1, grid.scale, easedProgress);

        const gridZIndex = Math.floor(index / currentLayout.columns) + 1;
        const baseZIndex = Math.round(lerp(stacked.zIndex, gridZIndex, easedProgress));

        const isHovered = index === state.hoveredIndex;
        const finalScale = isHovered ? baseScale * config.hoverScale : baseScale;
        const finalZIndex = isHovered ? totalCards + config.hoverZBoost : baseZIndex;

        state.cardStates[index] = {
          currentX,
          currentY,
          currentRotation,
          currentScale: baseScale,
          currentZIndex: baseZIndex,
        };

        card.style.transform = `
          translate3d(${currentX}px, ${currentY}px, 0)
          rotate(${currentRotation}deg)
          scale(${finalScale})
        `;
        card.style.opacity = String(lerp(0.85, 1, easedProgress));
        card.style.zIndex = String(finalZIndex);
        card.style.willChange = isAnimating ? 'transform, opacity' : 'auto';
      });

      // Bounce animation at completion
      if (
        animationProgress >= ANIMATION_TIMING.bounceThreshold &&
        !state.hasBounced &&
        !state.isAnimationLocked
      ) {
        state.hasBounced = true;
        state.isAnimationLocked = true;

        const finalGridMetrics = getGridMetrics(currentLayout, currentCardDims, totalCards, navHeight);

        cards.forEach((card, index) => {
          const finalGrid = getGridPosition(index, finalGridMetrics, totalCards);
          const finalZIndex = Math.floor(index / currentLayout.columns) + 1;

          state.cardStates[index] = {
            currentX: finalGrid.x,
            currentY: finalGrid.y,
            currentRotation: 0,
            currentScale: finalGrid.scale,
            currentZIndex: finalZIndex,
          };

          card.style.transform = `
            translate3d(${finalGrid.x}px, ${finalGrid.y}px, 0)
            rotate(0deg)
            scale(${finalGrid.scale})
          `;
          card.style.opacity = '1';
          card.style.zIndex = String(finalZIndex);

          setTimeout(() => {
            card.classList.add(classNames.bounceIn);
            setTimeout(
              () => card.classList.remove(classNames.bounceIn),
              ANIMATION_TIMING.bounceAnimationDuration,
            );
          }, index * ANIMATION_TIMING.bounceStagger);
        });

        setTimeout(() => {
          state.isAnimationLocked = false;
          state.lastProgress = 1;
          state.previousAnimationProgress = 1;
        }, ANIMATION_TIMING.bounceDuration + cards.length * ANIMATION_TIMING.bounceStagger);
      }

      // Reset bounce if user scrolls back
      if (animationProgress < 0.7 && state.hasBounced) {
        state.hasBounced = false;
      }

      if (
        state.previousAnimationProgress >= ANIMATION_TIMING.bounceThreshold &&
        animationProgress < ANIMATION_TIMING.bounceThreshold
      ) {
        state.hasBounced = false;
      }

      state.previousAnimationProgress = animationProgress;
      updateFlipAllowance(animationProgress);
    }

    // Expose update function for composable hooks
    forceUpdateRef.current = () => {
      if (state.cardStates.length === cards.length) {
        updateHoverStateOnly();
      } else {
        updateCards(true);
      }
    };

    // Scroll handler
    function onScroll(): void {
      if (rafId !== null || isDestroyed || !visibilityRef.current?.isVisible) return;
      rafId = window.requestAnimationFrame(() => {
        updateCards();
        rafId = null;
      });
    }

    // Resize handler
    function onResize(): void {
      if (isDestroyed) return;
      if (resizeTimeout != null) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        currentLayout = getCurrentLayout(config);
        currentCardDims = getCardDimensions(config);
        state.cachedGridMetrics = null;
        state.lastProgress = -1;
        updateCards(true);
        resizeTimeout = null;
      }, config.resizeDebounceMs);
    }

    // Loading state
    cardDeck?.classList.add(classNames.loadingCards);
    cards.forEach((card) => {
      card.style.willChange = 'transform, opacity';
    });

    const loadingStartTime = performance.now();
    updateCards(true);

    const elapsed = performance.now() - loadingStartTime;
    const remaining = Math.max(0, ANIMATION_TIMING.minimumLoadingTime - elapsed);

    setTimeout(() => {
      requestAnimationFrame(() => {
        cardDeck?.classList.remove(classNames.loadingCards);
        cardDeck?.classList.add(classNames.cardsInitialized);

        if (!prefersReducedMotion(config.respectReducedMotion)) {
          cards.forEach((card) => {
            card.classList.add(classNames.pulseLoad);
            setTimeout(
              () => card.classList.remove(classNames.pulseLoad),
              ANIMATION_TIMING.pulseDuration,
            );
          });
        }

        setTimeout(() => {
          cards.forEach((card) => {
            card.style.willChange = 'auto';
          });
        }, 100);
      });
    }, remaining);

    // Event listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Cleanup
    return () => {
      isDestroyed = true;
      forceUpdateRef.current = null;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
    };
  }, [
    sectionRef,
    cardDeckRef,
    cardRefs,
    navHeight,
    cardCount,
    config,
    classNames,
    visibilityRef,
  ]);

  return stateRef;
}
