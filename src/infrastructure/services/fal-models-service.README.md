# Model Management

Service and utilities for managing, selecting, and retrieving FAL AI model information.

**Location:** `src/infrastructure/services/fal-models-service.ts`

## Overview

This module provides centralized model management including model listings, model lookup by ID, and model type filtering. It integrates with model constants to provide consistent model data across the application.

## Purpose

Centralizes model management by:
- Providing model listings by type
- Supporting model lookup by ID
- Maintaining model state
- Enabling model selection
- Facilitating model filtering and sorting

## Import

```typescript
import {
  falModelsService
} from '@umituz/react-native-ai-fal-provider';
```

## Service: FalModelsService

Central service for managing model lists and information.

### Methods

**getModels**
Get all models for specific type.

**Parameters:**
- `type`: Model type (`text-to-image`, `text-to-video`, etc.)

**Returns:** Array of model configurations

**Usage:**
Retrieve models for specific generation type. Use to populate model selection UI. Filter models by category. Access model information.

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`
- Model constants: `src/domain/constants/default-models.constants.ts`

**getModelById**
Find model by ID.

**Parameters:**
- `id`: Model identifier string

**Returns:** Model configuration or undefined

**Usage:**
Lookup model by ID. Validate model IDs. Get model details. Check model existence.

**getAllModels**
Get all models.

**Returns:** Array of all model configurations

**Usage:**
Retrieve complete model catalog. Display all available models. Implement model search. Filter models by various criteria.

## Usage Guidelines

### For Model Listing

**Listing Pattern:**
1. Call `falModelsService.getModels(type)` with desired type
2. Receive array of model configurations
3. Display models in UI
4. Show model information (name, cost, description)
5. Enable user selection

**Best Practices:**
- Show models filtered by type
- Display pricing information
- Indicate default models
- Support model comparison
- Handle empty model lists

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`

### For Model Lookup

**Lookup Pattern:**
1. Get model ID from selection or storage
2. Call `falModelsService.getModelById(id)`
3. Receive model configuration or undefined
4. Validate model exists
5. Access model details

**Best Practices:**
- Validate model IDs before use
- Handle missing models gracefully
- Provide fallback models
- Log lookup failures
- Cache model lookups when appropriate

### For Model Selection

**Selection Pattern:**
1. Get models for type
2. Display model list to user
3. User selects model
4. Validate selection
5. Update state with selected model

**Best Practices:**
- Persist user selection
- Show clear model information
- Support model changes
- Validate selection validity
- Handle selection errors

## Best Practices

### 1. Use Service for Model Data

Centralize model access:
- Always use service for model data
- Don't duplicate model logic
- Keep model state consistent
- Update through service methods
- Benefit from centralized caching

### 2. Validate Model IDs

Check model validity:
- Validate before using model ID
- Use `getModelById()` for validation
- Handle undefined returns
- Provide fallback models
- Log validation failures

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 3. Handle Missing Models

Graceful degradation:
- Check if model exists
- Provide alternative models
- Log missing model warnings
- Inform user of issues
- Update model lists regularly

### 4. Cache Model Data

Optimize performance:
- Cache model lookups when appropriate
- Avoid repeated service calls
- Invalidate cache on updates
- Balance memory vs performance
- Consider stale data

### 5. Show Model Information

Display model details:
- Model name and ID
- Credit cost
- Model description
- Availability status
- Quality/capability indicators

**Related:**
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

## For AI Agents

### When Using Model Service

**DO:**
- Import from package root
- Use service for all model data
- Validate model IDs
- Handle missing models
- Cache appropriately
- Show model information
- Follow service patterns

**DON'T:**
- Access model constants directly
- Skip model validation
- Assume model exists
- Duplicate model logic
- Forget error handling
- Hide model information
- Create separate model lists

### When Working with Models

**DO:**
- Use `getModels()` for listings
- Use `getModelById()` for lookups
- Validate before using models
- Check model availability
- Handle undefined returns
- Provide fallback options
- Log issues appropriately

**DON'T:**
- Hardcode model lists
- Skip validation
- Ignore missing models
- Use outdated model data
- Forget error handling
- Assume all models valid
- Duplicate service logic

### When Displaying Models

**DO:**
- Show model names clearly
- Display pricing information
- Include model descriptions
- Indicate default models
- Support model comparison
- Handle empty lists

**DON'T:**
- Hide model information
- Skip pricing display
- Show incomplete data
- Ignore default indicators
- Prevent comparison
- Crash on empty lists

### When Extending Service

**For New Service Methods:**
1. Add method to service class
2. Follow existing patterns
3. Handle errors appropriately
4. Update TypeScript types
5. Add tests
6. Update this README

**For Enhanced Caching:**
1. Review caching strategy
2. Add cache invalidation
3. Consider cache size limits
4. Handle cache updates
5. Test performance
6. Document cache behavior

**For New Model Types:**
1. Update model constants
2. Add support in service
3. Update filtering logic
4. Test new types
5. Update documentation
6. Communicate changes

## Implementation Notes

**Location:** `src/infrastructure/services/fal-models-service.ts`

**Dependencies:**
- Uses model constants from `src/domain/constants/default-models.constants.ts`
- Uses model types from `src/domain/types/model-selection.types.ts`
- No external dependencies

**Service Methods:**
- Model listing by type
- Model lookup by ID
- Complete model catalog retrieval
- Model validation

**Import:**
```typescript
import {
  falModelsService
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Model constants: `src/domain/constants/default-models.constants.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`
- useModels hook: `src/presentation/hooks/use-models.ts`
- Model selection types: `src/domain/types/model-selection.types.ts`

## Related Documentation

- [Default Models Constants](../../domain/constants/default-models.constants.README.md)
- [Feature Models Constants](../../domain/constants/feature-models.constants.README.md)
- [useModels Hook](../../presentation/hooks/use-models.README.md)
- [Model Selection Types](../../domain/types/model-selection.types.README.md)
