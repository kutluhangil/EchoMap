/**
 * Formatting helpers for the data Echo Map surfaces in its monospaced
 * "field recordist" type: durations, dates, coordinates, and the nostalgic
 * relative age shown on the timeline.
 */

/** Format milliseconds as m:ss (e.g. 0:07, 1:32). */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Locale-aware absolute date, e.g. "9 Jun 2026" / "9 Haz 2026". */
export function formatDate(epochMs: number, locale?: string): string {
  return new Date(epochMs).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Compact coordinate pair at ~11m precision, e.g. "41.0082, 28.9784". */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/**
 * Relative, nostalgia-leaning age of a memory ("3 years ago"). Uses
 * Intl.RelativeTimeFormat so it localizes automatically; the Memory Weaver
 * tunes the surrounding copy per language.
 */
export function formatRelativeAge(epochMs: number, locale?: string, now = Date.now()): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const elapsed = epochMs - now; // negative for the past
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(elapsed) >= ms) {
      return rtf.format(Math.round(elapsed / ms), unit);
    }
  }
  return rtf.format(0, 'second');
}
