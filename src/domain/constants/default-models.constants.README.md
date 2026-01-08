# Default Models Constants

Default FAL AI models and model management constants.

**Location:** `src/domain/constants/default-models.constants.ts`

## Overview

This module contains definitions for all FAL AI models, their default selections, and helper functions for model management.

## Purpose

Centralizes model configuration by:
- Defining all available FAL models
- Providing default model selections
- Supporting model lookup by ID and type
- Managing model pricing information
- Enabling model filtering and sorting

## Import

```typescript
import {
  getAllDefaultModels,
  getDefaultModelsByType,
  getDefaultModel,
  findModelById
} from '@umituz/react-native-ai-fal-provider';
```

## Constants

### DEFAULT_CREDIT_COSTS

Default credit costs for each model type.

**Values:**
- `text-to-image`: 2 credits per generation
- `text-to-video`: 20 credits per generation
- `image-to-video`: 20 credits per generation
- `text-to-voice`: 3 credits per generation

**Usage:**
Use to calculate generation costs before processing. Display costs to users. Implement credit tracking.

**Implementation:** See constant definition in `src/domain/constants/default-models.constants.ts`

### DEFAULT_MODEL_IDS

Default model IDs for each model type.

**Values:**
- `text-to-image`: `fal-ai/flux/schnell`
- `text-to-video`: `fal-ai/minimax-video`
- `image-to-video`: `fal-ai/kling-video/v1.5/pro/image-to-video`
- `text-to-voice`: `fal-ai/playai/tts/v3`

**Usage:**
Use to get default model for each type. Provides fallback when no model selected. Maintains consistency across application.

### Model Lists

**Available Model Collections:**
- `DEFAULT_TEXT_TO_IMAGE_MODELS`: Flux Schnell, Flux Dev, Flux Pro
- `DEFAULT_TEXT_TO_VIDEO_MODELS`: Hunyuan, MiniMax, Kling 1.5, Mochi
- `DEFAULT_IMAGE_TO_VIDEO_MODELS`: Kling I2V
- `DEFAULT_TEXT_TO_VOICE_MODELS`: PlayAI TTS v3, ElevenLabs TTS
- `DEFAULT_TEXT_TO_TEXT_MODELS`: Llama 3 8B Instruct

**Usage:**
Access specific model lists by type. Filter models for UI display. Get pricing information. Check model availability.

**Related:**
- Model types: `src/domain/types/model-selection.types.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`

## Functions

### getAllDefaultModels

Get all default models.

**Returns:** Array of all model configurations

**Usage:**
Use to retrieve complete model list. Display all available models. Implement model selection UI. Filter models by type or status.

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`

### getDefaultModelsByType

Get default models for specific type.

**Parameters:**
- `type`: Model type (`text-to-image`, `text-to-video`, etc.)

**Returns:** Array of model configurations for specified type

**Usage:**
Use to get models for specific generation type. Filter models by category. Display type-specific model lists. Implement model type selection.

**Related:**
- Model types: `src/domain/types/model-selection.types.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### getDefaultModel

Get default model for a type.

**Parameters:**
- `type`: Model type

**Returns:** Default model configuration or undefined

**Usage:**
Use to get recommended model for type. Provides fallback model. Pre-selects default in UI. Ensures valid model selection.

**Related:**
- Model selection types: `src/domain/types/model-selection.types.ts`

### findModelById

Find model by ID.

**Parameters:**
- `id`: Model identifier string

**Returns:** Model configuration or undefined

**Usage:**
Use to lookup model by ID. Validate model IDs. Get model details. Check model existence.

## Usage Guidelines

### For Model Selection

**Selection Pattern:**
1. Get all models using `getAllDefaultModels()`
2. Filter by type using `getDefaultModelsByType()`
3. Display models in UI
4. Allow user selection
5. Use `getDefaultModel()` for default selection

