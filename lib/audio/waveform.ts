import * as FileSystem from 'expo-file-system/legacy';

/**
 * Waveform bars persisted as a small sidecar JSON next to each echo's audio
 * (`<id>.waveform.json`). Keeping them as files rather than a database column
 * keeps the metadata row lean and lets the audio and its waveform travel
 * together (export, cloud sync). The echoes directory is created by the audio
 * file store before this runs.
 */

const DOCUMENT_DIR = FileSystem.documentDirectory ?? '';
const DIR = `${DOCUMENT_DIR}echoes/`;

function waveformUri(id: string): string {
  return `${DIR}${id}.waveform.json`;
}

export async function saveWaveform(id: string, bars: number[]): Promise<void> {
  await FileSystem.writeAsStringAsync(waveformUri(id), JSON.stringify(bars));
}

export async function loadWaveform(id: string): Promise<number[] | null> {
  try {
    const json = await FileSystem.readAsStringAsync(waveformUri(id));
    const parsed: unknown = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as number[]) : null;
  } catch {
    return null;
  }
}

export async function deleteWaveform(id: string): Promise<void> {
  await FileSystem.deleteAsync(waveformUri(id), { idempotent: true });
}
