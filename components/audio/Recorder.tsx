import { useCallback, useEffect, useRef } from 'react';
import { useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Mic, Square } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { Pressable, Text } from '@/components/ui';
import { WaveformSampler, meteringToAmplitude } from '@/lib/audio/amplitude';
import {
  MAX_RECORDING_MS,
  configureForRecording,
  recordingOptions,
  requestMicrophonePermission,
} from '@/lib/audio/recorder';
import { formatDuration } from '@/lib/utils/format';
import { palette } from '@/theme/colors';
import { AmplitudeRings } from './AmplitudeRings';

export interface RecordingResult {
  uri: string;
  durationMs: number;
  waveform: number[];
}

interface RecorderProps {
  onComplete: (result: RecordingResult) => void;
  onPermissionDenied?: () => void;
}

const METER_INTERVAL_MS = 80;

/**
 * The capture surface: a big record button wrapped in the signature sound
 * rings, which breathe to the live microphone level while a mono counter ticks.
 * Auto-stops at the max length and hands the recording (uri, duration, waveform)
 * to the capture flow.
 */
export function Recorder({ onComplete, onPermissionDenied }: RecorderProps) {
  const { t } = useTranslation();
  const recorder = useAudioRecorder(recordingOptions);
  const recorderState = useAudioRecorderState(recorder, METER_INTERVAL_MS);
  const amplitude = useSharedValue(0);
  const samplerRef = useRef(new WaveformSampler());
  const completedRef = useRef(false);

  const isRecording = recorderState.isRecording;

  const stop = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    const durationMs = recorderState.durationMillis;
    const waveform = samplerRef.current.toBars();
    await recorder.stop();
    amplitude.value = withTiming(0, { duration: 200 });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (recorder.uri) {
      onComplete({ uri: recorder.uri, durationMs, waveform });
    }
  }, [recorder, recorderState.durationMillis, amplitude, onComplete]);

  const start = useCallback(async () => {
    const granted = await requestMicrophonePermission();
    if (!granted) {
      onPermissionDenied?.();
      return;
    }
    await configureForRecording();
    samplerRef.current = new WaveformSampler();
    completedRef.current = false;
    await recorder.prepareToRecordAsync();
    recorder.record();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [recorder, onPermissionDenied]);

  // Feed live metering into the rings and sampler; auto-stop at the max length.
  useEffect(() => {
    if (!isRecording) return;
    const amp = meteringToAmplitude(recorderState.metering);
    amplitude.value = withTiming(amp, { duration: METER_INTERVAL_MS });
    samplerRef.current.push(amp);
    if (recorderState.durationMillis >= MAX_RECORDING_MS) {
      void stop();
    }
  }, [isRecording, recorderState.metering, recorderState.durationMillis, amplitude, stop]);

  return (
    <View style={styles.container}>
      <View style={styles.rings}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <AmplitudeRings amplitude={amplitude} />
        </View>
        <Pressable
          onPress={isRecording ? stop : start}
          haptic="none"
          accessibilityRole="button"
          accessibilityLabel={isRecording ? t('capture.stop') : t('capture.record')}
          style={[styles.button, { backgroundColor: isRecording ? palette.error : palette.ember }]}
        >
          {isRecording ? (
            <Square color={palette.ink} size={26} fill={palette.ink} />
          ) : (
            <Mic color={palette.ink} size={30} strokeWidth={2} />
          )}
        </Pressable>
      </View>
      <Text variant="data" style={{ color: palette.fog }}>
        {isRecording ? formatDuration(recorderState.durationMillis) : t('capture.record')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  rings: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  button: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
