'use client';

import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { FullscreenMenu } from '@/components/menu';
import { NAVIGATION_ITEMS } from '@/constants/data';
import styles from './Header.module.css';

export function Header(): React.JSX.Element {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <BrandLogo />
        <div className={styles.navRight}>
          <Link href="/contact" className={styles.navCta}>
            Let&apos;s Talk <span>↗</span>
          </Link>
          <FullscreenMenu items={NAVIGATION_ITEMS} />
        </div>
      </nav>
    </header>
  );
}
