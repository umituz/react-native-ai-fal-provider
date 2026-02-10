/**
 * Services Index
 */

import { falProvider } from "./fal-provider";

export { FalProvider, falProvider } from "./fal-provider";
export type { FalProvider as FalProviderType } from "./fal-provider";
export { falModelsService, type FalModelConfig, type ModelSelectionResult } from "./fal-models.service";
export { NSFWContentError } from "./nsfw-content-error";

// Request store exports for advanced use cases
export {
  createRequestKey,
  getExistingRequest,
  storeRequest,
  removeRequest,
  cancelAllRequests,
  hasActiveRequests,
  cleanupRequestStore,
  stopAutomaticCleanup,
} from "./request-store";
export type { ActiveRequest } from "./request-store";

/**
 * Cancel the current running FAL request
 */
export function cancelCurrentFalRequest(): void {
  falProvider.cancelCurrentRequest();
}

/**
 * Check if there's a running FAL request
 */
export function hasRunningFalRequest(): boolean {
  return falProvider.hasRunningRequest();
}
