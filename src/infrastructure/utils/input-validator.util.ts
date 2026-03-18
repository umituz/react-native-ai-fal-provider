/**
 * Input Validator Utility (Infrastructure Layer)
 * Delegates to domain ValidationService for actual validation logic
 *
 * This file now serves as a thin adapter layer for backward compatibility.
 * The actual validation logic has been moved to the domain layer.
 */

import { ValidationService } from "../../domain/services";
import type { ValidationError } from "../../domain/services/ValidationService";

// Re-export for backward compatibility
export { InputValidationError } from "../../domain/services/ValidationService";
export type { ValidationError };

/**
 * Validate model and input parameters
 * Delegates to domain ValidationService
 *
 * @param model - Model ID
 * @param input - Input parameters to validate
 * @throws InputValidationError if validation fails
 */
export function validateInput(
  model: string,
  input: Record<string, unknown>
): void {
  ValidationService.validateInput(model, input);
}
