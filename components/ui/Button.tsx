import { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Primary action button. `primary` carries the warm ember fill (the one bold
 * move); `secondary` and `ghost` stay quiet. Height meets the 48dp touch
 * target, and the accessibility role/state are set for screen readers.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  fullWidth,
  style,
}: ButtonProps) {
  const { colors, radius, space } = useTheme();

  const tone = {
    primary: { bg: colors.accent, fg: colors.onAccent, border: 'transparent' },
    secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      haptic={variant === 'primary' ? 'medium' : 'light'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          borderRadius: radius.pill,
          paddingHorizontal: space.xl,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        fullWidth ? styles.fullWidth : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone.fg} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text variant="label" style={{ color: tone.fg }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fullWidth: { alignSelf: 'stretch' },
});
