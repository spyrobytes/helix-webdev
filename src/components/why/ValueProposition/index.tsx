'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './ValueProposition.module.css';

const VALUE_POINTS = [
  {
    id: 'unified',
    title: 'Unified Expertise',
    description: 'No more juggling multiple vendors. Get full-stack development, AI, cloud, and security from one cohesive team that actually talks to each other.',
  },
  {
    id: 'velocity',
    title: 'Faster Time-to-Value',
    description: 'Integrated teams move faster. No handoff delays, no translation layers, no finger-pointing. Just continuous progress toward your goals.',
  },
  {
    id: 'quality',
    title: 'Consistent Quality',
    description: 'Shared standards across disciplines mean fewer gaps and surprises. Every layer of your solution meets the same bar of excellence.',
  },
  {
    id: 'partnership',
    title: 'True Partnership',
    description: 'We succeed when you succeed. Our engagement model is built on transparency, honest feedback, and long-term thinking—not billable hours.',
  },
] as const;

export function ValueProposition(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
            <span className={styles.kicker}>The Helixbytes Difference</span>
            <h2 className={styles.title}>
              What You Actually Get
            </h2>
            <p className={styles.description}>
              Beyond technical capabilities, working with Helixbytes means
              tangible business advantages that impact your bottom line.
            </p>
          </div>

          <div className={styles.points}>
            {VALUE_POINTS.map((point, index) => (
              <div
                key={point.id}
                className={`${styles.point} ${isVisible ? styles.visible : ''}`}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={styles.pointNumber}>{String(index + 1).padStart(2, '0')}</div>
                <div className={styles.pointContent}>
                  <h3 className={styles.pointTitle}>{point.title}</h3>
                  <p className={styles.pointDescription}>{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
