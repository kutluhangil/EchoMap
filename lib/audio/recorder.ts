import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  type RecordingOptions,
} from 'expo-audio';

/** Echoes are short ambient moments, not long clips — cap the length. */
export const MAX_RECORDING_MS = 60_000;

/** .m4a / AAC with metering enabled to drive the sound rings and waveform. */
export const recordingOptions: RecordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

export async function requestMicrophonePermission(): Promise<boolean> {
  const { granted } = await requestRecordingPermissionsAsync();
  return granted;
}

/** Configure the audio session for recording (mic on, audible in silent mode). */
export async function configureForRecording(): Promise<void> {
  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
}

/** Restore a playback-friendly session after recording finishes. */
export async function configureForPlayback(): Promise<void> {
  await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
}
