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
import {
  calculateCostSummary,
  filterCostsByModel,
  filterCostsByOperation,
  filterCostsByTimeRange,
} from "./cost-tracker-queries";

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

  calculateEstimatedCost(modelId: string): number {
    const costInfo = this.getModelCostInfo(modelId);
    return costInfo.costPerRequest;
  }

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
