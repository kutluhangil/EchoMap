import { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { Pressable, Text } from '@/components/ui';
import { audioSource, progressFraction } from '@/lib/audio/player';
import { formatDuration } from '@/lib/utils/format';
import { palette } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { AmplitudeRings } from './AmplitudeRings';
import { Waveform } from './Waveform';

interface PlayerProps {
  uri: string;
  waveform: number[];
  durationMs: number;
}

/**
 * Playback for a saved echo: a play/pause control inside the signature sound
 * rings (pulsing to the waveform at the current position) over a tappable Skia
 * waveform that doubles as a seek bar.
 */
export function Player({ uri, waveform, durationMs }: PlayerProps) {
  const { colors } = useTheme();
  const player = useAudioPlayer(audioSource(uri));
  const status = useAudioPlayerStatus(player);
  const amplitude = useSharedValue(0);

  const totalSeconds = status.duration > 0 ? status.duration : durationMs / 1000;
  const progress = progressFraction(status.currentTime, totalSeconds);

  // Drive the rings from the recorded amplitude at the playback position.
  useEffect(() => {
    const index = Math.min(waveform.length - 1, Math.floor(progress * waveform.length));
    const amp = status.playing ? (waveform[index] ?? 0) : 0;
    amplitude.value = withTiming(amp, { duration: 120 });
  }, [progress, status.playing, waveform, amplitude]);

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.didJustFinish || progress >= 1) {
      void player.seekTo(0);
    }
    player.play();
  };

  const seek = (fraction: number) => {
    void player.seekTo(fraction * totalSeconds);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rings}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <AmplitudeRings amplitude={amplitude} size={180} />
        </View>
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={status.playing ? 'Pause' : 'Play'}
          style={styles.button}
        >
          {status.playing ? (
            <Pause color={palette.ink} size={26} fill={palette.ink} />
          ) : (
            <Play color={palette.ink} size={26} fill={palette.ink} />
          )}
        </Pressable>
      </View>

      <Waveform bars={waveform} progress={progress} onSeek={seek} inactiveColor={colors.border} />

      <View style={styles.times}>
        <Text variant="data" style={{ color: colors.textMuted }}>
          {formatDuration(status.currentTime * 1000)}
        </Text>
        <Text variant="data" style={{ color: colors.textMuted }}>
          {formatDuration(durationMs)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  rings: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ember,
  },
  times: { flexDirection: 'row', justifyContent: 'space-between', width: 300 },
});
