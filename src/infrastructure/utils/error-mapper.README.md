# Error Mapper

FAL API error mapping system for categorizing errors and converting to user-friendly messages.

**Location:** `src/infrastructure/utils/error-mapper.ts`

## Overview

The error mapper system provides utilities for mapping FAL API errors to standardized error information. It categorizes errors, determines retryability, and provides user-friendly message keys for display.

## Purpose

Standardizes error handling across the application by:
- Categorizing FAL API errors into types
- Determining if errors are retryable
- Providing user-friendly message keys
- Preserving original error information
- Supporting consistent error handling

## Import

```typescript
import { mapFalError, isFalErrorRetryable } from '@umituz/react-native-ai-fal-provider';
```

## Functions

### mapFalError

Map FAL API error to standardized error information.

**Parameters:**
- `error`: Error object from FAL API or unknown source

**Returns:** `FalErrorInfo` - Standardized error information object

**Usage:**
Call this function in catch blocks to convert errors to standard format. Use the returned object to display appropriate messages and determine retry behavior.

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### isFalErrorRetryable

Check if an error is retryable.

**Parameters:**
- `error`: Error object from FAL API or unknown source

**Returns:** `boolean` - True if error can be retried

**Usage:**
Use this function to determine if failed operations should be retried. Network errors, timeouts, and rate limits are retryable. Authentication and validation errors are not.

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### categorizeFalError

Categorize error by type and retryability.

**Parameters:**
- `error`: Error object from FAL API or unknown source

**Returns:** `FalErrorCategory` - Error category with type and retry information

**Usage:**
Use this function to get detailed error categorization. Provides error type, retryability, and message key for comprehensive error handling.

**Related:**
- Error types: `src/domain/entities/error.types.ts`

## Error Types

**FalErrorType Enumeration:**

| Type | Retryable | Description |
|------|-----------|-------------|
| `authentication` | ❌ No | Invalid or missing API key |
| `quota_exceeded` | ❌ No | Credit limit reached |
| `rate_limit` | ✅ Yes | Too many requests |
| `invalid_input` | ❌ No | Invalid input parameters |
| `model_unavailable` | ✅ Yes | Model temporarily unavailable |
| `network` | ✅ Yes | Network connectivity error |
| `timeout` | ✅ Yes | Request timeout |
| `nsfw_content` | ❌ No | NSFW content detected |
| `validation` | ❌ No | Input validation failed |
| `content_policy` | ❌ No | Content policy violation |
| `unknown` | ✅ Yes | Unknown error |

**Implementation:** See `src/domain/entities/error.types.ts` for complete type definitions

## Usage Guidelines

### For Error Mapping

**Standard Pattern:**
1. Wrap API calls in try-catch
2. Call `mapFalError()` in catch block
3. Use returned `FalErrorInfo` for display
4. Check `retryable` property before retrying
5. Display user-friendly message using `messageKey`

**Error Information Structure:**
- `type`: Error category from `FalErrorType`
- `messageKey`: Translation key for user message
- `retryable`: Whether error can be retried
- `originalError`: Original error object
- `statusCode`: HTTP status code if available

**Related:**
- Error types: `src/domain/entities/error.types.ts`

### For Retry Logic

**Retryable Errors:**
- Network errors (temporary)
- Timeout errors (may succeed on retry)
- Rate limit errors (wait before retry)
- Model unavailable errors (temporary)

**Non-Retryable Errors:**
- Authentication errors (require API key fix)
- Quota exceeded (require payment/upgrade)
- Invalid input (require input correction)
- NSFW content (require content change)
- Validation errors (require input fix)
- Content policy violations (require content change)

**Usage:**
Check `isFalErrorRetryable()` or `errorInfo.retryable` before attempting retry. Implement backoff for rate limit errors.

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### For User Messages

**Message Keys:**
Use `messageKey` from `FalErrorInfo` for translation:
- `fal.errors.authentication`: API key required
- `fal.errors.quota_exceeded`: Credit limit reached
- `fal.errors.rate_limit`: Too many requests
- `fal.errors.invalid_input`: Invalid input provided
- `fal.errors.network`: Network error occurred
- `fal.errors.timeout`: Request timed out
- `fal.errors.nsfw_content`: Inappropriate content
- `fal.errors.unknown`: Unknown error occurred

**Display Pattern:**
1. Get `messageKey` from error info
2. Look up translation in i18n system
3. Display to user with appropriate styling
4. Include `originalError` in debug logs

**Related:**
- Error types: `src/domain/entities/error.types.ts`

