'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './ApproachHero.module.css';

export function ApproachHero(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ delay: 100 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <span className={styles.kicker}>Our Approach</span>
        <h1 className={styles.title}>
          How We <span className={styles.highlight}>Think</span>.
          <br />
          How We <span className={styles.highlight}>Deliver</span>.
        </h1>
        <p className={styles.subtitle}>
          We believe great software comes from clear thinking, honest communication,
          and disciplined execution. Every engagement is a partnership built on
          transparency and shared goals.
        </p>
      </div>
    </section>
  );
}
