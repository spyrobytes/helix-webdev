// src/hooks/scrollCards/index.ts
// Composable hooks for scroll-triggered card animations

export { useSectionVisibility } from './useSectionVisibility';
export type {
  UseSectionVisibilityOptions,
  SectionVisibilityState,
  SectionVisibilityStateRef,
} from './useSectionVisibility';

export { useCardKeyboard } from './useCardKeyboard';
export type { UseCardKeyboardOptions } from './useCardKeyboard';

export { useCardHover } from './useCardHover';
export type {
  UseCardHoverOptions,
  CardHoverState,
  CardHoverStateRef,
} from './useCardHover';

export { useCardFlip } from './useCardFlip';
export type {
  UseCardFlipOptions,
  UseCardFlipClassNames,
} from './useCardFlip';
