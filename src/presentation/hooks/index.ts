/**
 * Hooks Index
 * Exports all React hooks
 */

export { useFalGeneration } from "./use-fal-generation";
export type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
} from "./use-fal-generation";

export { useModels } from "./use-models";
export type { UseModelsProps } from "./use-models";

export {
  useModelCapabilities,
  useVideoDurations,
  useVideoResolutions,
  useAspectRatios,
} from "./use-model-capabilities";
export type {
  UseModelCapabilitiesOptions,
  UseModelCapabilitiesReturn,
  UseVideoDurationsReturn,
  UseVideoResolutionsReturn,
  UseAspectRatiosReturn,
} from "./use-model-capabilities";
