const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle Drizzle migration files (.sql) as strings so the runtime migrator can
// apply them.
config.resolver.sourceExts.push('sql');

// Add wasm asset support for SQLite web
config.resolver.assetExts.push('wasm');

module.exports = config;
