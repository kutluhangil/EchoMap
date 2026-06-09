import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from './colors';

interface ThemeValue {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeValue>({ colors: darkColors, scheme: 'dark' });

/**
 * Minimal theme slot. Resolves the system scheme with a dark fallback, matching
 * the app's dark-first intent. The Aesthetician extends this with a manual
 * light/dark/system override persisted in MMKV and with font loading.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Anything that isn't explicitly light (dark, unspecified, null) resolves to
  // dark, matching the app's dark-first intent.
  const scheme: 'light' | 'dark' = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = scheme === 'light' ? lightColors : darkColors;
  return <ThemeContext.Provider value={{ colors, scheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}