**Best Practices:**
- Show pricing information to users
- Indicate default models
- Display model descriptions
- Support model comparison
- Enable filtering by cost or quality

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`

### For Cost Calculation

**Cost Calculation Pattern:**
1. Get model configuration
2. Access pricing information
3. Calculate cost based on usage
4. Display cost to user before generation
5. Track credit usage

**Pricing Structure:**
- Free user costs defined per model
- Premium user costs defined per model
- Costs vary by model quality
- Video models typically cost more

### For Model Filtering

**Filtering Options:**
- Filter by model type
- Filter by active status
- Filter by pricing tier
- Sort by cost or quality
- Sort by display order

**Common Filters:**
- Active models only: `model.isActive !== false`
- Default models only: `model.isDefault === true`
- Type-specific: Use `getDefaultModelsByType()`
- Cost-based: Sort by `pricing.freeUserCost`

### For Model Management

**Management Patterns:**
1. Use constants for model IDs
2. Look up models by ID
3. Validate model selections
4. Check model availability
5. Handle missing models gracefully

**Best Practices:**
- Always validate model IDs
- Provide fallback models
- Handle undefined returns
- Log model lookup failures
- Update model lists regularly

## Best Practices

### 1. Use Constants for Model IDs

Avoid hardcoded model strings:
- Import from constants module
- Use defined model IDs
- Maintain single source of truth
- Update models in one place
- Prevent typos in model IDs

### 2. Validate Model Selections

Check model validity before use:
- Validate model ID format
- Check model exists
- Verify model type matches
- Ensure model is active
- Handle invalid selections

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 3. Show Pricing Information

Display costs to users:
- Show credit cost before generation
- Compare model costs
- Indicate premium vs free costs
- Calculate total batch costs
- Warn about expensive operations

**Related:**
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### 4. Provide Model Choices

Let users select models:
- Show all available models
- Indicate default selection
- Display model capabilities
- Compare pricing
- Filter by type or cost

### 5. Handle Missing Models

Graceful degradation for missing models:
- Check if model exists
- Provide fallback models
- Log missing model warnings
- Inform user of unavailability
- Update model lists regularly

## For AI Agents

### When Using Model Constants

**DO:**
- Import from package root
- Use constants for model IDs
- Validate model selections
- Check model existence
- Provide fallback models
- Show pricing information
- Handle undefined returns

**DON'T:**
- Hardcode model IDs
- Skip model validation
- Assume model exists
- Ignore pricing information
- Forget fallback options
- Use outdated model lists
- Create duplicate model definitions

### When Selecting Models

**DO:**
- Use `getDefaultModel()` for defaults
- Filter by type with `getDefaultModelsByType()`
- Look up models with `findModelById()`
- Validate model before use
- Check pricing information
- Show model details to users
- Handle missing models

**DON'T:**
- Hardcode model selections
- Skip type validation
- Ignore model availability
- Forget to check pricing
- Hide model information
- Assume default exists
- Use invalid model IDs

### When Calculating Costs

**DO:**
- Use pricing from model config
- Calculate before generation
- Show costs to users
- Consider user tier (free/premium)
- Track credit usage
- Warn about expensive operations
- Calculate batch costs

**DON'T:**
- Skip cost calculation
- Hide pricing from users
- Ignore user tier differences
- Forget credit tracking
- Assume costs are zero
- Calculate after generation
- Use incorrect pricing

### When Adding Models

**For New Model Definitions:**
1. Add model to appropriate type list
2. Define model configuration
3. Set pricing information
4. Mark default if applicable
5. Update this README
6. Test model availability

**For Model Updates:**
1. Update pricing information
2. Change default selections
3. Add or remove models
4. Update model descriptions
5. Test with real API
6. Update documentation

**For Enhanced Filtering:**
1. Add filter options
2. Support new sort orders
3. Add pricing tiers
4. Update TypeScript types
5. Document filter behavior
6. Test filtering logic

## Implementation Notes

**Location:** `src/domain/constants/default-models.constants.ts`

**Dependencies:**
- Uses model types from `src/domain/types/model-selection.types.ts`
- No external dependencies
- Pure constant definitions

**Model Categories:**
- Text-to-image models (Flux family)
- Text-to-video models (Hunyuan, MiniMax, Kling, Mochi)
- Image-to-video models (Kling I2V)
- Text-to-voice models (PlayAI, ElevenLabs)
- Text-to-text models (Llama)

**Import:**
```typescript
import {
  getAllDefaultModels,
  getDefaultModelsByType,
  getDefaultModel,
  findModelById
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Model selection types: `src/domain/types/model-selection.types.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`
- useModels hook: `src/presentation/hooks/use-models.ts`
- Model-specific constants: `src/domain/constants/models/`

## Related Documentation

- [Model Selection Types](../types/model-selection.types.README.md)
- [Feature Models Constants](./feature-models.constants.README.md)
- [useModels Hook](../../presentation/hooks/use-models.README.md)
