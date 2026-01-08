# Type Guards & Validators

Runtime type checking and validation helper functions for FAL AI operations.

**Location:** `src/infrastructure/utils/type-guards.util.ts`

## Overview

This module provides runtime type checking and validation functions. It brings TypeScript type system to runtime, enabling detection of invalid data and type-safe operations.

## Purpose

Enhances type safety by:
- Providing runtime type guards for enums
- Validating data structures
- Checking image data validity
- Validating API keys
- Ensuring prompt safety
- Preventing invalid data from reaching APIs

## Import

```typescript
import {
  isFalModelType,
  isModelType,
  isFalErrorType,
  isValidBase64Image,
  isValidApiKey,
  isValidPrompt
} from '@umituz/react-native-ai-fal-provider';
```

## Type Guard Functions

### isFalModelType

Check if value is valid FAL model type.

**Parameters:**
- `value`: Unknown value to check

**Returns:** `boolean` - True if value is valid `FalModelType`

**Valid Values:**
- `text-to-image`
- `text-to-video`
- `text-to-voice`
- `image-to-video`
- `image-to-image`
- `text-to-text`

**Usage:**
Use before processing model type values. Enables type narrowing in TypeScript. Use in validation logic and user input processing.

**Implementation:** See complete validation in `src/infrastructure/utils/type-guards.util.ts`

### isModelType

Check if value is valid model type for hooks.

**Parameters:**
- `value`: Unknown value to check

**Returns:** `boolean` - True if value is valid `ModelType`

**Valid Values:**
- `text-to-image`
- `text-to-video`
- `image-to-video`
- `text-to-voice`

**Usage:**
Use when validating model type for `useModels` hook. Subset of `FalModelType` for user-facing model selection. Enables type-safe model filtering.

**Related:**
- Model types: `src/domain/types/model-selection.types.ts`
- useModels hook: `src/presentation/hooks/use-models.ts`

### isFalErrorType

Check if value is valid FAL error type.

**Parameters:**
- `value`: Unknown value to check

**Returns:** `boolean` - True if value is valid `FalErrorType`

**Valid Values:**
- `network`
- `timeout`
- `authentication`
- `quota_exceeded`
- `rate_limit`
- `invalid_input`
- `model_unavailable`
- `nsfw_content`
- `validation`
- `content_policy`
- `unknown`

**Usage:**
Use when validating error type values. Enables type-safe error handling. Use in error categorization and user error display.

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

## Validation Functions

### isValidBase64Image

Check if base64 image data is valid.

**Parameters:**
- `data`: Unknown value to check

**Returns:** `boolean` - True if valid base64 image

**Validation Rules:**
- Checks if string
- Validates base64 format
- Checks for valid image headers
- Ensures non-empty data

**Usage:**
Use this function before sending image data to FAL API. Validates that image data is properly formatted base64. Prevents API errors from invalid image data.

**Related:**
- Helper functions: `src/infrastructure/utils/helpers.util.ts`

### isValidApiKey

Check if API key is valid format.

**Parameters:**
- `key`: API key string to validate

**Returns:** `boolean` - True if API key format is valid

**Validation Rules:**
- Checks if string
- Validates minimum length
- Checks for valid characters
- Ensures not empty

**Usage:**
Use this function before setting API key. Validates FAL API key format. Prevents errors from invalid keys.

**Implementation:** See validation logic in `src/infrastructure/utils/type-guards.util.ts`

### isValidPrompt

Check if prompt text is valid.

**Parameters:**
- `prompt`: Prompt text to validate

**Returns:** `boolean` - True if prompt is valid

**Validation Rules:**
- Checks if string
- Ensures not empty
- Validates length limits
- Checks for prohibited content

**Usage:**
Use this function before sending prompt to FAL API. Validates prompt is safe and within limits. Prevents errors from invalid prompts.

**Related:**
- Helper functions: `src/infrastructure/utils/helpers.util.ts`

## Usage Guidelines

### For Type Safety

**Type Narrowing Pattern:**
1. Receive unknown value from external source
2. Use appropriate type guard function
3. TypeScript narrows type in conditional block
4. Safely use value with correct type

