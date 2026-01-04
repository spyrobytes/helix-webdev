import Link from 'next/link';
import styles from './not-found.module.css';

const QUICK_LINKS = [
  {
    href: '/services',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Services',
    description: 'What we build',
  },
  {
    href: '/approach',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Approach',
    description: 'How we work',
  },
  {
    href: '/blog',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    title: 'Blog',
    description: 'Insights & ideas',
  },
  {
    href: '/contact',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    title: 'Contact',
    description: 'Get in touch',
  },
] as const;

export default function NotFound(): React.JSX.Element {
  return (
    <main className={styles.page}>
      {/* Animated background elements */}
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        {/* Playful 404 display */}
        <div className={styles.errorDisplay}>
          <div className={styles.errorCode}>
            <span className={styles.digit}>4</span>
            <span className={styles.digitZero}>0</span>
            <span className={styles.digit}>4</span>
          </div>
          <div className={styles.errorGlitch} aria-hidden="true">404</div>
        </div>

        {/* Message */}
        <h1 className={styles.title}>
          Lost in the Digital Void
        </h1>

        <p className={styles.description}>
          The page you&apos;re looking for has drifted into uncharted territory.
          Perhaps it was moved, renamed, or never existed in this dimension.
        </p>

        {/* Primary CTA */}
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>
        </div>

        {/* Quick navigation links */}
        <div className={styles.quickLinks}>
          <p className={styles.linksLabel}>Or explore:</p>
          <nav className={styles.linksGrid}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.linkCard}>
                <div className={styles.linkIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={link.icon} />
                  </svg>
                </div>
                <div className={styles.linkText}>
                  <span className={styles.linkTitle}>{link.title}</span>
                  <span className={styles.linkDesc}>{link.description}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Decorative binary stream */}
        <div className={styles.binaryStream} aria-hidden="true">
          <span>01001000 01000101 01001100 01001001 01011000</span>
        </div>
      </div>
    </main>
  );
}
