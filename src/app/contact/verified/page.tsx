'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Note: Metadata must be in a separate file for 'use client' pages
// robots: noindex is handled via robots.ts disallow rule

type VerificationStatus = 'success' | 'already-verified' | 'expired' | 'invalid' | 'loading';

function SuccessCard(): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.iconSuccess}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h1 className={styles.title}>Email Verified!</h1>

      <p className={styles.description}>
        Your email has been successfully verified. Thank you for confirming your contact
        submission. Our team will review your message and get back to you soon.
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
    </div>
  );
}

function AlreadyVerifiedCard(): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.iconInfo}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>

      <h1 className={styles.title}>Already Verified</h1>

      <p className={styles.description}>
        This email has already been verified. Your submission is confirmed and our team
        has been notified. We&apos;ll be in touch soon.
      </p>

      <div className={styles.actions}>
        <Link href="/" className={styles.primaryButton}>
          Back to Home
        </Link>
        <Link href="/services" className={styles.secondaryButton}>
          Explore Services
        </Link>
      </div>
    </div>
  );
}

function ExpiredCard(): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.iconWarning}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>

      <h1 className={styles.title}>Link Expired</h1>

      <p className={styles.description}>
        This verification link has expired. Verification links are valid for 24 hours.
        Please submit a new contact form if you&apos;d like to get in touch.
      </p>

      <div className={styles.actions}>
        <Link href="/contact" className={styles.primaryButton}>
          Submit New Form
        </Link>
        <Link href="/" className={styles.secondaryButton}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function InvalidCard(): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.iconError}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>

      <h1 className={styles.title}>Invalid Link</h1>

      <p className={styles.description}>
        This verification link is invalid or has already been used.
        Please check your email for the correct link or submit a new contact form.
      </p>

      <div className={styles.actions}>
        <Link href="/contact" className={styles.primaryButton}>
          Contact Us
        </Link>
        <Link href="/" className={styles.secondaryButton}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function LoadingCard(): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.iconLoading}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <h1 className={styles.title}>Verifying...</h1>

      <p className={styles.description}>
        Please wait while we verify your email address.
      </p>
    </div>
  );
}

function VerifiedContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const status = (searchParams.get('status') as VerificationStatus) || 'loading';

  switch (status) {
    case 'success':
      return <SuccessCard />;
    case 'already-verified':
      return <AlreadyVerifiedCard />;
    case 'expired':
      return <ExpiredCard />;
    case 'invalid':
      return <InvalidCard />;
    default:
      return <LoadingCard />;
  }
}

export default function VerifiedPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <Suspense fallback={<LoadingCard />}>
        <VerifiedContent />
      </Suspense>
    </div>
  );
}
