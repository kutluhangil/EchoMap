import { useCallback } from 'react';
import { router } from 'expo-router';

import { OpeningGlobe } from '@/components/globe/OpeningGlobe';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * App entry. Plays the opening globe, then routes to onboarding on first launch
 * or straight to the map afterwards.
 */
export default function Index() {
  const onboarded = useSettingsStore((s) => s.onboarded);

  const handleFinish = useCallback(() => {
    router.replace(onboarded ? '/(tabs)/map' : '/onboarding');
  }, [onboarded]);

  return <OpeningGlobe onFinish={handleFinish} />;
}
