import { Metadata } from 'next';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ServiceDetail } from '@/components/services/ServiceDetail';
import { AIShowcase } from '@/components/services/AIShowcase';
import { ServicesCTA } from '@/components/services/ServicesCTA';
import { SERVICES } from '@/constants/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Expert software development services in Canada: Full-stack web and mobile apps, AI/ML integration, cybersecurity consulting, cloud architecture, and DevOps.',
  alternates: {
    canonical: '/services',
  },
};

// Service structured data for rich results
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: SERVICES.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'Helixbytes Digital Solutions',
        url: 'https://helixbytes.com',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Canada',
      },
      url: 'https://helixbytes.com/services',
    },
  })),
};

export default function ServicesPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
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
    </>
  );
}
