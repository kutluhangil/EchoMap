import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export const supportedLanguages = ['en', 'tr'] as const;
export type Language = (typeof supportedLanguages)[number];
export type LanguagePreference = 'system' | Language;

const resources = {
  en: { translation: en },
  tr: { translation: tr },
} as const;

/** Device language narrowed to a supported one (English when unsupported). */
export function deviceLanguage(): Language {
  const code = Localization.getLocales()[0]?.languageCode ?? 'en';
  return (supportedLanguages as readonly string[]).includes(code) ? (code as Language) : 'en';
}

/** Resolve a stored preference ('system' or a language) to a concrete one. */
export function resolveLanguage(preference: LanguagePreference): Language {
  return preference === 'system' ? deviceLanguage() : preference;
}

/**
 * Initialize i18next once. Resources are bundled, so init resolves
 * synchronously and translations are ready on first render.
 */
export function initI18n(preference: LanguagePreference = 'system'): typeof i18n {
  if (i18n.isInitialized) return i18n;
  void i18n.use(initReactI18next).init({
    resources,
    lng: resolveLanguage(preference),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return i18n;
}

/** Apply a language preference, switching the active language if it changed. */
export function setLanguage(preference: LanguagePreference): void {
  const next = resolveLanguage(preference);
  if (i18n.language !== next) void i18n.changeLanguage(next);
}

export default i18n;
