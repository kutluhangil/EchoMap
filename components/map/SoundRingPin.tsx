import { useEffect } from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme/colors';

interface SoundRingPinProps {
  size?: number;
  color?: string;
  /** Disable the breathing animation (reduce-motion). */
  animate?: boolean;
}

const DURATION = 2400;

/**
 * The signature element rendered in Skia: a glowing ember core that radiates
 * concentric sound rings. Used as the focal marker for a selected echo and
 * reused by the recorder and player so the whole app speaks one visual language.
 */
export function SoundRingPin({
  size = 72,
  color = palette.ember,
  animate = true,
}: SoundRingPinProps) {
  const progress = useSharedValue(0);
  const center = size / 2;
  const maxRadius = center - 6;

  useEffect(() => {
    if (!animate) return;
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [animate, progress]);

  // Two rings, offset by half a cycle, expand outward and fade.
  const radiusA = useDerivedValue(() => 6 + progress.value * maxRadius);
  const opacityA = useDerivedValue(() => (1 - progress.value) * 0.5);
  const radiusB = useDerivedValue(() => 6 + ((progress.value + 0.5) % 1) * maxRadius);
  const opacityB = useDerivedValue(() => (1 - ((progress.value + 0.5) % 1)) * 0.5);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group>
        <Circle
          cx={center}
          cy={center}
          r={radiusA}
          color={color}
          opacity={opacityA}
          style="stroke"
          strokeWidth={2}
        />
        <Circle
          cx={center}
          cy={center}
          r={radiusB}
          color={color}
          opacity={opacityB}
          style="stroke"
          strokeWidth={2}
        />
        <Circle cx={center} cy={center} r={6} color={color} />
      </Group>
    </Canvas>
  );
}
