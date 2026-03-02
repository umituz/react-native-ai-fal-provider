/**
 * FAL Provider Constants
 * Configuration and capability definitions for FAL AI provider
 *
 * Retry Strategy (layered):
 * ┌──────────────────────────────────────────────────┐
 * │ UPLOAD (fal.storage.upload) — per image          │
 * │ Timeout: 30s / attempt                           │
 * │ Retries: 2 (3 total attempts)                    │
 * │ Backoff: 1s → 2s (exponential)                   │
 * │ Retries on: network, timeout                     │
 * ├──────────────────────────────────────────────────┤
 * │ SUBSCRIBE (fal.subscribe) — generation           │
 * │ Timeout: caller-defined (120s image / 300s video)│
 * │ Retries: 1 (2 total attempts)                    │
 * │ Backoff: 3s (fixed — server needs recovery time) │
 * │ Retries on: network, timeout, server (5xx)       │
 * │ NO retry: auth, validation, NSFW, quota, cancel  │
 * ├──────────────────────────────────────────────────┤
 * │ FAL SDK HTTP retry (fal.config)                  │
 * │ Retries: 3 (internal HTTP-level only)            │
 * │ Backoff: 1s → 10s                                │
 * └──────────────────────────────────────────────────┘
 */

import type { ProviderCapabilities } from "../../domain/types";

export const DEFAULT_FAL_CONFIG = {
  /** FAL SDK HTTP-level retry */
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,

  /** Subscribe defaults */
  defaultTimeoutMs: 300000,
  pollInterval: 2500,

  /** Subscribe retry — retries the entire fal.subscribe call on transient failures */
  subscribeMaxRetries: 1,
  subscribeRetryDelayMs: 3000,
} as const;

export const UPLOAD_CONFIG = {
  /** Timeout per individual upload attempt */
  timeoutMs: 30_000,
  /** Max retries (2 = 3 total attempts) */
  maxRetries: 2,
  /** Initial backoff delay (doubles each retry) */
  baseDelayMs: 1_000,
} as const;

export const FAL_CAPABILITIES: ProviderCapabilities = {
  imageFeatures: [] as const,
  videoFeatures: [] as const,
  textToImage: true,
  textToVideo: true,
  imageToVideo: true,
  textToVoice: true,
  textToText: false,
};
