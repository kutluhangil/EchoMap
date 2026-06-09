import { Vector3 } from 'three';

/**
 * Convert geographic coordinates to a point on a sphere of the given radius.
 * Longitude 0 / latitude 0 faces +Z (toward the camera in the opening scene).
 */
export function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}
