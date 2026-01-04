/**
 * useModels Hook
 * Manages FAL AI model selection with dynamic credit costs
 *
 * @example
 * const { models, selectedModel, selectModel, creditCost, modelId } = useModels({
 *   type: "text-to-video",
 *   config: { defaultCreditCost: 20, defaultModelId: "fal-ai/minimax-video" }
 * });
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { falModelsService } from "../../infrastructure/services/fal-models.service";
import type { FalModelConfig } from "../../domain/constants/default-models.constants";
import type {
  ModelType,
  ModelSelectionConfig,
  UseModelsReturn,
} from "../../domain/types/model-selection.types";

declare const __DEV__: boolean;

const DEFAULT_CREDIT_COSTS: Record<ModelType, number> = {
  "text-to-image": 2,
  "text-to-video": 20,
  "image-to-video": 20,
  "text-to-voice": 3,
};

const DEFAULT_MODEL_IDS: Record<ModelType, string> = {
  "text-to-image": "fal-ai/flux/schnell",
  "text-to-video": "fal-ai/minimax-video",
  "image-to-video": "fal-ai/kling-video/v1.5/pro/image-to-video",
  "text-to-voice": "fal-ai/playai/tts/v3",
};

export interface UseModelsProps {
  /** Model type to fetch */
  readonly type: ModelType;
  /** Optional configuration */
  readonly config?: ModelSelectionConfig;
}

export function useModels(props: UseModelsProps): UseModelsReturn {
  const { type, config } = props;

  const [models, setModels] = useState<FalModelConfig[]>([]);
  const [selectedModel, setSelectedModel] = useState<FalModelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultCreditCost = config?.defaultCreditCost ?? DEFAULT_CREDIT_COSTS[type];
  const defaultModelId = config?.defaultModelId ?? DEFAULT_MODEL_IDS[type];

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedModels = await falModelsService.getModels(type);
      setModels(fetchedModels);

      const targetId = config?.initialModelId ?? defaultModelId;
      const initial =
        fetchedModels.find((m) => m.id === targetId) ||
        fetchedModels.find((m) => m.isDefault) ||
        fetchedModels[0];

      if (initial) {
        setSelectedModel(initial);
      }

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log(`[useModels] Loaded ${fetchedModels.length} ${type} models`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch models";
      setError(message);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`[useModels] Error fetching ${type} models:`, message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type, config?.initialModelId, defaultModelId]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const selectModel = useCallback(
    (modelId: string) => {
      const model = models.find((m) => m.id === modelId);
      if (model) {
        setSelectedModel(model);

        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.log(`[useModels] Selected: ${model.name} (${model.id})`);
        }
      }
    },
    [models],
  );

  const creditCost = useMemo(() => {
    if (selectedModel?.pricing?.freeUserCost) {
      return selectedModel.pricing.freeUserCost;
    }
    return defaultCreditCost;
  }, [selectedModel, defaultCreditCost]);

  const modelId = useMemo(() => {
    return selectedModel?.id ?? defaultModelId;
  }, [selectedModel, defaultModelId]);

  return {
    models,
    selectedModel,
    selectModel,
    creditCost,
    modelId,
    isLoading,
    error,
    refreshModels: fetchModels,
  };
}
