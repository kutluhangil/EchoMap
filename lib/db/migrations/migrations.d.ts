import type { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

// Types for the Drizzle-generated migrations.js bundle (default export). Kept
// alongside the generated file so the import is typed without enabling allowJs.
declare const migrations: Parameters<typeof useMigrations>[1];
export default migrations;
