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
import { DEFAULT_CREDIT_COSTS, DEFAULT_MODEL_IDS } from "../../domain/constants/default-models.constants";
import type {
  ModelType,
  ModelSelectionConfig,
  UseModelsReturn,
} from "../../domain/types/model-selection.types";

declare const __DEV__: boolean;

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

  const loadModels = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const fetchedModels = falModelsService.getModels(type);
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

    setIsLoading(false);
  }, [type, config?.initialModelId, defaultModelId]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

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
    refreshModels: loadModels,
  };
}
