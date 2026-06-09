import { create } from 'zustand';

export type SyncStatus = 'disabled' | 'idle' | 'syncing' | 'error';

interface SyncState {
  /** Cloud backup is opt-in; disabled until the user signs in. */
  enabled: boolean;
  status: SyncStatus;
  lastSyncedAt?: number;
  error?: string;
  setEnabled: (enabled: boolean) => void;
  setStatus: (status: SyncStatus) => void;
  setLastSyncedAt: (epochMs: number) => void;
  setError: (error?: string) => void;
}

/** Skeleton. The Data Layer wires this to the optional Supabase sync engine. */
export const useSyncStore = create<SyncState>((set) => ({
  enabled: false,
  status: 'disabled',
  lastSyncedAt: undefined,
  error: undefined,
  setEnabled: (enabled) => set({ enabled, status: enabled ? 'idle' : 'disabled' }),
  setStatus: (status) => set({ status }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
}));
