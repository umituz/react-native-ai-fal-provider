/**
 * Cost Tracker
 * Tracks and manages real-time cost information for AI generations
 */

import type {
  GenerationCost,
  CostTrackerConfig,
  CostSummary,
  ModelCostInfo,
} from "../../domain/entities/cost-tracking.types";
import { findModelById } from "../../domain/constants/default-models.constants";

declare const __DEV__: boolean | undefined;

export class CostTracker {
  private config: Required<CostTrackerConfig>;
  private costHistory: GenerationCost[] = [];
  private currentOperationCosts: Map<string, number> = new Map();

  constructor(config?: CostTrackerConfig) {
    this.config = {
      currency: config?.currency ?? "USD",
      trackEstimatedCost: config?.trackEstimatedCost ?? true,
      trackActualCost: config?.trackActualCost ?? true,
      onCostUpdate: config?.onCostUpdate ?? (() => {}),
    };
  }

  /**
   * Get cost information for a model
   */
  getModelCostInfo(modelId: string): ModelCostInfo {
    const model = findModelById(modelId);

    if (model?.pricing) {
      return {
        model: modelId,
        costPerRequest: model.pricing.freeUserCost,
        currency: this.config.currency,
      };
    }

    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.warn("[CostTracker] No pricing found for model:", modelId);
    }

    return {
      model: modelId,
      costPerRequest: 0,
      currency: this.config.currency,
    };
  }

  /**
   * Calculate estimated cost for a generation
   */
  calculateEstimatedCost(modelId: string): number {
    const costInfo = this.getModelCostInfo(modelId);
    return costInfo.costPerRequest;
  }

  /**
   * Start tracking a generation operation
   */
  startOperation(modelId: string, operation: string): string {
    const operationId = `${Date.now()}-${operation}`;
    const estimatedCost = this.calculateEstimatedCost(modelId);

    this.currentOperationCosts.set(operationId, estimatedCost);

    if (this.config.trackEstimatedCost) {
      const cost: GenerationCost = {
        model: modelId,
        operation,
        estimatedCost,
        actualCost: 0,
        currency: this.config.currency,
        timestamp: Date.now(),
      };

      this.costHistory.push(cost);
      this.config.onCostUpdate(cost);
    }

    return operationId;
  }

  /**
   * Complete tracking for a generation operation
   */
  completeOperation(
    operationId: string,
    modelId: string,
    operation: string,
    requestId?: string,
    actualCost?: number,
  ): GenerationCost | null {
    const estimatedCost = this.currentOperationCosts.get(operationId) ?? 0;
    const finalActualCost = actualCost ?? estimatedCost;

    this.currentOperationCosts.delete(operationId);

    const cost: GenerationCost = {
      model: modelId,
      operation,
      estimatedCost,
      actualCost: finalActualCost,
      currency: this.config.currency,
      timestamp: Date.now(),
      requestId,
    };

    this.costHistory.push(cost);

    if (this.config.trackActualCost) {
      this.config.onCostUpdate(cost);
    }

    return cost;
  }

  /**
   * Get cost summary for all tracked operations
   */
  getCostSummary(): CostSummary {
    const completedCosts = this.costHistory.filter((c) => c.actualCost > 0);
    const totalCost = completedCosts.reduce((sum, c) => sum + c.actualCost, 0);
    const totalGenerations = completedCosts.length;
    const averageCost = totalGenerations > 0 ? totalCost / totalGenerations : 0;

    const modelBreakdown: Record<string, number> = {};
    const operationBreakdown: Record<string, number> = {};

    for (const cost of completedCosts) {
      modelBreakdown[cost.model] =
        (modelBreakdown[cost.model] ?? 0) + cost.actualCost;
      operationBreakdown[cost.operation] =
        (operationBreakdown[cost.operation] ?? 0) + cost.actualCost;
    }

    return {
      totalCost,
      totalGenerations,
      averageCost,
      currency: this.config.currency,
      modelBreakdown,
      operationBreakdown,
    };
  }

  /**
   * Get cost history
   */
  getCostHistory(): readonly GenerationCost[] {
    return this.costHistory;
  }

  /**
   * Clear cost history
   */
  clearHistory(): void {
    this.costHistory = [];
    this.currentOperationCosts.clear();
  }

  /**
   * Get costs for a specific model
   */
  getCostsByModel(modelId: string): GenerationCost[] {
    return this.costHistory.filter((c) => c.model === modelId);
  }

  /**
   * Get costs for a specific operation type
   */
  getCostsByOperation(operation: string): GenerationCost[] {
    return this.costHistory.filter((c) => c.operation === operation);
  }

  /**
   * Get costs for a specific time range
   */
  getCostsByTimeRange(startTime: number, endTime: number): GenerationCost[] {
    return this.costHistory.filter(
      (c) => c.timestamp >= startTime && c.timestamp <= endTime,
    );
  }
}
