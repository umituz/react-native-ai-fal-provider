# Error Types

Type definitions for FAL AI error management, categorization, and user-friendly messaging.

**Location:** `src/domain/entities/error.types.ts`

## Overview

This module contains TypeScript type definitions used throughout the FAL AI provider for error handling, categorization, and user messaging. It provides consistent error structures across the application.

## Purpose

Standardizes error handling by:
- Defining error type enumeration
- Providing error information structures
- Supporting retry logic with type safety
- Enabling consistent error categorization
- Facilitating user-friendly error messages

## Types

### FalErrorType

Enumeration of all error types in the FAL AI system.

**Values:**
- `network`: Network connectivity errors
- `timeout`: Request timeout errors
- `authentication`: Authentication and authorization failures
- `quota_exceeded`: Credit quota limit reached
- `rate_limit`: API rate limit exceeded
- `invalid_input`: Input validation failures
- `model_unavailable`: Model temporarily unavailable
- `nsfw_content`: NSFW content detected
- `validation`: General validation errors
- `content_policy`: Content policy violations
- `unknown`: Uncategorized errors

**Usage:**
Use to check error type and implement type-specific handling. Import from package root when working with error types.

**Implementation:** See complete enum definition in `src/domain/entities/error.types.ts`

### FalErrorCategory

Basic error category information.

**Structure:**
- `type`: Error type from `FalErrorType` enum
- `messageKey`: i18n translation key for user messages
- `retryable`: Boolean indicating if error can be retried

**Usage:**
Returned by error categorization functions. Use for quick error type checking and retry decisions.

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### FalErrorInfo

Comprehensive error information object.

**Structure:**
- `type`: Error type from `FalErrorType` enum
- `messageKey`: i18n translation key for user messages
- `retryable`: Boolean indicating if error can be retried
- `originalError`: Original error message or object
- `statusCode`: HTTP status code if available

**Usage:**
Primary error information structure used throughout the application. Contains all necessary information for error handling, user display, and logging.

**Related:**
- Error mapper: `src/infrastructure/utils/error-mapper.ts`

### FalErrorMessages

Optional interface for custom error messages.

**Structure:**
Optional string properties for each error type

**Usage:**
Use for providing custom error messages. Not typically used directly - prefer message keys with i18n system.

## Type Usage

### For Error Type Checking

**Pattern:**
1. Import `FalErrorType` from package
2. Compare error info `type` property
3. Implement type-specific handling
4. Use switch or if statements

**Type Comparison:**
Use strict equality (`===`) for type checking. This ensures type safety and prevents errors from misspelled type strings.

### For Error Information Access

**Access Pattern:**
1. Get `FalErrorInfo` from error mapper
2. Access `type` for category
3. Access `messageKey` for user display
4. Check `retryable` for retry decisions
5. Log `originalError` for debugging
6. Use `statusCode` if available

**Property Reference:**
See property descriptions above for complete usage information.

### For Retry Logic

**Retry Checking:**
Use `retryable` property from error info or category:
- Check before attempting retry
- Implement appropriate backoff
- Respect non-retryable errors
- Set retry limits appropriately

**Related:**
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### For User Messaging

**Message Keys:**
Use `messageKey` property for translations:
- Format: `fal.errors.{type}`
- Use with i18n translation system
- Provide consistent user-facing messages
- Support multiple languages

**Implementation:** See error mapper documentation for complete key list

## Type Definitions Reference

**Import:**
```typescript
import type {
  FalErrorType,
  FalErrorCategory,
  FalErrorInfo
} from '@umituz/react-native-ai-fal-provider';
```

**Related Files:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Best Practices

### 1. Use Type Imports

Import types correctly:
- Use `import type` for type-only imports
- Import from package root
- Don't import from internal paths
- Maintain consistent import style

### 2. Check Types Strictly

Compare error types properly:
- Use strict equality (`===`)
- Don't use loose equality (`==`)
- Check against enum values
- Handle all type cases

### 3. Handle All Types

Prepare for every error type:
- Switch statements should cover all cases
- Provide default handling for unknown
- Don't ignore specific types
- Update handlers when adding types

### 4. Use Message Keys

Leverage message key system:
- Use `messageKey` for all user messages
- Don't hardcode error text
- Support i18n translations
- Keep messages consistent

### 5. Preserve Original Errors

Maintain error context:
- Log `originalError` for debugging
- Include in error reports
- Use for troubleshooting
- Don't modify or truncate

## For AI Agents

### When Using Error Types

**DO:**
- Import types from package root
- Use `FalErrorType` enum for type checking
- Check types with strict equality
- Handle all error type cases
- Use `messageKey` for display
- Check `retryable` before retrying
- Log `originalError` for debugging

**DON'T:**
- Import from internal paths
- Use string literals for types
- Use loose equality
- Skip error type handling
- Hardcode error messages
- Retry without checking retryable
- Discard original error info

### When Working with ErrorInfo

**DO:**
- Access all properties as needed
- Check `retryable` before retrying
- Use `messageKey` for translations
- Log `originalError` for debugging
- Use `statusCode` for specific handling
- Handle null/undefined properly

**DON'T:**
- Assume properties exist
- Skip null checks on optional fields
- Ignore retryable flag
- Hardcode message text
- Lose original error context
- Forget statusCode handling

### When Adding Error Types

**For New Error Types:**
1. Add value to `FalErrorType` enum
2. Update error categorizer patterns
3. Add message key to translations
4. Update error handling logic
5. Update this README
6. Test new error type

**For New Error Properties:**
1. Add to appropriate interface
2. Update error mapper
3. Update TypeScript types
4. Document new property
5. Test with all error types

**For Enhanced Type Safety:**
1. Review type definitions
2. Add stricter types where needed
3. Update type guards
4. Improve type coverage
5. Document type changes

## Implementation Notes

**Location:** `src/domain/entities/error.types.ts`

**Dependencies:**
- No external dependencies
- Pure TypeScript type definitions
- Used throughout error handling system

**Exports:**
- `FalErrorType` enum
- `FalErrorCategory` interface
- `FalErrorInfo` interface
- `FalErrorMessages` interface

**Import:**
```typescript
import type {
  FalErrorType,
  FalErrorCategory,
  FalErrorInfo
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`

## Related Documentation

- [Error Categorizer](../../infrastructure/utils/error-categorizer.README.md)
- [Error Mapper](../../infrastructure/utils/error-mapper.README.md)
- [Type Guards](../../infrastructure/utils/type-guards.util.README.md)
- [NSFW Validator](../../infrastructure/validators/nsfw-validator.README.md)
