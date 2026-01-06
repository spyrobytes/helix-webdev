import { Metadata } from 'next';
import Link from 'next/link';
import { LegalContent } from '@/components/shared/LegalContent';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Helixbytes Digital Solutions Terms of Service - Terms and conditions governing the use of our services.',
};

export default function TermsOfServicePage(): React.JSX.Element {
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
          <h1 className={styles.title}>Terms of Service</h1>
          <div className={styles.meta}>
            <span className={styles.company}>Helixbytes Digital Solutions</span>
            <span className={styles.lastUpdated}>Last updated: January 6, 2026</span>
          </div>
        </header>

        <LegalContent>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website, products, or services provided by Helixbytes Digital Solutions (&ldquo;<strong>Helixbytes</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;), you agree to be bound by these Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;). If you do not agree, you must not use our services.
          </p>
          <p>
            Your use of the website is also subject to our <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>2. Services Overview</h2>
          <p>Helixbytes provides professional technology services including, but not limited to:</p>
          <ul>
            <li>End-to-end AI application development</li>
            <li>Machine learning and LLM integration</li>
            <li>MLOps infrastructure, deployment, and monitoring</li>
            <li>Cloud, backend, and data engineering</li>
            <li>Technical consulting and advisory services</li>
          </ul>
          <p>
            Specific deliverables, timelines, and fees are governed by separate written agreements, statements of work (SOWs), or contracts.
          </p>

          <h2>3. Eligibility</h2>
          <p>You represent that you:</p>
          <ul>
            <li>Are at least 18 years old (or age of majority in your jurisdiction)</li>
            <li>Have the authority to enter into a binding agreement</li>
            <li>Will provide accurate and lawful information</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the services for unlawful or prohibited purposes</li>
            <li>Attempt unauthorized access to systems or data</li>
            <li>Interfere with service availability or security</li>
            <li>Upload malicious code or harmful content</li>
            <li>Misrepresent identity or authority</li>
          </ul>
          <p>Helixbytes reserves the right to suspend or terminate access for violations.</p>

          <h2>5. Intellectual Property</h2>
          <p>
            All website content, software, documentation, and materials provided by Helixbytes remain our intellectual property unless otherwise agreed in writing.
          </p>
          <p>No license is granted except as necessary to use the services as intended.</p>

          <h2>6. Client Content &amp; Data</h2>
          <p>
            You retain ownership of all data, datasets, prompts, documents, and materials you provide (&ldquo;<strong>Client Data</strong>&rdquo;).
          </p>
          <p>
            You grant Helixbytes a limited, non-exclusive license to use Client Data solely to deliver the agreed services.
          </p>
          <p>You represent that Client Data does not violate any laws or third-party rights.</p>

          <h2>7. AI, ML &amp; LLM Services</h2>

          <h3>7.1 Nature of AI Services</h3>
          <p>
            AI and machine learning systems are probabilistic and non-deterministic. Outputs may vary and may contain inaccuracies, omissions, or unexpected results.
          </p>

          <h3>7.2 No Guarantee of Accuracy</h3>
          <p>
            Helixbytes makes no guarantees regarding the accuracy, completeness, legality, or fitness of AI-generated outputs. AI outputs must not be relied upon as the sole basis for:
          </p>
          <ul>
            <li>Legal decisions</li>
            <li>Medical decisions</li>
            <li>Financial decisions</li>
            <li>Safety-critical operations</li>
          </ul>
          <p>unless explicitly agreed in writing.</p>

          <h3>7.3 Human Oversight</h3>
          <p>
            You are responsible for implementing appropriate human review, validation, and safeguards before using AI outputs in production or decision-making systems.
          </p>

          <h3>7.4 Client Data in AI Systems</h3>
          <p>
            Client Data is used only for your project unless explicitly authorized otherwise in writing. Client Data will not be used to train generalized or third-party models without consent.
          </p>

          <h3>7.5 Third-Party AI Providers</h3>
          <p>
            AI services may rely on third-party platforms (e.g., cloud providers, open-source models, commercial LLM APIs). Helixbytes is not responsible for third-party availability, behavior, or policy changes.
          </p>

          <h3>7.6 Bias, Drift &amp; Compliance</h3>
          <p>AI systems may reflect bias or experience model drift over time. Unless otherwise agreed:</p>
          <ul>
            <li>Bias-free outputs are not guaranteed</li>
            <li>Ongoing monitoring, retraining, or compliance audits are not included</li>
            <li>You are responsible for regulatory compliance related to AI usage</li>
          </ul>

          <h3>7.7 Prohibited AI Use</h3>
          <p>You agree not to use AI services for:</p>
          <ul>
            <li>Illegal activities</li>
            <li>Autonomous weapons or physical harm</li>
            <li>Unauthorized surveillance</li>
            <li>Disinformation or manipulation campaigns</li>
            <li>Circumventing safeguards or third-party terms</li>
          </ul>

          <h2>8. Fees &amp; Payment</h2>
          <p>
            Fees, billing schedules, and taxes are defined in applicable agreements. Late payment may result in service suspension or termination.
          </p>

          <h2>9. Confidentiality</h2>
          <p>
            Each party agrees to protect non-public, confidential information received in connection with the services, except where disclosure is required by law.
          </p>

          <h2>10. Disclaimers</h2>
          <p>
            To the maximum extent permitted by applicable law, services are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, express or implied.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Helixbytes shall not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, including those arising from AI-generated outputs or decisions made using them.
          </p>
          <p>
            To the maximum extent permitted by applicable law, Helixbytes&apos;s total liability shall not exceed the fees paid for the specific services giving rise to the claim.
          </p>

          <h2>12. Indemnification</h2>
          <p>You agree to indemnify and hold harmless Helixbytes from claims arising from:</p>
          <ul>
            <li>Your use of the services</li>
            <li>Your violation of these Terms</li>
            <li>Your misuse of AI outputs</li>
          </ul>

          <h2>13. Termination</h2>
          <p>
            Helixbytes may suspend or terminate services at any time for violation of these Terms or applicable law. Provisions relating to IP, AI disclaimers, liability, and indemnification survive termination.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province or Territory in Canada in which Helixbytes has its principal place of business, and the applicable federal laws of Canada, without regard to conflict-of-law principles.
          </p>
          <p>
            You agree to submit to the exclusive jurisdiction of the courts located in that Province or Territory in Canada for the resolution of any dispute arising out of or relating to these Terms or the services.
          </p>

          <h2>15. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of services after changes constitutes acceptance.
          </p>

          <h2>16. Contact</h2>
          <p>
            Questions about these Terms can be submitted via our <Link href="/contact">contact page</Link>.
          </p>
        </LegalContent>
      </article>
    </div>
  );
}
