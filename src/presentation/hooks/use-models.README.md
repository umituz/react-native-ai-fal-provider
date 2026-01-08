# useModels Hook

React hook for managing FAL AI model selection, pricing, and model information.

**Location:** `src/presentation/hooks/use-models.ts`

## Overview

The `useModels` hook provides functionality for managing FAL AI models including model selection, pricing information, model lists, and refresh capabilities. It handles model state management and provides easy access to model configurations.

## Purpose

Simplifies model management in React components by:
- Providing filtered model lists by type
- Managing selected model state
- Calculating credit costs dynamically
- Handling model refresh operations
- Supporting initial and default model configuration

## Import

```typescript
import { useModels } from '@umituz/react-native-ai-fal-provider';
```

## Parameters

**Props:** `UseModelsProps`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | `ModelType` | ✅ Yes | Model type filter |
| `config` | `ModelSelectionConfig` | ❌ No | Optional configuration |

**Model Types:**
- `text-to-image`: Text to image generation models
- `text-to-video`: Text to video generation models
- `image-to-video`: Image to video conversion models
- `text-to-voice`: Text to voice generation models

**Configuration Options:**
- `initialModelId`: Model ID to select initially
- `defaultModelId`: Fallback model ID if initial not found
- `defaultCreditCost`: Default cost if model pricing unavailable

**Implementation:** See `src/presentation/hooks/use-models.ts` for complete type definitions

**Related:**
- Model types: `src/domain/types/model-selection.types.ts`
- Model constants: `src/domain/constants/default-models.constants.ts`

## Return Values

**Result:** `UseModelsReturn`

| Property | Type | Description |
|----------|------|-------------|
| `models` | `FalModelConfig[]` | Array of available models for type |
| `selectedModel` | `FalModelConfig \| null` | Currently selected model object |
| `selectModel` | `function` | Function to select a model by ID |
| `creditCost` | `number` | Credit cost of selected model |
| `modelId` | `string` | ID of selected model |
| `isLoading` | `boolean` | True if models are loading |
| `error` | `string \| null` | Error message if loading failed |
| `refreshModels` | `function` | Function to refresh model list |

**Related:**
- Model config types: `src/domain/types/model-selection.types.ts`

## Methods

### selectModel

Select a model by ID.

**Parameters:**
- `id`: Model ID to select

**Usage:**
Call this function when user selects a model from UI. Updates `selectedModel`, `modelId`, and `creditCost` automatically. Pass model ID from model list.

### refreshModels

Refresh the model list from source.

**Usage:**
Call this function to reload models. Useful for updating model list after changes or when retrying after failed load.

## Usage Guidelines

### For Model Selection UI

**Basic Setup:**
1. Import `useModels` from package
2. Pass model type as prop
3. Provide optional config for default/initial model
4. Render model list from `models` array
5. Use `selectModel()` when user selects

**Model Display:**
- Show model name from `model.name`
- Display cost from `model.pricing?.freeUserCost`
- Use `model.id` as value for selection
- Show `creditCost` for selected model

**Related:**
- Default models: `src/domain/constants/default-models.constants.ts`
- Model types: `src/domain/types/model-selection.types.ts`

### For Pricing Display

**Cost Information:**
1. Use `creditCost` for selected model cost
2. Display cost in UI before generation
3. Update automatically when model changes
4. Handle missing cost with `defaultCreditCost`

**Pricing Structure:**
- Free user cost: `model.pricing?.freeUserCost`
- Paid user cost: `model.pricing?.paidUserCost`
- Credit cost: Total credits consumed per generation

### For Initial Model Selection

**Configuration:**
1. Set `initialModelId` for pre-selected model
2. Set `defaultModelId` as fallback
3. Set `defaultCreditCost` for pricing fallback
4. Handle case where initial model not found

**Selection Priority:**
1. Try to select `initialModelId` if provided
2. Fall back to `defaultModelId` if initial not found
3. Select first model if neither provided
4. Use `defaultCreditCost` if pricing unavailable

### For Error Handling

**Loading Errors:**
1. Check `error` for error message
2. Display error to user
3. Provide `refreshModels()` button
4. Show loading indicator when `isLoading` is true

