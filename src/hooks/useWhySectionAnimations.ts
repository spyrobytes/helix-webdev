import { useEffect, useRef, useState } from 'react';

interface AnimationState {
  titleVisible: boolean;
  pillsVisible: boolean;
  contentVisible: boolean;
  ctaPanelVisible: boolean;
}

export const useWhySectionAnimations = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    titleVisible: false,
    pillsVisible: false,
    contentVisible: false,
    ctaPanelVisible: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered visibility triggers
            setAnimationState({
              titleVisible: true,
              pillsVisible: true,
              contentVisible: true,
              ctaPanelVisible: true,
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: '0px 0px -100px 0px', // Offset trigger point
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    sectionRef,
    animationState,
  };
};
