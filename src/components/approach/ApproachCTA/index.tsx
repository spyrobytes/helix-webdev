'use client';

import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';
import { Button } from '@/components/shared/Button';
import styles from './ApproachCTA.module.css';

export function ApproachCTA(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={`${styles.inner} ${isVisible ? styles.visible : ''}`}>
        <h2 className={styles.title}>Ready to Work Together?</h2>
        <p className={styles.description}>
          Whether you&apos;re validating an idea, modernizing legacy systems, or
          scaling an existing platform—we&apos;d love to hear about it.
        </p>

        <div className={styles.actions}>
          <Link href="/contact">
            <Button variant="primary">Start a Conversation</Button>
          </Link>
          <Link href="/why-helixbytes">
            <Button variant="secondary">Why Helixbytes</Button>
          </Link>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaDot} />
            Typically responding within one business day
          </div>
        </div>
      </div>
    </section>
  );
}