**Error Scenarios:**
- Invalid model type
- Model list loading failure
- Model not found (shouldn't occur with defaults)
- Configuration errors

### For Model Type Filtering

**Available Types:**
- Text-to-image: Flux models (Schnell, Dev, Pro)
- Text-to-video: Hunyuan, MiniMax, Kling, Mochi
- Image-to-video: Image-to-video conversion models
- Text-to-voice: Voice generation models

**Filtering:**
- Models automatically filtered by `type` prop
- Only matching models included in `models` array
- Use separate hook instances for different types

**Related:**
- Model definitions: `src/domain/constants/models/`

## Best Practices

### 1. Always Handle Loading State

Check `isLoading` before rendering:
- Show loading indicator when true
- Disable model selection during load
- Handle empty state appropriately
- Provide user feedback

### 2. Provide Default Configuration

Always provide sensible defaults:
- Set `defaultModelId` for fallback
- Set `defaultCreditCost` for pricing
- Use `initialModelId` for pre-selection
- Handle missing models gracefully

### 3. Display Clear Pricing

Show cost information prominently:
- Display `creditCost` before generation
- Show cost per model in list
- Update cost when model changes
- Warn about high-cost models

### 4. Handle Model Changes

Respond to model selection:
- Update generation preview
- Refresh pricing display
- Clear previous generation
- Update configuration options

### 5. Support Model Refresh

Provide refresh functionality:
- Add refresh button in UI
- Call `refreshModels()` on error
- Show refresh status
- Handle refresh success/failure

## For AI Agents

### When Using useModels

**DO:**
- Import from package root
- Provide model type prop
- Set default configuration
- Handle loading state
- Display pricing information
- Support model refresh
- Handle errors gracefully

**DON'T:**
- Skip model type prop
- Forget default configuration
- Ignore loading states
- Hide pricing from users
- Prevent model refresh
- Ignore error states
- Use undefined model types

### When Building UI

**DO:**
- Show all available models
- Display model names clearly
- Show credit costs
- Highlight selected model
- Provide clear selection mechanism
- Support keyboard navigation
- Handle long model lists

**DON'T:**
- Hide model list from users
- Show technical IDs only
- Skip pricing display
- Make selection unclear
- Limit navigation options
- Ignore accessibility
- Show overwhelming lists

### When Adding Features

**For New Model Types:**
1. Add type to `ModelType` in types
2. Add model constants to appropriate file
3. Update filtering logic in hook
4. Update this README
5. Test with new type

**For New Config Options:**
1. Add to `ModelSelectionConfig` type
2. Implement logic in hook
3. Update TypeScript types
4. Document in this README
5. Provide examples

**For New Return Values:**
1. Add to `UseModelsReturn` type
2. Implement in hook logic
3. Update TypeScript types
4. Document usage
5. Test thoroughly

## Implementation Notes

**Location:** `src/presentation/hooks/use-models.ts`

**Dependencies:**
- Uses model constants from `src/domain/constants/default-models.constants.ts`
- Uses model types from `src/domain/types/model-selection.types.ts`
- Integrates with React hooks (useState, useMemo, useCallback)
- Filters models by type automatically

**TypeScript Types:**
- Strongly typed model configurations
- Type-safe model selection
- Proper null handling for selected model
- Generic pricing information

**Model Filtering:**
- Filters by `type` prop
- Returns array of matching models
- Maintains model order from constants
- Empty array if no models match

**State Management:**
- `models`: Computed from type filter (memoized)
- `selectedModel`: State updated by `selectModel()`
- `creditCost`: Derived from selected model pricing
- `isLoading`: Can be used for async loading in future
- `error`: Can be used for error handling in future

**Import:**
```typescript
import { useModels } from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.README.md`
- Hooks index: `src/presentation/hooks/index.README.md`
- Model types: `src/domain/types/model-selection.types.README.md`

## Related Documentation

- [useFalGeneration Hook](./use-fal-generation.README.md)
- [React Hooks Index](./index.README.md)
- [Model Selection Types](../../domain/types/model-selection.types.README.md)
- [Default Models](../../domain/constants/default-models.constants.README.md)
