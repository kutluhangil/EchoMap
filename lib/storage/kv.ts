import { createMMKV } from 'react-native-mmkv';

/**
 * Shared MMKV instance for fast, synchronous key-value storage (settings,
 * flags). Synchronous reads mean persisted state is available on first render
 * with no hydration flash. The Data Layer reuses this instance for its own
 * lightweight flags.
 */
export const storage = createMMKV({ id: 'echo-map' });

/** Zustand `persist` adapter backed by MMKV. */
export const zustandMMKVStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
