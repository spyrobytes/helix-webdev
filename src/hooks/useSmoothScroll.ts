import { useCallback } from 'react';

export function useSmoothScroll(): (targetId: string) => void {
  return useCallback((targetId: string): void => {
    const element = document.querySelector(targetId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);
}
