import { AnimatedGradient } from './AnimatedGradient';
import { NoisePattern } from './NoisePattern';

export function BackgroundLayers(): React.JSX.Element {
  return (
    <>
      <AnimatedGradient />
      <NoisePattern />
    </>
  );
}
