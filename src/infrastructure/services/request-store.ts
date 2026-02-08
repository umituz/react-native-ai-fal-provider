/**
 * Request Store - Promise Deduplication with globalThis
 * Survives hot reloads for React Native development
 */

export interface ActiveRequest<T = unknown> {
  promise: Promise<T>;
  abortController: AbortController;
}

const STORE_KEY = "__FAL_PROVIDER_REQUESTS__";
type RequestStore = Map<string, ActiveRequest>;

export function getRequestStore(): RequestStore {
  if (!(globalThis as Record<string, unknown>)[STORE_KEY]) {
    (globalThis as Record<string, unknown>)[STORE_KEY] = new Map();
  }
  return (globalThis as Record<string, unknown>)[STORE_KEY] as RequestStore;
}

/**
 * Create a deterministic request key using model and input hash
 * Same model + input will always produce the same key for deduplication
 */
export function createRequestKey(model: string, input: Record<string, unknown>): string {
  const inputStr = JSON.stringify(input, Object.keys(input).sort());
  // Use DJB2 hash for input fingerprinting
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Return deterministic key without unique ID
  // This allows proper deduplication: same model + input = same key
  return `${model}:${hash.toString(36)}`;
}

export function getExistingRequest<T>(key: string): ActiveRequest<T> | undefined {
  return getRequestStore().get(key) as ActiveRequest<T> | undefined;
}

export function storeRequest<T>(key: string, request: ActiveRequest<T>): void {
  getRequestStore().set(key, request);
}

export function removeRequest(key: string): void {
  getRequestStore().delete(key);
}

export function cancelAllRequests(): void {
  const store = getRequestStore();
  store.forEach((req) => {
    req.abortController.abort();
  });
  store.clear();
}

export function hasActiveRequests(): boolean {
  return getRequestStore().size > 0;
}

/**
 * Clean up completed/stale requests from the store
 * Should be called periodically to prevent memory leaks
 *
 * Note: This is a placeholder for future implementation.
 * Currently, requests are cleaned up automatically when they complete.
 */
export function cleanupRequestStore(_maxAge: number = 300000): void {
  const store = getRequestStore();

  // Requests are automatically removed when they complete (via finally block)
  // This function exists for future enhancements like time-based cleanup
  if (store.size > 50) {
    // Store size exceeds threshold - indicates potential memory leak
  }
}
