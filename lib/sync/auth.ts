import type { User } from '@supabase/supabase-js';

import { requireSupabase } from './supabase';

/**
 * Thin wrappers around Supabase Auth for the optional cloud backup. All of
 * these throw if cloud sync isn't configured (see `requireSupabase`).
 */

export async function signUpWithEmail(email: string, password: string): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await requireSupabase().auth.getUser();
  return data.user;
}
