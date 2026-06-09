import { type ReactNode } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initI18n } from '@/lib/i18n';
import { LanguageSync } from '@/lib/i18n/LanguageSync';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

// Initialize i18next as a one-time side effect when this module loads, so the
// first render already has translations available.
initI18n();

/** Status bar contrast follows the active scheme. */
function ThemedStatusBar() {
  const { scheme } = useTheme();
  return <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />;
}

/**
 * Single mount point for app-wide providers. Order matters: gesture handling
 * wraps everything, then safe-area insets, theme, and the bottom-sheet portal.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <LanguageSync />
            <ThemedStatusBar />
            {children}
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
