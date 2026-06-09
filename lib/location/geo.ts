import * as Location from 'expo-location';

export interface Coordinates {
  lat: number;
  lng: number;
}

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
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}
