# Text-to-Text Generation

Generates text from text using LLM-based models.

**Location:** `src/domain/constants/models/text-to-text.ts`

## Overview

Text-to-text generation uses Large Language Models (LLMs) to generate, transform, or analyze text content. This module provides model configurations for various text generation tasks with controllable parameters.

## Purpose

Provides text generation models by:
- Supporting question answering
- Enabling content generation
- Facilitating text transformation
- Providing summarization
- Supporting translation tasks

## Import

```typescript
import {
  falProvider,
  useFalGeneration
} from '@umituz/react-native-ai-fal-provider';
```

## Available Models

### Llama 3 8B Instruct
- **Model ID:** `fal-ai/llama-3-8b-instruct`
- **Cost:** 0.1 credits (Free), 0.05 credits (Premium)
- **Description:** Fast and reliable text generation (Default)
- **Use Cases:** QA, content generation, summarization, translation

## Parameters

### Basic Parameters

**Configuration:**
- `prompt`: Input prompt or question
- `max_tokens`: Maximum tokens to generate (default: 512)
- `temperature`: Creativity level 0.0 - 1.0 (default: 0.7)
- `top_p`: Nucleus sampling 0.0 - 1.0 (default: 0.9)
- `top_k`: Top-k sampling (default: 40)
- `repetition_penalty`: Reduce repetitions 1.0 - 2.0

### Parameter Descriptions

| Parameter | Range | Description |
|-----------|-------|-------------|
| `prompt` | string | Input text or question |
| `max_tokens` | 1 - 4096 | Maximum tokens to generate |
| `temperature` | 0.0 - 1.0 | Low = focused, High = creative |
| `top_p` | 0.0 - 1.0 | Nucleus sampling threshold |
| `top_k` | 1 - 100 | Top-k sampling value |
| `repetition_penalty` | 1.0 - 2.0 | Reduce repetitions |

## Usage Guidelines

### For Text Generation

**Generation Pattern:**
1. Construct clear prompt
2. Set appropriate max_tokens
3. Configure temperature for task
4. Generate text
5. Handle output appropriately

**Best Practices:**
- Write clear, specific prompts
- Use system prompts for behavior
- Adjust temperature for task type
- Set appropriate max_tokens
- Validate output quality

### For Temperature Selection

**Temperature Guidelines:**

**Low (0.0 - 0.3):**
- Factual responses
- Code generation
- Deterministic output
- Technical content

**Medium (0.4 - 0.7):**
- Balanced output
- General assistance
- Standard responses
- Most use cases

**High (0.8 - 1.0):**
- Creative writing
- Diverse outputs
- Brainstorming
- Fiction generation

## Best Practices

### 1. Engineer Effective Prompts

Create well-structured prompts:
- Define role or context
- Provide clear instructions
- Specify output format
- Include examples if needed
- Set constraints explicitly

**Prompt Structure:**
```
Role/Context
Task/Instructions
Input Content
Output Format/Constraints
```

### 2. Optimize Token Usage

Manage generation efficiently:
- Set appropriate max_tokens for task
- Use shorter prompts when possible
- Limit output length for simple tasks
- Monitor token consumption
- Cache common responses

### 3. Select Right Temperature

Choose temperature based on task:
- Factual QA: 0.2 - 0.3
- Code generation: 0.2 - 0.4
- Translation: 0.3 - 0.5
- Summarization: 0.5 - 0.7
- General assistance: 0.6 - 0.7
- Creative writing: 0.8 - 1.0

### 4. Use System Prompts

Guide model behavior:
- Define role explicitly
- Set behavioral constraints
- Specify response style
- Include format requirements
- Maintain consistency

### 5. Handle Edge Cases

Manage challenging scenarios:
- Validate input prompts
- Handle timeout errors
- Check quota limits
- Validate output quality
- Implement fallback strategies

## For AI Agents

### When Using Text-to-Text Models

**DO:**
- Write clear specific prompts
- Use system prompts for guidance
- Set appropriate temperature
- Configure max_tokens correctly
- Validate output quality
- Handle errors appropriately
- Monitor token usage
- Test with various prompts

**DON'T:**
- Write vague prompts
- Ignore temperature settings
- Set excessive max_tokens
- Skip output validation
- Forget error handling
- Waste tokens on long outputs
- Use wrong temperature
- Assume perfect output

### When Engineering Prompts

**DO:**
- Define role or context
- Provide clear instructions
- Specify output format
- Include examples when helpful
- Set explicit constraints
- Test prompt variations
- Iterate on prompt design

**DON'T:**
- Use vague instructions
- Skip context setting
- Forget format specification
- Ignore constraint setting
- Use overly complex prompts
- Skip testing
- Use first draft

### When Configuring Parameters

**DO:**
- Match temperature to task
- Set appropriate max_tokens
- Use repetition penalty
- Configure sampling parameters
- Test different settings
- Monitor output quality
- Adjust based on results

**DON'T:**
- Use default temperature always
- Set excessive max_tokens
- Ignore sampling parameters
- Skip parameter testing
- Use arbitrary values
- Forget output quality
- Waste tokens

## Implementation Notes

**Location:** `src/domain/constants/models/text-to-text.ts`

**Dependencies:**
- FAL provider service
- useFalGeneration hook
- Text processing utilities
- Prompt templates

**Common Use Cases:**
- Question answering
- Content generation
- Text summarization
- Translation
- Code generation
- Creative writing

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
