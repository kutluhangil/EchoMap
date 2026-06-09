import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Language } from '@/lib/i18n';
import { zustandMMKVStorage } from '@/lib/storage/kv';

export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | Language;

interface SettingsState {
  theme: ThemePreference;
  language: LanguagePreference;
  onboarded: boolean;
  /** True once persisted preferences have been read from storage. */
  hasHydrated: boolean;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
  setOnboarded: (onboarded: boolean) => void;
}

/**
 * Theme, language, and onboarding preferences, persisted to MMKV. MMKV is
 * synchronous, so persisted values are present almost immediately and the UI
 * avoids a theme/language flash on launch.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'system',
      onboarded: false,
      hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setOnboarded: (onboarded) => set({ onboarded }),
    }),
    {
      name: 'echo-settings',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (s) => ({ theme: s.theme, language: s.language, onboarded: s.onboarded }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ hasHydrated: true });
      },
    },
  ),
);
