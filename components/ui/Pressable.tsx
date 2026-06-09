import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Pressable as RNPressable,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';

type HapticKind = 'light' | 'medium' | 'selection' | 'none';

interface HapticPressableProps extends PressableProps {
  /** Tactile feedback fired on press. Defaults to a light tap. */
  haptic?: HapticKind;
}

const fire: Record<Exclude<HapticKind, 'none'>, () => Promise<void>> = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  selection: () => Haptics.selectionAsync(),
};

/**
 * Pressable with built-in haptic feedback. Feedback runs before the handler so
 * the tap feels immediate; failures (e.g. unsupported devices) are ignored.
 */
export function Pressable({ haptic = 'light', onPress, ...rest }: HapticPressableProps) {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (haptic !== 'none') {
        fire[haptic]().catch(() => {});
      }
      onPress?.(event);
    },
    [haptic, onPress],
  );

  return <RNPressable onPress={handlePress} {...rest} />;
}
