# Services Index

Central export point for all infrastructure services and utility functions.

**Location:** `src/infrastructure/services/index.ts`

## Overview

The services module provides the core infrastructure for interacting with the FAL AI API. It exports the main `FalProvider` service, model management service, error classes, and utility functions for feature model lookups and request management.

## Purpose

Centralizes service exports by:
- Providing single import point for services
- Exporting service instances and classes
- Exposing utility functions
- Maintaining clean API surface
- Facilitating service access

## Import

```typescript
import {
  falProvider,
  falModelsService,
  getImageFeatureModel,
  getVideoFeatureModel,
  cancelCurrentFalRequest,
  hasRunningFalRequest,
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### Classes

#### FalProvider

Main provider class for FAL AI operations.

**Exports:**
- `FalProvider` - Class implementation
- `falProvider` - Singleton instance
- `FalProviderType` - TypeScript type export

**Documentation:** See `src/infrastructure/services/fal-provider.README.md`

#### FalModelsService

Service for managing FAL AI model configurations.

**Exports:**
- `falModelsService` - Service instance
- `FalModelConfig` - Model configuration type

**Documentation:** See `src/infrastructure/services/fal-models-service.README.md`

#### NSFWContentError

Error class for NSFW content detection.

**Exports:**
- `NSFWContentError` - Error class

**Documentation:** See `src/infrastructure/services/nsfw-content-error.README.md`

### Functions

#### getImageFeatureModel

Get the FAL model ID for an image processing feature.

**Parameters:**
- `feature`: The image feature type

**Returns:** Model ID string

**Supported Features:**

| Feature | Model ID |
|---------|----------|
| `upscale` | `fal-ai/clarity-upscaler` |
| `photo-restore` | `fal-ai/aura-sr` |
| `face-swap` | `fal-ai/face-swap` |
| `anime-selfie` | `fal-ai/flux-pro/kontext` |
| `remove-background` | `fal-ai/birefnet` |
| `remove-object` | `fal-ai/fooocus/inpaint` |
| `hd-touch-up` | `fal-ai/clarity-upscaler` |
| `replace-background` | `fal-ai/bria/background/replace` |

**Usage:**
Look up model ID for image features. Use in feature-based routing. Get model for specific operations.

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Feature models constants: `src/domain/constants/feature-models.constants.ts`

#### getVideoFeatureModel

Get the FAL model ID for a video processing feature.

**Parameters:**
- `feature`: The video feature type

**Returns:** Model ID string

**Supported Features:**

| Feature | Model ID |
|---------|----------|
| `ai-hug` | `fal-ai/vidu/q1/reference-to-video` |
| `ai-kiss` | `fal-ai/vidu/q1/reference-to-video` |

**Usage:**
Look up model ID for video features. Use in feature-based routing. Get model for specific operations.

**Related:**
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`
- Feature models constants: `src/domain/constants/feature-models.constants.ts`

#### cancelCurrentFalRequest

Cancel the currently running FAL request.

**Returns:** `void`

**Use Cases:**
- User navigates away from generation screen
- User clicks "Cancel" button during long-running generation
- Component unmounts and needs to clean up
- Starting a new generation before the previous one completes

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Request ID management: `src/infrastructure/utils/job-metadata/`

#### hasRunningFalRequest

Check if there's currently a running FAL request.

**Returns:** `true` if a request is running, `false` otherwise

**Use Cases:**
- Disable "Generate" button while generation is in progress
- Show loading indicator
- Prevent multiple simultaneous requests
- Display warning before navigating away

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Job lifecycle: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

## Usage Guidelines

### For Feature Operations

**Feature Operation Pattern:**
1. Select feature type (image or video)
2. Get model ID using feature function
3. Build input using feature-specific builder
4. Call `falProvider.subscribe()` with model ID and input
5. Handle result

**Best Practices:**
- Use feature functions for model lookups
- Validate feature before use
- Handle unsupported features
- Provide fallback behavior
- Check request state before starting

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Video feature builder: `src/infrastructure/builders/video-feature-builder.ts`

### For Request Management

**Request Management Pattern:**
1. Check if request is running with `hasRunningFalRequest()`
2. Cancel existing request if needed
3. Start new request
4. Handle cancellation gracefully
5. Clean up on unmount

