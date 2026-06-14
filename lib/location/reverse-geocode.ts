import * as Location from 'expo-location';

import { withTimeout } from '@/lib/utils/with-timeout';

/** The on-device geocoder can hang; cap it so the capture form never waits. */
const GEOCODE_TIMEOUT_MS = 8000;

/**
 * Best-effort place name for a coordinate (city, region), used to suggest an
 * echo's location label. Uses the on-device geocoder, so it needs no API key
 * and works offline where the platform has cached data. Returns null on
 * failure — a missing label is never fatal.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const results = await withTimeout(
      Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }),
      GEOCODE_TIMEOUT_MS,
      [],
    );
    const place = results[0];
    if (!place) return null;
    const parts = [place.city ?? place.subregion, place.region].filter((part): part is string =>
      Boolean(part),
    );
    return parts.length > 0 ? parts.join(', ') : (place.country ?? null);
  } catch {
    return null;
  }
}
