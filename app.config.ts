import type { ExpoConfig } from 'expo/config';

/**
 * Dynamic Expo config.
 *
 * Permissions are intentionally minimal: microphone for recording and
 * FOREGROUND-ONLY location for geotagging. Background location is deliberately
 * excluded — it would trigger Google Play's strict review and the app never
 * needs a location while backgrounded. The expo-location / expo-audio config
 * plugins (added by the Cartographer and Sound Keeper) augment these strings.
 */
const config: ExpoConfig = {
  name: 'Echo Map',
  slug: 'echo-map',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'echomap',
  userInterfaceStyle: 'automatic',
  icon: './assets/images/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.kutluhangil.echomap',
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Echo Map records short ambient sounds you choose to capture as memories.',
      NSLocationWhenInUseUsageDescription:
        'Echo Map tags your recordings with their location so you can find them on the map.',
    },
  },
  android: {
    package: 'com.kutluhangil.echomap',
    adaptiveIcon: {
      backgroundColor: '#171A1F',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
    // Background location is explicitly NOT requested (Play policy).
  },
  plugins: [
    'expo-router',
    'expo-localization',
    'expo-sqlite',
    'expo-sharing',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#171A1F',
        image: './assets/images/splash-icon.png',
        imageWidth: 160,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
