import styles from './MenuBackground.module.css';

interface MenuBackgroundProps {
  isOpen: boolean;
  isScrolled: boolean;
}

export function MenuBackground({ isOpen, isScrolled }: MenuBackgroundProps): React.JSX.Element {
  const bgClasses = [
    styles.bg,
    isOpen && styles.bgOpen,
    isScrolled && !isOpen && styles.bgScrolledNotOpen
  ]
    .filter(Boolean)
    .join(' ');

  const shapeClasses = [styles.shape, isOpen && styles.shapeOpen]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={bgClasses}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={shapeClasses}
        d="M3.4,1.7c8.4,4.6,15.5,13.5,22.5,24.6c28.3,44.6,36.5,49.6,52.8,58.8c6.5,3.8,13.8,6.3,21.3,7.4l0,0V0H0C1.2,0.5,2.3,1.1,3.4,1.7"
      />
    </svg>
  );
}
