import { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Message Received',
  description: 'Thank you for contacting Helixbytes. We\'ll be in touch soon.',
};

export default function VerifiedPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconSuccess}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className={styles.title}>Message Received!</h1>

        <p className={styles.description}>
          Thank you for reaching out to Helixbytes. We&apos;ve received your message
          and will get back to you within one business day.
        </p>

        <div className={styles.nextSteps}>
          <h2 className={styles.nextStepsTitle}>What happens next?</h2>
          <ol className={styles.stepsList}>
            <li>Our team reviews your message</li>
            <li>We&apos;ll reach out via email to schedule a call</li>
            <li>Discovery call to understand your needs</li>
            <li>Tailored proposal based on your requirements</li>
          </ol>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Back to Home
          </Link>
          <Link href="/services" className={styles.secondaryButton}>
            Explore Services
          </Link>
        </div>

        <p className={styles.note}>
          Didn&apos;t submit a form? This page may have been accessed in error.
          <br />
          <Link href="/contact" className={styles.link}>
            Go to contact page
          </Link>
        </p>
      </div>
    </div>
  );
}
