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

function filterCostsByModel(costs: GenerationCost[], modelId: string): GenerationCost[] {
  return costs.filter((cost) => cost.model === modelId);
}

function filterCostsByOperation(costs: GenerationCost[], operation: string): GenerationCost[] {
  return costs.filter((cost) => cost.operation === operation);
}

function filterCostsByTimeRange(costs: GenerationCost[], startTime: number, endTime: number): GenerationCost[] {
  return costs.filter((cost) => cost.timestamp >= startTime && cost.timestamp <= endTime);
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
      // Silently return default cost info on error
    }

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
    // Use crypto.randomUUID() for guaranteed uniqueness without overflow
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}-${operation}`;

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
    return filterCostsByModel(this.costHistory, modelId);
  }

  getCostsByOperation(operation: string): GenerationCost[] {
    return filterCostsByOperation(this.costHistory, operation);
  }

  getCostsByTimeRange(startTime: number, endTime: number): GenerationCost[] {
    return filterCostsByTimeRange(this.costHistory, startTime, endTime);
  }
}
