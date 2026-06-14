const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

/**
 * The single seam for error reporting. Today it logs in development; it's also
 * the one place to wire a crash reporter (Sentry) for production. Kept
 * dependency-free until a DSN is set so the local-first build never ships an
 * SDK it isn't using — add `@sentry/react-native` and capture below when ready.
 */
export function report(error: unknown, context?: Record<string, unknown>): void {
  if (__DEV__) {
    console.error('[report]', error, context ?? {});
  }
  if (SENTRY_DSN) {
    // Sentry.captureException(error, { extra: context });
  }
}

/** Whether a production reporter is configured (drives opt-in UI later). */
export const isReportingEnabled = SENTRY_DSN.length > 0;
