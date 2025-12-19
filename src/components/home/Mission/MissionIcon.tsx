// src/components/home/Mission/MissionIcon.tsx
// Animated SVG icons for mission items with draw-in effect

interface MissionIconProps {
  type: 'discovery' | 'architecture' | 'delivery' | 'security';
  className?: string;
}

/**
 * Renders animated SVG icons for mission items.
 * Each icon has a draw-in animation on mount.
 */
export function MissionIcon({ type, className = '' }: MissionIconProps): React.JSX.Element {
  const icons = {
    discovery: {
      viewBox: '0 0 24 24',
      paths: [
        // Magnifying glass circle
        'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
        // Handle
        'm21 21-4.35-4.35',
      ],
    },
    architecture: {
      viewBox: '0 0 24 24',
      paths: [
        // Blueprint grid
        'M3 3h18v18H3z',
        // Horizontal lines
        'M3 8h18M3 13h18M3 18h18',
        // Vertical lines
        'M8 3v18M13 3v18M18 3v18',
      ],
    },
    delivery: {
      viewBox: '0 0 24 24',
      paths: [
        // Rocket body
        'M12 2 8 8l4 4 4-4-4-6z',
        // Flames
        'M12 12v10M8 12l4 4M16 12l-4 4',
        // Wings
        'M8 8H4v4h4M16 8h4v4h-4',
      ],
    },
    security: {
      viewBox: '0 0 24 24',
      paths: [
        // Shield outline
        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        // Checkmark
        'M9 12l2 2 4-4',
      ],
    },
  };

  const icon = icons[type];

  return (
    <svg
      viewBox={icon.viewBox}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon.paths.map((d, index) => (
        <path
          key={index}
          d={d}
          style={{
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
            animation: `drawIn 1.5s ease-out ${index * 0.15}s forwards`,
          }}
        />
      ))}
    </svg>
  );
}
