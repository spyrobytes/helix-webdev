'use client';

import { BrandLogo } from './BrandLogo';
import { FullscreenMenu } from '@/components/menu';
import { MENU_ITEMS } from '@/constants/data';
import styles from './Header.module.css';

export function Header(): React.JSX.Element {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <BrandLogo />
        <div className={styles.navRight}>
          <a href="#contact" className={styles.navCta}>
            Let's Talk <span>↗</span>
          </a>
          <FullscreenMenu items={MENU_ITEMS} />
        </div>
      </nav>
    </header>
  );
}
