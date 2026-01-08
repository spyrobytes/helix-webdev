import { Metadata } from 'next';
import { ApproachHero } from '@/components/approach/ApproachHero';
import { ProcessSection } from '@/components/approach/ProcessSection';
import { PhilosophySection } from '@/components/approach/PhilosophySection';
import { ApproachCTA } from '@/components/approach/ApproachCTA';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Our Approach',
  description:
    'How Helixbytes delivers results: our agile process, engineering philosophy, and commitment to building reliable, scalable software solutions.',
  alternates: {
    canonical: '/approach',
  },
};

export default function ApproachPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <ApproachHero />
      <ProcessSection />
      <PhilosophySection />
      <ApproachCTA />
    </div>
  );
}
