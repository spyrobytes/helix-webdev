// src/utils/cardLayout.ts
// Card layout calculation utilities

import type {
  GridMetrics,
  LayoutConfig,
  CardDimensions,
  ScrollCardsConfig,
} from '@/constants/scrollCardsConfig';
import {
  DEFAULT_SCROLL_CARDS_CONFIG,
  BREAKPOINTS,
} from '@/constants/scrollCardsConfig';

/**
 * Get the layout configuration for the current viewport width.
 * @param config - Optional config override
 * @returns Layout configuration for current breakpoint
 */
export function getCurrentLayout(
  config: ScrollCardsConfig = DEFAULT_SCROLL_CARDS_CONFIG,
): LayoutConfig {
  if (typeof window === 'undefined') return config.layouts.desktop;

  const width = window.innerWidth;
  if (width >= BREAKPOINTS.desktop) return config.layouts.desktop;
  if (width >= BREAKPOINTS.tablet) return config.layouts.tablet;
  return config.layouts.mobile;
}

/**
 * Get the card dimensions for the current viewport width.
 * @param config - Optional config override
 * @returns Card dimensions for current breakpoint
 */
export function getCardDimensions(
  config: ScrollCardsConfig = DEFAULT_SCROLL_CARDS_CONFIG,
): CardDimensions {
  if (typeof window === 'undefined') return config.cardDimensions.desktop;

  const vw = window.innerWidth;
  if (vw >= BREAKPOINTS.largeDesktop) return config.cardDimensions.largeDesktop;
  if (vw >= BREAKPOINTS.desktop) return config.cardDimensions.desktop;
  if (vw >= BREAKPOINTS.tablet) return config.cardDimensions.tablet;
  return config.cardDimensions.mobile;
}

/**
 * Calculate grid metrics for card positioning.
 * All values are pre-scaled for the current viewport.
 *
 * @param layout - Layout configuration
 * @param cardDimensions - Card dimensions
 * @param cardCount - Number of cards
 * @param navHeight - Height of navigation bar
 * @returns Grid metrics with scaled values
 */
export function getGridMetrics(
  layout: LayoutConfig,
  cardDimensions: CardDimensions,
  cardCount: number,
  navHeight: number,
): GridMetrics {
  const { columns, gapX, gapY } = layout;
  const { width, height } = cardDimensions;

  const totalWidth = columns * width + (columns - 1) * gapX;
  const totalRows = Math.ceil(cardCount / columns);
  const totalHeight = totalRows * height + (totalRows - 1) * gapY;

  const bottomPadding = 60;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth - 40 : 1000;
  const availableHeight = viewportHeight - navHeight - bottomPadding;

  let scale = 1;

  // Scale down if grid is wider than viewport
  if (totalWidth > viewportWidth) {
    scale = Math.min(scale, viewportWidth / totalWidth);
  }

  // Scale down if grid is too tall
  const minScale = 0.75;
  if (totalHeight > availableHeight * 1.5) {
    const heightScale = (availableHeight * 1.5) / totalHeight;
    scale = Math.min(scale, heightScale);
  }
  scale = Math.max(scale, minScale);

  return {
    columns,
    scaledWidth: width * scale,
    scaledHeight: height * scale,
    scaledGapX: gapX * scale,
    scaledGapY: gapY * scale,
    scaledTotalWidth: totalWidth * scale,
    scaledTotalHeight: totalHeight * scale,
    scale,
  };
}

/**
 * Position offset for a specific grid layout.
 */
interface GridPositionOffset {
  rows: number;
  columns: number;
  offsetY: number;
}

/**
 * Vertical offset adjustments for different grid layouts.
 * Helps center the grid visually.
 */
const GRID_POSITION_OFFSETS: GridPositionOffset[] = [
  { rows: 3, columns: 2, offsetY: 100 }, // 2-column tablet layout
  { rows: 2, columns: 3, offsetY: 80 },  // 3-column desktop layout
];

/**
 * Calculate the position for a card at a given index in the grid.
 *
 * @param index - Card index
 * @param metrics - Pre-calculated grid metrics
 * @param cardCount - Total number of cards
 * @returns Position { x, y, scale } relative to center
 */
export function getGridPosition(
  index: number,
  metrics: GridMetrics,
  cardCount: number,
): { x: number; y: number; scale: number } {
  const {
    columns,
    scaledWidth,
    scaledHeight,
    scaledGapX,
    scaledGapY,
    scaledTotalWidth,
    scaledTotalHeight,
    scale,
  } = metrics;

  const col = index % columns;
  const row = Math.floor(index / columns);
  const totalRows = Math.ceil(cardCount / columns);

  // Calculate base position (centered at origin)
  const x =
    col * (scaledWidth + scaledGapX) -
    scaledTotalWidth / 2 +
    scaledWidth / 2;

  let y =
    row * (scaledHeight + scaledGapY) -
    scaledTotalHeight / 2 +
    scaledHeight / 2;

  // Apply vertical offset adjustments for specific layouts
  const offset = GRID_POSITION_OFFSETS.find(
    (o) => o.rows === totalRows && o.columns === columns,
  );
  if (offset) {
    y += offset.offsetY;
  }

  return { x, y, scale };
}

/**
 * Calculate the stacked position for a card before spreading.
 *
 * @param index - Card index
 * @param totalCards - Total number of cards
 * @param config - Optional config override
 * @returns Stacked position { x, y, rotation, zIndex }
 */
export function getStackedPosition(
  index: number,
  totalCards: number,
  config: ScrollCardsConfig = DEFAULT_SCROLL_CARDS_CONFIG,
): { x: number; y: number; rotation: number; zIndex: number } {
  const { rotation, offsetX, offsetY } = config.stacked;

  const centerIndex = (totalCards - 1) / 2;
  const offsetFromCenter = index - centerIndex;

  return {
    x: offsetFromCenter * offsetX,
    y: Math.abs(offsetFromCenter) * offsetY,
    rotation: offsetFromCenter * rotation,
    zIndex: totalCards - Math.abs(offsetFromCenter),
  };
}

/**
 * Calculate scroll progress through the services section.
 *
 * @param sectionElement - The section element
 * @returns Progress value 0-1 (0 = not scrolled, 1 = fully scrolled)
 */
export function getScrollProgress(sectionElement: HTMLElement | null): number {
  if (!sectionElement) return 0;
  if (typeof window === 'undefined') return 0;

  const rect = sectionElement.getBoundingClientRect();
  const sectionTop = rect.top;
  const viewportHeight = window.innerHeight;

  // Not yet scrolled into view
  if (sectionTop > 0) return 0;

  // Find header element to account for its height
  const servicesHeader = sectionElement.querySelector<HTMLElement>('[class*="header"]');
  const headerHeight = servicesHeader ? servicesHeader.offsetHeight : 200;

  const scrolledPastHeader = Math.abs(sectionTop) - headerHeight;
  const animationDistance = viewportHeight * 1.5;

  // Still scrolling through header
  if (scrolledPastHeader < 0) return 0;

  const progress = scrolledPastHeader / animationDistance;
  return Math.max(0, Math.min(1, progress));
}
