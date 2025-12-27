'use client';

import { useRef, useEffect, useState } from 'react';
import type { Service } from '@/types';
import styles from './ServiceDetail.module.css';

interface ServiceDetailProps {
  service: Service;
  index: number;
  isReversed: boolean;
}

export function ServiceDetail({ service, index, isReversed }: ServiceDetailProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Get accent color based on service index
  const accentColors = [
    'var(--accent-1)', // cyan
    'var(--accent-2)', // purple
    'var(--accent-3)', // green
    'var(--accent-5)', // pink
    'var(--accent-6)', // blue
    'var(--accent-4)', // orange
  ];
  const accentColor = accentColors[index % accentColors.length];

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isReversed ? styles.reversed : ''}`}
      id={`service-${service.id}`}
    >
      <div className={styles.inner}>
        {/* Visual Side */}
        <div className={`${styles.visual} ${isVisible ? styles.visible : ''}`}>
          <div
            className={styles.iconContainer}
            style={{ '--accent-color': accentColor } as React.CSSProperties}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.icon}
            >
              <path d={typeof service.icon === 'string' ? service.icon : ''} />
            </svg>
          </div>

          {/* Decorative elements */}
          <div className={styles.decorLine} style={{ '--accent-color': accentColor } as React.CSSProperties} />
          <div className={styles.decorDots}>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={styles.dot}
                style={{
                  '--accent-color': accentColor,
                  animationDelay: `${i * 0.2}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        {/* Content Side */}
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.header}>
            <span
              className={styles.number}
              style={{ '--accent-color': accentColor } as React.CSSProperties}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className={styles.title}>{service.title}</h2>
          </div>

          <p className={styles.description}>{service.description}</p>

          {/* Tags */}
          <div className={styles.tags}>
            {service.tags.map((tag) => (
              <span
                key={tag.id}
                className={styles.tag}
                style={{ '--accent-color': accentColor } as React.CSSProperties}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Capabilities */}
          {service.backItems && (
            <div className={styles.capabilities}>
              <span className={styles.capabilitiesLabel}>{service.backIntro}</span>
              <ul className={styles.capabilitiesList}>
                {service.backItems.map((item, i) => (
                  <li
                    key={i}
                    className={styles.capabilityItem}
                    style={{
                      '--accent-color': accentColor,
                      animationDelay: `${0.3 + i * 0.1}s`,
                    } as React.CSSProperties}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
