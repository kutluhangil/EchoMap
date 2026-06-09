/**
 * Custom typefaces, chosen for character without noise:
 * - Clash Display — display grotesk for headings, used with restraint
 * - General Sans — clean, readable body
 * - Geist Mono — coordinates, durations, dates (the "field recordist" identity)
 *
 * `fontAssets` feeds expo-font's `useFonts`; `fontFamily` holds the family
 * names referenced by the type scale and component styles.
 */
export const fontAssets = {
  'ClashDisplay-Medium': require('@/assets/fonts/ClashDisplay-Medium.ttf'),
  'ClashDisplay-Semibold': require('@/assets/fonts/ClashDisplay-Semibold.ttf'),
  'GeneralSans-Regular': require('@/assets/fonts/GeneralSans-Regular.ttf'),
  'GeneralSans-Medium': require('@/assets/fonts/GeneralSans-Medium.ttf'),
  'GeistMono-Regular': require('@/assets/fonts/GeistMono-Regular.ttf'),
} as const;

export const fontFamily = {
  display: 'ClashDisplay-Medium',
  displayStrong: 'ClashDisplay-Semibold',
  body: 'GeneralSans-Regular',
  bodyMedium: 'GeneralSans-Medium',
  mono: 'GeistMono-Regular',
} as const;
