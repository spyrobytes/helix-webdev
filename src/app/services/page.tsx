import { Metadata } from 'next';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceDetail } from '@/components/services/ServiceDetail';
import { AIShowcase } from '@/components/services/AIShowcase';
import { ServicesCTA } from '@/components/services/ServicesCTA';
import { SERVICES } from '@/constants/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive digital services: Full-stack development, AI integration, cybersecurity, cloud architecture, and strategic consulting.',
};

export default function ServicesPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <ServiceHero />

      {/* Service detail sections */}
      {SERVICES.map((service, index) => (
        <ServiceDetail
          key={service.id}
          service={service}
          index={index}
          isReversed={index % 2 === 1}
        />
      ))}

      {/* AI End-to-End Showcase */}
      <AIShowcase />

      {/* Call to Action */}
      <ServicesCTA />
    </div>
  );
}
