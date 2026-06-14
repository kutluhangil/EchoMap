import { Easing } from 'react-native-reanimated';

/**
 * Motion tokens. One source of truth for timing so every animation in the app
 * shares the same rhythm — the quiet, unhurried pace the design thesis asks for.
 * Durations are milliseconds.
 */
export const duration = {
  fast: 160,
  base: 280,
  slow: 560,
  /** Ambient loops (breathing rings, idle pulse). */
  ambient: 2400,
} as const;

/** Shared easing curves. `standard` decelerates; `inOut` for symmetrical moves. */
export const easing = {
  standard: Easing.out(Easing.quad),
  inOut: Easing.inOut(Easing.quad),
  /** A touch of overshoot for things that should feel alive (FAB, CTA). */
  emphasized: Easing.bezier(0.2, 0.9, 0.2, 1),
} as const;

/** Spring presets for gesture-driven and entrance motion. */
export const spring = {
  gentle: { damping: 18, stiffness: 140, mass: 1 },
  snappy: { damping: 22, stiffness: 240, mass: 0.9 },
} as const;
