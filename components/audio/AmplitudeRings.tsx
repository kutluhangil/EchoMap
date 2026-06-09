import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { palette } from '@/theme/colors';

interface AmplitudeRingsProps {
  /** Live amplitude 0..1 (recording metering or playback waveform position). */
  amplitude: SharedValue<number>;
  size?: number;
  color?: string;
}

/**
 * The signature element, driven by real audio: concentric ember rings that
 * expand and brighten with amplitude. Shared by the recorder (live metering)
 * and the player (waveform at the current position).
 */
export function AmplitudeRings({
  amplitude,
  size = 220,
  color = palette.ember,
}: AmplitudeRingsProps) {
  const center = size / 2;
  const maxRadius = center - 8;

  const outerRadius = useDerivedValue(() => 26 + amplitude.value * (maxRadius - 26));
  const outerOpacity = useDerivedValue(() => 0.08 + amplitude.value * 0.32);
  const midRadius = useDerivedValue(() => 20 + amplitude.value * (maxRadius - 44));
  const midOpacity = useDerivedValue(() => 0.14 + amplitude.value * 0.4);
  const coreRadius = useDerivedValue(() => 14 + amplitude.value * 12);

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group>
        <Circle cx={center} cy={center} r={outerRadius} color={color} opacity={outerOpacity} />
        <Circle cx={center} cy={center} r={midRadius} color={color} opacity={midOpacity} />
        <Circle cx={center} cy={center} r={coreRadius} color={color} />
      </Group>
    </Canvas>
  );
}
