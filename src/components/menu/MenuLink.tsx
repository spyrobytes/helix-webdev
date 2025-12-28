import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MenuLink.module.css';

interface MenuLinkProps {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function MenuLink({ href, children, onClose }: MenuLinkProps): React.JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  const linkClass = isActive
    ? `${styles.link} ${styles.active}`
    : styles.link;

  return (
    <Link href={href} className={linkClass} onClick={onClose}>
      {children}
    </Link>
  );
}
