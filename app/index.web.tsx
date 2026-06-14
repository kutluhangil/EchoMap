import { LandingHero } from '@/components/landing/LandingHero';

/**
 * Web entry. The native app opens on the 3D globe and routes into onboarding;
 * the web build is a public demo, so it opens on a cinematic landing instead
 * (Expo Router resolves this `.web` file over `index.tsx` on web).
 */
export default function WebIndex() {
  return <LandingHero />;
}
