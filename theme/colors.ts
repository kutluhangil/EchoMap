/**
 * Echo Map color foundation.
 *
 * Thesis: a cool world, a warm memory. The map and globe stay cool and
 * desaturated (slate, fog); memories glow warm (ember). The Aesthetician
 * expands this raw palette into the full light/dark semantic system, font
 * loading, and UI kit — this file only establishes the source tokens.
 */

export const palette = {
  // Cool world — map, globe, UI ground
  ink: '#171A1F',
  slateDeep: '#1E242C',
  slate: '#2A323C',
  fog: '#9AA3AD',
  mist: '#E9EBE8',
  haze: '#D4D8D5',

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
} as const;

/** Semantic colors resolved per scheme. The Aesthetician extends this set. */
export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
}

export const darkColors: ThemeColors = {
  background: palette.ink,
  surface: palette.slateDeep,
  border: palette.slate,
  text: palette.mist,
  textMuted: palette.fog,
  accent: palette.ember,
  accentGlow: palette.emberDim,
};

export const lightColors: ThemeColors = {
  background: palette.mist,
  surface: '#FFFFFF',
  border: palette.haze,
  text: palette.ink,
  textMuted: palette.slate,
  accent: palette.ember,
  accentGlow: palette.emberDim,
};
