import { Radio } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Placeholder map screen. The Cartographer replaces this with the custom slate
 * Mapbox map and sound-ring pins; the empty state is the baseline.
 */
export default function MapScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <EmptyState
        icon={<Radio color={colors.accent} size={40} strokeWidth={1.5} />}
        title={t('map.empty.title')}
        description={t('map.empty.description')}
      />
    </View>
  );
}
