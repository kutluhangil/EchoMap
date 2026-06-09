import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';

import { listEchoes } from '@/lib/db/echoes';
import { readAudioBase64 } from './files';

/**
 * Export every echo as a single zip — `echoes.json` metadata plus the audio
 * files — and hand it to the system share sheet. Gives users a portable,
 * local-first backup without any account.
 */
export async function exportEchoes(): Promise<void> {
  const rows = listEchoes();
  const zip = new JSZip();
  zip.file('echoes.json', JSON.stringify(rows, null, 2));

  const audio = zip.folder('audio');
  for (const row of rows) {
    try {
      const base64 = await readAudioBase64(row.audioPath);
      audio?.file(`${row.id}.m4a`, base64, { base64: true });
    } catch {
      // Skip rows whose audio file is missing rather than failing the export.
    }
  }

  const content = await zip.generateAsync({ type: 'base64' });
  const outUri = `${FileSystem.cacheDirectory ?? ''}echo-map-export.zip`;
  await FileSystem.writeAsStringAsync(outUri, content, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(outUri, {
      mimeType: 'application/zip',
      dialogTitle: 'Export echoes',
    });
  }
}
