'use client';

import { forwardRef } from 'react';
import type { Service } from '@/types';
import styles from './AnimatedCard.module.css';

interface AnimatedCardProps {
  service: Service;
  index: number;
}

/**
 * Renders an SVG icon from a path string.
 * The icon paths are stored as strings in the service data for easy serialization.
 */
function ServiceIcon({ pathData }: { pathData: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={pathData} />
    </svg>
  );
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  function AnimatedCard({ service, index }, ref) {
    const headingId = `card-title-${service.id}`;

    return (
      <div
        ref={ref}
        data-index={index}
        tabIndex={0}
        role="article"
        aria-labelledby={headingId}
        className={styles.card}
      >
        <div className={styles.cardInner}>
          {/* Front Face */}
          <div className={styles.cardFront}>
            <div className={styles.cardIcon}>
              {typeof service.icon === 'string' ? (
                <ServiceIcon pathData={service.icon} />
              ) : (
                service.icon
              )}
            </div>
            <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={styles.cardTitle} id={headingId}>
              {service.title}
            </h3>
            <p className={styles.cardDescription}>{service.description}</p>
            <div className={styles.cardTags} aria-label="Technologies">
              {service.tags.map((tag) => (
                <span key={tag.id} className={styles.cardTag}>
                  {tag.label}
                </span>
              ))}
            </div>
            {service.backIntro && <span className={styles.flipHint}>Click to learn more</span>}
          </div>

          {/* Back Face - scroll handled by useScrollCards hook */}
          {service.backIntro && (
            <div className={styles.cardBack} tabIndex={0}>
              <button className={styles.flipBackBtn} aria-label="Flip back to front" type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h4 className={styles.cardBackTitle}>{service.title}</h4>
              <div className={styles.cardBackContent}>
                <p>{service.backIntro}</p>
                {service.backItems && (
                  <ul>
                    {service.backItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              {service.ctaLabel && (
                <a href={service.ctaHref || '#contact'} className={styles.cardBackCta}>
                  {service.ctaLabel} &rarr;
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
