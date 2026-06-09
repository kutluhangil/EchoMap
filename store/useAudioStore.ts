import { create } from 'zustand';

export type AudioMode = 'idle' | 'recording' | 'playing' | 'paused';

interface AudioState {
  mode: AudioMode;
  /** Live amplitude 0..1 — drives the signature sound rings. */
  amplitude: number;
  /** Recording or playback position in ms. */
  positionMs: number;
  activeEchoId?: string;
  setMode: (mode: AudioMode) => void;
  setAmplitude: (amplitude: number) => void;
  setPosition: (positionMs: number) => void;
  setActiveEcho: (id?: string) => void;
  reset: () => void;
}

/** Skeleton. The Sound Keeper drives these from the record/playback engine. */
export const useAudioStore = create<AudioState>((set) => ({
  mode: 'idle',
  amplitude: 0,
  positionMs: 0,
  activeEchoId: undefined,
  setMode: (mode) => set({ mode }),
  setAmplitude: (amplitude) => set({ amplitude }),
  setPosition: (positionMs) => set({ positionMs }),
  setActiveEcho: (activeEchoId) => set({ activeEchoId }),
  reset: () => set({ mode: 'idle', amplitude: 0, positionMs: 0, activeEchoId: undefined }),
}));
