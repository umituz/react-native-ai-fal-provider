# Error Categorizer

FAL AI error categorization system for automatic error type detection and retryability determination.

**Location:** `src/infrastructure/utils/error-categorizer.ts`

## Overview

The error categorizer analyzes raw error messages and determines error type, retryability, and message keys. It uses pattern matching on error messages, status codes, and error structures to categorize errors consistently.

## Purpose

Automates error categorization by:
- Analyzing error messages for patterns
- Determining error types automatically
- Setting retryability flags correctly
- Providing message keys for translations
- Supporting consistent error handling

## Import

```typescript
import { categorizeFalError } from '@umituz/react-native-ai-fal-provider';
```

## Functions

### categorizeFalError

Analyze and categorize error message.

**Parameters:**
- `error`: Error object from any source (Error, string, number, unknown)

**Returns:** `FalErrorCategory` - Categorized error information

**Structure:**
- `type`: Error type from `FalErrorType` enum
- `messageKey`: i18n translation key for user message
- `retryable`: Boolean indicating if error can be retried

**Usage:**
Use in catch blocks to automatically categorize errors. The function analyzes error message content, status codes, and error structure to determine the appropriate category.

**Implementation:** See `src/infrastructure/utils/error-categorizer.ts` for complete categorization logic

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`

## Error Categories

### Network Errors

**Pattern Keywords:** network, fetch, connection, econnrefused, enotfound, etimedout

**Type:** `FalErrorType.NETWORK`

**Retryable:** Yes

**Message Key:** `fal.errors.network`

**Usage:** Network connectivity errors are temporary and should be retried. Use for connection failures, DNS errors, and network timeouts.

### Timeout Errors

**Pattern Keywords:** timeout, timed out

**Type:** `FalErrorType.TIMEOUT`

**Retryable:** Yes

**Message Key:** `fal.errors.timeout`

**Usage:** Request timeouts may succeed on retry. Implement with longer timeout on retry.

### Validation Errors

**Pattern Keywords:** validation, invalid, unprocessable, 422, bad request, 400

**Type:** `FalErrorType.VALIDATION`

**Retryable:** No

**Message Key:** `fal.errors.invalid_input`

**Usage:** Input validation failures require input correction. Do not retry without fixing input.

### Content Policy Errors

**Pattern Keywords:** content_policy, content policy, policy violation, nsfw, inappropriate

**Type:** `FalErrorType.CONTENT_POLICY`

**Retryable:** No

**Message Key:** `fal.errors.nsfw_content`

**Usage:** Content policy violations require content changes. Do not retry with same content.

**Related:**
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`

### Rate Limit Errors

**Pattern Keywords:** rate limit, too many requests, 429, quota

**Type:** `FalErrorType.RATE_LIMIT`

**Retryable:** Yes

**Message Key:** `fal.errors.rate_limit`

**Usage:** Rate limit errors require waiting before retry. Implement exponential backoff.

### Authentication Errors

**Pattern Keywords:** unauthorized, 401, forbidden, 403, api key, authentication

**Type:** `FalErrorType.AUTHENTICATION`

**Retryable:** No

**Message Key:** `fal.errors.authentication`

**Usage:** Authentication failures require valid API key. Do not retry without fixing credentials.

### Quota Exceeded Errors

**Pattern Keywords:** quota exceeded, insufficient credits, billing, payment required, 402

**Type:** `FalErrorType.QUOTA_EXCEEDED`

**Retryable:** No

**Message Key:** `fal.errors.quota_exceeded`

**Usage:** Quota limits require payment or upgrade. Do not retry without increasing quota.

### Model Not Found Errors

**Pattern Keywords:** model not found, endpoint not found, 404, not found

**Type:** `FalErrorType.MODEL_UNAVAILABLE`

**Retryable:** Yes

**Message Key:** `fal.errors.model_unavailable`

**Usage:** Model availability issues may be temporary. Retry after checking model availability.

### API Errors

**Pattern Keywords:** api error, 502, 503, 504, 500, internal server error

**Type:** `FalErrorType.UNKNOWN`

**Retryable:** Yes

**Message Key:** `fal.errors.unknown`

**Usage:** Server errors may be temporary. Retry with backoff.

## Categorization Strategy

### Pattern Matching

**Detection Order:**
1. Check HTTP status codes (401, 403, 404, 422, 429, 500, 502, 503, 504)
2. Search error message for pattern keywords
3. Check error type names
4. Check error codes
5. Default to unknown type

**Pattern Priority:**
- Status codes have highest priority
- Specific keywords override general patterns
- First matching pattern wins
- Unknown type is fallback

**Implementation:** See pattern definitions in `src/infrastructure/utils/error-categorizer.ts`

### Retryability Rules

**Always Retryable:**
- Network errors (temporary connectivity issues)
- Timeout errors (may succeed with longer timeout)
- Rate limit errors (after waiting period)
- Model unavailable errors (temporary)
- API server errors (temporary)

