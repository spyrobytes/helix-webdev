import type { ButtonProps } from '@/types';
import styles from './Button.module.css';

export function Button({
  variant,
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  style
}: ButtonProps & { style?: React.CSSProperties }): React.JSX.Element {
  // Map variant to CSS module class
  const variantClass = styles[variant];

  // Merge with optional external className
  const finalClass = className ? `${variantClass} ${className}` : variantClass;

  return (
    <button
      type={type}
      className={finalClass}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
