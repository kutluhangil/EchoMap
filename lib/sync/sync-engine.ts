import { listUnsynced, markSynced } from '@/lib/db/echoes';
import { readAudioBase64 } from '@/lib/storage/files';
import { base64ToBytes } from '@/lib/utils/base64';
import { requireSupabase } from './supabase';

const TABLE = 'echoes';
const BUCKET = 'echo-audio';

/** Remote row shape (snake_case columns from Postgres). */
export interface RemoteEcho {
  id: string;
  user_id: string;
  title: string;
  note: string | null;
  lat: number;
  lng: number;
  location_name: string | null;
  audio_path: string;
  duration_ms: number;
  created_at: number;
  updated_at: number;
}

/**
 * Push locally-changed echoes (audio + metadata) to Supabase. Conflicts use
 * last-write-wins on `updated_at`. Audio goes to a per-user private path so
 * Row Level Security and storage policies keep users isolated.
 *
 * @returns the number of echoes pushed.
 */
export async function pushEchoes(userId: string): Promise<number> {
  const client = requireSupabase();
  const pending = listUnsynced();

  for (const row of pending) {
    const path = `${userId}/${row.id}.m4a`;
    const bytes = base64ToBytes(await readAudioBase64(row.audioPath));
    const upload = await client.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: 'audio/m4a', upsert: true });
    if (upload.error) throw upload.error;

    const { error } = await client.from(TABLE).upsert({
      id: row.id,
      user_id: userId,
      title: row.title,
      note: row.note,
      lat: row.lat,
      lng: row.lng,
      location_name: row.locationName,
      audio_path: path,
      duration_ms: row.durationMs,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    } satisfies RemoteEcho);
    if (error) throw error;

    markSynced(row.id, Date.now());
  }

  return pending.length;
}

/**
 * Fetch echoes changed remotely since `since` (epoch ms). Merging these into
 * the local store — downloading audio via signed URLs and applying
 * last-write-wins — is handled by the caller once cloud sync is enabled.
 */
export async function pullEchoes(userId: string, since = 0): Promise<RemoteEcho[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .gt('updated_at', since);
  if (error) throw error;
  return (data ?? []) as RemoteEcho[];
}

/**
 * Delete all of a user's cloud data and the account itself. Removing the auth
 * user requires service-role access, so that step runs in a privileged
 * `delete-account` Edge Function (Google Play requires an in-app deletion path
 * when accounts exist). See docs/supabase-setup.sql.
 */
export async function deleteAccount(userId: string): Promise<void> {
  const client = requireSupabase();
  await client.from(TABLE).delete().eq('user_id', userId);
  await client.storage.from(BUCKET).remove([userId]);
  const { error } = await client.functions.invoke('delete-account');
  if (error) throw error;
  await client.auth.signOut();
}
