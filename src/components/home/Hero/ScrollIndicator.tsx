'use client';

import { useEffect, useState } from 'react';
import styles from './ScrollIndicator.module.css';

/**
 * Scroll indicator component for Hero section.
 *
 * - Auto-hides when user scrolls past threshold (300px)
 * - Re-appears when scrolling back to top
 * - Non-interactive (visual cue only)
 * - Fades in after 1s delay to let hero content settle
 */
export function ScrollIndicator(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hide when scrolled past 300px, show when back at top
      setIsVisible(scrollY < 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.indicator} ${isVisible ? styles.visible : styles.hidden}`}
      aria-label="Scroll down to explore more content"
      role="img"
    >
      <span className={styles.label}>Scroll to explore</span>
      <div className={styles.line} aria-hidden="true" />
    </div>
  );
}
