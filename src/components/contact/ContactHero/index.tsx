'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './ContactHero.module.css';

export function ContactHero(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ delay: 100 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <span className={styles.kicker}>Get in Touch</span>
        <h1 className={styles.title}>
          Let&apos;s Build Something
          <br />
          <span className={styles.highlight}>Great Together</span>
        </h1>
        <p className={styles.subtitle}>
          Have a project in mind? Tell us about your goals and challenges.
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    </section>
  );
}
