# Model Selection Types

TypeScript types for model selection functionality and the `useModels` hook.

**Location:** `src/domain/types/model-selection.types.ts`

## Overview

This module defines all TypeScript types and interfaces related to model selection in the FAL provider. These types are used by the `useModels` hook to manage model state, configuration, and actions.

## Purpose

Provides type safety for model selection by:
- Defining supported model types
- Specifying selection configuration options
- Typing selection state structure
- Enabling type-safe model operations
- Supporting model filtering and validation

## Import

```typescript
import type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState
} from '@umituz/react-native-ai-fal-provider';
```

## Types

### ModelType

Supported AI model generation types.

**Valid Values:**
- `text-to-image`: Generate images from text prompts
- `text-to-video`: Generate videos from text prompts
- `image-to-video`: Generate videos from images
- `text-to-voice`: Generate speech from text (TTS)

**Usage:**
Use to specify model generation type. Enables type-safe model filtering. Used in `useModels` hook parameter. Supports model categorization.

**Implementation:** See complete type definition in `src/domain/types/model-selection.types.ts`

**Related:**
- Model type guards: `src/infrastructure/utils/type-guards.util.ts`
- useModels hook: `src/presentation/hooks/use-models.ts`

### ModelSelectionConfig

Configuration options for model selection behavior.

**Properties:**
- `initialModelId`: Model ID to select on mount (optional)
- `defaultCreditCost`: Fallback credit cost if model has no pricing (optional)
- `defaultModelId`: Fallback model if no models are available (optional)

**Usage:**
Configure initial model selection state. Set default behaviors. Provide fallback options. Customize hook behavior.

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`

### ModelSelectionState

State object containing model selection data.

**Properties:**
- `models`: All available models for the selected type
- `selectedModel`: Currently selected model configuration
- `creditCost`: Credit cost based on selected model
- `modelId`: Selected model's FAL ID for API calls
- `isLoading`: Loading state indicator
- `error`: Error message if fetch failed

**Usage:**
Access model selection state from hook. Display model information. Check loading and error states. Use model data for generation.

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`
- Model constants: `src/domain/constants/default-models.constants.ts`

## Usage Guidelines

### For Type Safety

**Type Usage Pattern:**
1. Import `ModelType` from package
2. Use in function parameters
3. Enable type narrowing
4. Validate model types with guards
5. Switch on model type

**Best Practices:**
- Use type imports for type-only imports
- Validate runtime values with type guards
- Handle all model type cases
- Use discriminated unions when appropriate
- Leverage type inference

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### For Configuration

**Configuration Pattern:**
1. Import `ModelSelectionConfig` type
2. Create config object with desired options
3. Pass to `useModels` hook
4. Configure initial state
5. Set fallback behaviors

**Configuration Options:**
- Set initial model selection
- Provide default costs
- Configure fallback models
- Customize hook behavior
- Handle edge cases

### For State Management

**State Usage Pattern:**
1. Access state from `useModels` hook
2. Use `models` array for display
3. Check `selectedModel` for current selection
4. Monitor `isLoading` for UI feedback
5. Handle `error` state appropriately

**State Properties:**
- `models`: Available models list
- `selectedModel`: Current selection
- `creditCost`: Generation cost
- `modelId`: Model identifier
- `isLoading`: Loading indicator
- `error`: Error information

## Best Practices

### 1. Use Type Imports

Import types correctly:
- Use `import type` for type-only imports
- Import from package root
- Maintain consistent imports
- Avoid value imports for types

### 2. Validate Model Types

Check model type validity:
- Use type guards for runtime validation
- Handle unknown model types
- Provide fallback behavior
- Log validation failures
- Update guards when adding types

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### 3. Configure Properly

Set appropriate configuration:
- Provide initial model when known
- Set sensible default costs
- Configure fallback models
- Handle undefined states
- Test edge cases

### 4. Handle State Changes

Respond to state updates:
- Monitor `isLoading` changes
- Handle `error` states
- Update UI on model changes
- Persist user selections
- React to cost changes

### 5. Provide Type Safety

Maintain type safety throughout:
- Use strict TypeScript settings
- Avoid type assertions
- Leverage type inference
- Handle all type cases
- Keep types synchronized

## For AI Agents

### When Using Model Selection Types

**DO:**
- Import types from package root
- Use type imports for types
- Validate model types at runtime
- Handle all model type cases
- Use type guards
- Leverage type inference
- Maintain type safety

**DON'T:**
- Import from internal paths
- Skip type validation
- Assume type correctness
- Use type assertions unnecessarily
- Handle only some type cases
- Ignore type errors
- Create duplicate types

### When Configuring Selection

**DO:**
- Set initial model when available
- Provide default costs
- Configure fallback options
- Handle undefined states
- Test configuration
- Document config choices
- Update types when needed

**DON'T:**
- Skip configuration
- Use arbitrary values
- Forget fallback options
- Ignore edge cases
- Assume defaults work
- Create inconsistent configs
- Use outdated types

### When Managing State

**DO:**
- Access state from hook
- Check all state properties
- Handle loading states
- Display error messages
- Update UI on changes
- Persist selections
- Validate state data

**DON'T:**
- Ignore state properties
- Skip loading handling
- Hide error states
- Assume valid data
- Forget UI updates
- Lose user selections
- Skip validation

### When Adding Types

**For New Model Types:**
1. Add value to `ModelType` type
2. Update type guards
3. Add support in hooks
4. Update constants
5. Test new type
6. Update this README

**For Enhanced Config Options:**
1. Add property to config interface
2. Set optional with good reason
3. Update hook logic
4. Document behavior
5. Test configuration
6. Update TypeScript types

**For State Properties:**
1. Add property to state interface
2. Initialize in hook
3. Update type definitions
4. Document usage
5. Test state changes
6. Update related code

## Implementation Notes

**Location:** `src/domain/types/model-selection.types.ts`

**Dependencies:**
- No external dependencies
- Pure TypeScript type definitions
- Used throughout model selection system

**Type Categories:**
- Model type definitions
- Configuration interfaces
- State interfaces
- Action types

**Import:**
```typescript
import type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- useModels hook: `src/presentation/hooks/use-models.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Model constants: `src/domain/constants/default-models.constants.ts`
- Model service: `src/infrastructure/services/fal-models-service.ts`

## Related Documentation

- [useModels Hook](../../presentation/hooks/use-models.README.md)
- [Type Guards](../../infrastructure/utils/type-guards.util.README.md)
- [Default Models Constants](../constants/default-models.constants.README.md)
- [Model Service](../../infrastructure/services/fal-models-service.README.md)
