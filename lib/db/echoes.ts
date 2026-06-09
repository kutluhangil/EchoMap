import { desc, eq, gt, isNull, or } from 'drizzle-orm';

import { db } from './client';
import { echoes, type EchoRow, type NewEchoRow } from './schema';

/**
 * Repository for the `echoes` table. expo-sqlite is synchronous, so these
 * return immediately; the store layers async file-system work on top.
 */

/** All echoes, newest first (matches the timeline and map ordering). */
export function listEchoes(): EchoRow[] {
  return db.select().from(echoes).orderBy(desc(echoes.createdAt)).all();
}

export function getEcho(id: string): EchoRow | undefined {
  return db.select().from(echoes).where(eq(echoes.id, id)).get();
}

export function insertEcho(row: NewEchoRow): void {
  db.insert(echoes).values(row).run();
}

export function updateEcho(id: string, patch: Partial<NewEchoRow>): void {
  db.update(echoes).set(patch).where(eq(echoes.id, id)).run();
}

export function deleteEcho(id: string): void {
  db.delete(echoes).where(eq(echoes.id, id)).run();
}

/** Rows changed since their last successful cloud push — the sync queue. */
export function listUnsynced(): EchoRow[] {
  return db
    .select()
    .from(echoes)
    .where(or(isNull(echoes.syncedAt), gt(echoes.updatedAt, echoes.syncedAt)))
    .all();
}

export function markSynced(id: string, syncedAt: number): void {
  db.update(echoes).set({ syncedAt }).where(eq(echoes.id, id)).run();
}
