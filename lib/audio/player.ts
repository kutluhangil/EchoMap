import type { AudioSource } from 'expo-audio';

/** Build an expo-audio source from a local file uri. */
export function audioSource(uri: string): AudioSource {
  return { uri };
}

/** Clamp playback position to a 0..1 fraction. */
export function progressFraction(currentTime: number, duration: number): number {
  return duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
}
