import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { Pressable, type GestureResponderEvent } from 'react-native';

import { palette } from '@/theme/colors';

interface WaveformProps {
  /** Amplitude bars 0..1. */
  bars: number[];
  /** Playback progress 0..1; bars before it read as played. */
  progress?: number;
  width?: number;
  height?: number;
  onSeek?: (fraction: number) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const GAP = 2;
const MIN_BAR = 3;

/**
 * Skia waveform of a recorded echo. Played bars glow ember, the rest stay
 * slate, and tapping seeks to that position.
 */
export function Waveform({
  bars,
  progress = 0,
  width = 300,
  height = 72,
  onSeek,
  activeColor = palette.ember,
  inactiveColor = palette.slate,
}: WaveformProps) {
  const count = bars.length;
  const barWidth = count > 0 ? (width - GAP * (count - 1)) / count : 0;
  const playedCount = Math.floor(progress * count);

  const handlePress = (event: GestureResponderEvent) => {
    if (!onSeek || width <= 0) return;
    const fraction = Math.min(1, Math.max(0, event.nativeEvent.locationX / width));
    onSeek(fraction);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onSeek}
      accessibilityRole={onSeek ? 'adjustable' : 'image'}
    >
      <Canvas style={{ width, height }}>
        {bars.map((amplitude, i) => {
          const barHeight = Math.max(MIN_BAR, amplitude * height);
          const x = i * (barWidth + GAP);
          const y = (height - barHeight) / 2;
          return (
            <RoundedRect
              // Bars are a fixed, ordered series — index is a stable key here.
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              r={barWidth / 2}
              color={i < playedCount ? activeColor : inactiveColor}
            />
          );
        })}
      </Canvas>
    </Pressable>
  );
}
