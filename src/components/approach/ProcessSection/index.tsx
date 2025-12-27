'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { MISSION_ITEMS } from '@/constants/data';
import styles from './ProcessSection.module.css';

const PROCESS_ICONS = [
  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', // Discovery
  'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', // Architecture
  'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', // Delivery
  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', // Security
];

export function ProcessSection(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>Our Process</span>
          <h2 className={styles.title}>From Concept to Production</h2>
          <p className={styles.subtitle}>
            Every engagement follows a proven process that ensures clarity,
            alignment, and measurable progress at each stage.
          </p>
        </div>

        <div className={styles.steps}>
          {MISSION_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.step} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</div>
              <div className={styles.stepIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={PROCESS_ICONS[index]} />
                </svg>
              </div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
