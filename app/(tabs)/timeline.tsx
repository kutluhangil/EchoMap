import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Waveform } from '@/components/audio/Waveform';
import { CaptureButton } from '@/components/CaptureButton';
import { EmptyState, Pressable, Text } from '@/components/ui';
import { loadWaveform } from '@/lib/audio/waveform';
import { formatRelativeAge } from '@/lib/utils/format';
import { useEchoStore, type Echo } from '@/store/useEchoStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Timeline: echoes in reverse chronological order, each a row with a tiny
 * waveform, its title and place, and a nostalgic relative age. The map's quiet
 * sibling, where "3 years ago" does the emotional work.
 */
export default function TimelineScreen() {
  const { colors, space } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const echoes = useEchoStore((s) => s.echoes);

  if (echoes.length === 0) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <EmptyState
          icon={<Clock color={colors.accent} size={40} strokeWidth={1.5} />}
          title={t('timeline.empty.title')}
          description={t('timeline.empty.description')}
        />
        <CaptureButton />
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <FlatList
        data={echoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + space.lg,
          paddingHorizontal: space.lg,
          paddingBottom: insets.bottom + 110,
          gap: space.sm,
        }}
        ListHeaderComponent={
          <Text variant="hero" style={{ marginBottom: space.md }}>
            {t('tabs.timeline')}
          </Text>
        }
        renderItem={({ item }) => <TimelineRow echo={item} locale={i18n.language} />}
      />
      <CaptureButton />
    </View>
  );
}

function TimelineRow({ echo, locale }: { echo: Echo; locale: string }) {
  const { colors, radius, space } = useTheme();
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    void loadWaveform(echo.id).then((waveform) => setBars(waveform ?? []));
  }, [echo.id]);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/echo/[id]', params: { id: echo.id } })}
      haptic="light"
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: space.md,
          gap: space.md,
        },
      ]}
    >
      <Waveform
        bars={bars}
        width={56}
        height={40}
        activeColor={colors.accent}
        inactiveColor={colors.accent}
      />
      <View style={styles.meta}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {echo.title}
        </Text>
        {echo.locationName ? (
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {echo.locationName}
          </Text>
        ) : null}
      </View>
      <Text variant="data" color="textFaint">
        {formatRelativeAge(echo.createdAt, locale)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  meta: { flex: 1, gap: 2 },
});
