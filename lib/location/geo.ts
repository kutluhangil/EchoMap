import * as Location from 'expo-location';

import { withTimeout } from '@/lib/utils/with-timeout';

export interface Coordinates {
  lat: number;
  lng: number;
}

/** A GPS fix can stall indefinitely (weak signal, emulator); bound the wait. */
const LOCATION_TIMEOUT_MS = 8000;

/** Request foreground location permission; returns whether it was granted. */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

/** Current permission status without prompting. */
export async function hasLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

/**
 * Current coordinates, or null if permission is denied or the fix fails.
 * Foreground only — the app never reads location in the background.
 */
export async function getCurrentCoordinates(): Promise<Coordinates | null> {
  const granted = await requestLocationPermission();
  if (!granted) return null;
  const position = await withTimeout(
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    LOCATION_TIMEOUT_MS,
    null,
  );
  if (!position) return null;
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}
