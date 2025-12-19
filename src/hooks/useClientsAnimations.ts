// src/hooks/useClientsAnimations.ts
// Intersection Observer hook for Clients section scroll-triggered animations

import { useEffect, useRef, useState } from 'react';

interface UseClientsAnimationsOptions {
  /** Threshold for visibility detection (0-1) */
  threshold?: number;
  /** Root margin for early/late trigger */
  rootMargin?: string;
}

/**
 * Hook to trigger Clients section animations when scrolled into view.
 * Returns visibility state to control CSS classes for staggered badge animations.
 */
export function useClientsAnimations(
  options: UseClientsAnimationsOptions = {}
) {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -10% 0px',
  } = options;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger once when entering viewport
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible]);

  return {
    sectionRef,
    isVisible,
  };
}
