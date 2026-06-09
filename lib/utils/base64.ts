// React Native provides a global `atob`; declare it so this stays typed
// regardless of the configured TS lib.
declare function atob(data: string): string;

/** Decode a base64 string to raw bytes (used for binary cloud uploads). */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
