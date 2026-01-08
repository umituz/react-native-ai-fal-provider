# useFalGeneration Hook

React hook for managing FAL AI generation operations with state management, error handling, and retry logic.

**Location:** `src/presentation/hooks/use-fal-generation.ts`

## Overview

The `useFalGeneration` hook provides complete state management for FAL AI generation operations including images, videos, and other content. It handles loading states, errors, cancellation, retry logic, and automatic cleanup.

## Purpose

Simplifies AI generation in React components by:
- Managing all generation states (loading, error, success)
- Providing automatic retry functionality
- Handling request cancellation
- Tracking request lifecycle
- Managing cleanup on unmount

## Import

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';
```

## Parameters

**Options:** `UseFalGenerationOptions`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeoutMs` | `number` | ❌ No | Maximum time to wait for generation (ms) |
| `onProgress` | `(status: FalQueueStatus) => void` | ❌ No | Callback for status updates during generation |
| `onError` | `(error: FalErrorInfo) => void` | ❌ No | Callback when error occurs |

**Implementation:** See `src/presentation/hooks/use-fal-generation.ts` for complete type definitions

## Return Values

**Result:** `UseFalGenerationResult<T>`

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| null` | Generated content result |
| `error` | `FalErrorInfo \| null` | Error information if generation failed |
| `isLoading` | `boolean` | True if generation is in progress |
| `isRetryable` | `boolean` | True if error can be retried |
| `requestId` | `string \| null` | Current request ID |
| `isCancelling` | `boolean` | True if cancellation is in progress |
| `generate` | `function` | Start generation function |
| `retry` | `function` | Retry failed generation function |
| `cancel` | `function` | Cancel current generation function |
| `reset` | `function` | Reset all states function |

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Queue status types: `src/domain/entities/fal.types.ts`

## Methods

### generate

Start AI generation operation.

**Parameters:**
- `modelEndpoint`: FAL model ID (e.g., 'fal-ai/flux/schnell')
- `input`: Job input object matching model requirements

**Returns:** `Promise<T | null>` - Generation result or null if failed

**Usage:**
Call this function to start a generation operation. The hook manages loading states automatically. Use builder functions from `src/infrastructure/utils/` to construct input objects.

**Related:**
- Input builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video builders: `src/infrastructure/utils/video-feature-builders.util.ts`

### retry

Retry the last failed generation operation.

**Returns:** `Promise<T | null>` - Generation result or null if failed

**Usage:**
Call this function to retry a failed generation. Uses the same model and input from the last failed attempt. Only works if `isRetryable` is true.

**Related:**
- Error categorization: `src/infrastructure/utils/error-categorizer.ts`

### cancel

Cancel the current generation operation.

**Usage:**
Call this function to abort an in-progress generation. Sets `isCancelling` to true and aborts the request. Use for user cancellation or cleanup.

**Related:**
- Provider cancellation: `src/infrastructure/services/fal-provider.ts`

### reset

Reset all states to initial values.

**Usage:**
Call this function to clear data, error, and loading states. Use before starting a new generation to ensure clean state.

## Usage Guidelines

### For Basic Generation

**Setup:**
1. Import `useFalGeneration` from package
2. Destructure required states and methods
3. Call `generate()` with model ID and input
4. Handle `data`, `error`, and `isLoading` states

**State Display:**
- Show loading indicator when `isLoading` is true
- Display error message when `error` is not null
- Render result when `data` is not null
- Check `isRetryable` before showing retry button

**Related:**
- Model constants: `src/domain/constants/default-models.constants.ts`

### For Progress Tracking

**Progress Callbacks:**
1. Provide `onProgress` callback in options
2. Monitor `status.status` for job state
3. Check `status.queuePosition` for queue information
4. Display progress to user

**Status Values:**
- `IN_QUEUE`: Job is queued (10% progress)
- `IN_PROGRESS`: Job is processing (50% progress)
- `COMPLETED`: Job finished (100% progress)

**Related:**
- Queue status types: `src/domain/entities/fal.types.ts`
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

### For Error Handling

**Error Callback:**
1. Provide `onError` callback in options
2. Check `error.type` for error category
3. Use `error.messageKey` for user-facing messages
4. Check `isRetryable` before allowing retry

**Error Types:**
- `quota_exceeded`: Credit limit reached
- `rate_limit`: Too many requests
- `authentication`: API key invalid
- `content_policy`: Content violation
- `network`: Network error
- `timeout`: Request timeout
- `unknown`: Unknown error

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`

### For Cancellation

**Cancellation Flow:**
1. Check `isLoading` before showing cancel button
2. Call `cancel()` when user cancels
3. Monitor `isCancelling` for cancellation state
4. Show appropriate feedback

**Best Practices:**
- Always check `isLoading` before enabling cancel
- Disable generation button while cancelling
- Show "Cancelling..." message during cancellation
- Handle cleanup properly

### For Retry Logic

**Retry Flow:**
1. Check `isRetryable` before showing retry option
2. Call `retry()` to attempt same generation
3. Handle retry result in `onError` or `onSuccess`
4. Limit retry attempts if needed

