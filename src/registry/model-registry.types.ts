/**
 * Model Registry Types
 * Type definitions for model capabilities and configuration
 */

// =============================================================================
// PRIMITIVE TYPES
// =============================================================================

export type ModelType = "text-to-video" | "image-to-video" | "text-to-image";
export type ModelProvider = "fal" | "openai" | "stability" | "runway";

// =============================================================================
// OPTION TYPES
// =============================================================================

export interface DurationOption {
  value: number;
  label: string;
}

export interface ResolutionOption {
  value: string;
  label: string;
}

export interface AspectRatioOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// =============================================================================
// CAPABILITIES
// =============================================================================

export interface ModelCapabilities {
  durations?: DurationOption[];
  resolutions?: ResolutionOption[];
  aspectRatios?: AspectRatioOption[];
  maxPromptLength?: number;
  supportsSound?: boolean;
  supportsStyle?: boolean;
}

export interface ModelPricing {
  costPerSecond?: number;
  costPerGeneration?: number;
  creditsByDuration?: Record<number, number>;
}

export interface ModelDefaults {
  duration: number;
  resolution: string;
  aspectRatio: string;
}

// =============================================================================
// MODEL CONFIG
// =============================================================================

export interface ModelConfig {
  id: string;
  name: string;
  type: ModelType;
  provider: ModelProvider;
  capabilities: ModelCapabilities;
  pricing: ModelPricing;
  defaults: ModelDefaults;
  enabled: boolean;
}

// =============================================================================
// REGISTRY TYPES
// =============================================================================

export type ModelRegistry = Record<string, ModelConfig>;

export interface ResolvedCapabilities {
  durations: DurationOption[];
  resolutions: ResolutionOption[];
  aspectRatios: AspectRatioOption[];
  maxPromptLength: number;
  supportsSound: boolean;
  supportsStyle: boolean;
  pricing: ModelPricing;
  defaults: ModelDefaults;
}

// =============================================================================
// GLOBAL CAPABILITIES
// =============================================================================

export interface GlobalCapabilities {
  aspectRatios: {
    video: AspectRatioOption[];
    image: AspectRatioOption[];
  };
}

export interface GlobalDefaults {
  maxPromptLength: number;
  supportsSound: boolean;
  supportsStyle: boolean;
}
