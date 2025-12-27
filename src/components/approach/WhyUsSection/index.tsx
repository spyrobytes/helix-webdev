'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { WHY_PILLS } from '@/constants/data';
import styles from './WhyUsSection.module.css';

export function WhyUsSection(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
            <span className={styles.kicker}>Why Helixbytes</span>
            <h2 className={styles.title}>
              Innovation Without Boundaries.
              <br />
              Partners Without Silos.
            </h2>
            <p className={styles.description}>
              You&apos;re not just looking for a vendor—you&apos;re looking for a technical
              partner who understands complexity, communicates clearly, and ships
              high-quality solutions.
            </p>
            <p className={styles.description}>
              Helixbytes brings together full-stack engineering, AI integration,
              and cybersecurity into a single, cohesive offering. That means you
              don&apos;t have to manage multiple disconnected teams or compromise on
              depth of expertise.
            </p>
          </div>

          <div className={`${styles.pills} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.pillsLabel}>What sets us apart:</div>
            <div className={styles.pillsGrid}>
              {WHY_PILLS.map((pill, index) => (
                <div
                  key={pill}
                  className={styles.pill}
                  style={{ transitionDelay: `${0.3 + index * 0.08}s` }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.pillIcon}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
