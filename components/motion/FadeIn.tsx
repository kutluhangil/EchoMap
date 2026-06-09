import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn as ReanimatedFadeIn,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** Drift up slightly while fading (a gentle reveal). */
  slide?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Reveal wrapper used to bring screen content in softly. Honors reduce-motion
 * by rendering its children with no animation.
 */
export function FadeIn({ children, delay = 0, duration = 400, slide = true, style }: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  const entering = (slide ? FadeInDown : ReanimatedFadeIn).duration(duration).delay(delay);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
