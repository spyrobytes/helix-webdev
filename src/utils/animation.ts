// src/utils/animation.ts
// Pure animation utility functions

/**
 * Linear interpolation between two values.
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Progress (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Cubic ease-out function.
 * Starts fast, decelerates toward end.
 * @param t - Progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Cubic ease-in function.
 * Starts slow, accelerates toward end.
 * @param t - Progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeInCubic(t: number): number {
  return t * t * t;
}

/**
 * Cubic ease-in-out function.
 * Slow start and end, fast middle.
 * @param t - Progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Clamp a value between min and max.
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalize a value from one range to another.
 * @param value - Value to normalize
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum (default 0)
 * @param outMax - Output range maximum (default 1)
 * @returns Normalized value
 */
export function normalize(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
): number {
  const clamped = clamp(value, inMin, inMax);
  return ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
