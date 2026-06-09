import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export const supportedLanguages = ['en', 'tr'] as const;
export type Language = (typeof supportedLanguages)[number];

const resources = {
  en: { translation: en },
  tr: { translation: tr },
} as const;

/** Device language narrowed to a supported one (English when unsupported). */
function deviceLanguage(): Language {
  const code = Localization.getLocales()[0]?.languageCode ?? 'en';
  return (supportedLanguages as readonly string[]).includes(code) ? (code as Language) : 'en';
}

/**
 * Initialize i18next once. Resources are bundled, so init resolves
 * synchronously and translations are ready on first render. The Aesthetician
 * wires the manual language override (Settings) on top of the device default.
 */
export function initI18n(language?: Language): typeof i18n {
  if (i18n.isInitialized) return i18n;
  void i18n.use(initReactI18next).init({
    resources,
    lng: language ?? deviceLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return i18n;
}

export default i18n;
