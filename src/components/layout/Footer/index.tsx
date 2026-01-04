'use client';

import Link from 'next/link';
import { useFooterAnimations } from '@/hooks/useFooterAnimations';
import styles from './Footer.module.css';

/**
 * App-wide footer for Helixbytes landing and content pages.
 * - Features:
 * - Semantic <footer>, <nav>, <section>, <address>
 * - Scroll-triggered staggered animations matching landing page aesthetic
 * - Quick links route to dedicated pages for Next.js multi-page architecture
 */
export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const { footerRef, animationState } = useFooterAnimations();

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Brand / Identity */}
        <section
          className={`${styles.brandSection} ${
            animationState.brandVisible ? styles.brandVisible : ''
          }`}
          aria-label="Helixbytes brand"
        >
          <h2 className={styles.brandName}>
            <span className={styles.helix}>HELIX</span>
            <span className={styles.bytes}>BYTES</span>
            {' '}DIGITAL SOLUTIONS
          </h2>
          <p className={styles.tagline}>Innovation Without Boundaries</p>

          <p className={styles.description}>
            We craft modern digital experiences—from high-performance web platforms
            to AI-driven systems—built with security, elegance, and scalability at their core.
          </p>
        </section>

        {/* Quick Links */}
        <nav
          className={`${styles.linksSection} ${
            animationState.linksVisible ? styles.linksVisible : ''
          }`}
          aria-label="Footer quick links"
        >
          <h2 className={styles.columnTitle}>Quick Links</h2>
          <ul className={styles.linkList}>
            <li>
              <Link href="/services" className={styles.navLink}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/approach" className={styles.navLink}>
                Approach
              </Link>
            </li>
            <li>
              <Link href="/why-helixbytes" className={styles.navLink}>
                Why Helixbytes
              </Link>
            </li>
            <li>
              <Link href="/contact" className={styles.navLink}>
                Let&apos;s Talk
              </Link>
            </li>
            <li>
              <Link href="/blog" className={styles.navLink}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <section
          className={`${styles.contactSection} ${
            animationState.contactVisible ? styles.contactVisible : ''
          }`}
          aria-label="Contact"
        >
          <h2 className={styles.columnTitle}>Contact</h2>
          <address className={styles.address}>
            <p className={styles.hours}>Mon–Fri, 9am–6pm (MT)</p>
            <p className={styles.responseTime}>Typically responding within one business day</p>
          </address>

          <Link href="/contact" className={styles.ctaButton}>
            <span>Let&apos;s Talk</span>
            <span aria-hidden="true" className={styles.ctaArrow}>
              →
            </span>
          </Link>
        </section>

        {/* Social */}
        <section
          className={`${styles.socialSection} ${
            animationState.socialVisible ? styles.socialVisible : ''
          }`}
          aria-label="Helixbytes social profiles"
        >
          <h2 className={styles.columnTitle}>Follow</h2>
          <ul className={styles.socialList}>
            <li>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialPill}
                aria-label="Helixbytes on LinkedIn"
              >
                <span className={styles.socialDot} style={{ '--dot-accent': 'var(--accent-1)' } as React.CSSProperties} aria-hidden="true" />
                <span className={styles.socialLabel}>LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialPill}
                aria-label="Helixbytes on GitHub"
              >
                <span className={styles.socialDot} style={{ '--dot-accent': 'var(--accent-2)' } as React.CSSProperties} aria-hidden="true" />
                <span className={styles.socialLabel}>GitHub</span>
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialPill}
                aria-label="Helixbytes on X"
              >
                <span className={styles.socialDot} style={{ '--dot-accent': 'var(--accent-3)' } as React.CSSProperties} aria-hidden="true" />
                <span className={styles.socialLabel}>X</span>
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className={styles.socialPill}
                aria-label="Helixbytes on YouTube"
              >
                <span className={styles.socialDot} style={{ '--dot-accent': 'var(--accent-4)' } as React.CSSProperties} aria-hidden="true" />
                <span className={styles.socialLabel}>YouTube</span>
              </a>
            </li>
          </ul>
        </section>
      </div>

      {/* Bottom bar */}
      <div
        className={`${styles.bottomBar} ${
          animationState.bottomBarVisible ? styles.bottomBarVisible : ''
        }`}
      >
        <p className={styles.copyright}>
          © {currentYear} Helixbytes Digital Solutions. All rights reserved.
        </p>

        <div className={styles.bottomLinks}>
          <a href="/privacy" className={styles.bottomLink}>
            Privacy Policy
          </a>
          <span className={styles.bottomSeparator} aria-hidden="true">
            ·
          </span>
          <a href="/terms" className={styles.bottomLink}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
