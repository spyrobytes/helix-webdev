import { useState, useEffect } from 'react';

interface RotatingPhrasesReturn {
  currentPhrase: string;
  isVisible: boolean;
}

export function useRotatingPhrases(
  phrases: readonly string[],
  interval: number = 2800
): RotatingPhrasesReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 220);
    }, interval);

    return () => clearInterval(timer);
  }, [phrases.length, interval]);

  return { currentPhrase: phrases[currentIndex], isVisible };
}
