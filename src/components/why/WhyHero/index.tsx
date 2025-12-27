'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './WhyHero.module.css';

export function WhyHero(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ delay: 100 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <span className={styles.kicker}>Why Helixbytes</span>
        <h1 className={styles.title}>
          One Team. Full Spectrum.
          <br />
          <span className={styles.highlight}>Zero Compromises.</span>
        </h1>
        <p className={styles.subtitle}>
          You need more than a vendor—you need a technical partner who can see
          the whole picture. From AI to infrastructure to security, we bring
          unified expertise so you can move faster with confidence.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>1</span>
            <span className={styles.statLabel}>Integrated Team</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>6</span>
            <span className={styles.statLabel}>Core Disciplines</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Handoff Gaps</span>
          </div>
        </div>
      </div>
    </section>
  );
}
