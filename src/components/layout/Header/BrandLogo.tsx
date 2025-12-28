import Link from 'next/link';
import styles from './BrandLogo.module.css';

export function BrandLogo(): React.JSX.Element {
  return (
    <Link href="/" className={styles.brand} aria-label="Helixbytes - Go to homepage">
      <img src="/images/hlx-logo-optimized.svg" alt="" className={styles.logo} />
      <div className={styles.text}>
        <span className={styles.name}>
          <span className={styles.helix}>HELIX</span>
          <span className={styles.bytes}>BYTES</span>
        </span>
        <span className={styles.tagline}>Innovation Without Boundaries</span>
      </div>
    </Link>
  );
}
