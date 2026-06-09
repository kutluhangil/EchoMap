import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder map screen. The Cartographer replaces this with the custom slate
 * Mapbox map and sound-ring pins; the empty-state copy stays as the baseline.
 */
export default function MapScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textMuted }]}>{t('map.empty')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
});
