import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initI18n } from '@/lib/i18n';
import { ThemeProvider } from '@/theme/ThemeProvider';

// Initialize i18next as a one-time side effect when this module loads, so the
// first render already has translations available.
initI18n();

/**
 * Single mount point for app-wide providers. Order matters: gesture handling
 * must wrap everything, then safe-area insets, then theme. Later agents slot
 * their own providers (audio session, sync) in here.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
