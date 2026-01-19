/**
 * Services Index
 */

import { falProvider } from "./fal-provider";

export { FalProvider, falProvider } from "./fal-provider";
export type { FalProvider as FalProviderType } from "./fal-provider";
export { falModelsService, type FalModelConfig } from "./fal-models.service";
export { NSFWContentError } from "./nsfw-content-error";

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
