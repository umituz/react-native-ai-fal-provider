/**
 * Wizard Flow Registration Helper
 * Use this when your app uses GenericWizardFlow from @umituz/react-native-ai-generation-content
 */

import { providerRegistry } from '@umituz/react-native-ai-generation-content';
import { falProvider } from '../infrastructure/services';

/**
 * Register FAL provider with the wizard flow provider registry.
 * Optionally accepts a custom registry for backward compatibility.
 *
 * @example
 * ```typescript
 * import { registerWithWizard } from '@umituz/react-native-ai-fal-provider';
 *
 * // No need to import providerRegistry separately anymore
 * registerWithWizard();
 * ```
 */
export function registerWithWizard(registry?: {
  register: (provider: unknown) => void;
  setActiveProvider: (id: string) => void;
}): void {
  const reg = registry ?? providerRegistry;
  reg.register(falProvider);
  reg.setActiveProvider('fal');
}
