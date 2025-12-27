'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { CLIENT_SECTORS } from '@/constants/data';
import styles from './ClientsSection.module.css';

export function ClientsSection(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>Who We Serve</span>
          <h2 className={styles.title}>Adaptable to Your Scale and Needs</h2>
          <p className={styles.subtitle}>
            From agile startups to complex government systems, we tailor our
            engagement model to match your organizational requirements.
          </p>
        </div>

        <div className={styles.grid}>
          {CLIENT_SECTORS.map((sector, index) => (
            <div
              key={sector.id}
              className={`${styles.card} ${isVisible ? styles.visible : ''}`}
              style={{
                transitionDelay: `${0.15 + index * 0.1}s`,
                '--sector-accent': `var(${sector.accentVar})`,
              } as React.CSSProperties}
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
                  <path d={sector.icon} />
                </svg>
              </div>
              <h3 className={styles.cardLabel}>{sector.label}</h3>
              <p className={styles.cardDescription}>{sector.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
