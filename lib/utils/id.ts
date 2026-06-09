import { nanoid } from 'nanoid/non-secure';

/**
 * Generate a unique id for an echo. The non-secure variant is deliberate:
 * ids are local row keys, not security tokens, so avoiding a crypto polyfill
 * keeps startup lean in React Native.
 */
export function createId(): string {
  return nanoid();
}
