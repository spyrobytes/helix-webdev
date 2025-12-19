'use client';

import { useRef } from 'react';
import { SERVICES } from '@/constants/data';
import { useScrollCards } from '@/hooks/useScrollCards';
import { AnimatedCard } from './AnimatedCard';
import styles from './Services.module.css';

export function Services(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardDeckRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize scroll-triggered card animation system
  // cardCount ensures hook re-initializes if services list changes
  // Returns a ref to state (access via .current in event handlers)
  const scrollCardsStateRef = useScrollCards({
    sectionRef,
    cardDeckRef,
    cardRefs,
    navHeight: 80,
    cardCount: SERVICES.length,
  });

  // State ref is available for future use (e.g., conditional rendering, analytics)
  // Access via scrollCardsStateRef.current.progress, .isSectionVisible, etc.
  void scrollCardsStateRef;

  return (
    <section className={styles.section} id="services" ref={sectionRef}>
      {/* Header with solid background - scrolls over stacked cards */}
      <div className={styles.servicesHeader}>
        <span className={styles.sectionTag}>What We Do</span>
        <h2 className={styles.sectionTitle}>Our Services</h2>
      </div>

      {/* Screen reader live region for card announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
        id="card-announcer"
      />

      {/* Sticky card container */}
      <div className={styles.cardContainer}>
        <div className={styles.cardDeck} ref={cardDeckRef}>
          {SERVICES.map((service, index) => (
            <AnimatedCard
              key={service.id}
              service={service}
              index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
