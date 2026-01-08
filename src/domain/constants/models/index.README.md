# Model Catalog Index

Central export point for all FAL AI model configurations.

**Location:** `src/domain/constants/models/index.ts`

## Overview

The model catalog provides organized access to all available FAL AI models across different generation types. Each model includes detailed configuration such as pricing, availability, and capabilities.

## Purpose

Provides model catalog by:
- Organizing models by generation type
- Exporting all model configurations
- Supporting model discovery
- Enabling model comparison
- Facilitating model selection

## Import

```typescript
import {
  DEFAULT_TEXT_TO_IMAGE_MODELS,
  DEFAULT_TEXT_TO_VIDEO_MODELS,
  DEFAULT_IMAGE_TO_VIDEO_MODELS,
  DEFAULT_TEXT_TO_VOICE_MODELS,
  DEFAULT_TEXT_TO_TEXT_MODELS,
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### Text-to-Image Models

Models for generating images from text prompts.

**Documentation:** See `text-to-image.README.md`

**Models:**
- Flux Schnell (1 credit) - Fast generation
- Flux Dev (2 credits) - High quality
- Flux Pro (3 credits) - Professional quality

**Path:** `src/domain/constants/models/text-to-image.ts`

### Text-to-Video Models

Models for generating videos from text descriptions.

**Documentation:** See `text-to-video.README.md`

**Models:**
- Hunyuan (10 credits) - Balanced quality/speed
- MiniMax (15 credits) - High quality video
- Kling 1.5 (20 credits) - Premium video generation
- Mochi (8 credits) - Fast video generation

**Path:** `src/domain/constants/models/text-to-video.ts`

### Image-to-Video Models

Models for converting images to videos.

**Documentation:** See `image-to-video.README.md`

**Models:**
- Kling I2V (15 credits) - Professional image-to-video conversion

**Path:** `src/domain/constants/models/image-to-video.ts`

### Text-to-Voice Models

Models for text-to-speech generation.

**Documentation:** See `text-to-voice.README.md`

**Models:**
- PlayAI TTS v3 (1 credit) - Fast text-to-speech
- ElevenLabs TTS (2 credits) - High quality TTS

**Path:** `src/domain/constants/models/text-to-voice.ts`

### Text-to-Text Models

Models for text generation and completion.

**Documentation:** See `text-to-text.README.md`

**Models:**
- Llama 3 8B Instruct (0.1 credits) - General purpose LLM

**Path:** `src/domain/constants/models/text-to-text.ts`

## Usage Guidelines

### For Model Discovery

**Discovery Pattern:**
1. Import model arrays by type
2. Filter models based on criteria
3. Access model configurations
4. Display model information
5. Enable user selection

**Best Practices:**
- Import from package root
- Use model arrays for UI components
- Filter by cost, quality, or availability
- Display pricing information
- Indicate default models

### For Model Information

**Information Pattern:**
1. Access model configuration
2. Read model metadata
3. Check availability and pricing
4. Display to users
5. Guide model selection

**Available Information:**
- Model ID and name
- Generation type
- Pricing (free/premium)
- Default status
- Active status
- Description

## Best Practices

### 1. Use Model IDs Directly

Reference models by ID:
- Use model IDs from catalog
- Avoid hardcoding IDs
- Reference through configuration
- Maintain single source of truth
- Update models centrally

### 2. Check Model Availability

Validate model status:
- Check `isActive` property
- Handle inactive models
- Provide fallback options
- Inform users of issues
- Update UI accordingly

### 3. Display Cost to Users

Show pricing information:
- Display credit cost per generation
- Show free vs premium pricing
- Calculate batch costs
- Warn before expensive operations
- Help users optimize costs

### 4. Respect Default Models

Use default appropriately:
- Identify default models
- Use default for new users
- Enable easy switching
- Clearly mark defaults
- Support user preferences

### 5. Enable Model Comparison

Facilitate model selection:
- Compare by cost
- Compare by quality
- Compare by capabilities
- Show pros and cons
- Help users choose

## For AI Agents

### When Using Model Catalog

**DO:**
- Import from package root
- Use model arrays from catalog
- Check model availability
- Display pricing information
- Respect default models
- Filter models appropriately
- Use model IDs from catalog

**DON'T:**
- Hardcode model IDs
- Skip availability checks
- Hide pricing information
- Ignore default status
- Create duplicate model lists
- Import from internal paths
- Assume model validity

### When Displaying Models

**DO:**
- Show model names clearly
- Display pricing information
- Indicate default models
- Show availability status
- Provide descriptions
- Enable filtering
- Support comparison

**DON'T:**
- Hide model information
- Skip pricing display
- Ignore defaults
- Show inactive models
- Prevent comparison
- Create confusing UIs
- Overwhelm users

### When Selecting Models

**DO:**
- Use default models initially
- Enable user switching
- Validate selections
- Check availability
- Warn about costs
- Provide recommendations
- Support preferences

**DON'T:**
- Force model selection
- Skip validation
- Ignore costs
- Hide options
- Remove user control
- Make arbitrary choices
- Override user preferences

## Implementation Notes

**Location:** `src/domain/constants/models/index.ts`

**Dependencies:**
- Re-exports all model type files
- No external dependencies
- Pure TypeScript exports

**Export Categories:**
- Text-to-image models
- Text-to-video models
- Image-to-video models
- Text-to-voice models
- Text-to-text models

**Import:**
```typescript
import {
  DEFAULT_TEXT_TO_IMAGE_MODELS,
  DEFAULT_TEXT_TO_VIDEO_MODELS,
  DEFAULT_IMAGE_TO_VIDEO_MODELS,
  DEFAULT_TEXT_TO_VOICE_MODELS,
  DEFAULT_TEXT_TO_TEXT_MODELS,
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Individual model docs: `src/domain/constants/models/*.README.md`
- Default models: `src/domain/constants/default-models.constants.ts`
- Feature models: `src/domain/constants/feature-models.constants.ts`
