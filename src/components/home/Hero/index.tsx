import { HeroContent } from './HeroContent';
import { CapabilitiesCard } from './CapabilitiesCard';
import { ScrollIndicator } from './ScrollIndicator';
import styles from './Hero.module.css';
import sectionStyles from '@/styles/section.module.css';

export function Hero(): React.JSX.Element {
  return (
    <section className={styles.section} id="hero">
      <div className={`${sectionStyles.inner} ${styles.grid}`}>
        <HeroContent />
        <CapabilitiesCard />
      </div>
      <ScrollIndicator />
    </section>
  );
}