**Retryable Errors:**
- Network errors
- Timeout errors
- Rate limit errors
- Temporary server errors

**Non-Retryable Errors:**
- Authentication errors
- Content policy violations
- Quota exceeded
- Invalid input errors

**Related:**
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### For Cleanup

**Automatic Cleanup:**
- Hook automatically cancels on unmount
- AbortController is cleaned up
- No manual cleanup required

**Manual Cleanup:**
1. Call `cancel()` if needed
2. Call `reset()` to clear state
3. Handle cleanup in useEffect if needed

## Best Practices

### 1. Always Handle Loading State

Check `isLoading` before allowing actions:
- Disable generate button while loading
- Show loading indicator to user
- Prevent duplicate submissions
- Handle cancellation properly

### 2. Provide User Feedback

Give clear feedback for all states:
- Show loading message with progress
- Display user-friendly error messages
- Show success confirmation
- Indicate retry availability

### 3. Use Appropriate Timeouts

Set timeout based on model type:
- Text-to-image: 2 minutes (120000ms)
- Text-to-video: 5 minutes (300000ms)
- Image features: 1 minute (60000ms)
- Adjust based on your use case

### 4. Reset Between Generations

Clear state before new operations:
- Call `reset()` before new generation
- Ensures clean state
- Prevents stale data display
- Avoids confusion

### 5. Handle Errors Gracefully

Implement comprehensive error handling:
- Check `isRetryable` before retry
- Show user-friendly messages
- Log errors for debugging
- Provide retry option when appropriate

## For AI Agents

### When Using useFalGeneration

**DO:**
- Import from package root
- Destructure all needed values
- Handle all states (loading, error, data)
- Use builder functions for inputs
- Check `isRetryable` before retry
- Cancel on unmount (automatic)
- Reset state between generations
- Provide user feedback

**DON'T:**
- Skip error handling
- Ignore loading states
- Retry without checking `isRetryable`
- Build input objects manually
- Forget to handle cancellation
- Show stale data
- Use undefined types

### When Building Components

**DO:**
- Check all state values before rendering
- Disable buttons appropriately
- Show loading indicators
- Display error messages clearly
- Handle null data gracefully
- Use proper TypeScript types
- Test all error scenarios

**DON'T:**
- Assume data is always present
- Forget loading states
- Ignore error states
- Allow actions while loading
- Skip null checks
- Use any types
- Ignore edge cases

### When Adding Features

**For New Callback Options:**
1. Add option to `UseFalGenerationOptions` type
2. Implement callback in hook logic
3. Document in this README
4. Test with various scenarios
5. Update related hooks if needed

**For New State Values:**
1. Add to `UseFalGenerationResult` type
2. Implement state management in hook
3. Update TypeScript types
4. Document usage guidelines
5. Provide migration guide if breaking

**For New Methods:**
1. Add function to return object
2. Implement with proper error handling
3. Update TypeScript types
4. Document in this README
5. Test thoroughly

## Implementation Strategy

### State Management

**Managed States:**
- `data`: Result of generation (null initially)
- `error`: Error information (null initially)
- `isLoading`: Loading state (boolean)
- `isRetryable`: Whether error can be retried (boolean)
- `requestId`: Current request ID (null initially)
- `isCancelling`: Cancellation state (boolean)

**State Updates:**
- States update automatically during generation
- Reset manually via `reset()` method
- States persist until reset or new generation

### Request Tracking

**Last Request Storage:**
- Stores last model endpoint and input
- Used for retry functionality
- Stored in ref to prevent re-renders
- Updates on each `generate()` call

**Cleanup:**
- Automatic cleanup on unmount
- AbortController cancellation
- State reset optional
- No memory leaks

### Error Handling

**Error Categorization:**
- Uses error categorizer from `src/infrastructure/utils/error-categorizer.ts`
- Determines if error is retryable
- Provides user-friendly error messages
- Categorizes by error type

**Error Callback:**
- Called when error occurs
- Receives `FalErrorInfo` object
- Use for user notifications
- Can trigger automatic retry

## Implementation Notes

**Location:** `src/presentation/hooks/use-fal-generation.ts`

**Dependencies:**
- Uses `falProvider` from `src/infrastructure/services/fal-provider.ts`
- Uses error utilities from `src/infrastructure/utils/error-mapper.ts`
- Uses error categorizer from `src/infrastructure/utils/error-categorizer.ts`
- Integrates with React hooks (useState, useEffect, useRef, useCallback)

**TypeScript Types:**
- Generic type parameter for result typing
- Strongly typed options and result
- Type-safe error handling
- Proper null handling

**Import:**
```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- useModels hook: `src/presentation/hooks/use-models.README.md`
- Hooks index: `src/presentation/hooks/index.README.md`
- Provider: `src/infrastructure/services/fal-provider.README.md`

## Related Documentation

- [useModels Hook](./use-models.README.md)
- [React Hooks Index](./index.README.md)
- [FalProvider](../services/fal-provider.README.md)
- [Error Types](../../domain/entities/error.types.README.md)
- [Error Mapper](../utils/error-mapper.README.md)
