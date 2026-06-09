// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  // Disable stylistic rules that Prettier owns to avoid conflicts.
  eslintConfigPrettier,
  {
    rules: {
      // Reanimated shared values are mutated through `.value` by design; the
      // rules-of-react immutability check flags this valid pattern.
      'react-hooks/immutability': 'off',
    },
  },
  {
    // React Three Fiber elements use three.js props the React plugin doesn't
    // know (args, position, vertexShader, ...).
    files: ['components/globe/**/*.tsx'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'lib/db/migrations/*'],
  },
]);
