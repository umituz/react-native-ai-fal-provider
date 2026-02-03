/**
 * Domain Types Index
 */

export type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState,
  ModelSelectionActions,
  UseModelsReturn,
} from "./model-selection.types";

export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  ImageToImagePromptConfig,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
  TextToVideoOptions,
  FaceSwapOptions,
} from "./input-builders.types";

// Provider Types (local definitions)
export type {
  ImageFeatureType,
  VideoFeatureType,
  AIProviderConfig,
  AIJobStatusType,
  AILogEntry,
  JobSubmission,
  JobStatus,
  ProviderProgressInfo,
  SubscribeOptions,
  RunOptions,
  ProviderCapabilities,
  ImageFeatureInputData,
  VideoFeatureInputData,
  IAIProviderLifecycle,
  IAIProviderCapabilities,
  IAIProviderJobManager,
  IAIProviderExecutor,
  IAIProviderImageFeatures,
  IAIProviderVideoFeatures,
  IAIProvider,
} from "./provider.types";
