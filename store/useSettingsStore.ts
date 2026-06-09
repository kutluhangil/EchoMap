import { create } from 'zustand';

import type { Language } from '@/lib/i18n';

export type ThemePreference = 'system' | 'light' | 'dark';
export type LanguagePreference = 'system' | Language;

interface SettingsState {
  theme: ThemePreference;
  language: LanguagePreference;
  onboarded: boolean;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: LanguagePreference) => void;
  setOnboarded: (onboarded: boolean) => void;
}

/**
 * Skeleton. The Aesthetician persists these to MMKV and connects theme and
 * language to their providers; the defaults here keep first launch sensible
 * (follow the system, not yet onboarded).
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  language: 'system',
  onboarded: false,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setOnboarded: (onboarded) => set({ onboarded }),
}));
