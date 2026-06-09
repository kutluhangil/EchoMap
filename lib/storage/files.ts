import * as FileSystem from 'expo-file-system/legacy';

/**
 * Audio file storage in the app sandbox. Recordings live under
 * `<documentDirectory>/echoes/<id>.m4a`, separate from the SQLite metadata so
 * the database stays small and audio can be exported or synced on its own.
 *
 * Uses the stable legacy file-system API; it can move to the new File/Directory
 * API later without changing this module's surface.
 */

const DOCUMENT_DIR = FileSystem.documentDirectory ?? '';
const AUDIO_DIR = `${DOCUMENT_DIR}echoes/`;

async function ensureAudioDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
  }
}

/** Canonical sandbox path for an echo's audio. */
export function audioUri(id: string): string {
  return `${AUDIO_DIR}${id}.m4a`;
}

/** Move a freshly recorded file into the sandbox, keyed by the echo id. */
export async function persistRecording(sourceUri: string, id: string): Promise<string> {
  await ensureAudioDir();
  const dest = audioUri(id);
  await FileSystem.moveAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function deleteAudio(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export async function audioExists(uri: string): Promise<boolean> {
  return (await FileSystem.getInfoAsync(uri)).exists;
}

/** Read an audio file as base64 (used by export and cloud upload). */
export async function readAudioBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}
