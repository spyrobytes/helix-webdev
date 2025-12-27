import { Metadata } from 'next';
import { WhyHero } from '@/components/why/WhyHero';
import { DifferentiatorsSection } from '@/components/why/DifferentiatorsSection';
import { ValueProposition } from '@/components/why/ValueProposition';
import { ClientsSection } from '@/components/why/ClientsSection';
import { WhyCTA } from '@/components/why/WhyCTA';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Why Helixbytes',
  description: 'Discover why organizations choose Helixbytes: unified expertise, AI-native solutions, security-first approach, and a true partnership model.',
};

export default function WhyHelixbytesPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <WhyHero />
      <DifferentiatorsSection />
      <ValueProposition />
      <ClientsSection />
      <WhyCTA />
    </div>
  );
}
