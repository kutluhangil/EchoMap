import * as Haptics from 'expo-haptics';

/**
 * Centralized haptics so feedback stays consistent and intentional across the
 * app. Each call is fire-and-forget; failures (unsupported devices, web) are
 * swallowed so a missing taptic engine never surfaces as an error.
 */
function run(action: () => Promise<void>): void {
  action().catch(() => {});
}

export const haptics = {
  /** Light tap — taps, selections, secondary actions. */
  light: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Medium tap — primary actions, record start/stop. */
  medium: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** Heavy tap — significant moments. */
  heavy: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  selection: () => run(() => Haptics.selectionAsync()),
  /** Saved an echo, completed a flow. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Destructive confirmation (delete). */
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
