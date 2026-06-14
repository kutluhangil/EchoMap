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
import { duration } from '@/theme/motion';

interface PulseRingProps {
  size?: number;
  color?: string;
  /** Number of rings staggered across the cycle. */
  count?: number;
  /** Peak ring opacity at the start of a cycle. */
  intensity?: number;
  /** Disable the loop (reduce-motion); renders a single static ring. */
  animate?: boolean;
}

/**
 * The ambient, non-amplitude cousin of {@link AmplitudeRings}: a quiet idle
 * pulse used where there's no live audio but the sound-ring motif should still
 * breathe — behind the FAB, the landing globe, and the onboarding slides.
 */
export function PulseRing({
  size = 96,
  color = palette.ember,
  count = 2,
  intensity = 0.32,
  animate = true,
}: PulseRingProps) {
  const progress = useSharedValue(0);
  const center = size / 2;
  const maxRadius = center - 2;

  useEffect(() => {
    if (!animate) return;
    progress.value = withRepeat(
      withTiming(1, { duration: duration.ambient, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [animate, progress]);

  // Each ring rides the same clock, offset by an equal slice of the cycle, so
  // they expand and fade in a continuous train.
  const rings = Array.from({ length: count }, (_, i) => i / count);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group>
        {rings.map((offset, i) => (
          <PulseCircle
            key={i}
            progress={progress}
            offset={offset}
            center={center}
            maxRadius={maxRadius}
            color={color}
            intensity={intensity}
          />
        ))}
        <Circle cx={center} cy={center} r={4} color={color} opacity={0.9} />
      </Group>
    </Canvas>
  );
}

interface PulseCircleProps {
  progress: ReturnType<typeof useSharedValue<number>>;
  offset: number;
  center: number;
  maxRadius: number;
  color: string;
  intensity: number;
}

function PulseCircle({ progress, offset, center, maxRadius, color, intensity }: PulseCircleProps) {
  const phase = useDerivedValue(() => (progress.value + offset) % 1);
  const radius = useDerivedValue(() => 4 + phase.value * maxRadius);
  const opacity = useDerivedValue(() => (1 - phase.value) * intensity);
  return (
    <Circle
      cx={center}
      cy={center}
      r={radius}
      color={color}
      opacity={opacity}
      style="stroke"
      strokeWidth={1.5}
    />
  );
}
