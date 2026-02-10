/**
 * FAL Error Categorizer - Classifies FAL AI errors
 *
 * This module re-exports error categorization functions from the unified
 * fal-error-handler.util module for backward compatibility.
 */

export { categorizeFalError } from "./fal-error-handler.util";
export type { FalErrorCategory } from "../../domain/entities/error.types";
