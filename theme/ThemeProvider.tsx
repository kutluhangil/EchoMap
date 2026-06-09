import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/useSettingsStore';
import { darkColors, lightColors, type ThemeColors } from './colors';
import { radius, space } from './spacing';
import { type as typeScale } from './typography';

interface ThemeValue {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  space: typeof space;
  radius: typeof radius;
  type: typeof typeScale;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/**
 * Resolves the active scheme from the user's preference (Settings) over the
 * system scheme, defaulting to dark. Anything that isn't explicitly light
 * resolves to dark to keep the app dark-first.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  const scheme: 'light' | 'dark' =
    preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo<ThemeValue>(
    () => ({
      colors: scheme === 'light' ? lightColors : darkColors,
      scheme,
      space,
      radius,
      type: typeScale,
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
