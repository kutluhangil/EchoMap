import { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
 * move); `secondary` and `ghost` stay quiet. Presses settle with a subtle
 * scale (skipped under reduce-motion). Height meets the 48dp touch target.
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
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const tone = {
    primary: { bg: colors.accent, fg: colors.onAccent, border: 'transparent' },
    secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
  }[variant];

  const isDisabled = disabled || loading;

  const pressIn = () => {
    if (!reduced && !isDisabled) scale.value = withTiming(0.96, { duration: 90 });
  };
  const pressOut = () => {
    if (!reduced) scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={[fullWidth ? styles.fullWidth : null, animatedStyle, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        haptic={variant === 'primary' ? 'medium' : 'light'}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={({ pressed }) => [
          styles.base,
          {
            backgroundColor: tone.bg,
            borderColor: tone.border,
            borderRadius: radius.pill,
            paddingHorizontal: space.xl,
            opacity: isDisabled ? 0.5 : pressed ? 0.92 : 1,
          },
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
    </Animated.View>
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
