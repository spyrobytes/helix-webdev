import type { MenuItem } from '@/types';
import { MenuLink } from './MenuLink';
import styles from './MenuPanel.module.css';

interface MenuPanelProps {
  items: readonly MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  panelId: string;
}

export function MenuPanel({ items, isOpen, onClose, panelId }: MenuPanelProps): React.JSX.Element {
  const panelClass = isOpen
    ? `${styles.panel} ${styles.panelOpen}`
    : styles.panel;

  return (
    <nav
      id={panelId}
      className={panelClass}
      aria-hidden={!isOpen}
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={isOpen ? `${styles.item} ${styles.itemOpen}` : styles.item}
          >
            <MenuLink href={item.href} onClose={onClose}>
              {item.label}
            </MenuLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
