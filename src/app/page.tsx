// Home page - All sections migrated from POC
// Structure: Hero, Services, Mission, WhySection, Clients

import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { Mission } from '@/components/home/Mission';
import { WhySection } from '@/components/home/WhySection';
import { Clients } from '@/components/home/Clients';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <Services />
      <Mission />
      <WhySection />
      <Clients />
    </div>
  );
}
