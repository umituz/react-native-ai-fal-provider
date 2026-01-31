/**
 * AI Provider Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import { falProvider } from '../infrastructure/services';
import { providerRegistry } from '@umituz/react-native-ai-generation-content';

declare const __DEV__: boolean;

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
   * Video feature models mapping
   * Maps feature types to FAL model IDs
   */
  videoFeatureModels?: Record<string, string>;

  /**
   * Image feature models mapping
   * Maps feature types to FAL model IDs
   */
  imageFeatureModels?: Record<string, string>;

  /**
   * Provider ID to use
   * @default "fal"
   */
  providerId?: string;

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
 *       videoFeatureModels: {
 *         "image-to-video": "fal-ai/wan-25-preview/image-to-video",
 *         "text-to-video": "fal-ai/wan-25-preview/text-to-video",
 *       },
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
    videoFeatureModels,
    imageFeatureModels,
    providerId = 'fal',
    critical = false,
    dependsOn = ['firebase'],
  } = config;

  return {
    name: 'aiProviders',
    critical,
    dependsOn,
    init: () => {
      try {
        const apiKey = getApiKey();

        if (!apiKey) {
          if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.log('[createAiProviderInitModule] No API key - skipping');
          }
          return Promise.resolve(true); // Not an error, just skip
        }

        // Initialize FAL provider
        falProvider.initialize({
          apiKey,
          videoFeatureModels,
          imageFeatureModels,
        });

        // Register and set as active
        providerRegistry.register(falProvider);
        providerRegistry.setActiveProvider(providerId);

        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.log('[createAiProviderInitModule] AI provider initialized');
        }

        return Promise.resolve(true);
      } catch (error) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.error('[createAiProviderInitModule] Error:', error);
        }
        // Continue on error - AI provider is not critical
        return Promise.resolve(true);
      }
    },
  };
}
