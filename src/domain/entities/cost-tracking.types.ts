/**
 * Cost Tracking Types
 * Real-time cost tracking for AI generation operations
 */

export interface GenerationCost {
  readonly model: string;
  readonly operation: string;
  readonly estimatedCost: number;
  readonly actualCost: number;
  readonly currency: string;
  readonly timestamp: number;
  readonly requestId?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface CostTrackerConfig {
  readonly currency?: string;
  readonly trackEstimatedCost?: boolean;
  readonly trackActualCost?: boolean;
  readonly onCostUpdate?: (cost: GenerationCost) => void;
}

export interface ModelCostInfo {
  readonly model: string;
  readonly costPerRequest: number;
  readonly costPerToken?: number;
  readonly costPerSecond?: number;
  readonly currency: string;
}

export interface CostSummary {
  readonly totalCost: number;
  readonly totalGenerations: number;
  readonly averageCost: number;
  readonly currency: string;
  readonly modelBreakdown: Record<string, number>;
  readonly operationBreakdown: Record<string, number>;
}
