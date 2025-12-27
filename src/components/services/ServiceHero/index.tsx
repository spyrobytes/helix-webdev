'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './ServiceHero.module.css';

interface AnimatedStatProps {
  endValue: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}

function AnimatedStat({ endValue, suffix = '', duration = 2000, isVisible }: AnimatedStatProps): React.JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isVisible, endValue, duration]);

  return <>{displayValue}{suffix}</>;
}

export function ServiceHero(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Small delay to ensure smooth page load animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>What We Do</span>
          <h1 className={styles.title}>
            Engineering <span className={styles.highlight}>Excellence</span>,
            <br />
            Delivered End-to-End
          </h1>
          <p className={styles.subtitle}>
            From concept to deployment and beyond, we build intelligent, secure,
            and scalable digital solutions. Our full-spectrum capabilities mean
            you get a unified team that understands your entire technology stack.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <AnimatedStat endValue={6} isVisible={isVisible} duration={1500} />
              </span>
              <span className={styles.statLabel}>Core Disciplines</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <AnimatedStat endValue={50} suffix="+" isVisible={isVisible} duration={2000} />
              </span>
              <span className={styles.statLabel}>Technologies</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <AnimatedStat endValue={100} suffix="%" isVisible={isVisible} duration={2500} />
              </span>
              <span className={styles.statLabel}>In-House Expertise</span>
            </div>
          </div>
        </div>

        <div className={`${styles.scrollIndicator} ${isVisible ? styles.visible : ''}`}>
          <span>Explore our services</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
