import { fontFamily } from './fonts';

/**
 * Type scale. Each variant binds a family to a size/leading/tracking. The
 * `data` variant is monospaced on purpose — coordinates, durations, and dates
 * carry the "field recordist" identity.
 */
export const type = {
  hero: { fontFamily: fontFamily.displayStrong, fontSize: 34, lineHeight: 38, letterSpacing: -0.5 },
  title: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: fontFamily.bodyMedium, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.bodyMedium, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18 },
  data: { fontFamily: fontFamily.mono, fontSize: 13, lineHeight: 16, letterSpacing: 0.2 },
} as const;

export type TypeVariant = keyof typeof type;
