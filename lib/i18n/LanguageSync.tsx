import { useEffect } from 'react';

import { setLanguage } from '@/lib/i18n';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * Keeps i18next in sync with the persisted language preference. Renders
 * nothing; mounted once near the provider root.
 */
export function LanguageSync() {
  const language = useSettingsStore((s) => s.language);
  useEffect(() => {
    setLanguage(language);
  }, [language]);
  return null;
}
