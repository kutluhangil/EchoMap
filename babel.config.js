module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Inline Drizzle's .sql migration files as strings at build time — Metro
    // can't parse them as JS. Pairs with the 'sql' sourceExts entry in
    // metro.config.js so the runtime migrator receives the SQL as a string.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
