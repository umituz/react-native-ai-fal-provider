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

export type { UseModelsReturn } from "../../domain/types/model-selection.types";

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

  // Memoize config to prevent unnecessary re-renders when parent re-renders
  // Only recreate when actual config values change
  const memoizedConfig = useMemo(() => config, [
    config?.initialModelId,
    config?.defaultCreditCost,
    config?.defaultModelId,
  ]);

  // Unified load function - eliminates duplication between effect and manual reload
  const performLoad = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const selectionData = falModelsService.getModelSelectionData(type, memoizedConfig);
      setModels(selectionData.models);
      setSelectedModel(selectionData.selectedModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setIsLoading(false);
    }
  }, [type, memoizedConfig]);

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    performLoad();
  }, [performLoad]);

  // Alias for manual reloads (same function, clearer name for external API)
  const loadModels = performLoad;

  const selectModel = useCallback(
    (modelId: string) => {
      const model = models.find((m) => m.id === modelId);
      if (model) {
        setSelectedModel(model);
      }
    },
    [models],
  );

  const creditCost = useMemo(() => {
    return falModelsService.getModelCreditCost(
      selectedModel?.id ?? falModelsService.getDefaultModelId(type),
      type
    );
  }, [selectedModel, type]);

  const modelId = useMemo(() => {
    return selectedModel?.id ?? falModelsService.getDefaultModelId(type);
  }, [selectedModel, type]);

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
