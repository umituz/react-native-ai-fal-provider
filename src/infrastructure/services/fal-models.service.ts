/**
 * FAL Models Service
 * Manages FAL AI model configurations with in-memory caching
 *
 * This service provides default models and allows apps to override/extend
 * with custom model sources (e.g., Firebase, API)
 */

import type { FalModelType } from "../../domain/entities/fal.types";
import {
  type FalModelConfig,
  getDefaultModelsByType,
  getDefaultModel,
  findModelById,
} from "../../domain/constants/default-models.constants";

export type { FalModelConfig };

export type ModelFetcher = (type: FalModelType) => Promise<FalModelConfig[]>;

interface CacheEntry {
  data: FalModelConfig[];
  timestamp: number;
}

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

class FalModelsService {
  private cache = new Map<FalModelType, CacheEntry>();
  private cacheTtl = DEFAULT_CACHE_TTL;
  private customFetcher: ModelFetcher | null = null;

  /**
   * Set custom model fetcher (e.g., for Firebase integration)
   */
  setModelFetcher(fetcher: ModelFetcher): void {
    this.customFetcher = fetcher;
    this.clearCache();
  }

  /**
   * Configure cache TTL
   */
  setCacheTtl(ttlMs: number): void {
    this.cacheTtl = ttlMs;
  }

  /**
   * Get models by type with caching
   */
  async getModels(type: FalModelType): Promise<FalModelConfig[]> {
    const cached = this.getFromCache(type);
    if (cached) {
      return cached;
    }

    let models: FalModelConfig[];

    if (this.customFetcher) {
      try {
        models = await this.customFetcher(type);
        if (models.length === 0) {
          models = getDefaultModelsByType(type);
        }
      } catch {
        models = getDefaultModelsByType(type);
      }
    } else {
      models = getDefaultModelsByType(type);
    }

    this.setCache(type, models);
    return this.sortModels(models);
  }

  /**
   * Get text-to-image models
   */
  async getTextToImageModels(): Promise<FalModelConfig[]> {
    return this.getModels("text-to-image");
  }

  /**
   * Get text-to-voice models
   */
  async getTextToVoiceModels(): Promise<FalModelConfig[]> {
    return this.getModels("text-to-voice");
  }

  /**
   * Get text-to-video models
   */
  async getTextToVideoModels(): Promise<FalModelConfig[]> {
    return this.getModels("text-to-video");
  }

  /**
   * Get image-to-video models
   */
  async getImageToVideoModels(): Promise<FalModelConfig[]> {
    return this.getModels("image-to-video");
  }

  /**
   * Get default model for type
   */
  getDefaultModel(type: FalModelType): FalModelConfig | undefined {
    return getDefaultModel(type);
  }

  /**
   * Find model by ID (from cache or defaults)
   */
  findById(id: string): FalModelConfig | undefined {
    // Check cache first
    for (const [, entry] of this.cache) {
      const found = entry.data.find((m) => m.id === id);
      if (found) return found;
    }

    // Fall back to defaults
    return findModelById(id);
  }

  /**
   * Get model pricing
   */
  getModelPricing(
    modelId: string
  ): { freeUserCost: number; premiumUserCost: number } | null {
    const model = this.findById(modelId);
    return model?.pricing ?? null;
  }

  /**
   * Get voice model pricing
   */
  async getVoiceModelPricing(
    modelId: string
  ): Promise<{ freeUserCost: number; premiumUserCost: number } | null> {
    const models = await this.getTextToVoiceModels();
    const model = models.find((m) => m.id === modelId);
    return model?.pricing || null;
  }

  /**
   * Get video model pricing
   */
  async getVideoModelPricing(
    modelId: string
  ): Promise<{ freeUserCost: number; premiumUserCost: number } | null> {
    const models = await this.getTextToVideoModels();
    const model = models.find((m) => m.id === modelId);
    return model?.pricing || null;
  }

  /**
   * Clear all cached models
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific type
   */
  clearCacheForType(type: FalModelType): void {
    this.cache.delete(type);
  }

  private getFromCache(type: FalModelType): FalModelConfig[] | null {
    const entry = this.cache.get(type);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.cacheTtl;
    if (isExpired) {
      this.cache.delete(type);
      return null;
    }

    return entry.data;
  }

  private setCache(type: FalModelType, data: FalModelConfig[]): void {
    this.cache.set(type, { data, timestamp: Date.now() });
  }

  private sortModels(models: FalModelConfig[]): FalModelConfig[] {
    return [...models].sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 0) - (b.order || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }
}

export const falModelsService = new FalModelsService();
