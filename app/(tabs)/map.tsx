import { router } from 'expo-router';
import { MapPinned, Radio } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { CaptureButton } from '@/components/CaptureButton';
import { EchoMap } from '@/components/map/EchoMap';
import { isMapConfigured } from '@/components/map/mapStyle';
import { EmptyState } from '@/components/ui';
import { useEchoStore } from '@/store/useEchoStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Map tab: the custom slate Mapbox map with sound-ring pins. Falls back to a
 * friendly note when no Mapbox token is configured, and overlays an inviting
 * empty state until the first echo exists.
 */
export default function MapScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const hasEchoes = useEchoStore((s) => s.echoes.length > 0);

  if (!isMapConfigured) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background }]}>
        <EmptyState
          icon={<MapPinned color={colors.textMuted} size={40} strokeWidth={1.5} />}
          title={t('map.needsToken.title')}
          description={t('map.needsToken.description')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <EchoMap onSelectEcho={(id) => router.push({ pathname: '/echo/[id]', params: { id } })} />
      {!hasEchoes ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <EmptyState
            icon={<Radio color={colors.accent} size={40} strokeWidth={1.5} />}
            title={t('map.empty.title')}
            description={t('map.empty.description')}
          />
        </View>
      ) : null}
      <CaptureButton />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
