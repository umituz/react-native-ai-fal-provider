# React Hooks Index

Central export point for all React hooks provided by the FAL provider.

**Location:** `src/presentation/hooks/index.ts`

## Overview

The presentation hooks module exports custom React hooks that provide easy integration with FAL AI services. These hooks handle state management, error handling, loading states, and job lifecycle management.

## Purpose

Provides React integration by:
- Exporting generation management hook
- Exporting model selection hook
- Enabling state management
- Handling loading and error states
- Supporting React component integration

## Import

```typescript
import {
  useFalGeneration,
  useModels
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### useFalGeneration

Hook for managing FAL AI generation operations.

**Path:** `src/presentation/hooks/use-fal-generation.ts`

**Features:**
- Generation state management (loading, error, success)
- Automatic retry functionality
- Request cancellation
- Progress tracking
- Timeout handling
- Error categorization

### useModels

Hook for managing AI model selection and metadata.

**Path:** `src/presentation/hooks/use-models.ts`

**Features:**
- Model listing and filtering
- Dynamic credit cost calculation
- Model selection state
- Loading and error states
- Model refresh functionality

## Usage Guidelines

### For React Integration

**Hook Pattern:**
1. Import hooks from package root
2. Use hooks in components
3. Configure hook options
4. Use returned state and actions
5. Handle loading and error states

**Best Practices:**
- Use hooks at component level
- Configure appropriate timeouts
- Handle errors gracefully
- Display loading states
- Enable user cancellation

### For State Management

**State Pattern:**
1. Use hook to access state
2. Display loading indicators
3. Show error messages
4. Handle success states
5. Update UI appropriately

**Best Practices:**
- Check loading states before actions
- Display user-friendly errors
- Show progress feedback
- Handle cancellation states
- Update UI reactively

## Best Practices

### 1. Cleanup on Unmount

Always clean up resources:
- Cancel requests on unmount
- Clear timeouts and intervals
- Release controller references
- Prevent memory leaks
- Handle cleanup errors

### 2. Disable Controls During Loading

Prevent duplicate requests:
- Disable buttons during generation
- Show loading indicators
- Prevent form submissions
- Update button states
- Guide user experience

### 3. Handle Errors Gracefully

Display appropriate error messages:
- Check error types
- Show specific error messages
- Provide retry options when available
- Log technical details
- Guide users to corrections

### 4. Show Progress

Keep users informed:
- Display queue positions
- Show current status
- Update progress bars
- Provide estimated times
- Display generation progress

### 5. Use Type Safety

Leverage TypeScript types:
- Use hook result types
- Enable type checking
- Prevent type errors
- Enable autocomplete
- Maintain type safety

## For AI Agents

### When Using Hooks

**DO:**
- Import from package root
- Use hooks in components
- Handle loading states
- Display error messages
- Enable cancellation
- Configure timeouts appropriately
- Handle errors gracefully

**DON'T:**
- Import from internal paths
- Skip loading states
- Hide error information
- Disable cancellation
- Use inappropriate timeouts
- Forget error handling
- Create memory leaks

### When Managing State

**DO:**
- Use hook states in UI
- Check loading before actions
- Display error messages
- Show progress indicators
- Handle cancellation states
- Update reactively
- Clean up properly

**DON'T:**
- Ignore hook states
- Skip loading indicators
- Hide error information
- Block user actions
- Create stale UIs
- Forget cleanup
- Create race conditions

### When Configuring Hooks

**DO:**
- Set appropriate timeouts
- Configure error handlers
- Set up progress callbacks
- Handle cancellation
- Test configuration
- Monitor performance
- Adjust based on use case

**DON'T:**
- Use default timeouts only
- Skip error configuration
- Ignore progress updates
- Forget cancellation
- Use one-size-fits-all
- Skip testing
- Create poor UX

## Implementation Notes

**Location:** `src/presentation/hooks/index.ts`

**Dependencies:**
- Generation hook: `src/presentation/hooks/use-fal-generation.ts`
- Models hook: `src/presentation/hooks/use-models.ts`

**Export Categories:**
- Generation management hooks
- Model selection hooks
- Type definitions for hooks

**Import:**
```typescript
import {
  useFalGeneration,
  useModels
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- useFalGeneration: `src/presentation/hooks/use-fal-generation.ts`
- useModels: `src/presentation/hooks/use-models.ts`
