import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import styles from './MenuLink.module.css';

interface MenuLinkProps {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function MenuLink({ href, children, onClose }: MenuLinkProps): React.JSX.Element {
  const smoothScroll = useSmoothScroll();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    smoothScroll(href);
    onClose();
  };

  return (
    <a href={href} className={styles.link} onClick={handleClick}>
      {children}
    </a>
  );
}