**Best Practices:**
- Always check request state before starting
- Cancel requests in cleanup functions
- Handle cancellation errors
- Provide user feedback
- Prevent request leaks

**Related:**
- Job lifecycle utilities: `src/infrastructure/utils/job-metadata/job-metadata-lifecycle.util.ts`

### For Error Handling

**Error Handling Pattern:**
1. Catch errors from provider
2. Check for `NSFWContentError`
3. Handle cancellation errors
4. Display user-friendly messages
5. Log errors appropriately

**Best Practices:**
- Handle NSFW content errors specifically
- Distinguish cancellation from failure
- Provide clear error messages
- Log technical details
- Suggest recovery actions

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`

## Best Practices

### 1. Check Request State

Always verify request status:
- Use `hasRunningFalRequest()` before starting
- Prevent duplicate requests
- Show loading indicators
- Disable UI appropriately
- Handle concurrent access

### 2. Clean Up Properly

Manage request lifecycle:
- Cancel requests on unmount
- Use cleanup functions
- Prevent memory leaks
- Handle cancellation errors
- Release resources

### 3. Use Feature Functions

Look up models correctly:
- Use `getImageFeatureModel()` for image features
- Use `getVideoFeatureModel()` for video features
- Validate feature types
- Handle missing features
- Cache lookups when appropriate

### 4. Handle Cancellation

Support request cancellation:
- Check for cancelled state
- Handle cancellation errors
- Provide cancel UI
- Update state appropriately
- Inform user of cancellation

### 5. Validate Features

Check feature support:
- Validate feature types
- Check model availability
- Provide fallback options
- Log unsupported features
- Guide user to valid features

## For AI Agents

### When Using Services

**DO:**
- Import from package root
- Use service instances
- Check request state
- Clean up properly
- Handle errors appropriately
- Validate features
- Follow patterns

**DON'T:**
- Import from internal paths
- Create service instances
- Skip request state checks
- Forget cleanup
- Ignore error handling
- Use invalid features
- Duplicate services

### When Managing Requests

**DO:**
- Check `hasRunningFalRequest()` first
- Cancel when appropriate
- Handle cancellation gracefully
- Prevent duplicates
- Provide user feedback
- Clean up on unmount
- Log request state

**DON'T:**
- Start requests without checking
- Ignore running requests
- Forget cleanup
- Allow duplicates
- Hide user feedback
- Leave requests running
- Skip error handling

### When Looking Up Models

**DO:**
- Use feature functions
- Validate feature types
- Check model availability
- Handle missing models
- Use correct function
- Follow feature patterns
- Document feature usage

**DON'T:**
- Hardcode model IDs
- Use wrong function
- Skip validation
- Assume model exists
- Mix image/video features
- Create duplicate lookups
- Ignore feature types

### When Adding Services

**For New Service Exports:**
1. Add service to index file
2. Export instance and types
3. Update documentation
4. Follow export patterns
5. Test imports
6. Update related code

**For Enhanced Functions:**
1. Add function to index
2. Export from appropriate module
3. Update TypeScript types
4. Document function behavior
5. Test functionality
6. Update imports

**For Service Updates:**
1. Update service implementation
2. Maintain export compatibility
3. Update documentation
4. Test service changes
5. Communicate breaking changes
6. Update related code

## Implementation Notes

**Location:** `src/infrastructure/services/index.ts`

**Dependencies:**
- Exports from all service modules
- Re-exports utility functions
- No external dependencies

**Export Categories:**
- Service classes and instances
- Utility functions
- Error classes
- Type definitions

**Import:**
```typescript
import {
  falProvider,
  falModelsService,
  getImageFeatureModel,
  getVideoFeatureModel,
  cancelCurrentFalRequest,
  hasRunningFalRequest,
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Model service: `src/infrastructure/services/fal-models-service.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`

## Related Documentation

- [FAL Provider](./fal-provider.README.md)
- [Model Service](./fal-models-service.README.md)
- [NSFW Content Error](./nsfw-content-error.README.md)
- [Feature Models Constants](../../domain/constants/feature-models.constants.README.md)
