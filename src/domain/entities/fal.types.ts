/**
 * FAL AI Types
 * Core type definitions for FAL AI integration
 */

export interface FalConfig {
  readonly apiKey: string;
  readonly baseUrl?: string;
  readonly maxRetries?: number;
  readonly baseDelay?: number;
  readonly maxDelay?: number;
  readonly defaultTimeoutMs?: number;
}

export interface FalModel {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly endpoint: string;
  readonly type: FalModelType;
  readonly pricing?: FalModelPricing;
  readonly enabled: boolean;
  readonly order?: number;
}

export type FalModelType =
  | "text-to-image"
  | "text-to-video"
  | "text-to-voice"
  | "image-to-video"
  | "image-to-image"
  | "text-to-text";

export interface FalModelPricing {
  readonly creditsPerGeneration: number;
  readonly currency?: string;
}

export interface FalJobInput {
  readonly [key: string]: unknown;
}

export interface FalJobResult<T = unknown> {
  readonly requestId: string;
  readonly data: T;
  readonly logs?: readonly FalLogEntry[];
}

export interface FalLogEntry {
  readonly message: string;
  readonly timestamp?: string;
  readonly level?: "info" | "warn" | "error";
}

export interface FalQueueStatus {
  readonly status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  readonly requestId: string;
  readonly logs?: readonly FalLogEntry[];
  readonly queuePosition?: number;
}

export interface FalSubscribeOptions {
  readonly onQueueUpdate?: (update: FalQueueStatus) => void;
  readonly timeoutMs?: number;
}
