import styles from './MenuToggle.module.css';

interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
}

export function MenuToggle({ isOpen, onClick, ariaControls }: MenuToggleProps): React.JSX.Element {
  const toggleClass = isOpen
    ? `${styles.toggle} ${styles.toggleOpen}`
    : styles.toggle;

  return (
    <button
      className={toggleClass}
      type="button"
      aria-label={isOpen ? "Close main navigation" : "Open main navigation"}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      onClick={onClick}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className={
            isOpen
              ? `${styles.iconLine} ${styles.iconLineTopOpen}`
              : styles.iconLine
          }
          d="M 20 30 H 80"
        />
        <path
          className={
            isOpen
              ? `${styles.iconLine} ${styles.iconLineMiddleOpen}`
              : styles.iconLine
          }
          d="M 20 50 H 80"
        />
        <path
          className={
            isOpen
              ? `${styles.iconLine} ${styles.iconLineBottomOpen}`
              : styles.iconLine
          }
          d="M 20 70 H 80"
        />
      </svg>
    </button>
  );
}
