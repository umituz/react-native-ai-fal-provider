/**
 * Direct FAL Provider Initialization
 * Synchronous initialization for simple app startup
 */

import { providerRegistry } from '@umituz/react-native-ai-generation-content';
import { falProvider } from '../infrastructure/services/fal-provider';

/**
 * Initializes FAL provider and registers it with providerRegistry in one call.
 * Use this for simple synchronous registration at app startup.
 */
export function initializeFalProvider(config: {
  apiKey: string | undefined;
  /** When true (default), sets this provider as the active/default provider */
  setAsActive?: boolean;
}): boolean {
  const { apiKey, setAsActive = true } = config;

  if (!apiKey) {
    return false;
  }

  falProvider.initialize({ apiKey });

  if (!providerRegistry.hasProvider(falProvider.providerId)) {
    providerRegistry.register(falProvider);
  }
  if (setAsActive) {
    providerRegistry.setActiveProvider(falProvider.providerId);
  }

  return true;
}
