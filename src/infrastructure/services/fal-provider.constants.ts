/**
 * FAL Provider Constants
 * Configuration and capability definitions for FAL AI provider
 */

import type { ProviderCapabilities } from "../../domain/types";

export const DEFAULT_FAL_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  defaultTimeoutMs: 300000,
  pollInterval: 2500,
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
