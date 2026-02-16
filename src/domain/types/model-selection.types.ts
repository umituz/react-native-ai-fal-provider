/**
 * Model Selection Types
 */

import type { FalModelType } from "../entities/fal.types";

export type ModelType = Extract<
  FalModelType,
  "text-to-image" | "text-to-video" | "image-to-video" | "text-to-voice"
>;
