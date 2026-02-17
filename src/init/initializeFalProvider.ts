/**
 * Direct FAL Provider Initialization
 * Synchronous initialization for simple app startup
 */

import { providerRegistry } from '@umituz/react-native-ai-generation-content';
import { falProvider } from '../infrastructure/services';

/**
 * Initializes FAL provider and registers it with providerRegistry in one call.
 * Use this for simple synchronous registration at app startup.
 */
export function initializeFalProvider(config: {
  apiKey: string | undefined;
}): boolean {
  try {
    const { apiKey } = config;

    if (!apiKey) {
      return false;
    }

    falProvider.initialize({ apiKey });

    if (!providerRegistry.hasProvider(falProvider.providerId)) {
      providerRegistry.register(falProvider);
    }
    providerRegistry.setActiveProvider(falProvider.providerId);

    return true;
  } catch {
    return false;
  }
}
