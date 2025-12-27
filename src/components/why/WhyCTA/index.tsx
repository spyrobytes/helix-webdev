'use client';

import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';
import { Button } from '@/components/shared/Button';
import styles from './WhyCTA.module.css';

export function WhyCTA(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.inner} ${isVisible ? styles.visible : ''}`}>
        <h2 className={styles.title}>Let&apos;s Build Something Great Together</h2>
        <p className={styles.description}>
          Ready to experience the difference? Tell us about your project and
          discover how Helixbytes can help you achieve your goals.
        </p>

        <div className={styles.actions}>
          <Link href="/contact">
            <Button variant="primary">Start a Conversation</Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary">Explore Our Services</Button>
          </Link>
        </div>

        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            No obligation consultation
          </div>
          <div className={styles.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Response within 24 hours
          </div>
          <div className={styles.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Tailored recommendations
          </div>
        </div>
      </div>
    </section>
  );
}
