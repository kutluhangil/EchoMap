import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder timeline screen. The Memory Weaver replaces this with the
 * chronological echo list and relative "3 years ago" dates.
 */
export default function TimelineScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <EmptyState
        icon={<Clock color={colors.accent} size={40} strokeWidth={1.5} />}
        title={t('timeline.empty.title')}
        description={t('timeline.empty.description')}
      />
    </View>
  );
}
