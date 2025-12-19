'use client';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Button } from '@/components/shared/Button';
import styles from './HeroContent.module.css';

export function HeroContent(): React.JSX.Element {
  const smoothScroll = useSmoothScroll();

  return (
    <div>
      <div className={styles.kicker}>HELIXBYTES DIGITAL SOLUTIONS</div>
      <h1 className={styles.title}>
        Innovation<br />
        <span className={styles.highlight}>Without Boundaries.</span>
      </h1>
      <p className={styles.subtitle}>
        We design and engineer{' '}
        <strong>intelligent, secure, and scalable</strong> digital
        solutions—from full-stack platforms and AI-driven applications to
        fortified cyber defenses for businesses, enterprises, and government
        agencies.
      </p>

      <div className={styles.ctaRow}>
        <Button variant="primary" onClick={() => smoothScroll('#contact')}>
          Schedule a Discovery Call
          <span>➝</span>
        </Button>
        <Button variant="secondary" onClick={() => smoothScroll('#services')}>
          Explore Our Services
        </Button>
      </div>

      <div className={styles.competencies}>
        <span className={styles.dot} />
        <span>Full-Stack Engineering</span>
        <span>•</span>
        <span>Intelligent Web &amp; AI</span>
        <span>•</span>
        <span>Cybersecurity &amp; Resilience</span>
      </div>
    </div>
  );
}
