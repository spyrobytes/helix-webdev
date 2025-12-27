import { useRef, useEffect, useState } from 'react';

interface UseFadeInOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Simple fade-in animation hook using IntersectionObserver.
 * Triggers once when element enters viewport.
 */
export function useFadeIn<T extends HTMLElement = HTMLElement>(
  options: UseFadeInOptions = {}
): {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
} {
  const { threshold = 0.1, rootMargin = '0px', delay = 0 } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return { ref, isVisible };
}
