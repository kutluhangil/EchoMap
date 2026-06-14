/**
 * Resolve with `fallback` if `promise` hasn't settled within `ms`. Rejections
 * also resolve to `fallback` — callers that use this treat failure and timeout
 * the same way (a missing value, never a thrown error). Used to keep location
 * lookups from hanging the capture flow indefinitely.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    let settled = false;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(fallback), ms);
    promise.then(finish, () => finish(fallback));
  });
}
