import { router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Pressable } from '@/components/ui';
import { palette } from '@/theme/colors';

/** Floating capture button — opens the recording flow. Sits above the tab bar. */
export function CaptureButton() {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={() => router.push('/echo/new')}
      haptic="medium"
      accessibilityRole="button"
      accessibilityLabel={t('capture.header')}
      style={styles.fab}
    >
      <Mic color={palette.ink} size={28} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ember,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
