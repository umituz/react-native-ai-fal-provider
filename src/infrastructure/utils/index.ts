/**
 * Utils Index
 * Exports all utility functions
 */

export { categorizeFalError } from "./error-categorizer";
export { falErrorMapper, mapFalError, isFalErrorRetryable } from "./error-mapper";

// Input builders
export {
  buildSingleImageInput,
  buildDualImageInput,
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildVideoFromImageInput,
  buildFaceSwapInput,
  buildAnimeSelfieInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildReplaceBackgroundInput,
  buildHDTouchUpInput,
} from "./input-builders.util";

export type {
  UpscaleOptions,
  PhotoRestoreOptions,
  FaceSwapOptions,
  AnimeSelfieOptions,
  RemoveBackgroundOptions,
  RemoveObjectOptions,
  ReplaceBackgroundOptions,
  VideoFromImageOptions,
} from "./input-builders.util";
