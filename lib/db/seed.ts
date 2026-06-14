import { writeToneFile } from '@/lib/audio/synth';
import { deleteWaveform, saveWaveform } from '@/lib/audio/waveform';
import { deleteAudio } from '@/lib/storage/files';
import type { Echo } from '@/store/useEchoStore';
import { deleteEcho, insertEcho, listEchoes } from './echoes';

/**
 * Curated demo dataset. It exists so the web demo has something to show — a map,
 * timeline, and globe that feel lived-in — without anyone recording first. Demo
 * rows are prefixed so they can be cleared in one pass and never mix with a real
 * user's echoes. Native builds don't seed; only the web entry calls this.
 */

const DEMO_PREFIX = 'demo-';
const DEMO_DURATION_MS = 2000;
const DAY_MS = 86_400_000;

interface DemoSpec {
  slug: string;
  title: string;
  note: string;
  place: string;
  lat: number;
  lng: number;
  /** Drives the synth tone, so each demo plays a distinct pitch. */
  freq: number;
  /** Age of the memory in days — spreads the timeline across years. */
  daysAgo: number;
}

// Spread across continents so the opening globe lights up around the world.
const DEMOS: DemoSpec[] = [
  {
    slug: 'kadikoy-ferry',
    title: 'Morning ferry',
    note: 'Gulls and the engine hum, crossing the Bosphorus before work.',
    place: 'Kadıköy, İstanbul',
    lat: 40.9901,
    lng: 29.027,
    freq: 220,
    daysAgo: 4,
  },
  {
    slug: 'izmir-kordon',
    title: 'Kordon at dusk',
    note: "Waves against the sea wall and a busker's guitar.",
    place: 'İzmir',
    lat: 38.4327,
    lng: 27.1384,
    freq: 262,
    daysAgo: 38,
  },
  {
    slug: 'cappadocia-dawn',
    title: 'Balloons at dawn',
    note: 'Burners firing one by one as the valley wakes up.',
    place: 'Kapadokya',
    lat: 38.6431,
    lng: 34.8289,
    freq: 330,
    daysAgo: 210,
  },
  {
    slug: 'paris-cafe',
    title: 'A café on the corner',
    note: 'Cups, low chatter, a distant accordion.',
    place: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    freq: 196,
    daysAgo: 430,
  },
  {
    slug: 'tokyo-crossing',
    title: 'Shibuya crossing',
    note: 'A thousand footsteps, then the green light again.',
    place: 'Tokyo',
    lat: 35.6595,
    lng: 139.7005,
    freq: 392,
    daysAgo: 720,
  },
  {
    slug: 'nyc-platform',
    title: 'Uptown platform',
    note: 'Steel, a gust of warm wind, the rumble arriving.',
    place: 'New York',
    lat: 40.758,
    lng: -73.9855,
    freq: 147,
    daysAgo: 1180,
  },
];

/** Deterministic, organic-looking waveform bars (0..1) keyed off the tone. */
function demoBars(seed: number): number[] {
  return Array.from({ length: 48 }, (_, i) => {
    const v =
      0.25 + 0.7 * Math.abs(Math.sin(i * 0.6 + seed * 0.01)) * (0.6 + 0.4 * Math.sin(i * 0.17));
    return Math.min(1, Math.max(0.05, v));
  });
}

/** Whether any demo rows are currently present. */
export function hasDemo(): boolean {
  return listEchoes().some((e) => e.id.startsWith(DEMO_PREFIX));
}

/**
 * Seed the demo dataset — but only into an empty store, so it never displaces a
 * real recording. Idempotent and safe to call on every web launch.
 */
export async function seedDemo(): Promise<void> {
  if (listEchoes().length > 0) return;
  const now = Date.now();
  for (const spec of DEMOS) {
    const id = `${DEMO_PREFIX}${spec.slug}`;
    const audioPath = await writeToneFile(id, spec.freq, 2);
    await saveWaveform(id, demoBars(spec.freq));
    const createdAt = now - spec.daysAgo * DAY_MS;
    insertEcho({
      id,
      title: spec.title,
      note: spec.note,
      lat: spec.lat,
      lng: spec.lng,
      locationName: spec.place,
      audioPath,
      durationMs: DEMO_DURATION_MS,
      createdAt,
      updatedAt: createdAt,
      syncedAt: null,
    } satisfies Echo);
  }
}

/** Remove every demo row and its files. */
export async function clearDemo(): Promise<void> {
  const demo = listEchoes().filter((e) => e.id.startsWith(DEMO_PREFIX));
  for (const echo of demo) {
    deleteEcho(echo.id);
    await deleteAudio(echo.audioPath);
    await deleteWaveform(echo.id);
  }
}
