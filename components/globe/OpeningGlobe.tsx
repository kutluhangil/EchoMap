import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas } from '@react-three/fiber/native';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useEchoStore } from '@/store/useEchoStore';
import { palette } from '@/theme/colors';
import { GlobeScene } from './GlobeScene';

// Always hand off to the app within this window, even if the GL sequence stalls.
const MAX_DURATION_MS = 5200;
// A pleasant default view when there are no echoes and no known location yet.
const FALLBACK_FOCUS = { lat: 39, lng: 35 };

interface OpeningGlobeProps {
  onFinish: () => void;
}

/**
 * The animated opening: a rotating, ember-lit globe that zooms toward the
 * focus location before handing off to the map. Tappable to skip, respectful of
 * reduce-motion, and guarded so it always finishes (timeout + error boundary).
 */
export function OpeningGlobe({ onFinish }: OpeningGlobeProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const echoes = useEchoStore((s) => s.echoes);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const cover = useSharedValue(1); // ink overlay opacity: 1 = fully covered
  const finished = useRef(false);

  const points = useMemo(() => echoes.map((e) => ({ id: e.id, lat: e.lat, lng: e.lng })), [echoes]);
  const focus = echoes[0] ?? FALLBACK_FOCUS; // newest echo, or the default view

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    cover.value = withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) }, (done) => {
      if (done) runOnJS(onFinish)();
    });
  }, [cover, onFinish]);

  // Resolve the reduce-motion setting before starting the sequence.
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) {
          setReducedMotion(value);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Fade the globe in, and arm the safety timeout.
  useEffect(() => {
    if (!ready) return;
    cover.value = withTiming(0, {
      duration: reducedMotion ? 200 : 700,
      easing: Easing.out(Easing.quad),
    });
    const timer = setTimeout(finish, reducedMotion ? 1200 : MAX_DURATION_MS);
    return () => clearTimeout(timer);
  }, [ready, reducedMotion, cover, finish]);

  const coverStyle = useAnimatedStyle(() => ({ opacity: cover.value }));

  if (!ready) {
    return <View style={[styles.fill, { backgroundColor: palette.ink }]} />;
  }

  return (
    <View style={[styles.fill, { backgroundColor: palette.ink }]}>
      <GlobeErrorBoundary onError={finish}>
        <Canvas camera={{ position: [0, 0, 3.4], fov: 45 }} gl={{ antialias: true }}>
          <GlobeScene
            echoes={points}
            focusLat={focus.lat}
            focusLng={focus.lng}
            reducedMotion={reducedMotion}
            landColor={palette.mapLand}
            rimColor={palette.signal}
            emberColor={palette.ember}
            onZoomComplete={finish}
          />
        </Canvas>
      </GlobeErrorBoundary>

      <View pointerEvents="none" style={styles.title}>
        <Text variant="hero" center style={{ color: palette.mist }}>
          {t('app.name')}
        </Text>
        <Text variant="caption" center style={{ color: palette.fog }}>
          {t('app.tagline')}
        </Text>
      </View>

      {/* Tap anywhere to skip; a visible affordance reinforces it. */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel={t('common.skip')}
      />
      <Pressable style={[styles.skip, { top: insets.top + 12 }]} onPress={finish} hitSlop={12}>
        <Text variant="label" style={{ color: palette.fog }}>
          {t('common.skip')}
        </Text>
      </Pressable>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, coverStyle, { backgroundColor: palette.ink }]}
      />
    </View>
  );
}

/** Falls back to handing off to the app if the GL canvas fails to initialize. */
class GlobeErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  title: { position: 'absolute', left: 24, right: 24, bottom: '16%', gap: 6 },
  skip: { position: 'absolute', right: 24, paddingVertical: 8, paddingHorizontal: 12 },
});
