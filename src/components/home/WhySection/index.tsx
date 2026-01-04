'use client';

import { WHY_PILLS } from '@/constants/data';
import { Pill } from '@/components/shared/Pill';
import { Button } from '@/components/shared/Button';
import { StatusDot } from '@/components/shared/StatusDot';
import { useWhySectionAnimations } from '@/hooks/useWhySectionAnimations';
import styles from './WhySection.module.css';
import sectionStyles from '@/styles/section.module.css';

export function WhySection(): React.JSX.Element {
  const { sectionRef, animationState } = useWhySectionAnimations();

  return (
    <section ref={sectionRef} className={styles.section} id="why">
      <div className={sectionStyles.inner}>
        <div
          className={`${sectionStyles.header} ${styles.title} ${
            animationState.titleVisible ? styles.titleVisible : ''
          }`}
        >
          <div className={sectionStyles.kicker}>Why Helixbytes</div>
          <h2 className={sectionStyles.title}>Innovation Without Boundaries. Partners Without Silos.</h2>
          <p className={sectionStyles.subtitle}>
            You&apos;re not just looking for a vendor—you&apos;re looking for a technical
            partner who understands complexity, communicates clearly, and ships
            high-quality solutions.
          </p>
        </div>

        <div className={styles.layout}>
          <div>
            <div
              className={`${styles.pillRow} ${
                animationState.pillsVisible ? styles.pillsVisible : ''
              }`}
            >
              {WHY_PILLS.map((pill, index) => (
                <div key={pill} className={styles.pill} style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <Pill>{pill}</Pill>
                </div>
              ))}
            </div>

            <div
              className={`${styles.contentBlock} ${
                animationState.contentVisible ? styles.contentVisible : ''
              }`}
            >
              <p className={styles.description}>
                Helixbytes brings together full-stack engineering, AI integration,
                and cybersecurity into a single, cohesive offering. That means you
                don&apos;t have to manage multiple disconnected teams or compromise on
                depth of expertise.
              </p>
              <p className={styles.description}>
                We thrive in environments where reliability, performance, and
                security are non-negotiable—whether that&apos;s a digital product,
                internal platform, or mission-critical public service.
              </p>
            </div>
          </div>

          <div
            className={`${styles.ctaPanel} ${
              animationState.ctaPanelVisible ? styles.ctaPanelVisible : ''
            }`}
            id="contact"
          >
            <h3>Ready to Explore What We Can Build Together?</h3>
            <p>
              Whether you&apos;re validating an idea, modernizing legacy systems, or
              scaling an existing platform, we&apos;d love to hear about it.
            </p>

            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
              Start Your Project Brief
            </Button>

            <div className={styles.ctaContactMeta}>
              <p>
                <StatusDot />
                Typically responding within one business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
