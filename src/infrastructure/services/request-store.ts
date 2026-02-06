/**
 * Request Store - Promise Deduplication with globalThis
 * Survives hot reloads for React Native development
 */

declare const __DEV__: boolean | undefined;

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

export function createRequestKey(model: string, input: Record<string, unknown>): string {
  const inputStr = JSON.stringify(input, Object.keys(input).sort());
  // Simple hash to avoid collisions from truncation
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

export function storeRequest<T>(key: string, request: ActiveRequest<T>): void {
  getRequestStore().set(key, request);
}

export function removeRequest(key: string): void {
  getRequestStore().delete(key);
}

export function cancelAllRequests(): void {
  const store = getRequestStore();
  store.forEach((req, key) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log(`[RequestStore] Cancelling: ${key}`);
    }
    req.abortController.abort();
  });
  store.clear();
}

export function hasActiveRequests(): boolean {
  return getRequestStore().size > 0;
}
