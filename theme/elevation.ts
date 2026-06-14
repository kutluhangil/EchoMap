import { type ViewStyle } from 'react-native';

import { palette } from './colors';

/**
 * Elevation tokens. Two neutral shadow steps for surfaces, plus an ember `glow`
 * for the few warm elements that should feel lit from within (the FAB, the
 * selected pin, the landing CTA). Cross-platform: iOS reads `shadow*`, Android
 * reads `elevation`, and React Native Web maps `shadow*` to box-shadow.
 */
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  } satisfies ViewStyle,
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  } satisfies ViewStyle,
} as const;

/**
 * A warm ember bloom. `level` scales the spread — keep it measured; the thesis
 * wants glow to read as memory, not neon.
 */
export function glow(color: string = palette.ember, level: 'sm' | 'md' = 'md'): ViewStyle {
  const radius = level === 'sm' ? 10 : 18;
  return {
    shadowColor: color,
    shadowOpacity: level === 'sm' ? 0.35 : 0.45,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 0 },
    elevation: level === 'sm' ? 6 : 10,
  };
}