**Never Retryable:**
- Authentication errors (require credential fix)
- Quota exceeded errors (require payment)
- Validation errors (require input fix)
- Content policy errors (require content change)
- NSFW content errors (require content moderation)

**Usage:** Use `retryable` flag to determine retry behavior. Implement appropriate backoff for retryable errors.

## Usage Guidelines

### For Error Handling

**Standard Pattern:**
1. Wrap API calls in try-catch
2. Call `categorizeFalError()` with caught error
3. Check `type` for specific handling
4. Check `retryable` before retrying
5. Use `messageKey` for user display

**Type-Specific Handling:**
- Authentication: Prompt for API key
- Quota: Show upgrade dialog
- Rate limit: Wait and retry with backoff
- Network: Show connection error, allow retry
- Timeout: Allow retry with longer timeout
- Validation: Show input requirements
- Content policy: Show policy notice

**Related:**
- Error types: `src/domain/entities/error.types.ts`

### For Retry Logic

**Retryable Errors:**
- Check `retryable` flag before retry
- Implement exponential backoff for rate limits
- Use longer timeouts for timeout errors
- Allow immediate retry for network errors
- Set reasonable retry limits

**Non-Retryable Errors:**
- Do not automatically retry
- Require user intervention
- Fix underlying issue first
- Provide clear guidance to user

### For User Messages

**Message Key Usage:**
1. Get `messageKey` from category
2. Look up translation in i18n system
3. Display user-friendly message
4. Include actionable next steps
5. Contextualize by error type

**Translation Keys:**
See complete list in error mapper documentation at `src/infrastructure/utils/error-mapper.README.md`

## Best Practices

### 1. Always Categorize Errors

Categorize all caught errors:
- Call `categorizeFalError()` in catch blocks
- Use returned category for handling
- Don't manually interpret error messages
- Maintain consistent categorization

### 2. Respect Retryability

Honor the retryable flag:
- Never retry non-retryable errors
- Always check before attempting retry
- Implement appropriate backoff strategies
- Set retry limits for retryable errors

### 3. Handle Types Specifically

Provide type-specific handling:
- Authentication: Request new API key
- Quota: Show payment/upgrade options
- Rate limit: Implement backoff
- Network: Show connectivity message
- Validation: Display input requirements
- Content policy: Show policy details

### 4. Use Message Keys

Leverage message key system:
- Use for i18n translations
- Provide consistent messaging
- Support multiple languages
- Include context in translations

### 5. Log Categorization

Track error categories:
- Log categorized types for analytics
- Monitor error patterns over time
- Identify recurring issues
- Track retry success rates

## For AI Agents

### When Using Error Categorizer

**DO:**
- Import from package root
- Categorize all caught errors
- Check retryability flag
- Handle each type appropriately
- Use message keys for display
- Log categorized errors
- Implement type-specific handling

**DON'T:**
- Manually parse error messages
- Ignore categorization results
- Retry non-retryable errors
- Skip type-specific handling
- Show raw errors to users
- Assume all errors are retryable
- Create duplicate categorization logic

### When Handling Errors

**DO:**
- Wrap all API calls in try-catch
- Call `categorizeFalError()` immediately
- Check `type` for specific handling
- Use `retryable` for retry decisions
- Display user-friendly messages
- Implement proper retry logic
- Log errors with category

**DON'T:**
- Let errors propagate uncategorized
- Assume error structure
- Implement custom categorization
- Retry without checking retryable
- Show technical messages to users
- Skip error logging
- Use generic error handling

### When Adding Error Types

**For New Error Categories:**
1. Add type to `FalErrorType` enum in `src/domain/entities/error.types.ts`
2. Add pattern keywords to categorizer
3. Set appropriate retryability
4. Add message key for translations
5. Update this README
6. Test categorization

**For New Pattern Keywords:**
1. Add keyword to appropriate pattern array
2. Test keyword matching
3. Update documentation
4. Verify categorization works
5. Add tests for new patterns

**For Enhanced Categorization:**
1. Review existing pattern matching
2. Add new detection methods if needed
3. Improve categorization accuracy
4. Update TypeScript types
5. Document changes thoroughly

## Implementation Notes

**Location:** `src/infrastructure/utils/error-categorizer.ts`

**Dependencies:**
- Uses error types from `src/domain/entities/error.types.ts`
- No external dependencies
- Pure pattern matching logic

**Patterns:** Defined in `src/infrastructure/utils/error-categorizer.ts`
- Network patterns
- Timeout patterns
- Validation patterns
- Content policy patterns
- Rate limit patterns
- Authentication patterns
- Quota patterns
- Model availability patterns
- API error patterns

**Import:**
```typescript
import { categorizeFalError } from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Related Documentation

- [Error Types](../../domain/entities/error.types.README.md)
- [Error Mapper](./error-mapper.README.md)
- [Type Guards](./type-guards.util.README.md)
