'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { MISSION_POINTS } from '@/constants/data';
import styles from './PhilosophySection.module.css';

const PHILOSOPHY_ICONS = [
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', // Innovation
  'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', // Security
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', // Future-Ready
  'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', // Versatile
];

export function PhilosophySection(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>Our Philosophy</span>
          <h2 className={styles.title}>Principles That Guide Every Decision</h2>
        </div>

        <div className={styles.grid}>
          {MISSION_POINTS.map((point, index) => (
            <div
              key={point.id}
              className={`${styles.card} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
            >
              <div className={styles.cardIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={PHILOSOPHY_ICONS[index]} />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>{point.heading}</h3>
              <p className={styles.cardDescription}>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
