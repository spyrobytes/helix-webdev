// src/hooks/scrollCards/useSectionVisibility.ts
// IntersectionObserver hook for tracking section visibility

import { useEffect, useRef, useCallback } from 'react';

export interface UseSectionVisibilityOptions {
  /** Ref to the element to observe */
  elementRef: React.RefObject<HTMLElement | null>;
  /** Root margin for IntersectionObserver (default: '100px 0px') */
  rootMargin?: string;
  /** Visibility threshold (default: 0.1) */
  threshold?: number;
  /** Callback when visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean;
}

export interface SectionVisibilityState {
  /** Whether the section is currently visible */
  isVisible: boolean;
}

export type SectionVisibilityStateRef = React.RefObject<SectionVisibilityState>;

/**
 * Hook for observing element visibility using IntersectionObserver.
 * Optimized for scroll-based animations - updates ref without causing re-renders.
 *
 * @returns Ref to visibility state (access via .current.isVisible)
 */
export function useSectionVisibility({
  elementRef,
  rootMargin = '100px 0px 100px 0px',
  threshold = 0.1,
  onVisibilityChange,
  enabled = true,
}: UseSectionVisibilityOptions): SectionVisibilityStateRef {
  const stateRef = useRef<SectionVisibilityState>({
    isVisible: false,
  });

  const onVisibilityChangeRef = useRef(onVisibilityChange);

  // Update ref in effect to satisfy lint rules
  useEffect(() => {
    onVisibilityChangeRef.current = onVisibilityChange;
  }, [onVisibilityChange]);

  const updateVisibility = useCallback((isVisible: boolean) => {
    const wasVisible = stateRef.current.isVisible;
    stateRef.current.isVisible = isVisible;

    if (wasVisible !== isVisible) {
      onVisibilityChangeRef.current?.(isVisible);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      updateVisibility(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          updateVisibility(entry.isIntersecting);
        });
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, rootMargin, threshold, enabled, updateVisibility]);

  return stateRef;
}
