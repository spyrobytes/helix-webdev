'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './DifferentiatorsSection.module.css';

const DIFFERENTIATORS = [
  {
    id: 'ai-native',
    title: 'AI-Native',
    tagline: 'Not an afterthought',
    description: 'We build AI into products from day one—not as a bolt-on feature. From LLM integration to custom model training, AI capabilities are woven into our architecture decisions.',
    icon: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83',
    accent: 'var(--accent-2)',
  },
  {
    id: 'security-first',
    title: 'Security-First',
    tagline: 'Built in, not bolted on',
    description: 'Security is embedded at every layer—from secure coding practices to infrastructure hardening to compliance automation. We assume threats exist and design accordingly.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
    accent: 'var(--accent-3)',
  },
  {
    id: 'cloud-ready',
    title: 'Cloud-Ready',
    tagline: 'Scale without limits',
    description: 'Whether AWS, Azure, GCP, or hybrid—we architect for elasticity, resilience, and cost efficiency. Your infrastructure grows with your business, not against it.',
    icon: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
    accent: 'var(--accent-1)',
  },
  {
    id: 'human-centered',
    title: 'Human-Centered UX',
    tagline: 'Technology that serves people',
    description: 'Great software is invisible. We design interfaces that feel intuitive, accessible, and delightful—reducing friction between users and their goals.',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    accent: 'var(--accent-4)',
  },
] as const;

export function DifferentiatorsSection(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>What Sets Us Apart</span>
          <h2 className={styles.title}>Four Pillars of Excellence</h2>
          <p className={styles.subtitle}>
            These aren&apos;t just buzzwords—they&apos;re principles embedded in every
            project, every decision, every line of code.
          </p>
        </div>

        <div className={styles.grid}>
          {DIFFERENTIATORS.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.card} ${isVisible ? styles.visible : ''}`}
              style={{
                transitionDelay: `${0.15 + index * 0.1}s`,
                '--card-accent': item.accent,
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
                  <path d={item.icon} />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <span className={styles.cardTagline}>{item.tagline}</span>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