### For Error Categorization

**Category Detection:**
1. Call `categorizeFalError()` with error
2. Check `type` for error category
3. Check `retryable` for retry behavior
4. Use `messageKey` for display

**Advanced Usage:**
- Track error types for analytics
- Implement specific handling per type
- Customize retry strategy by type
- Log errors with full categorization

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

## Best Practices

### 1. Always Map Errors

Map all errors from FAL API:
- Call `mapFalError()` in every catch block
- Use standardized error info for handling
- Don't rely on raw error objects
- Maintain consistent error handling

### 2. Check Retryability

Always check before retrying:
- Use `isFalErrorRetryable()` function
- Check `retryable` property in error info
- Don't retry non-retryable errors
- Implement backoff for rate limits

### 3. Provide User Feedback

Display appropriate messages:
- Use `messageKey` for translations
- Show clear error descriptions
- Indicate if retry is possible
- Provide actionable next steps

### 4. Log Original Errors

Preserve original error information:
- Include `originalError` in logs
- Log `statusCode` if available
- Use `type` for filtering
- Maintain full context for debugging

### 5. Handle All Error Types

Prepare for every error type:
- Authentication: Prompt for API key
- Quota: Show upgrade message
- Rate limit: Implement backoff
- Network: Show connection error
- Timeout: Allow retry with longer timeout
- Validation: Show input requirements
- NSFW: Show content policy notice

## For AI Agents

### When Using Error Mapper

**DO:**
- Import from package root
- Map all FAL API errors
- Check retryability before retrying
- Use message keys for display
- Log original errors
- Handle all error types
- Provide user feedback

**DON'T:**
- Use raw error objects
- Skip error mapping
- Retry non-retryable errors
- Show technical errors to users
- Ignore error categorization
- Forget original error logging
- Assume all errors are retryable

### When Handling Errors

**DO:**
- Wrap API calls in try-catch
- Call `mapFalError()` in catch
- Check `retryable` property
- Display user-friendly messages
- Implement retry logic appropriately
- Log errors for debugging
- Handle each error type specifically

**DON'T:**
- Let errors propagate uncaught
- Show raw error messages
- Retry without checking
- Ignore error types
- Skip logging
- Use generic error handling
- Assume error structure

### When Adding Features

**For New Error Types:**
1. Add type to `FalErrorType` enum
2. Add detection logic in categorizer
3. Add message key to translations
4. Set retryability appropriately
5. Update this README
6. Test error handling

**For New Error Functions:**
1. Add function to error mapper
2. Follow existing patterns
3. Update exports
4. Document in this README
5. Test with various errors

**For Enhanced Error Info:**
1. Extend `FalErrorInfo` type
2. Add new properties as needed
3. Update mapping logic
4. Update TypeScript types
5. Document new properties

## Implementation Strategy

### Error Detection

**Detection Logic:**
1. Check error type and structure
2. Examine error message content
3. Check HTTP status code if available
4. Match against known error patterns
5. Categorize by type

**Priority:**
1. HTTP status codes (401, 429, 500, etc.)
2. Error message keywords
3. Error type names
4. Error codes
5. Default to unknown

### Retry Determination

**Retryable Criteria:**
- Network connectivity errors
- Timeout errors
- Rate limit errors (with backoff)
- Temporary server errors
- Model unavailable errors

**Non-Retryable Criteria:**
- Authentication failures
- Authorization failures
- Invalid input
- Validation errors
- Content policy violations
- Quota exceeded

### Message Key Generation

**Key Pattern:**
- Base prefix: `fal.errors.`
- Error type suffix: `{type}`
- Example: `fal.errors.authentication`

**Usage:**
- Use with i18n translation systems
- Provide fallback messages
- Include context in translations
- Support parameterized messages

## Implementation Notes

**Location:** `src/infrastructure/utils/error-mapper.ts`

**Dependencies:**
- Uses error types from `src/domain/entities/error.types.ts`
- Integrates with error categorizer from `src/infrastructure/utils/error-categorizer.ts`
- No external dependencies

**Functions:**
- `mapFalError(error: unknown): FalErrorInfo`
- `isFalErrorRetryable(error: unknown): boolean`
- `categorizeFalError(error: unknown): FalErrorCategory`

**Import:**
```typescript
import {
  mapFalError,
  isFalErrorRetryable,
  categorizeFalError
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`

## Related Documentation

- [Error Types](../../domain/entities/error.types.README.md)
- [Error Categorizer](./error-categorizer.README.md)
- [NSFW Validator](../validators/nsfw-validator.README.md)