**Benefits:**
- Runtime type safety
- Compile-time type narrowing
- Prevents type errors
- Catches invalid data early

### For Data Validation

**Validation Pattern:**
1. Receive data from user input or API
2. Use validation function appropriate to data type
3. Check return value
4. Handle invalid data appropriately

**Best Practices:**
- Always validate external data
- Validate user input before processing
- Check API responses before use
- Provide clear error messages for invalid data

### For Image Data

**Image Validation Pattern:**
1. Receive image data from source
2. Use `isValidBase64Image()` to validate
3. Use `formatImageDataUri()` if needed
4. Pass to FAL API only if valid

**Related:**
- Helper functions: `src/infrastructure/utils/helpers.util.ts`
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### For Error Handling

**Error Type Validation:**
1. Receive error type from unknown source
2. Use `isFalErrorType()` to validate
3. Use in switch statement for type-safe handling
4. Handle all error types

**Related:**
- Error types: `src/domain/entities/error.types.ts`

## Best Practices

### 1. Always Validate External Data

Validate all data from external sources:
- User input
- API responses
- File uploads
- Configuration data

### 2. Use Type Guards for Type Safety

Leverage TypeScript type narrowing:
- Use before processing unknown values
- Combine with conditional types
- Enable type-safe operations
- Prevent type errors

### 3. Validate Before API Calls

Check data before sending to FAL API:
- Validate image data format
- Check prompt validity
- Verify API key format
- Prevent unnecessary API errors

### 4. Provide Clear Error Messages

Give useful feedback for invalid data:
- Indicate what failed validation
- Provide guidance for correction
- Show format requirements
- Suggest valid examples

### 5. Handle Invalid Data Gracefully

Respond appropriately to invalid data:
- Return error to user
- Log validation failures
- Don't crash application
- Provide recovery options

## For AI Agents

### When Using Type Guards

**DO:**
- Import from package root
- Use type guards before processing
- Validate all external data
- Leverage type narrowing
- Handle invalid data
- Provide clear errors
- Use appropriate guard for data type

**DON'T:**
- Assume data types
- Skip type checking
- Process invalid data
- Ignore type safety
- Create duplicate guards
- Use wrong guard for data
- Assume validation passes

### When Validating Data

**DO:**
- Validate user input
- Check API responses
- Verify file uploads
- Validate configuration
- Use specific validation functions
- Handle invalid data appropriately
- Log validation failures

**DON'T:**
- Skip validation
- Assume data format
- Process invalid data
- Ignore validation results
- Use generic checks only
- Allow invalid data through
- Hide validation errors

### When Adding Guards

**For New Type Guards:**
1. Add to type guards file
2. Follow naming convention (`isXxx`)
3. Return boolean for simple checks
4. Return detailed info if needed
5. Update exports
6. Document in this README

**For New Validators:**
1. Add validation function
2. Follow naming convention (`isValidXxx`)
3. Check all relevant conditions
4. Provide clear return values
5. Handle edge cases
6. Document validation rules

**For Enhanced Validation:**
1. Review existing validation logic
2. Add stricter checks if needed
3. Improve error messages
4. Update documentation
5. Test with edge cases

## Implementation Notes

**Location:** `src/infrastructure/utils/type-guards.util.ts`

**Dependencies:**
- No external dependencies
- Pure validation functions
- Used throughout the provider

**Function Categories:**
- Type guards for enum validation
- Data validation functions
- Format validation functions
- Safety checks

**Import:**
```typescript
import {
  isFalModelType,
  isModelType,
  isFalErrorType,
  isValidBase64Image,
  isValidApiKey,
  isValidPrompt
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Helper functions: `src/infrastructure/utils/helpers.util.ts`
- Error types: `src/domain/entities/error.types.ts`
- Model types: `src/domain/types/model-selection.types.ts`

## Related Documentation

- [Helper Utilities](./helpers.util.README.md)
- [Error Types](../../domain/entities/error.types.README.md)
- [Model Selection Types](../../domain/types/model-selection.types.README.md)
