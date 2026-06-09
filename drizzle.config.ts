import type { Config } from 'drizzle-kit';

/**
 * Drizzle Kit config for the local SQLite database. `driver: 'expo'` makes
 * `drizzle-kit generate` emit a migrations bundle that expo-sqlite applies at
 * runtime via the migrator. Run `npm run db:generate` after editing the schema.
 */
export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
