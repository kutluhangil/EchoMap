import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore, type ToastType } from '@/store/useToastStore';
import { shadow } from '@/theme/elevation';
import { useTheme } from '@/theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

/**
 * Overlay host for transient messages. Mounted once near the app root; it reads
 * the toast queue and renders a stack at the top, each item tappable to dismiss.
 * Quiet by design — a thin ember (or red/green) edge carries the meaning.
 */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const insets = useSafeAreaInsets();
  const { colors, radius, space } = useTheme();

  if (toasts.length === 0) return null;

  const edge: Record<ToastType, string> = {
    error: colors.error,
    success: colors.success,
    info: colors.accent,
  };

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + space.sm }]}>
      {toasts.map((t) => (
        <Animated.View
          key={t.id}
          entering={FadeInUp.duration(220)}
          exiting={FadeOut.duration(160)}
          style={[
            styles.toast,
            shadow.md,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderLeftColor: edge[t.type],
              borderRadius: radius.md,
              paddingVertical: space.md,
              paddingHorizontal: space.lg,
            },
          ]}
        >
          <Pressable onPress={() => dismiss(t.id)} accessibilityRole="button" hitSlop={8}>
            <Text variant="bodyMedium" numberOfLines={3}>
              {t.message}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 8,
    alignItems: 'stretch',
  },
  toast: {
    borderWidth: 1,
    borderLeftWidth: 3,
  },
});
