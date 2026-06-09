import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { storage } from '@/lib/storage/kv';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Persist the auth session in MMKV so sign-in survives restarts without an
// extra async-storage dependency.
const authStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

/** True when the optional cloud backup has been configured via env. */
export const isCloudConfigured = Boolean(url && anonKey);

/**
 * Supabase client, or null when cloud sync isn't configured. The app is
 * local-first: everything works without this, and it stays null unless the
 * user has opted into backup and the env keys are present.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: authStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Cloud sync is not configured.');
  }
  return supabase;
}
