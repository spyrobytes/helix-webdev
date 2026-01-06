import { Metadata } from 'next';
import Link from 'next/link';
import { LegalContent } from '@/components/shared/LegalContent';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Helixbytes Digital Solutions Privacy Policy - How we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Breadcrumb">
        <Link href="/" className={styles.backLink}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <div className={styles.meta}>
            <span className={styles.company}>Helixbytes Digital Solutions</span>
            <span className={styles.lastUpdated}>Last updated: January 6, 2026</span>
          </div>
        </header>

        <LegalContent>
          <h2>1. Introduction</h2>
          <p>
            Helixbytes Digital Solutions (&ldquo;<strong>Helixbytes</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;) respects your privacy and is committed to protecting personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you interact with our website, services, and AI-powered solutions.
          </p>
          <p>
            By using our website or services, you consent to the practices described in this policy.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide</h3>
          <p>We may collect personal information you voluntarily provide, including:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company or organization</li>
            <li>Messages, inquiries, or project-related communications</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and device information</li>
            <li>Pages visited and interaction data</li>
            <li>Referring URLs</li>
          </ul>

          <h3>2.3 Cookies and Similar Technologies</h3>
          <p>
            At this time, we do not use cookies for advertising or analytics on our website.
          </p>
          <p>
            Some features and third-party services we use (for example, security and abuse prevention tools) may rely on similar technologies (such as cookies, local storage, or device identifiers) to function properly.
          </p>
          <p>
            You can control cookies through your browser settings. Note that disabling certain technologies may impact site functionality.
          </p>

          <h2>3. How We Use Information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Respond to inquiries and provide services</li>
            <li>Communicate about projects, updates, or support</li>
            <li>Improve our website, services, and security</li>
            <li>Monitor usage and performance</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>

          <h2>4. AI &amp; Data Processing Context</h2>
          <p>When providing AI, machine learning, or MLOps services:</p>
          <ul>
            <li>Client-provided data is used solely to deliver agreed services</li>
            <li>Data is not used to train generalized or third-party models without explicit written consent</li>
            <li>AI outputs are generated programmatically and may be processed by third-party platforms under their own privacy policies</li>
          </ul>

          <h2>5. Legal Basis for Processing</h2>
          <p>Where applicable (e.g., GDPR), we process personal data based on:</p>
          <ul>
            <li>Consent</li>
            <li>Performance of a contract</li>
            <li>Legitimate business interests</li>
            <li>Legal obligations</li>
          </ul>

          <h2>6. Information Sharing</h2>
          <p>
            We do <strong>not</strong> sell personal information.
          </p>
          <p>We may share information:</p>
          <ul>
            <li>With trusted service providers (for example, website hosting, email delivery, cloud infrastructure, content management, and security)</li>
            <li>To comply with law, regulation, or legal process</li>
            <li>To protect rights, safety, or security</li>
            <li>In connection with a business transaction (e.g., merger or acquisition)</li>
          </ul>
          <p>All service providers are required to protect information appropriately.</p>

          <h2>7. Data Retention</h2>
          <p>
            We retain personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law or contract.
          </p>

          <h2>8. Data Security</h2>
          <p>
            We implement reasonable technical and organizational safeguards to protect information. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access personal information</li>
            <li>Correct or update inaccurate data</li>
            <li>Request deletion of personal data</li>
            <li>Withdraw consent</li>
            <li>Object to or restrict certain processing</li>
          </ul>
          <p>
            Requests can be made via our <Link href="/contact">contact page</Link>.
          </p>
          <p>We may need to verify your identity before fulfilling certain requests.</p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be processed or stored outside your country of residence. We take reasonable measures to ensure appropriate protections are in place.
          </p>

          <h2>11. Third-Party Links</h2>
          <p>
            Our website may link to third-party websites or services. We are not responsible for their privacy practices and encourage you to review their policies.
          </p>

          <h2>12. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 13 (or 16 where required by law). We do not knowingly collect personal information from children.
          </p>

          <h2>13. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Updates will be posted with a revised &ldquo;Last updated&rdquo; date. Continued use of our services constitutes acceptance of changes.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or would like to submit a privacy request, please contact us via our <Link href="/contact">contact page</Link>.
          </p>
        </LegalContent>
      </article>
    </div>
  );
}
