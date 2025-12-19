import { useState, useCallback, useEffect } from 'react';

interface FullscreenMenuReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useFullscreenMenu(): FullscreenMenuReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback((): void => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggle = useCallback((): void => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  return { isOpen, open, close, toggle };
}
