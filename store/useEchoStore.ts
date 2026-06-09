import { create } from 'zustand';

/** A geotagged sound memory. Mirrors the Drizzle `echoes` row (Data Layer). */
export interface Echo {
  id: string;
  title: string;
  note?: string | null;
  lat: number;
  lng: number;
  locationName?: string | null;
  audioPath: string;
  durationMs: number;
  createdAt: number;
  syncedAt?: number | null;
}

interface EchoState {
  echoes: Echo[];
  hydrated: boolean;
  setEchoes: (echoes: Echo[]) => void;
  upsert: (echo: Echo) => void;
  remove: (id: string) => void;
}

/**
 * Skeleton store. The Data Layer connects these actions to Drizzle/SQLite and
 * the audio file store; for now they hold in-memory state only. Echoes are
 * kept newest-first to match the timeline.
 */
export const useEchoStore = create<EchoState>((set) => ({
  echoes: [],
  hydrated: false,
  setEchoes: (echoes) => set({ echoes, hydrated: true }),
  upsert: (echo) =>
    set((state) => ({ echoes: [echo, ...state.echoes.filter((e) => e.id !== echo.id)] })),
  remove: (id) => set((state) => ({ echoes: state.echoes.filter((e) => e.id !== id) })),
}));
