/**
 * Type scale. The custom faces (Clash Display, General Sans, Geist Mono) are
 * loaded by the Aesthetician via expo-font; until then text falls back to the
 * platform font so the skeleton still renders. The `data` variant (coordinates,
 * durations, dates) is intentionally monospaced — the "field recordist" feel.
 */
export const type = {
  hero: { size: 34, lineHeight: 38, letterSpacing: -0.5 },
  title: { size: 24, lineHeight: 28, letterSpacing: -0.3 },
  heading: { size: 18, lineHeight: 24 },
  body: { size: 16, lineHeight: 24 },
  caption: { size: 13, lineHeight: 18 },
  data: { size: 13, lineHeight: 16, letterSpacing: 0.2 },
} as const;

export type TypeVariant = keyof typeof type;
