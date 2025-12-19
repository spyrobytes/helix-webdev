// src/constants/scrollCardsConfig.ts
// Configuration and types for the scroll-triggered card animation system

/**
 * Grid metrics calculated for card layout positioning.
 * All values are pre-scaled for the current viewport.
 */
export interface GridMetrics {
  columns: number;
  scaledWidth: number;
  scaledHeight: number;
  scaledGapX: number;
  scaledGapY: number;
  scaledTotalWidth: number;
  scaledTotalHeight: number;
  scale: number;
}

/**
 * Current transform state for a single card.
 * Used for hover optimizations to avoid full recalculation.
 */
export interface CardState {
  currentX: number;
  currentY: number;
  currentRotation: number;
  currentScale: number;
  currentZIndex: number;
}

/**
 * Layout configuration for a specific breakpoint.
 */
export interface LayoutConfig {
  columns: number;
  rows: number;
  gapX: number;
  gapY: number;
}

/**
 * Card dimensions for a specific breakpoint.
 */
export interface CardDimensions {
  width: number;
  height: number;
}

/**
 * CSS class names used by the scroll cards system.
 * Configurable to decouple hook from specific CSS module names.
 */
export interface ScrollCardsClassNames {
  /** Applied when card flip is allowed (animation complete) */
  allowFlip: string;
  /** Applied when card is flipped to back face */
  isFlipped: string;
  /** Applied when card is hovered */
  isHovered: string;
  /** Applied to deck when using static layout (mobile) */
  layoutStatic: string;
  /** Applied during initial loading shimmer */
  loadingCards: string;
  /** Applied after cards are initialized */
  cardsInitialized: string;
  /** Applied during bounce animation */
  bounceIn: string;
  /** Applied during initial pulse animation */
  pulseLoad: string;
}

/**
 * Full configuration for the scroll cards system.
 */
export interface ScrollCardsConfig {
  /** Stacked card positioning */
  stacked: {
    rotation: number;
    offsetY: number;
    offsetX: number;
  };
  /** Scroll progress where spread animation starts (0-1) */
  spreadStartThreshold: number;
  /** Scroll progress where spread animation ends (0-1) */
  spreadEndThreshold: number;
  /** Layout configurations per breakpoint */
  layouts: {
    mobile: LayoutConfig;
    tablet: LayoutConfig;
    desktop: LayoutConfig;
  };
  /** Debounce time for resize handler in ms */
  resizeDebounceMs: number;
  /** Minimum scroll change to trigger update */
  scrollThreshold: number;
  /** Scale multiplier on hover */
  hoverScale: number;
  /** Z-index boost on hover */
  hoverZBoost: number;
  /** Whether to respect prefers-reduced-motion */
  respectReducedMotion: boolean;
  /** Card dimensions per breakpoint */
  cardDimensions: {
    mobile: CardDimensions;
    tablet: CardDimensions;
    desktop: CardDimensions;
    largeDesktop: CardDimensions;
  };
  /** CSS class names (allows decoupling from CSS modules) */
  classNames: ScrollCardsClassNames;
}

/**
 * Default CSS class names.
 * These are global class names applied via classList, not CSS module classes.
 */
export const DEFAULT_CLASS_NAMES: ScrollCardsClassNames = {
  allowFlip: 'allowFlip',
  isFlipped: 'isFlipped',
  isHovered: 'isHovered',
  layoutStatic: 'layoutStatic',
  loadingCards: 'loadingCards',
  cardsInitialized: 'cardsInitialized',
  bounceIn: 'bounceIn',
  pulseLoad: 'pulseLoad',
} as const;

/**
 * Default configuration for the scroll cards system.
 * Can be partially overridden via useScrollCards options.
 */
export const DEFAULT_SCROLL_CARDS_CONFIG: ScrollCardsConfig = {
  stacked: {
    rotation: 4,
    offsetY: 6,
    offsetX: 2,
  },
  spreadStartThreshold: 0.1,
  spreadEndThreshold: 0.6,
  layouts: {
    mobile: { columns: 1, rows: 6, gapX: 0, gapY: 20 },
    tablet: { columns: 2, rows: 3, gapX: 32, gapY: 32 },
    desktop: { columns: 3, rows: 2, gapX: 28, gapY: 28 },
  },
  resizeDebounceMs: 100,
  scrollThreshold: 0.001,
  hoverScale: 1.06,
  hoverZBoost: 20,
  respectReducedMotion: true,
  cardDimensions: {
    mobile: { width: 280, height: 380 },
    tablet: { width: 340, height: 420 },
    desktop: { width: 320, height: 380 },
    largeDesktop: { width: 360, height: 420 },
  },
  classNames: DEFAULT_CLASS_NAMES,
} as const;

/**
 * Breakpoint values in pixels.
 * Exported for potential CSS synchronization.
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1400,
} as const;

/**
 * Animation timing constants.
 */
export const ANIMATION_TIMING = {
  /** Threshold for triggering bounce animation (0-1) */
  bounceThreshold: 0.95,
  /** Duration of bounce animation in ms */
  bounceDuration: 600,
  /** Delay between card bounces in ms */
  bounceStagger: 50,
  /** Duration of bounce CSS animation in ms */
  bounceAnimationDuration: 500,
  /** Duration of pulse animation in ms */
  pulseDuration: 1500,
  /** Minimum loading shimmer time in ms */
  minimumLoadingTime: 400,
} as const;
