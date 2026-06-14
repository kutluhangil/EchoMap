import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { GlobeScene } from '@/components/globe/GlobeScene';
import { PulseRing } from '@/components/motion/PulseRing';
import { Button, Text } from '@/components/ui';
import { isLocated, useEchoStore } from '@/store/useEchoStore';
import { palette } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';

const GITHUB_URL = 'https://github.com/kutluhangil/EchoMap';
const FALLBACK_FOCUS = { lat: 39, lng: 35 };

/**
 * The web-only landing: a slowly rotating, ember-lit globe behind the app's
 * name, a tagline, and two calls to action. The demo data (seeded on launch)
 * lights the globe, so the hero already tells the story before anyone clicks.
 */
export function LandingHero() {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const echoes = useEchoStore((s) => s.echoes);
  const seedDemo = useEchoStore((s) => s.seedDemo);

  const points = useMemo(
    () => echoes.filter(isLocated).map((e) => ({ id: e.id, lat: e.lat, lng: e.lng })),
    [echoes],
  );
  const focus = points[0] ?? FALLBACK_FOCUS;
  const isWide = width >= 720;

  const enterDemo = async () => {
    // Defensive: the web entry usually seeds before this mounts, but make sure.
    await seedDemo();
    router.replace('/(tabs)/map');
  };

  const features = [
    t('landing.features.record'),
    t('landing.features.map'),
    t('landing.features.relive'),
  ];

  return (
    <View style={styles.fill}>
      <Canvas
        style={StyleSheet.absoluteFill}
        camera={{ position: [0, 0, 3.1], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <GlobeScene
          echoes={points}
          focusLat={focus.lat}
          focusLng={focus.lng}
          reducedMotion={false}
          mode="idle"
          landColor={palette.mapLand}
          rimColor={palette.signal}
          emberColor={palette.ember}
        />
      </Canvas>

      {/* Scrim keeps the type legible over the globe without hiding it. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scrim]} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.column, { minHeight: height, maxWidth: isWide ? 620 : 460 }]}>
          <Text style={[styles.brand, { fontSize: isWide ? 64 : 44 }]}>{t('app.name')}</Text>
          <Text variant="title" center style={styles.tagline}>
            {t('landing.tagline')}
          </Text>
          <Text variant="body" color="textMuted" center style={styles.sub}>
            {t('landing.subtitle')}
          </Text>

          <View style={[styles.ctas, isWide ? styles.ctasRow : null]}>
            <Button label={t('landing.ctaDemo')} onPress={enterDemo} fullWidth={!isWide} />
            <Button
              label={t('landing.ctaGithub')}
              variant="secondary"
              onPress={() => void Linking.openURL(GITHUB_URL)}
              fullWidth={!isWide}
            />
          </View>

          <View style={styles.features}>
            {features.map((line) => (
              <Text key={line} variant="data" color="textFaint" center>
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.footerRing}>
            <PulseRing size={64} count={2} intensity={0.22} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: palette.ink },
  scrim: { backgroundColor: 'rgba(23,26,31,0.45)' },
  content: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24 },
  column: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 48 },
  brand: {
    fontFamily: fontFamily.displayStrong,
    color: palette.mist,
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: { color: palette.mist },
  sub: { maxWidth: 440 },
  ctas: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
  ctasRow: { flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' },
  features: { gap: 6, marginTop: 24 },
  footerRing: { marginTop: 28, alignItems: 'center' },
});
