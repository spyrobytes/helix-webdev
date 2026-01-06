import styles from './LegalContent.module.css';

interface LegalContentProps {
  children: React.ReactNode;
}

/**
 * Typography wrapper for legal pages (Privacy Policy, Terms of Service).
 * Provides consistent heading, paragraph, list, and link styling
 * that aligns with the blog PostContent component.
 */
export function LegalContent({ children }: LegalContentProps): React.JSX.Element {
  return <div className={styles.content}>{children}</div>;
}
