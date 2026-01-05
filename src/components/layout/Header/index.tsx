'use client';

import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { FullscreenMenu } from '@/components/menu';
import { useFullscreenMenu } from '@/hooks/useFullscreenMenu';
import { NAVIGATION_ITEMS } from '@/constants/data';
import styles from './Header.module.css';

export function Header(): React.JSX.Element {
  const { isOpen, toggle, close } = useFullscreenMenu();

  const ctaClasses = [
    styles.navCta,
    isOpen && styles.ctaHidden
  ].filter(Boolean).join(' ');

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <BrandLogo />
        <div className={styles.navRight}>
          <Link
            href="/contact"
            className={ctaClasses}
            tabIndex={isOpen ? -1 : undefined}
            aria-hidden={isOpen ? true : undefined}
          >
            Let&apos;s Talk <span>↗</span>
          </Link>
          <FullscreenMenu
            items={NAVIGATION_ITEMS}
            isOpen={isOpen}
            toggle={toggle}
            close={close}
          />
        </div>
      </nav>
    </header>
  );
}
