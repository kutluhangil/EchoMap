import { useEffect, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SharedElementProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Entrance that echoes a sound ring expanding from the tapped pin: content
 * scales up from a slightly smaller ring while fading in. This is a deliberate
 * stand-in for a true cross-screen shared element — the stable APIs for that in
 * Reanimated / Expo Router are still in flux, and this reads the same to the
 * eye. Reduce-motion shows the content immediately.
 */
export function SharedElement({ children, style }: SharedElementProps) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (!reduced) {
      progress.value = withTiming(1, { duration: 440, easing: Easing.out(Easing.cubic) });
    }
  }, [reduced, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.86 + progress.value * 0.14 }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
