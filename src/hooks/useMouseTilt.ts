import { useState, useEffect, useRef } from 'react';

interface TiltValues {
  rotateX: number;
  rotateY: number;
}

interface UseMouseTiltReturn {
  tiltRef: React.RefObject<HTMLDivElement | null>;
  tiltValues: TiltValues;
}

export function useMouseTilt(maxTilt: number = 10): UseMouseTiltReturn {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const [tiltValues, setTiltValues] = useState<TiltValues>({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const element = tiltRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltValues({ rotateX, rotateY });
    };

    const handleMouseLeave = (): void => {
      setTiltValues({ rotateX: 0, rotateY: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);

  return { tiltRef, tiltValues };
}
