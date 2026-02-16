/**
 * useModels Hook - Model selection management
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { falModelsService, type FalModelConfig } from "../../infrastructure/services/fal-models.service";

export interface UseModelsProps {
  readonly models: FalModelConfig[];
  readonly initialModelId?: string;
}

export interface UseModelsReturn {
  readonly models: FalModelConfig[];
  readonly selectedModel: FalModelConfig | null;
  readonly selectModel: (modelId: string) => void;
  readonly modelId: string;
}

export function useModels(props: UseModelsProps): UseModelsReturn {
  const { models, initialModelId } = props;

  const sortedModels = useMemo(() => falModelsService.sortModels(models), [models]);

  const [selectedModel, setSelectedModel] = useState<FalModelConfig | null>(() => {
    if (initialModelId) {
      const initial = falModelsService.findById(initialModelId, sortedModels);
      if (initial) return initial;
    }
    return falModelsService.getDefaultModel(sortedModels) ?? null;
  });

  useEffect(() => {
    if (initialModelId) {
      const model = falModelsService.findById(initialModelId, sortedModels);
      if (model) setSelectedModel(model);
    }
  }, [initialModelId, sortedModels]);

  const selectModel = useCallback(
    (modelId: string) => {
      const model = falModelsService.findById(modelId, sortedModels);
      if (model) setSelectedModel(model);
    },
    [sortedModels]
  );

  const modelId = useMemo(() => selectedModel?.id ?? "", [selectedModel]);

  return {
    models: sortedModels,
    selectedModel,
    selectModel,
    modelId,
  };
}
