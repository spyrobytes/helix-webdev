'use client';

import { useRotatingPhrases } from '@/hooks/useRotatingPhrases';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { HERO_PHRASES, HERO_METRICS } from '@/constants/data';
import { RotatingPhrase } from './RotatingPhrase';
import { StatusDot } from '@/components/shared/StatusDot';
import styles from './CapabilitiesCard.module.css';

export function CapabilitiesCard(): React.JSX.Element {
  const { currentPhrase, isVisible } = useRotatingPhrases(HERO_PHRASES);
  const { tiltRef, tiltValues } = useMouseTilt(8);

  return (
    <div
      ref={tiltRef}
      className={styles.visual}
      aria-hidden="true"
      style={{
        '--rotate-x': `${tiltValues.rotateX}deg`,
        '--rotate-y': `${tiltValues.rotateY}deg`,
      } as React.CSSProperties}
    >
      <div className={styles.cloudBackdrop}>
        <img src="/images/cloud-optimized.svg" alt="" className={styles.cloud} />
      </div>
      <div className={styles.core}>
        <div className={styles.coreHeader}>
          <span className={styles.label}>Live capabilities map</span>
          <span className={styles.badge}>Helixbytes • v1.0</span>
        </div>

        <div className={styles.coreMain}>
          <div className={styles.coreTitle}>
            Innovation graph: <span>Active</span>
          </div>
          <RotatingPhrase phrase={currentPhrase} isVisible={isVisible} />
          <div className={styles.metrics}>
            {HERO_METRICS.map((metric, index) => (
              <div key={index}>
                <strong>{metric.value}</strong>
                {metric.label}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.coreFooter}>
          <span className={styles.pill}>
            <StatusDot />
            Accepting new projects
          </span>
          <span>From prototype to production-ready systems.</span>
        </div>
      </div>
    </div>
  );
}
