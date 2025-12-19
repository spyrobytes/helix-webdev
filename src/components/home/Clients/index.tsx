'use client';

// src/components/home/Clients/index.tsx
// Clients section showcasing trusted sectors

import { CLIENT_SECTORS } from '@/constants/data';
import { useClientsAnimations } from '@/hooks/useClientsAnimations';
import { ClientBadge } from './ClientBadge';
import styles from './Clients.module.css';
import sectionStyles from '@/styles/section.module.css';

export function Clients(): React.JSX.Element {
  const { sectionRef, isVisible } = useClientsAnimations();

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.animate : ''}`}
      id="clients"
    >
      <div className={sectionStyles.inner}>
        <div className={`${sectionStyles.header} ${styles.header} ${isVisible ? styles.headerAnimate : ''}`}>
          <div className={sectionStyles.kicker}>Who We Serve</div>
          <h2 className={sectionStyles.title}>Trusted Across Sectors</h2>
          <p className={sectionStyles.subtitle}>
            From agile startups to global enterprises, we partner with organizations
            that demand excellence, security, and innovation at every level.
          </p>
        </div>

        <div className={styles.grid}>
          {CLIENT_SECTORS.map((sector, index) => (
            <ClientBadge
              key={sector.id}
              label={sector.label}
              description={sector.description}
              icon={sector.icon}
              accentVar={sector.accentVar}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
