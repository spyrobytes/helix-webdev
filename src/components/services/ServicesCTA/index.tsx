'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import styles from './ServicesCTA.module.css';

export function ServicesCTA(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`${styles.inner} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to Build Something Great?</h2>
          <p className={styles.description}>
            Whether you need a full digital transformation or a targeted solution,
            our team is ready to help. Let&apos;s discuss how we can bring your vision to life.
          </p>

          <div className={styles.actions}>
            <Link href="/contact">
              <Button variant="primary">Start a Conversation</Button>
            </Link>
            <Link href="/approach">
              <Button variant="secondary">Learn Our Approach</Button>
            </Link>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className={styles.decorLeft} />
        <div className={styles.decorRight} />
      </div>
    </section>
  );
}
