/**
 * FAL AI Types
 * Core type definitions for FAL AI integration
 */

export interface FalConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  defaultTimeoutMs?: number;
}

export interface FalModel {
  id: string;
  name: string;
  description?: string;
  endpoint: string;
  type: FalModelType;
  pricing?: FalModelPricing;
  enabled: boolean;
  order?: number;
}

export type FalModelType =
  | "text-to-image"
  | "text-to-video"
  | "text-to-voice"
  | "image-to-video"
  | "image-to-image";

export interface FalModelPricing {
  creditsPerGeneration: number;
  currency?: string;
}

export interface FalJobInput {
  [key: string]: unknown;
}

export interface FalJobResult<T = unknown> {
  requestId: string;
  data: T;
  logs?: FalLogEntry[];
}

export interface FalLogEntry {
  message: string;
  timestamp?: string;
  level?: "info" | "warn" | "error";
}

export interface FalQueueStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  requestId: string;
  logs?: FalLogEntry[];
  queuePosition?: number;
}

export interface FalSubscribeOptions {
  onQueueUpdate?: (update: FalQueueStatus) => void;
  timeoutMs?: number;
}
