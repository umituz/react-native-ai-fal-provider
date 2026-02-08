/**
 * Provider Types
 * Local type definitions for FAL Provider
 */

// =============================================================================
// Feature Types
// =============================================================================

/**
 * Feature types for image processing (output: image)
 */
export type ImageFeatureType =
  | "upscale"
  | "photo-restore"
  | "face-swap"
  | "anime-selfie"
  | "remove-background"
  | "remove-object"
  | "hd-touch-up"
  | "replace-background";

/**
 * Feature types for video generation (output: video)
 */
export type VideoFeatureType = "image-to-video" | "text-to-video";

// =============================================================================
// Provider Configuration
// =============================================================================

export interface AIProviderConfig {
  apiKey: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
  textModel?: string;
  textToImageModel?: string;
  imageEditModel?: string;
  videoGenerationModel?: string;
  videoFeatureModels?: Partial<Record<VideoFeatureType, string>>;
  imageFeatureModels?: Partial<Record<ImageFeatureType, string>>;
}

// =============================================================================
// Status Types
// =============================================================================

export type AIJobStatusType =
  | "IN_QUEUE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export interface AILogEntry {
  message: string;
  level: "info" | "warn" | "error";
  timestamp?: string;
}

export interface JobSubmission {
  requestId: string;
  statusUrl?: string;
  responseUrl?: string;
}

export interface JobStatus {
  status: AIJobStatusType;
  logs?: AILogEntry[];
  queuePosition?: number;
  eta?: number;
  requestId?: string;
}

// =============================================================================
// Progress & Options
// =============================================================================

export interface ProviderProgressInfo {
  progress: number;
  status?: AIJobStatusType;
  message?: string;
  estimatedTimeRemaining?: number;
}

export interface SubscribeOptions<T = unknown> {
  timeoutMs?: number;
  onQueueUpdate?: (status: JobStatus) => void;
  onProgress?: (progress: ProviderProgressInfo) => void;
  onResult?: (result: T) => void;
}

export interface RunOptions {
  onProgress?: (progress: ProviderProgressInfo) => void;
  signal?: AbortSignal;
}

// =============================================================================
// Capabilities
// =============================================================================

export interface ProviderCapabilities {
  imageFeatures: readonly ImageFeatureType[];
  videoFeatures: readonly VideoFeatureType[];
  textToImage: boolean;
  textToVideo: boolean;
  imageToVideo: boolean;
  textToVoice: boolean;
  textToText: boolean;
}

// =============================================================================
// Feature Input Data
// =============================================================================

export interface ImageFeatureInputData {
  imageBase64: string;
  targetImageBase64?: string;
  prompt?: string;
  options?: Record<string, unknown>;
}

export interface VideoFeatureInputData {
  sourceImageBase64?: string;
  targetImageBase64?: string;
  prompt?: string;
  options?: Record<string, unknown>;
}

// =============================================================================
// Provider Interface
// =============================================================================

export interface IAIProviderLifecycle {
  initialize(config: AIProviderConfig): void;
  isInitialized(): boolean;
  reset(): void;
}

export interface IAIProviderCapabilities {
  getCapabilities(): ProviderCapabilities;
  isFeatureSupported(feature: ImageFeatureType | VideoFeatureType): boolean;
}

export interface IAIProviderJobManager {
  submitJob(
    model: string,
    input: Record<string, unknown>,
  ): Promise<JobSubmission>;
  getJobStatus(model: string, requestId: string): Promise<JobStatus>;
  getJobResult<T = unknown>(model: string, requestId: string): Promise<T>;
}

export interface IAIProviderExecutor {
  subscribe<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: SubscribeOptions<T>,
  ): Promise<T>;
  run<T = unknown>(
    model: string,
    input: Record<string, unknown>,
    options?: RunOptions,
  ): Promise<T>;
}

export interface IAIProviderImageFeatures {
  getImageFeatureModel(feature: ImageFeatureType): string;
  buildImageFeatureInput(
    feature: ImageFeatureType,
    data: ImageFeatureInputData,
  ): Record<string, unknown>;
}

export interface IAIProviderVideoFeatures {
  getVideoFeatureModel(feature: VideoFeatureType): string;
  buildVideoFeatureInput(
    feature: VideoFeatureType,
    data: VideoFeatureInputData,
  ): Record<string, unknown>;
}

/**
 * Main AI Provider Interface
 */
export interface IAIProvider
  extends IAIProviderLifecycle,
    IAIProviderCapabilities,
    IAIProviderJobManager,
    IAIProviderExecutor,
    IAIProviderImageFeatures,
    IAIProviderVideoFeatures {
  readonly providerId: string;
  readonly providerName: string;
}
