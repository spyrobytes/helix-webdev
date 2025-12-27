import { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Helixbytes. Tell us about your project and we\'ll respond within one business day.',
};

export default function ContactPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <ContactHero />
      <div className={styles.content}>
        <div className={styles.inner}>
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
