import type { PillProps } from '@/types';
import styles from './Pill.module.css';

export function Pill({ children, className = '' }: PillProps): React.JSX.Element {
  const finalClass = className ? `${styles.pill} ${className}` : styles.pill;

  return (
    <span className={finalClass}>
      {children}
    </span>
  );
}
