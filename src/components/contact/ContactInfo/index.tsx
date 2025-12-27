'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import styles from './ContactInfo.module.css';

const CONTACT_POINTS = [
  {
    id: 'response',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Quick Response',
    description: 'We respond to all inquiries within one business day.',
  },
  {
    id: 'consultation',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    title: 'Free Consultation',
    description: 'Initial discovery calls are always complimentary.',
  },
  {
    id: 'nda',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Confidential',
    description: 'NDA available upon request. Your ideas are safe with us.',
  },
] as const;

export function ContactInfo(): React.JSX.Element {
  const { ref, isVisible } = useFadeIn<HTMLDivElement>({ threshold: 0.1, delay: 200 });

  return (
    <div ref={ref} className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <h2 className={styles.title}>What to Expect</h2>

      <div className={styles.points}>
        {CONTACT_POINTS.map((point, index) => (
          <div
            key={point.id}
            className={styles.point}
            style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
          >
            <div className={styles.pointIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={point.icon} />
              </svg>
            </div>
            <div>
              <h3 className={styles.pointTitle}>{point.title}</h3>
              <p className={styles.pointDescription}>{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.directContact}>
        <h3 className={styles.directTitle}>Prefer Email?</h3>
        <p className={styles.directText}>
          Reach us directly at{' '}
          <a href="mailto:hello@helixbytes.digital" className={styles.email}>
            hello@helixbytes.digital
          </a>
        </p>
      </div>

      <div className={styles.availability}>
        <div className={styles.statusDot} />
        <span>Available for new projects</span>
      </div>
    </div>
  );
}
