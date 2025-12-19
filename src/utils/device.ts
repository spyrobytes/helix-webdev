// src/utils/device.ts
// Device and environment detection utilities

import { BREAKPOINTS } from '@/constants/scrollCardsConfig';

/**
 * Detect if the device supports touch input.
 * @returns true if touch is supported
 */
export function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if current viewport is mobile-sized.
 * @returns true if viewport width is below tablet breakpoint
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.tablet;
}

/**
 * Check if current viewport is tablet-sized.
 * @returns true if viewport width is between tablet and desktop breakpoints
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
}

/**
 * Check if current viewport is desktop-sized.
 * @returns true if viewport width is at or above desktop breakpoint
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.desktop;
}

/**
 * Check if user prefers reduced motion.
 * @param respectSetting - Whether to respect the setting (default true)
 * @returns true if reduced motion is preferred and respected
 */
export function prefersReducedMotion(respectSetting = true): boolean {
  if (!respectSetting) return false;
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get the current breakpoint name.
 * @returns 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
 */
export function getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'largeDesktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.largeDesktop) return 'largeDesktop';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Create a listener for reduced motion preference changes.
 * @param callback - Function to call when preference changes
 * @returns Cleanup function to remove the listener
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}
