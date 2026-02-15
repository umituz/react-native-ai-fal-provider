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
const LOCK_KEY = "__FAL_PROVIDER_REQUESTS_LOCK__";
const TIMER_KEY = "__FAL_PROVIDER_CLEANUP_TIMER__";
type RequestStore = Map<string, ActiveRequest>;

const CLEANUP_INTERVAL = 60000; // 1 minute
const MAX_REQUEST_AGE = 300000; // 5 minutes

/**
 * Get cleanup timer from globalThis to survive hot reloads
 */
function getCleanupTimer(): ReturnType<typeof setInterval> | null {
  const globalObj = globalThis as Record<string, unknown>;
  return (globalObj[TIMER_KEY] as ReturnType<typeof setInterval>) ?? null;
}

/**
 * Set cleanup timer in globalThis to survive hot reloads
 */
function setCleanupTimer(timer: ReturnType<typeof setInterval> | null): void {
  const globalObj = globalThis as Record<string, unknown>;
  globalObj[TIMER_KEY] = timer;
}

/**
 * Simple lock mechanism to prevent concurrent access issues
 * NOTE: This is not a true mutex but provides basic protection for React Native
 */
function acquireLock(): boolean {
  const globalObj = globalThis as Record<string, unknown>;
  if (globalObj[LOCK_KEY]) {
    return false; // Lock already held
  }
  globalObj[LOCK_KEY] = true;
  return true;
}

function releaseLock(): void {
  const globalObj = globalThis as Record<string, unknown>;
  globalObj[LOCK_KEY] = false;
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
  // Acquire lock for consistent operation
  // React Native is single-threaded, but this prevents re-entrancy issues
  const maxRetries = 10;
  let retries = 0;

  // Spin-wait loop (synchronous)
  // Note: Does NOT yield to event loop - tight loop
  // In practice, this rarely loops due to single-threaded nature of React Native
  while (!acquireLock() && retries < maxRetries) {
    retries++;
  }

  if (retries >= maxRetries) {
    // Lock acquisition failed - this shouldn't happen in normal operation
    // Log warning but proceed anyway since RN is single-threaded
    console.warn(
      `[request-store] Failed to acquire lock after ${maxRetries} attempts for key: ${key}. ` +
      'Proceeding anyway (safe in single-threaded environment)'
    );
  }

  try {
    const requestWithTimestamp = {
      ...request,
      createdAt: request.createdAt ?? Date.now(),
    };
    getRequestStore().set(key, requestWithTimestamp);

    // Start automatic cleanup if not already running
    startAutomaticCleanup();
  } finally {
    // Always release lock, even if we didn't successfully acquire it
    // to prevent deadlocks
    releaseLock();
  }
}

export function removeRequest(key: string): void {
  const store = getRequestStore();
  store.delete(key);

  // Stop cleanup timer if store is empty
  if (store.size === 0) {
    const timer = getCleanupTimer();
    if (timer) {
      clearInterval(timer);
      setCleanupTimer(null);
    }
  }
}

export function cancelAllRequests(): void {
  const store = getRequestStore();
  store.forEach((req) => {
    req.abortController.abort();
  });
  store.clear();

  // Stop cleanup timer
  const timer = getCleanupTimer();
  if (timer) {
    clearInterval(timer);
    setCleanupTimer(null);
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
  if (store.size === 0) {
    const timer = getCleanupTimer();
    if (timer) {
      clearInterval(timer);
      setCleanupTimer(null);
    }
  }

  return cleanedCount;
}

/**
 * Start automatic cleanup of stale requests
 * Runs periodically to prevent memory leaks
 * Uses globalThis to survive hot reloads in React Native
 */
function startAutomaticCleanup(): void {
  const existingTimer = getCleanupTimer();
  if (existingTimer) {
    return; // Already running
  }

  const timer = setInterval(() => {
    const cleanedCount = cleanupRequestStore(MAX_REQUEST_AGE);
    const store = getRequestStore();

    // Stop timer if no more requests in store (prevents indefinite timer)
    if (store.size === 0) {
      const currentTimer = getCleanupTimer();
      if (currentTimer) {
        clearInterval(currentTimer);
        setCleanupTimer(null);
      }
    }

    if (cleanedCount > 0) {
      console.log(`[request-store] Cleaned up ${cleanedCount} stale request(s)`);
    }
  }, CLEANUP_INTERVAL);

  setCleanupTimer(timer);
}

/**
 * Stop automatic cleanup (typically on app shutdown or hot reload)
 * Clears the global timer to prevent memory leaks
 */
export function stopAutomaticCleanup(): void {
  const timer = getCleanupTimer();
  if (timer) {
    clearInterval(timer);
    setCleanupTimer(null);
  }
}

// Clean up any existing timer on module load to prevent leaks during hot reload
// This ensures old timers are cleared when the module is reloaded in development
if (typeof globalThis !== "undefined") {
  const existingTimer = getCleanupTimer();
  if (existingTimer) {
    clearInterval(existingTimer);
    setCleanupTimer(null);
  }
}
