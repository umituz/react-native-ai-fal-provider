/**
 * Wizard Flow Registration Helper
 * Use this when your app uses GenericWizardFlow from @umituz/react-native-ai-generation-content
 */

import { falProvider } from '../infrastructure/services';

/**
 * Register FAL provider with the wizard flow provider registry
 *
 * @example
 * ```typescript
 * import { providerRegistry } from '@umituz/react-native-ai-generation-content';
 * import { registerWithWizard } from '@umituz/react-native-ai-fal-provider';
 *
 * // After FAL provider is initialized, register it for wizard flow
 * registerWithWizard(providerRegistry);
 * ```
 */
export function registerWithWizard(registry: {
  register: (provider: any) => void;
  setActiveProvider: (id: string) => void;
}): void {
  registry.register(falProvider);
  registry.setActiveProvider('fal');

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log('[FAL Provider] Registered with wizard flow');
  }
}
