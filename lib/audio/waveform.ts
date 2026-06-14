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

// Bars never change once a recording is saved, so a waveform read from disk can
// be kept in memory for the rest of the session. This is what keeps the timeline
// smooth: FlatList remounts rows as they scroll back into view, and without this
// each remount would re-read and re-parse the sidecar for bars we already had.
const cache = new Map<string, number[]>();

function waveformUri(id: string): string {
  return `${DIR}${id}.waveform.json`;
}

export async function saveWaveform(id: string, bars: number[]): Promise<void> {
  cache.set(id, bars);
  await FileSystem.writeAsStringAsync(waveformUri(id), JSON.stringify(bars));
}

/** Synchronous cache peek so a row can paint instantly, without a blank frame. */
export function getCachedWaveform(id: string): number[] | null {
  return cache.get(id) ?? null;
}

export async function loadWaveform(id: string): Promise<number[] | null> {
  const cached = cache.get(id);
  if (cached) return cached;
  try {
    const json = await FileSystem.readAsStringAsync(waveformUri(id));
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    const bars = parsed as number[];
    cache.set(id, bars);
    return bars;
  } catch {
    return null;
  }
}

export async function deleteWaveform(id: string): Promise<void> {
  cache.delete(id);
  await FileSystem.deleteAsync(waveformUri(id), { idempotent: true });
}
