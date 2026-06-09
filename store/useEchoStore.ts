import { create } from 'zustand';

import { deleteWaveform, saveWaveform } from '@/lib/audio/waveform';
import * as repo from '@/lib/db/echoes';
import type { EchoRow } from '@/lib/db/schema';
import { audioUri, deleteAudio, persistRecording } from '@/lib/storage/files';
import { createId } from '@/lib/utils/id';

/** A geotagged sound memory (the SQLite row shape). */
export type Echo = EchoRow;

/** Fields supplied by the capture flow; ids and timestamps are assigned here. */
export interface CreateEchoInput {
  title: string;
  note?: string | null;
  lat: number;
  lng: number;
  locationName?: string | null;
  durationMs: number;
  /** Temporary uri of the just-finished recording, moved into the sandbox. */
  recordingUri: string;
  /** Downsampled amplitude bars for the waveform (persisted as a sidecar). */
  waveform: number[];
}

export interface UpdateEchoInput {
  title?: string;
  note?: string | null;
  locationName?: string | null;
}

interface EchoState {
  echoes: Echo[];
  hydrated: boolean;
  hydrate: () => void;
  getById: (id: string) => Echo | undefined;
  createEcho: (input: CreateEchoInput) => Promise<Echo>;
  updateEcho: (id: string, patch: UpdateEchoInput) => Promise<void>;
  deleteEcho: (id: string) => Promise<void>;
}

/**
 * Source of truth for echoes in the UI. Reads/writes go through the SQLite
 * repository and the audio file store, keeping database, files, and in-memory
 * state consistent. Hydrated once after migrations complete.
 */
export const useEchoStore = create<EchoState>((set, get) => ({
  echoes: [],
  hydrated: false,

  hydrate: () => {
    set({ echoes: repo.listEchoes(), hydrated: true });
  },

  getById: (id) => get().echoes.find((e) => e.id === id),

  createEcho: async (input) => {
    const id = createId();
    // Move the recording into the sandbox before writing the row so a row
    // never references a missing file, then save its waveform sidecar.
    const audioPath = await persistRecording(input.recordingUri, id);
    await saveWaveform(id, input.waveform);
    const now = Date.now();
    const row: Echo = {
      id,
      title: input.title,
      note: input.note ?? null,
      lat: input.lat,
      lng: input.lng,
      locationName: input.locationName ?? null,
      audioPath,
      durationMs: input.durationMs,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    };
    repo.insertEcho(row);
    set((state) => ({ echoes: [row, ...state.echoes] }));
    return row;
  },

  updateEcho: async (id, patch) => {
    const updatedAt = Date.now();
    repo.updateEcho(id, { ...patch, updatedAt });
    set((state) => ({
      echoes: state.echoes.map((e) => (e.id === id ? { ...e, ...patch, updatedAt } : e)),
    }));
  },

  deleteEcho: async (id) => {
    repo.deleteEcho(id);
    await deleteAudio(audioUri(id));
    await deleteWaveform(id);
    set((state) => ({ echoes: state.echoes.filter((e) => e.id !== id) }));
  },
}));
