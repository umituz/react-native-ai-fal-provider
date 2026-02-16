/**
 * AI Provider Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import { providerRegistry } from '@umituz/react-native-ai-generation-content';
import { falProvider } from '../infrastructure/services';

/**
 * InitModule interface (from @umituz/react-native-design-system)
 */
export interface InitModule {
  name: string;
  init: () => Promise<boolean>;
  critical?: boolean;
  dependsOn?: string[];
}

export interface AiProviderInitModuleConfig {
  /**
   * FAL AI API key getter function
   * Returns the API key or undefined if not available
   */
  getApiKey: () => string | undefined;

  /**
   * Whether this module is critical for app startup
   * @default false
   */
  critical?: boolean;

  /**
   * Module dependencies
   * @default ["firebase"]
   */
  dependsOn?: string[];

  /**
   * Optional callback called after provider is initialized
   */
  onInitialized?: () => void;
}

/**
 * Creates an AI Provider initialization module for use with createAppInitializer
 *
 * @example
 * ```typescript
 * import { createAppInitializer } from "@umituz/react-native-design-system";
 * import { createFirebaseInitModule } from "@umituz/react-native-firebase";
 * import { createAiProviderInitModule } from "@umituz/react-native-ai-fal-provider";
 *
 * export const initializeApp = createAppInitializer({
 *   modules: [
 *     createFirebaseInitModule(),
 *     createAiProviderInitModule({
 *       getApiKey: () => getFalApiKey(),
 *     }),
 *   ],
 * });
 * ```
 */
export function createAiProviderInitModule(
  config: AiProviderInitModuleConfig
): InitModule {
  const {
    getApiKey,
    critical = false,
    dependsOn = ['firebase'],
    onInitialized,
  } = config;

  return {
    name: 'aiProviders',
    critical,
    dependsOn,
    init: () => {
      try {
        const apiKey = getApiKey();

        if (!apiKey) {
          return Promise.resolve(false);
        }

        // Initialize FAL provider
        falProvider.initialize({ apiKey });

        // Register with providerRegistry automatically
        if (!providerRegistry.hasProvider(falProvider.providerId)) {
          providerRegistry.register(falProvider);
        }
        providerRegistry.setActiveProvider(falProvider.providerId);

        if (onInitialized) {
          onInitialized();
        }

        return Promise.resolve(true);
      } catch (error) {
        return Promise.resolve(false);
      }
    },
  };
}

/**
 * Initializes FAL provider and registers it with providerRegistry in one call.
 * Use this for simple synchronous registration at app startup.
 *
 * @example
 * ```typescript
 * // registerProviders.ts - that's all you need!
 * import { initializeFalProvider } from "@umituz/react-native-ai-fal-provider";
 * import { getFalApiKey } from "@/core/utils/env";
 *
 * export function registerProviders(): void {
 *   initializeFalProvider({ apiKey: getFalApiKey() });
 * }
 * ```
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
