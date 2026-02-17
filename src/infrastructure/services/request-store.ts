/**
 * Request Store - Promise Deduplication with globalThis
 * Survives hot reloads for React Native development
 *
 * React Native is single-threaded - no lock mechanism needed.
 * Direct Map operations are atomic in JS event loop.
 */

export interface ActiveRequest<T = unknown> {
  promise: Promise<T>;
  abortController: AbortController;
  createdAt: number;
}

const STORE_KEY = "__FAL_PROVIDER_REQUESTS__";
const TIMER_KEY = "__FAL_PROVIDER_CLEANUP_TIMER__";
type RequestStore = Map<string, ActiveRequest>;

const CLEANUP_INTERVAL = 60000; // 1 minute
const MAX_REQUEST_AGE = 300000; // 5 minutes

function getCleanupTimer(): ReturnType<typeof setInterval> | null {
  const globalObj = globalThis as Record<string, unknown>;
  return (globalObj[TIMER_KEY] as ReturnType<typeof setInterval>) ?? null;
}

function setCleanupTimer(timer: ReturnType<typeof setInterval> | null): void {
  const globalObj = globalThis as Record<string, unknown>;
  globalObj[TIMER_KEY] = timer;
}

export function getRequestStore(): RequestStore {
  const globalObj = globalThis as Record<string, unknown>;
  if (!globalObj[STORE_KEY]) {
    globalObj[STORE_KEY] = new Map();
  }
  return globalObj[STORE_KEY] as RequestStore;
}

/**
 * Create a deterministic request key using model and input hash
 */
export function createRequestKey(model: string, input: Record<string, unknown>): string {
  const inputStr = JSON.stringify(input, Object.keys(input).sort());
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `${model}:${hash.toString(36)}`;
}

export function getExistingRequest<T>(key: string): ActiveRequest<T> | undefined {
  return getRequestStore().get(key) as ActiveRequest<T> | undefined;
}

/**
 * Store a request for deduplication
 * RN is single-threaded - no lock needed, Map.set is synchronous
 */
export function storeRequest<T>(key: string, request: ActiveRequest<T>): void {
  getRequestStore().set(key, {
    ...request,
    createdAt: request.createdAt ?? Date.now(),
  });
  ensureCleanupRunning();
}

export function removeRequest(key: string): void {
  const store = getRequestStore();
  store.delete(key);
  // Don't stop timer here - let the cleanup interval handle it
  // This prevents the race where a new request arrives right after we stop
}

export function cancelAllRequests(): void {
  const store = getRequestStore();
  store.forEach((req) => {
    req.abortController.abort();
  });
  store.clear();
  stopCleanupTimer();
}

export function hasActiveRequests(): boolean {
  return getRequestStore().size > 0;
}

/**
 * Clean up stale requests from the store
 * @returns Number of requests cleaned up
 */
export function cleanupRequestStore(maxAge: number = MAX_REQUEST_AGE): number {
  const store = getRequestStore();
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, request] of store.entries()) {
    if (now - request.createdAt > maxAge) {
      request.abortController.abort();
      store.delete(key);
      cleanedCount++;
    }
  }

  // Stop timer only inside the interval callback when store is truly empty
  if (store.size === 0) {
    stopCleanupTimer();
  }

  return cleanedCount;
}

/**
 * Ensure cleanup timer is running (idempotent)
 */
function ensureCleanupRunning(): void {
  if (getCleanupTimer()) return;

  const timer = setInterval(() => {
    cleanupRequestStore(MAX_REQUEST_AGE);
  }, CLEANUP_INTERVAL);

  setCleanupTimer(timer);
}

function stopCleanupTimer(): void {
  const timer = getCleanupTimer();
  if (timer) {
    clearInterval(timer);
    setCleanupTimer(null);
  }
}

/**
 * Stop automatic cleanup (for app shutdown)
 */
export function stopAutomaticCleanup(): void {
  stopCleanupTimer();
}

// Clear any leftover timer on module load (hot reload safety)
if (typeof globalThis !== "undefined") {
  const existingTimer = getCleanupTimer();
  if (existingTimer) {
    clearInterval(existingTimer);
    setCleanupTimer(null);
  }
}
