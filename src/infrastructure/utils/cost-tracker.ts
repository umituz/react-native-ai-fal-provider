/**
 * Cost Tracker
 * Tracks and manages real-time cost information for AI generations
 */

import type {
  GenerationCost,
  CostTrackerConfig,
  ModelCostInfo,
} from "../../domain/entities/cost-tracking.types";
import { findModelById } from "../../domain/constants/default-models.constants";
import { filterByProperty, filterByTimeRange } from "./collection-filters.util";

interface CostSummary {
  totalEstimatedCost: number;
  totalActualCost: number;
  currency: string;
  operationCount: number;
}

function calculateCostSummary(costs: GenerationCost[], currency: string): CostSummary {
  return costs.reduce(
    (summary, cost) => ({
      totalEstimatedCost: summary.totalEstimatedCost + cost.estimatedCost,
      totalActualCost: summary.totalActualCost + cost.actualCost,
      currency,
      operationCount: summary.operationCount + 1,
    }),
    { totalEstimatedCost: 0, totalActualCost: 0, currency, operationCount: 0 }
  );
}

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

  getModelCostInfo(modelId: string): ModelCostInfo {
    try {
      const model = findModelById(modelId);

      if (model?.pricing) {
        return {
          model: modelId,
          costPerRequest: model.pricing.freeUserCost,
          currency: this.config.currency,
        };
      }
    } catch (error) {
      // Log error but continue with default cost info
      console.warn(
        `[cost-tracker] Failed to get model cost info for ${modelId}:`,
        error instanceof Error ? error.message : String(error)
      );
    }

    // Return default cost info (0 cost) if model not found or error occurred
    return {
      model: modelId,
      costPerRequest: 0,
      currency: this.config.currency,
    };
  }

  calculateEstimatedCost(modelId: string): number {
    const costInfo = this.getModelCostInfo(modelId);
    return costInfo.costPerRequest;
  }

  startOperation(modelId: string, operation: string): string {
    // Generate unique operation ID
    let uniqueId: string;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uniqueId = crypto.randomUUID();
    } else {
      // Fallback: Use timestamp with random component and counter
      // Format: timestamp-randomCounter-operationHash
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 11);
      const operationHash = operation.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(36);
      uniqueId = `${timestamp}-${random}-${operationHash}`;
    }

    const estimatedCost = this.calculateEstimatedCost(modelId);

    this.currentOperationCosts.set(uniqueId, estimatedCost);

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

    return uniqueId;
  }

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
   * Mark an operation as failed - removes from pending without adding to history
   */
  failOperation(operationId: string): void {
    this.currentOperationCosts.delete(operationId);
  }

  getCostSummary(): CostSummary {
    return calculateCostSummary(this.costHistory, this.config.currency);
  }

  getCostHistory(): readonly GenerationCost[] {
    return this.costHistory;
  }

  clearHistory(): void {
    this.costHistory = [];
    this.currentOperationCosts.clear();
  }

  getCostsByModel(modelId: string): GenerationCost[] {
    return filterByProperty(this.costHistory, "model", modelId);
  }

  getCostsByOperation(operation: string): GenerationCost[] {
    return filterByProperty(this.costHistory, "operation", operation);
  }

  getCostsByTimeRange(startTime: number, endTime: number): GenerationCost[] {
    return filterByTimeRange(this.costHistory, "timestamp", startTime, endTime);
  }
}
