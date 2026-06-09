import { useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Pressable, Text } from '@/components/ui';
import { requestMicrophonePermission } from '@/lib/audio/recorder';
import { requestLocationPermission } from '@/lib/location/geo';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';

const SLIDES = ['slide1', 'slide2', 'slide3'] as const;

/**
 * First-launch onboarding: three quiet slides, then an in-context permission
 * request with a prominent disclosure (Google Play requirement) before asking
 * for the microphone and location.
 */
export default function Onboarding() {
  const { t } = useTranslation();
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);
  const [step, setStep] = useState(0);
  const [requesting, setRequesting] = useState(false);

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step] ?? 'slide1';

  const finish = async () => {
    setRequesting(true);
    // The disclosure above is shown before these prompts (prominent disclosure).
    await requestMicrophonePermission();
    await requestLocationPermission();
    setOnboarded(true);
    router.replace('/(tabs)/map');
  };

  return (
    <View
      style={[
        styles.fill,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + space.xxl,
          paddingHorizontal: space.xl,
          paddingBottom: insets.bottom + space.xl,
        },
      ]}
    >
      <View style={styles.skip}>
        {!isLast ? (
          <Pressable onPress={() => setStep(SLIDES.length - 1)} haptic="light">
            <Text variant="label" color="textMuted">
              {t('common.skip')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Animated.View
        key={slide}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(150)}
        style={styles.body}
      >
        <Text variant="hero">{t(`onboarding.${slide}.title`)}</Text>
        <Text variant="body" color="textMuted" style={{ marginTop: space.md }}>
          {t(`onboarding.${slide}.body`)}
        </Text>
      </Animated.View>

      <View style={{ gap: space.lg }}>
        <View style={styles.dots}>
          {SLIDES.map((name, i) => (
            <View
              key={name}
              style={[styles.dot, { backgroundColor: i === step ? colors.accent : colors.border }]}
            />
          ))}
        </View>

        {isLast ? (
          <View style={{ gap: space.md }}>
            <Text variant="caption" color="textFaint" center>
              {t('onboarding.permissionsDisclosure')}
            </Text>
            <Button label={t('onboarding.allow')} onPress={finish} loading={requesting} fullWidth />
          </View>
        ) : (
          <Button
            label={t('common.next')}
            onPress={() => setStep((current) => Math.min(SLIDES.length - 1, current + 1))}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  skip: { alignItems: 'flex-end', height: 24 },
  body: { flex: 1, justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
