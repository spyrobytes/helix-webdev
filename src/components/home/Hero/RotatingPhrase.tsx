import styles from './RotatingPhrase.module.css';

interface RotatingPhraseProps {
  phrase: string;
  isVisible: boolean;
}

export function RotatingPhrase({ phrase, isVisible }: RotatingPhraseProps): React.JSX.Element {
  const phraseClass = isVisible
    ? `${styles.phrase} ${styles.visible}`
    : styles.phrase;

  return (
    <div className={styles.wrapper}>
      <div className={phraseClass} id="rotatingPhrase">
        {phrase}
      </div>
    </div>
  );
}
