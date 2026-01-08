# FAL Provider Subscription

Manages FAL subscription and run operations.

**Location:** `src/infrastructure/services/fal-provider-subscription.ts`

## Overview

This module handles asynchronous operations with the FAL API, manages timeouts, handles cancellations, and performs NSFW validation for generation requests.

## Purpose

Provides subscription management by:
- Handling async FAL subscriptions
- Managing operation timeouts
- Supporting request cancellation
- Performing NSFW validation
- Tracking status updates
- Managing polling intervals

## Import

```typescript
import {
  handleFalSubscription,
  handleFalRun
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### handleFalSubscription

Manages FAL subscription operation with timeout and cancellation support.

**Parameters:**
- `model`: FAL model ID string
- `input`: Model input object
- `options`: Subscription options (timeout, callbacks)
- `signal`: AbortSignal for cancellation (optional)

**Returns:** Promise with result and requestId

**Options:**
- `timeoutMs`: Operation timeout in milliseconds
- `onQueueUpdate`: Status update callback
- `onResult`: Result callback

**Usage:**
Use for async generation with progress tracking. Handle cancellations with AbortSignal. Configure timeout based on model type.

### handleFalRun

Manages FAL run operation (synchronous execution).

**Parameters:**
- `model`: FAL model ID string
- `input`: Model input object
- `options`: Run options (progress callback)

**Returns:** Promise with result

**Options:**
- `onProgress`: Progress update callback

**Usage:**
Use for simpler synchronous-style operations. Track progress with callbacks. Less control than subscription.

## Usage Guidelines

### For Subscription Operations

**Subscription Pattern:**
1. Create AbortController for cancellation
2. Call handleFalSubscription with model and input
3. Configure timeout appropriately
4. Set up status update callbacks
5. Handle result or error
6. Clean up controller

**Best Practices:**
- Set appropriate timeouts for model type
- Use AbortController for cancellation
- Track status updates for UI
- Handle NSFW content errors
- Clean up resources properly

### For Timeout Management

**Timeout Pattern:**
1. Determine appropriate timeout for model type
2. Add buffer for queue times
3. Handle timeout errors gracefully
4. Inform users of long operations
5. Consider retry options

**Timeout Guidelines:**
- Text-to-image: 60,000 - 120,000ms
- Text-to-video: 180,000 - 300,000ms
- Image-to-video: 180,000 - 300,000ms
- Text-to-voice: 30,000 - 60,000ms

### For Cancellation

**Cancellation Pattern:**
1. Create AbortController before request
2. Pass signal to subscription function
3. Call abort() to cancel
4. Handle cancellation errors
5. Clean up resources

**Best Practices:**
- Always clean up controllers
- Handle cancellation gracefully
- Inform users of cancellation
- Don't retry cancelled requests
- Release resources properly

## Best Practices

### 1. Set Appropriate Timeouts

Configure timeouts based on model:
- Use shorter timeouts for fast models
- Use longer timeouts for video generation
- Add buffer for queue times
- Consider network conditions
- Inform users of expected wait times

### 2. Manage Cancellation

Handle user cancellations:
- Provide cancel button in UI
- Use AbortController for control
- Clean up on unmount
- Handle cancellation errors
- Don't retry cancelled requests

### 3. Track Status Updates

Monitor operation progress:
- Display queue position
- Show current status
- Update UI frequently
- Provide feedback to users
- Handle status changes

### 4. Handle NSFW Content

Validate content appropriately:
- Catch NSFW content errors
- Display user-friendly messages
- Don't retry NSFW requests
- Guide users to acceptable content
- Track NSFW occurrences

### 5. Clean Up Resources

Manage lifecycle properly:
- Always clean up AbortControllers
- Clear timeouts
- Release references
- Handle unmount scenarios
- Prevent memory leaks

## For AI Agents

### When Using Subscription Functions

**DO:**
- Set appropriate timeouts
- Use AbortController for cancellation
- Handle status updates
- Catch NSFW content errors
- Clean up resources
- Handle timeout errors
- Track request state

**DON'T:**
- Use default timeouts for all models
- Skip cancellation handling
- Ignore status updates
- Forget NSFW validation
- Leave resources allocated
- Retry NSFW requests
- Handle cancellations poorly

### When Managing Timeouts

**DO:**
- Adjust timeout for model type
- Add buffer for queue times
- Handle timeout errors
- Inform users of long waits
- Consider retry strategies
- Test timeout values
- Monitor operation times

**DON'T:**
- Use one timeout for all models
- Skip timeout handling
- Ignore queue times
- Leave users uninformed
- Set arbitrary timeouts
- Forget error handling
- Block UI indefinitely

### When Handling Cancellation

**DO:**
- Use AbortController
- Provide cancel UI
- Clean up properly
- Handle cancellation errors
- Inform users of cancellation
- Release resources
- Prevent memory leaks

**DON'T:**
- Skip cancellation support
- Forget cleanup
- Ignore cancellation errors
- Leave users confused
- Retry cancelled requests
- Create resource leaks
- Handle cancellation poorly

## Implementation Notes

**Location:** `src/infrastructure/services/fal-provider-subscription.ts`

**Dependencies:**
- FAL client library
- NSFW validator
- Status mapper
- Timeout utilities

**Operations:**
- Async subscription with polling
- Timeout management
- Cancellation support
- NSFW validation
- Status tracking
- Progress reporting

**Import:**
```typescript
import {
  handleFalSubscription,
  handleFalRun
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Status mapper: `src/infrastructure/services/fal-status-mapper.ts`
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`
