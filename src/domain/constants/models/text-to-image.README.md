# Text-to-Image Generation

Generates high-quality images from text-based prompts.

**Location:** `src/domain/constants/models/text-to-image.ts`

## Overview

Text-to-image generation creates visual content from textual descriptions using AI models. This module provides model configurations for various image generation capabilities with different quality levels and cost structures.

## Purpose

Provides image generation models by:
- Supporting multiple quality tiers (fast, quality, professional)
- Offering flexible image sizes and aspect ratios
- Enabling batch image generation
- Providing safety checking
- Supporting configurable inference steps

## Import

```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

## Available Models

### Flux Schnell
- **Model ID:** `fal-ai/flux/schnell`
- **Cost:** 1 credit (Free), 0.5 credit (Premium)
- **Description:** Fast and efficient image generation (Default)
- **Use Cases:** Quick iterations, drafts, preview generations

### Flux Dev
- **Model ID:** `fal-ai/flux/dev`
- **Cost:** 2 credits (Free), 1 credit (Premium)
- **Description:** High-quality image generation
- **Use Cases:** Production images, enhanced quality

### Flux Pro
- **Model ID:** `fal-ai/flux-pro`
- **Cost:** 3 credits (Free), 1.5 credits (Premium)
- **Description:** Professional-level image generation
- **Use Cases:** Professional work, highest quality requirements

## Parameters

### Common Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `prompt` | `string` | Description of image to generate | - |
| `image_size` | `string` | Output image dimensions | `square_hd` |
| `num_inference_steps` | `number` | Number of inference steps | 4 |
| `num_images` | `number` | Number of images to generate | 1 |
| `enable_safety_checker` | `boolean` | Enable safety checking | true |

### Image Sizes

- `square_hd`: 1024x1024
- `square`: 512x512
- `portrait_4_3`: 832x1104
- `portrait_16_9`: 832x1216
- `landscape_4_3`: 1104x832
- `landscape_16_9`: 1216x832

## Usage Guidelines

### For Image Generation

**Generation Pattern:**
1. Select model based on quality needs
2. Construct descriptive prompt
3. Set appropriate image size
4. Configure inference steps (quality vs speed)
5. Handle generation result

**Best Practices:**
- Use descriptive, detailed prompts
- Match image size to intended use
- Start with Schnell for quick iterations
- Upgrade to Dev/Pro for final output
- Enable safety checker for production

### For Model Selection

**Selection Pattern:**
1. Evaluate quality requirements
2. Consider cost constraints
3. Balance speed vs quality
4. Use appropriate model for task
5. Scale up as needed

**Model Choice Guidelines:**
- Schnell: Testing, drafts, previews
- Dev: Standard production use
- Pro: Professional, highest quality

## Best Practices

### 1. Write Effective Prompts

Create detailed descriptions:
- Be specific about subjects and style
- Include lighting and atmosphere details
- Specify composition and framing
- Mention mood and emotion
- Use natural language descriptions

### 2. Choose Right Model

Select appropriate quality tier:
- Use Schnell for rapid iteration
- Upgrade to Dev for better quality
- Use Pro for professional work
- Consider cost vs quality trade-off
- Test with lower tier first

### 3. Optimize Parameters

Balance quality and speed:
- Lower steps for faster generation
- Higher steps for better quality
- Adjust image size for use case
- Generate multiple images when needed
- Enable safety checking

### 4. Handle Results

Process generated images:
- Validate image quality
- Check safety filter results
- Handle generation failures
- Display images appropriately
- Store results efficiently

### 5. Manage Costs

Control generation costs:
- Start with lower tier models
- Limit batch generation
- Use appropriate image sizes
- Cache successful generations
- Monitor credit usage

## For AI Agents

### When Using Text-to-Image Models

**DO:**
- Select appropriate model for task
- Write detailed descriptive prompts
- Set correct image sizes
- Enable safety checking
- Handle generation errors
- Monitor credit usage
- Follow parameter constraints

**DON'T:**
- Use highest tier for testing
- Write vague or short prompts
- Ignore safety checking
- Forget to handle failures
- Generate unnecessary batches
- Exceed credit limits
- Use wrong aspect ratios

### When Writing Prompts

**DO:**
- Be specific and detailed
- Include style information
- Describe lighting and mood
- Specify composition
- Use natural language
- Include important details
- Reference art styles if needed

**DON'T:**
- Use vague descriptions
- Forget key details
- Ignore style guidance
- Skip composition details
- Use overly complex language
- Include contradictory elements
- Exceed reasonable length

### When Selecting Models

**DO:**
- Start with Schnell for testing
- Upgrade to Dev for production
- Use Pro for professional work
- Consider cost implications
- Balance quality vs speed
- Test before final generation
- Scale appropriately

**DON'T:**
- Always use highest tier
- Ignore cost constraints
- Skip testing phase
- Use Pro for drafts
- Forget quality requirements
- Waste credits on iterations
- Select model randomly

## Implementation Notes

**Location:** `src/domain/constants/models/text-to-image.ts`

**Dependencies:**
- FAL provider service
- useFalGeneration hook
- Image format utilities
- Safety validators

**Model Categories:**
- Fast generation (Flux Schnell)
- Quality generation (Flux Dev)
- Professional generation (Flux Pro)

**Import:**
```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- Generation hook: `src/presentation/hooks/use-fal-generation.ts`
- Default models: `src/domain/constants/default-models.constants.ts`
