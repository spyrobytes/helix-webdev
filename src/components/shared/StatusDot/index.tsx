import type { StatusDotProps } from '@/types';
import styles from './StatusDot.module.css';

export function StatusDot({ className = '' }: StatusDotProps): React.JSX.Element {
  const finalClass = className ? `${styles.statusDot} ${className}` : styles.statusDot;

  return <span className={finalClass} />;
}
