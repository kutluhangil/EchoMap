import { router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { PulseRing } from '@/components/motion/PulseRing';
import { Pressable } from '@/components/ui';
import { palette } from '@/theme/colors';
import { glow } from '@/theme/elevation';

/**
 * Floating capture button — opens the recording flow. A quiet pulse behind it
 * carries the sound-ring motif so the primary action feels alive; the ember
 * glow lights it from within. Both stay still under reduce-motion.
 */
export function CaptureButton() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  return (
    <View pointerEvents="box-none" style={styles.dock}>
      {!reduced ? (
        <View pointerEvents="none" style={styles.pulse}>
          <PulseRing size={108} count={2} intensity={0.16} />
        </View>
      ) : null}
      <Pressable
        onPress={() => router.push('/echo/new')}
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel={t('capture.header')}
        style={[styles.fab, glow(palette.ember, 'md')]}
      >
        <Mic color={palette.ink} size={28} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: { position: 'absolute' },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ember,
  },
});
