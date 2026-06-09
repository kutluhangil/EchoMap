/**
 * Echo Map color foundation.
 *
 * Thesis: a cool world, a warm memory. The map and globe stay cool and
 * desaturated (slate, fog); memories glow warm (ember). `palette` holds the
 * raw tokens; `darkColors` / `lightColors` map them to semantic roles the UI
 * consumes. Dark is the default — it suits a map and sound content.
 */

export const palette = {
  // Cool world — map, globe, UI ground
  ink: '#171A1F',
  slateDeep: '#1E242C',
  slate: '#2A323C',
  slateLight: '#3A434E',
  fog: '#9AA3AD',
  fogDeep: '#6B7480',
  mist: '#E9EBE8',
  haze: '#D4D8D5',
  hazeDeep: '#BFC4C0',

  // Warm memory — the single accent that carries the app
  ember: '#E08A3C',
  emberBright: '#F0A55C',
  emberDim: 'rgba(224,138,60,0.18)',

  // Functional
  signal: '#4F7A8C',
  success: '#5AA17F',
  warning: '#D9A441',
  error: '#C75D5D',

  // Map tints (consumed by the Cartographer's custom Mapbox style)
  mapLand: '#1B2128',
  mapWater: '#11161B',
  mapContour: '#2C3640',

  white: '#FFFFFF',
} as const;

/** Semantic colors resolved per scheme. */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentBright: string;
  accentGlow: string;
  onAccent: string;
  success: string;
  warning: string;
  error: string;
  signal: string;
  overlay: string;
  tabBar: string;
  tabBarBorder: string;
}

export const darkColors: ThemeColors = {
  background: palette.ink,
  surface: palette.slateDeep,
  surfaceElevated: palette.slate,
  border: palette.slate,
  borderStrong: palette.slateLight,
  text: palette.mist,
  textMuted: palette.fog,
  textFaint: palette.fogDeep,
  accent: palette.ember,
  accentBright: palette.emberBright,
  accentGlow: palette.emberDim,
  onAccent: palette.ink, // dark text on ember reads with AA contrast
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  signal: palette.signal,
  overlay: 'rgba(0,0,0,0.5)',
  tabBar: palette.slateDeep,
  tabBarBorder: palette.slate,
};

export const lightColors: ThemeColors = {
  background: palette.mist,
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.haze,
  borderStrong: palette.hazeDeep,
  text: palette.ink,
  textMuted: '#5A636D',
  textFaint: palette.fog,
  accent: palette.ember,
  accentBright: palette.emberBright,
  accentGlow: palette.emberDim,
  onAccent: palette.ink,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  signal: palette.signal,
  overlay: 'rgba(23,26,31,0.4)',
  tabBar: palette.white,
  tabBarBorder: palette.haze,
};
