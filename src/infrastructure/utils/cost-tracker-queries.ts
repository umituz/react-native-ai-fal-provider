/**
 * Cost Tracker Queries
 * Query functions for cost history analysis
 */

import type { GenerationCost, CostSummary } from "../../domain/entities/cost-tracking.types";

/**
 * Calculate cost summary from history
 */
export function calculateCostSummary(
  costHistory: readonly GenerationCost[],
  currency: string
): CostSummary {
  const completedCosts = costHistory.filter((c) => c.actualCost > 0);
  const totalCost = completedCosts.reduce((sum, c) => sum + c.actualCost, 0);
  const totalGenerations = completedCosts.length;
  const averageCost = totalGenerations > 0 ? totalCost / totalGenerations : 0;

  const modelBreakdown: Record<string, number> = {};
  const operationBreakdown: Record<string, number> = {};

  for (const cost of completedCosts) {
    modelBreakdown[cost.model] = (modelBreakdown[cost.model] ?? 0) + cost.actualCost;
    operationBreakdown[cost.operation] = (operationBreakdown[cost.operation] ?? 0) + cost.actualCost;
  }

  return {
    totalCost,
    totalGenerations,
    averageCost,
    currency,
    modelBreakdown,
    operationBreakdown,
  };
}

/**
 * Filter costs by model
 */
export function filterCostsByModel(
  costHistory: readonly GenerationCost[],
  modelId: string
): GenerationCost[] {
  return costHistory.filter((c) => c.model === modelId);
}

/**
 * Filter costs by operation type
 */
export function filterCostsByOperation(
  costHistory: readonly GenerationCost[],
  operation: string
): GenerationCost[] {
  return costHistory.filter((c) => c.operation === operation);
}

/**
 * Filter costs by time range
 */
export function filterCostsByTimeRange(
  costHistory: readonly GenerationCost[],
  startTime: number,
  endTime: number
): GenerationCost[] {
  return costHistory.filter((c) => c.timestamp >= startTime && c.timestamp <= endTime);
}
