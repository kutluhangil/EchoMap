import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/ui';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Minimal onboarding placeholder. The Memory Weaver expands this into the
 * three animated slides with in-context permission requests; for now it sets
 * the onboarded flag and continues to the map so the launch routing works.
 */
export default function Onboarding() {
  const { t } = useTranslation();
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);

  const begin = () => {
    setOnboarded(true);
    router.replace('/(tabs)/map');
  };

  return (
    <View
      style={[
        styles.fill,
        {
          backgroundColor: colors.background,
          paddingHorizontal: space.xl,
          paddingTop: insets.top + space.xxl,
          paddingBottom: insets.bottom + space.xl,
        },
      ]}
    >
      <View style={styles.body}>
        <Text variant="hero">{t('onboarding.slide1.title')}</Text>
        <Text variant="body" color="textMuted" style={{ marginTop: space.md }}>
          {t('onboarding.slide1.body')}
        </Text>
      </View>
      <Button label={t('common.begin')} onPress={begin} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { flex: 1, justifyContent: 'center' },
});
