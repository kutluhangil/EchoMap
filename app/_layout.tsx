import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useReducedMotion } from 'react-native-reanimated';

import { AppProviders } from '@/components/providers/AppProviders';
import { palette } from '@/theme/colors';
import { fontAssets } from '@/theme/fonts';

// Hold the native splash until fonts are ready to avoid a flash of fallback type.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Keep the splash up until fonts resolve (or fail — we still proceed then).
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.ink },
          // Reduce-motion swaps translations for a gentle cross-fade.
          animation: reduced ? 'fade' : 'default',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="echo/new"
          options={{ presentation: 'modal', animation: reduced ? 'fade' : 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="echo/[id]"
          options={{ presentation: 'card', animation: reduced ? 'fade' : 'slide_from_right' }}
        />
      </Stack>
    </AppProviders>
  );
}
