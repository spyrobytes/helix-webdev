import { useEffect, useRef, useState } from 'react';

interface AnimationState {
  brandVisible: boolean;
  linksVisible: boolean;
  contactVisible: boolean;
  socialVisible: boolean;
  bottomBarVisible: boolean;
}

export const useFooterAnimations = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    brandVisible: false,
    linksVisible: false,
    contactVisible: false,
    socialVisible: false,
    bottomBarVisible: false,
  });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger staggered column animations
            setAnimationState({
              brandVisible: true,
              linksVisible: true,
              contactVisible: true,
              socialVisible: true,
              bottomBarVisible: true,
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px', // Slight offset
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    footerRef,
    animationState,
  };
};
