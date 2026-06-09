import { Redirect } from 'expo-router';

/**
 * App entry. The Globe Smith replaces this with the animated opening globe and
 * the first-launch onboarding routing; for now it lands straight on the map.
 */
export default function Index() {
  return <Redirect href="/(tabs)/map" />;
}
