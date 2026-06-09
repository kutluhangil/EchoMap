import { useCallback, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { MapPin, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Recorder, type RecordingResult } from '@/components/audio/Recorder';
import { Waveform } from '@/components/audio/Waveform';
import { Button, Field, Pressable, Text } from '@/components/ui';
import { getCurrentCoordinates, type Coordinates } from '@/lib/location/geo';
import { reverseGeocode } from '@/lib/location/reverse-geocode';
import { haptics } from '@/lib/utils/haptics';
import { useEchoStore } from '@/store/useEchoStore';
import { useTheme } from '@/theme/ThemeProvider';

interface LocationInfo {
  coords: Coordinates;
  name: string | null;
}

/**
 * Capture flow: record an ambient moment, automatically find where it happened,
 * give it a title and an optional memory, and save. Few steps, feeling-first.
 */
export default function NewEcho() {
  const { t } = useTranslation();
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();
  const createEcho = useEchoStore((s) => s.createEcho);

  const [recording, setRecording] = useState<RecordingResult | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [locating, setLocating] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLocation = useCallback(async () => {
    setLocating(true);
    const coords = await getCurrentCoordinates();
    if (coords) {
      const name = await reverseGeocode(coords.lat, coords.lng);
      setLocation({ coords, name });
      setTitle((current) => current || name || '');
    }
    setLocating(false);
  }, []);

  const handleRecorded = useCallback(
    (result: RecordingResult) => {
      setRecording(result);
      void fetchLocation();
    },
    [fetchLocation],
  );

  const discard = useCallback(async () => {
    if (recording) {
      await FileSystem.deleteAsync(recording.uri, { idempotent: true });
    }
    router.back();
  }, [recording]);

  const save = useCallback(async () => {
    if (!recording || !location) return;
    setSaving(true);
    try {
      await createEcho({
        title: title.trim() || location.name || t('capture.untitled'),
        note: note.trim() || null,
        lat: location.coords.lat,
        lng: location.coords.lng,
        locationName: location.name,
        durationMs: recording.durationMs,
        recordingUri: recording.uri,
        waveform: recording.waveform,
      });
      haptics.success();
      router.back();
    } catch {
      setSaving(false);
      Alert.alert(t('errors.saveFailed'));
    }
  }, [recording, location, title, note, createEcho, t]);

  const header = (onClose: () => void) => (
    <View style={[styles.header, { paddingHorizontal: space.md }]}>
      <Text variant="heading">{t('capture.header')}</Text>
      <Pressable onPress={onClose} accessibilityLabel={t('common.close')} style={styles.iconButton}>
        <X color={colors.textMuted} size={24} />
      </Pressable>
    </View>
  );

  if (!recording) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        {header(() => router.back())}
        <View style={styles.center}>
          <Recorder
            onComplete={handleRecorded}
            onPermissionDenied={() =>
              Alert.alert(t('errors.micDenied.title'), t('errors.micDenied.body'))
            }
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.fill, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {header(discard)}
      <ScrollView
        contentContainerStyle={[styles.body, { padding: space.xl, gap: space.lg }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.waveform}>
          <Waveform
            bars={recording.waveform}
            progress={1}
            width={320}
            activeColor={colors.accent}
          />
        </View>

        <View style={styles.location}>
          <MapPin color={colors.textMuted} size={16} strokeWidth={1.5} />
          {locating ? (
            <Text variant="data" color="textMuted">
              {t('capture.locating')}
            </Text>
          ) : location ? (
            <Text variant="data" color="textMuted">
              {location.name ??
                `${location.coords.lat.toFixed(4)}, ${location.coords.lng.toFixed(4)}`}
            </Text>
          ) : (
            <Pressable onPress={fetchLocation} haptic="light">
              <Text variant="data" color="accent">
                {t('capture.allowLocation')}
              </Text>
            </Pressable>
          )}
        </View>

        <Field
          label={t('capture.titleLabel')}
          placeholder={t('capture.titlePlaceholder')}
          value={title}
          onChangeText={setTitle}
        />
        <Field
          label={t('capture.noteLabel')}
          placeholder={t('capture.notePlaceholder')}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </ScrollView>

      <View style={[styles.footer, { padding: space.xl, paddingBottom: insets.bottom + space.lg }]}>
        <Button
          label={saving ? t('capture.saving') : t('capture.save')}
          onPress={save}
          loading={saving}
          disabled={!location}
          fullWidth
        />
        <Button label={t('capture.discard')} onPress={discard} variant="ghost" fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { alignItems: 'center' },
  waveform: { height: 80, justifyContent: 'center' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footer: { gap: 12 },
});
