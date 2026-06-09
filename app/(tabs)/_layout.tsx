import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';

/**
 * Two-tab shell: map (primary) and timeline. Tab icons (Lucide) and the
 * floating record button are added by the Aesthetician and Memory Weaver.
 */
export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="map" options={{ title: t('tabs.map') }} />
      <Tabs.Screen name="timeline" options={{ title: t('tabs.timeline') }} />
    </Tabs>
  );
}
