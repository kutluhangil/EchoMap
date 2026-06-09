import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * A geotagged sound memory. `audioPath` points at a file in the app sandbox
 * (managed by lib/storage/files.ts), kept separate from this metadata row so
 * the database stays small and the audio can be backed up independently.
 *
 * `updatedAt` drives last-write-wins cloud sync; `syncedAt` records the last
 * successful push to Supabase (null while local-only).
 */
export const echoes = sqliteTable(
  'echoes',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    note: text('note'),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    locationName: text('location_name'),
    audioPath: text('audio_path').notNull(),
    durationMs: integer('duration_ms').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    syncedAt: integer('synced_at'),
  },
  (table) => [
    // Timeline reads newest-first; map reads by coordinate window.
    index('echoes_created_at_idx').on(table.createdAt),
    index('echoes_location_idx').on(table.lat, table.lng),
  ],
);

export type EchoRow = typeof echoes.$inferSelect;
export type NewEchoRow = typeof echoes.$inferInsert;
