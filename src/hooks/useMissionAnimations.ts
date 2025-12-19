// src/hooks/useMissionAnimations.ts
// Scroll-aware hook for Mission section with per-item progress tracking

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseMissionAnimationsOptions {
  /** Number of mission items to track */
  itemCount: number;
  /** Threshold for initial visibility detection (0-1) */
  threshold?: number;
  /** Root margin for early/late trigger */
  rootMargin?: string;
}

interface MissionItemProgress {
  /** Progress from 0-1 for this specific item */
  progress: number;
  /** Whether item is fully visible */
  isVisible: boolean;
}

/**
 * Hook to track scroll progress through Mission section.
 * Returns per-item visibility and progress for interactive animations.
 *
 * @example
 * const { isVisible, itemProgress, itemRefs } = useMissionAnimations({ itemCount: 4 });
 * <li ref={el => itemRefs.current[0] = el}>
 *   <ProgressCircle progress={itemProgress[0].progress} />
 * </li>
 */
export function useMissionAnimations(
  options: UseMissionAnimationsOptions
) {
  const {
    itemCount,
    threshold = 0.2,
    rootMargin = '0px 0px -20% 0px',
  } = options;

  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [itemProgress, setItemProgress] = useState<MissionItemProgress[]>(
    Array(itemCount).fill({ progress: 0, isVisible: false })
  );

  // Calculate progress for each item based on scroll position
  const updateProgress = useCallback(() => {
    if (!sectionRef.current || !isVisible) return;

    const newProgress = itemRefs.current.map((item) => {
      if (!item) return { progress: 0, isVisible: false };

      const rect = item.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start progress when item enters bottom 80% of viewport
      const startPoint = windowHeight * 0.8;
      // Complete progress when item reaches middle of viewport
      const completePoint = windowHeight * 0.4;

      // Calculate progress based on item position
      if (rect.top <= completePoint) {
        // Item has scrolled to completion point - fully complete
        return { progress: 1, isVisible: true };
      } else if (rect.top >= startPoint) {
        // Item hasn't reached start point yet - not started
        return { progress: 0, isVisible: false };
      } else {
        // Item is between start and complete points
        // Calculate smooth progress from 0 to 1
        const distance = startPoint - completePoint;
        const traveled = startPoint - rect.top;
        const progress = Math.max(0, Math.min(1, traveled / distance));
        return { progress, isVisible: progress > 0.05 };
      }
    });

    setItemProgress(newProgress);
  }, [isVisible]);

  // Section visibility observer
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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

  // Scroll listener for per-item progress
  useEffect(() => {
    if (!isVisible) return;

    // Initial calculation
    updateProgress();

    // Update on scroll
    const handleScroll = () => {
      window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [isVisible, updateProgress]);

  return {
    sectionRef,
    itemRefs,
    isVisible,
    itemProgress,
  };
}
