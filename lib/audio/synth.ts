import * as FileSystem from 'expo-file-system/legacy';

// React Native provides a global `btoa`; declare it so this stays typed.
declare function btoa(data: string): string;

const SAMPLE_RATE = 8000;
const DOCUMENT_DIR = FileSystem.documentDirectory ?? '';
const DIR = `${DOCUMENT_DIR}echoes/`;

/**
 * Build a mono 16-bit PCM WAV of a sine tone as raw bytes. Used to give demo
 * echoes self-contained, license-free audio so the web demo has something to
 * play without bundling sound files. A short fade in/out avoids edge clicks.
 */
export function synthToneWav(freqHz: number, seconds: number): Uint8Array {
  const numSamples = Math.floor(SAMPLE_RATE * seconds);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM fmt chunk size
  view.setUint16(20, 1, true); // audio format: PCM
  view.setUint16(22, 1, true); // channels: mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const fade = SAMPLE_RATE * 0.05;
  for (let i = 0; i < numSamples; i += 1) {
    const env = Math.min(1, i / fade, (numSamples - i) / fade);
    const sample = Math.sin((2 * Math.PI * freqHz * i) / SAMPLE_RATE) * 0.3 * env;
    view.setInt16(44 + i * 2, sample * 0x7fff, true);
  }
  return new Uint8Array(buffer);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Write a synth tone WAV into the echoes dir and return its path. */
export async function writeToneFile(id: string, freqHz: number, seconds = 2): Promise<string> {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  const path = `${DIR}${id}.wav`;
  const base64 = bytesToBase64(synthToneWav(freqHz, seconds));
  await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
  return path;
}
