# Domain Types Index

Central export point for all domain type definitions.

**Location:** `src/domain/types/index.ts`

## Overview

The domain types module serves as the central export hub for all TypeScript types and interfaces used throughout the `react-native-ai-fal-provider` package. This module consolidates type exports from two main categories: model selection types and input builders types.

## Purpose

Provides type organization by:
- Centralizing type exports
- Organizing types by category
- Facilitating type imports
- Maintaining type consistency
- Enabling tree-shaking

## Import

```typescript
import type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState,
  UpscaleOptions,
  VideoFromImageOptions,
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### Model Selection Types

Types related to model selection functionality and the `useModels` hook.

**Path:** `src/domain/types/model-selection.types.ts`

**Includes:**
- `ModelType` - Supported AI model generation types
- `ModelSelectionConfig` - Configuration options for model selection
- `ModelSelectionState` - Model selection state object
- `ModelSelectionActions` - Actions for manipulating model selection
- `UseModelsReturn` - Complete return type for `useModels` hook

### Input Builders Types

Types related to input builder functions for FAL API calls.

**Path:** `src/domain/types/input-builders.types.ts`

**Includes:**
- `UpscaleOptions` - Options for image upscaling
- `PhotoRestoreOptions` - Options for photo restoration
- `ImageToImagePromptConfig` - Configuration for image-to-image generation
- `RemoveBackgroundOptions` - Options for background removal
- `RemoveObjectOptions` - Options for object removal
- `ReplaceBackgroundOptions` - Options for background replacement
- `VideoFromImageOptions` - Options for video generation from images
- `FaceSwapOptions` - Options for face swapping

## Usage Guidelines

### For Type Imports

**Import Pattern:**
1. Use `import type` for type-only imports
2. Import only needed types
3. Import from package root
4. Enable tree-shaking
5. Maintain type safety

**Best Practices:**
- Use type imports for types
- Avoid value imports for types
- Import specific types needed
- Group related type imports
- Enable strict TypeScript checking

### For Type Safety

**Safety Pattern:**
1. Use types for configuration
2. Enable autocomplete
3. Validate at compile time
4. Use type guards
5. Leverage type inference

**Benefits:**
- Compile-time validation
- IDE autocomplete support
- Parameter type checking
- Prevent invalid inputs
- Self-documenting code

## Best Practices

### 1. Use Type Imports

Import types correctly:
- Use `import type` for type-only imports
- Import from package root
- Maintain consistent imports
- Enable tree-shaking

### 2. Import Only What You Need

Be specific in imports:
- Import only required types
- Avoid star imports
- Group related types
- Remove unused imports
- Keep imports organized

### 3. Combine Related Types

Organize type imports:
- Group by functionality
- Import related types together
- Maintain logical grouping
- Document type relationships
- Enable reusability

### 4. Use Type Guards

Implement type checking:
- Use type guards for validation
- Enable type narrowing
- Check runtime values
- Validate model types
- Handle type errors

### 5. Enable Type Inference

Leverage TypeScript:
- Use type inference where possible
- Provide type annotations when needed
- Avoid unnecessary type assertions
- Let TypeScript infer types
- Maintain type safety

## For AI Agents

### When Using Types

**DO:**
- Use `import type` for types
- Import specific types needed
- Import from package root
- Enable type safety
- Use type guards
- Validate at compile time
- Enable autocomplete

**DON'T:**
- Use value imports for types
- Import everything indiscriminately
- Import from internal paths
- Skip type validation
- Use type assertions unnecessarily
- Disable type checking
- Create duplicate types

### When Organizing Imports

**DO:**
- Group by functionality
- Import related types together
- Maintain logical grouping
- Remove unused imports
- Enable tree-shaking
- Follow import conventions

**DON'T:**
- Mix imports randomly
- Import unused types
- Create import chaos
- Skip organization
- Disable tree-shaking
- Follow inconsistent patterns

### When Validating Types

**DO:**
- Use type guards
- Check runtime values
- Validate model types
- Handle type errors
- Provide helpful errors
- Update type guards

**DON'T:**
- Skip type validation
- Assume type correctness
- Use type assertions
- Ignore type errors
- Create type mismatches
- Forget type guards

## Implementation Notes

**Location:** `src/domain/types/index.ts`

**Dependencies:**
- Re-exports from type files
- No external dependencies
- Pure TypeScript types

**Type Categories:**
- Model selection types
- Input builder types
- Configuration types
- State types

**Import:**
```typescript
import type {
  ModelType,
  ModelSelectionConfig,
  ModelSelectionState,
  UpscaleOptions,
  VideoFromImageOptions,
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Model selection types: `src/domain/types/model-selection.types.ts`
- Input builder types: `src/domain/types/input-builders.types.ts`
