import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DATABASE_NAME = 'echo-map.db';

// `enableChangeListener` lets Drizzle's useLiveQuery react to writes, so the
// map and timeline can update without manual refetching.
const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

/** Typed Drizzle client over the local SQLite database. */
export const db = drizzle(expoDb, { schema });
