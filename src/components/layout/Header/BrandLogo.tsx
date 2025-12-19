import styles from './BrandLogo.module.css';

export function BrandLogo(): React.JSX.Element {
  return (
    <div className={styles.brand}>
      <img src="/images/hlx-logo-optimized.svg" alt="Helixbytes Logo" className={styles.logo} />
      <div className={styles.text}>
        <span className={styles.name}>
          <span className={styles.helix}>HELIX</span>
          <span className={styles.bytes}>BYTES</span>
        </span>
        <span className={styles.tagline}>Innovation Without Boundaries</span>
      </div>
    </div>
  );
}
