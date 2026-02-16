/**
 * FAL Model Configuration Type
 */

import type { FalModelType } from "../entities/fal.types";

export interface FalModelConfig {
  readonly id: string;
  readonly name: string;
  readonly type: FalModelType;
  readonly isDefault?: boolean;
  readonly isActive?: boolean;
  readonly pricing?: {
    readonly freeUserCost: number;
    readonly premiumUserCost: number;
  };
  readonly description?: string;
  readonly order?: number;
}
