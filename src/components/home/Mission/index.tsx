'use client';

import { MISSION_ITEMS, MISSION_POINTS } from '@/constants/data';
import { useMissionAnimations } from '@/hooks/useMissionAnimations';
import { MissionIcon } from './MissionIcon';
import { ProgressCircle } from './ProgressCircle';
import styles from './Mission.module.css';
import sectionStyles from '@/styles/section.module.css';

const MISSION_ICON_TYPES = ['discovery', 'architecture', 'delivery', 'security'] as const;

export function Mission(): React.JSX.Element {
  const { sectionRef, itemRefs, isVisible, itemProgress } = useMissionAnimations({
    itemCount: MISSION_ITEMS.length,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.animate : ''}`}
      id="mission"
    >
      <div className={sectionStyles.inner}>
        <div className={`${sectionStyles.header} ${isVisible ? styles.headerAnimate : ''}`}>
          <div className={sectionStyles.kicker}>Mission &amp; Approach</div>
          <h2 className={sectionStyles.title}>How We Think. How We Deliver.</h2>
          <p className={sectionStyles.subtitle}>
            Our mission is simple: to engineer intelligent, secure, and
            future-ready solutions that let you focus on what matters most—your
            business, your users, and your mission.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.block}>
            <p>
              At <strong>Helixbytes</strong>, we treat every engagement as a
              partnership. We listen first, design deliberately, and build with a
              clear line of sight from{' '}
              <strong>concept</strong> to <strong>production</strong>.
            </p>
            <ul className={styles.list}>
              {MISSION_ITEMS.map((item, index) => (
                <li
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`${styles.listItem} ${isVisible ? styles.itemAnimate : ''}`}
                  style={
                    {
                      animationDelay: `${0.1 + index * 0.15}s`,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.itemHeader}>
                    <ProgressCircle
                      step={index + 1}
                      progress={itemProgress[index]?.progress || 0}
                      isVisible={itemProgress[index]?.isVisible || false}
                      className={styles.progressCircle}
                    />
                    <MissionIcon type={MISSION_ICON_TYPES[index]} className={styles.missionIcon} />
                  </div>
                  <div className={styles.itemContent}>
                    <strong>{item.title}</strong> {item.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.points}>
            {MISSION_POINTS.map((point, index) => (
              <div
                key={point.id}
                className={`${styles.pointCard} ${isVisible ? styles.pointAnimate : ''}`}
                style={
                  {
                    animationDelay: `${0.3 + index * 0.1}s`,
                  } as React.CSSProperties
                }
              >
                <h4>{point.heading}</h4>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
