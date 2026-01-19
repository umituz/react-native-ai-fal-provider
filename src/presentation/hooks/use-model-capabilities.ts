/**
 * useModelCapabilities Hook
 * React hook for accessing model capabilities from the registry
 */

import { useMemo, useCallback } from "react";
import {
  getModelConfig,
  getModelCapabilities,
  getModelCreditCost,
  VIDEO_ASPECT_RATIOS,
} from "../../registry";
import type { ResolvedCapabilities, ModelConfig } from "../../registry";

// =============================================================================
// MAIN HOOK
// =============================================================================

export interface UseModelCapabilitiesOptions {
  modelId: string;
}

export interface UseModelCapabilitiesReturn {
  config: ModelConfig | undefined;
  capabilities: ResolvedCapabilities | undefined;
  getCreditCost: (duration: number) => number;
  defaults: ResolvedCapabilities["defaults"] | undefined;
  isAvailable: boolean;
}

export function useModelCapabilities(
  options: UseModelCapabilitiesOptions
): UseModelCapabilitiesReturn {
  const { modelId } = options;

  const config = useMemo(() => getModelConfig(modelId), [modelId]);
  const capabilities = useMemo(() => getModelCapabilities(modelId), [modelId]);

  const getCreditCost = useCallback(
    (duration: number) => getModelCreditCost(modelId, duration),
    [modelId]
  );

  return {
    config,
    capabilities,
    getCreditCost,
    defaults: capabilities?.defaults,
    isAvailable: !!config?.enabled,
  };
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

export interface UseVideoDurationsReturn {
  durations: ResolvedCapabilities["durations"];
  defaultDuration: number;
}

export function useVideoDurations(modelId: string): UseVideoDurationsReturn {
  const { capabilities } = useModelCapabilities({ modelId });

  return {
    durations: capabilities?.durations ?? [],
    defaultDuration: capabilities?.defaults.duration ?? 4,
  };
}

export interface UseVideoResolutionsReturn {
  resolutions: ResolvedCapabilities["resolutions"];
  defaultResolution: string;
}

export function useVideoResolutions(
  modelId: string
): UseVideoResolutionsReturn {
  const { capabilities } = useModelCapabilities({ modelId });

  return {
    resolutions: capabilities?.resolutions ?? [],
    defaultResolution: capabilities?.defaults.resolution ?? "720p",
  };
}

export interface UseAspectRatiosReturn {
  aspectRatios: ResolvedCapabilities["aspectRatios"];
  defaultAspectRatio: string;
}

export function useAspectRatios(modelId: string): UseAspectRatiosReturn {
  const { capabilities } = useModelCapabilities({ modelId });

  return {
    aspectRatios: capabilities?.aspectRatios ?? VIDEO_ASPECT_RATIOS,
    defaultAspectRatio: capabilities?.defaults.aspectRatio ?? "16:9",
  };
}
