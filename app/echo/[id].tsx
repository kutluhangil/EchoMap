import { useEffect, useRef, useState } from 'react';
import * as Sharing from 'expo-sharing';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Pencil, Share2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Player } from '@/components/audio/Player';
import { FadeIn } from '@/components/motion/FadeIn';
import { SharedElement } from '@/components/motion/SharedElement';
import { Button, Field, Pressable, Sheet, Text, type SheetRef } from '@/components/ui';
import { loadWaveform } from '@/lib/audio/waveform';
import { haptics } from '@/lib/utils/haptics';
import { formatCoordinates, formatDate } from '@/lib/utils/format';
import { useEchoStore } from '@/store/useEchoStore';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Pin detail: the recording played back through the signature sound rings, the
 * place and date in mono type, the memory note, and edit/delete/share. The
 * Motion Director adds the shared-element transition from the map pin.
 */
export default function EchoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();

  const echo = useEchoStore((s) => s.echoes.find((e) => e.id === id));
  const updateEcho = useEchoStore((s) => s.updateEcho);
  const deleteEcho = useEchoStore((s) => s.deleteEcho);

  const [waveform, setWaveform] = useState<number[] | null>(null);
  const sheetRef = useRef<SheetRef>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (id) {
      void loadWaveform(id).then(setWaveform);
    }
  }, [id]);

  if (!echo) {
    return (
      <View style={[styles.fill, styles.center, { backgroundColor: colors.background }]}>
        <Text variant="body" color="textMuted">
          {t('detail.notFound')}
        </Text>
      </View>
    );
  }

  const openEdit = () => {
    setEditTitle(echo.title);
    setEditNote(echo.note ?? '');
    sheetRef.current?.present();
  };

  const saveEdit = async () => {
    await updateEcho(echo.id, {
      title: editTitle.trim() || echo.title,
      note: editNote.trim() || null,
    });
    haptics.success();
    sheetRef.current?.dismiss();
  };

  const confirmDelete = () => {
    Alert.alert(t('detail.deleteTitle'), t('detail.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          haptics.warning();
          await deleteEcho(echo.id);
          router.back();
        },
      },
    ]);
  };

  const share = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(echo.audioPath, { mimeType: 'audio/m4a', dialogTitle: echo.title });
    }
  };

  return (
    <View style={[styles.fill, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: space.md }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={t('common.close')}
          style={styles.iconButton}
        >
          <ChevronLeft color={colors.text} size={26} />
        </Pressable>
        <Pressable onPress={share} accessibilityLabel={t('common.share')} style={styles.iconButton}>
          <Share2 color={colors.textMuted} size={22} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { padding: space.xl, gap: space.lg }]}>
        <FadeIn style={{ gap: 4 }}>
          <Text variant="title">{echo.title}</Text>
          <Text variant="data" color="textMuted">
            {formatDate(echo.createdAt, i18n.language)}
            {echo.locationName ? ` · ${echo.locationName}` : ''}
          </Text>
          <Text variant="data" color="textFaint">
            {formatCoordinates(echo.lat, echo.lng)}
          </Text>
        </FadeIn>

        {waveform ? (
          <SharedElement style={styles.center}>
            <Player uri={echo.audioPath} waveform={waveform} durationMs={echo.durationMs} />
          </SharedElement>
        ) : null}

        {echo.note ? (
          <Text variant="body" color="textMuted">
            {echo.note}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={t('common.edit')}
            variant="secondary"
            icon={<Pencil color={colors.text} size={16} strokeWidth={1.5} />}
            onPress={openEdit}
            style={styles.action}
          />
          <Button
            label={t('common.delete')}
            variant="ghost"
            onPress={confirmDelete}
            style={styles.action}
          />
        </View>
      </ScrollView>

      <Sheet ref={sheetRef}>
        <View style={{ gap: space.lg }}>
          <Text variant="heading">{t('common.edit')}</Text>
          <Field label={t('capture.titleLabel')} value={editTitle} onChangeText={setEditTitle} />
          <Field
            label={t('capture.noteLabel')}
            value={editNote}
            onChangeText={setEditNote}
            multiline
          />
          <Button label={t('common.save')} onPress={saveEdit} fullWidth />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  body: { gap: 16 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1 },
});
