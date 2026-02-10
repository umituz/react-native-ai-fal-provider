/**
 * Request Store - Promise Deduplication with globalThis
 * Survives hot reloads for React Native development
 */

export interface ActiveRequest<T = unknown> {
  promise: Promise<T>;
  abortController: AbortController;
  createdAt: number;
}

const STORE_KEY = "__FAL_PROVIDER_REQUESTS__";
type RequestStore = Map<string, ActiveRequest>;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;
const CLEANUP_INTERVAL = 60000; // 1 minute
const MAX_REQUEST_AGE = 300000; // 5 minutes

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
  const requestWithTimestamp = {
    ...request,
    createdAt: request.createdAt ?? Date.now(),
  };
  getRequestStore().set(key, requestWithTimestamp);

  // Start automatic cleanup if not already running
  startAutomaticCleanup();
}

export function removeRequest(key: string): void {
  const store = getRequestStore();
  store.delete(key);

  // Stop cleanup timer if store is empty
  if (store.size === 0 && cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

export function cancelAllRequests(): void {
  const store = getRequestStore();
  store.forEach((req) => {
    req.abortController.abort();
  });
  store.clear();

  // Stop cleanup timer
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

export function hasActiveRequests(): boolean {
  return getRequestStore().size > 0;
}

/**
 * Clean up completed/stale requests from the store
 * Should be called periodically to prevent memory leaks
 *
 * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns Number of requests cleaned up
 */
export function cleanupRequestStore(maxAge: number = MAX_REQUEST_AGE): number {
  const store = getRequestStore();
  const now = Date.now();
  let cleanedCount = 0;

  // Track stale requests
  const staleKeys: string[] = [];

  for (const [key, request] of store.entries()) {
    const requestAge = now - request.createdAt;

    // Clean up stale requests that exceed max age
    if (requestAge > maxAge) {
      staleKeys.push(key);
    }
  }

  // Remove stale requests
  for (const key of staleKeys) {
    const request = store.get(key);
    if (request) {
      request.abortController.abort();
      store.delete(key);
      cleanedCount++;
    }
  }

  // Stop cleanup timer if store is empty
  if (store.size === 0 && cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }

  return cleanedCount;
}

/**
 * Start automatic cleanup of stale requests
 * Runs periodically to prevent memory leaks
 */
function startAutomaticCleanup(): void {
  if (cleanupTimer) {
    return; // Already running
  }

  cleanupTimer = setInterval(() => {
    const cleanedCount = cleanupRequestStore(MAX_REQUEST_AGE);
    if (cleanedCount > 0) {
      // Cleanup was performed
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Stop automatic cleanup (typically on app shutdown)
 */
export function stopAutomaticCleanup(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}
