'use client';

import { useScrollAwareness } from '@/hooks/useScrollAwareness';
import type { MenuItem } from '@/types';
import { MenuToggle } from './MenuToggle';
import { MenuBackground } from './MenuBackground';
import { MenuPanel } from './MenuPanel';
import styles from './Menu.module.css';

interface FullscreenMenuProps {
  items: readonly MenuItem[];
  scrollThreshold?: number;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export function FullscreenMenu({ items, scrollThreshold = 100, isOpen, toggle, close }: FullscreenMenuProps): React.JSX.Element {
  const isScrolled = useScrollAwareness(scrollThreshold);

  const menuClasses = [
    styles.menu,
    isOpen && styles.open,
    isScrolled && styles.scrolled
  ].filter(Boolean).join(' ');

  const panelId = 'fs-menu-panel';

  return (
    <div className={menuClasses} data-fs-menu>
      <MenuToggle
        isOpen={isOpen}
        onClick={toggle}
        ariaControls={panelId}
      />
      <MenuBackground isOpen={isOpen} isScrolled={isScrolled} />
      <MenuPanel
        items={items}
        isOpen={isOpen}
        onClose={close}
        panelId={panelId}
      />
    </div>
  );
}
