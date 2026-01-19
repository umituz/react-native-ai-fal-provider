/**
 * Model Registry Index
 * Export all registry types, models, and services
 */

// Types
export type {
  ModelType,
  ModelProvider,
  DurationOption,
  ResolutionOption,
  AspectRatioOption,
  ModelCapabilities,
  ModelPricing,
  ModelDefaults,
  ModelConfig,
  ModelRegistry,
  ResolvedCapabilities,
  GlobalCapabilities,
  GlobalDefaults,
} from "./model-registry.types";

// Global Capabilities
export {
  VIDEO_ASPECT_RATIOS,
  IMAGE_ASPECT_RATIOS,
  GLOBAL_CAPABILITIES,
  GLOBAL_DEFAULTS,
} from "./global-capabilities";

// Model Configurations
export {
  SORA_2_DURATIONS,
  SORA_2_RESOLUTIONS,
  SORA_2_CREDITS_BY_DURATION,
  SORA_2_TEXT_TO_VIDEO,
  SORA_2_IMAGE_TO_VIDEO,
  SORA_2_MODELS,
} from "./models";

// Registry Service
export {
  MODEL_REGISTRY,
  getModelConfig,
  getModelsByType,
  getEnabledModels,
  getModelCapabilities,
  getModelCreditCost,
  getDefaultModelFromRegistry,
} from "./model-registry.service";
