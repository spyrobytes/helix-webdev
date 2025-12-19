// src/components/home/Clients/ClientBadge.tsx
// Individual client sector badge with glassmorphism and hover effects

import styles from './Clients.module.css';

interface ClientBadgeProps {
  label: string;
  description: string;
  icon: string; // SVG path data
  accentVar: string; // CSS variable name
  index: number;
  isVisible: boolean;
}

/**
 * Renders a client sector badge with animated SVG icon.
 * Features glassmorphism, hover states, and scroll-triggered animations.
 */
export function ClientBadge({
  label,
  description,
  icon,
  accentVar,
  index,
  isVisible,
}: ClientBadgeProps): React.JSX.Element {
  return (
    <div
      className={`${styles.badge} ${isVisible ? styles.animate : ''}`}
      style={
        {
          '--badge-accent': `var(${accentVar})`,
          animationDelay: `${index * 0.1}s`,
        } as React.CSSProperties
      }
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={icon} />
      </svg>
      <div className={styles.badgeContent}>
        <span className={styles.badgeLabel}>{label}</span>
        <span className={styles.badgeDescription}>{description}</span>
      </div>
    </div>
  );
}
