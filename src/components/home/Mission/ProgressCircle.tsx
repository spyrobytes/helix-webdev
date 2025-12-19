// src/components/home/Mission/ProgressCircle.tsx
// Scroll-aware circular progress indicator for mission step numbers

interface ProgressCircleProps {
  step: number;
  /** Progress from 0-1 based on scroll position */
  progress: number;
  isVisible: boolean;
  className?: string;
}

/**
 * Renders a circular progress indicator that fills as user scrolls.
 * Progress is dynamically calculated based on scroll position.
 */
export function ProgressCircle({
  step,
  progress,
  isVisible,
  className = '',
}: ProgressCircleProps): React.JSX.Element {
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate stroke offset based on progress (0-1)
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle - controlled by scroll */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))',
          }}
        />
      </svg>

      {/* Step number */}
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--text-main)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {String(step).padStart(2, '0')}
      </span>
    </div>
  );
}
