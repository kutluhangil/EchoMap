import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder timeline screen. The Memory Weaver replaces this with the
 * chronological echo list and relative "3 years ago" dates.
 */
export default function TimelineScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textMuted }]}>{t('timeline.empty')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
});
