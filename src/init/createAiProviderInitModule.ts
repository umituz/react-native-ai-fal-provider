/**
 * AI Provider Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

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
          return Promise.resolve(false);
        }

        falProvider.initialize({
          apiKey,
          videoFeatureModels,
          imageFeatureModels,
        });

        return Promise.resolve(true);
      } catch (error) {
        return Promise.resolve(false);
      }
    },
  };
}
