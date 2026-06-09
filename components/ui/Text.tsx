import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import type { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';
import type { TypeVariant } from '@/theme/typography';

interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  color?: keyof ThemeColors;
  center?: boolean;
}

/**
 * Themed text. `variant` selects the type scale entry (which carries the right
 * family); `color` selects a semantic theme color. Honors the user's font-scale
 * setting via React Native's default `allowFontScaling`.
 */
export function Text({ variant = 'body', color = 'text', center, style, ...rest }: TextProps) {
  const { type, colors } = useTheme();
  return (
    <RNText
      style={[
        type[variant],
        { color: colors[color] },
        center ? { textAlign: 'center' } : null,
        style,
      ]}
      {...rest}
    />
  );
}
