# Helper Utilities

Common utility functions for data formatting, validation, error handling, and performance optimization in FAL operations.

**Location:** `src/infrastructure/utils/helpers.util.ts`

## Overview

This module provides reusable utility functions used throughout the FAL AI provider. It includes image data formatting, credit cost formatting, prompt sanitization, and timeout management functions.

## Purpose

Simplifies common operations by:
- Formatting image data URIs correctly
- Extracting and validating base64 data
- Formatting credit costs for display
- Sanitizing user prompts
- Managing timeouts with jitter
- Providing consistent data transformations

## Import

```typescript
import {
  formatImageDataUri,
  extractBase64,
  formatCreditCost,
  truncatePrompt,
  sanitizePrompt
} from '@umituz/react-native-ai-fal-provider';
```

## Image Data Functions

### formatImageDataUri

Convert base64 string to data URI format.

**Parameters:**
- `base64`: Base64 string or data URI

**Returns:** `string` - Properly formatted data URI

**Usage:**
Use this function to ensure image data is in correct data URI format. Function checks if input is already formatted and only formats if necessary. Prepends `data:image/jpeg;base64,` if not present.

**Implementation:** See `src/infrastructure/utils/helpers.util.ts`

### extractBase64

Extract raw base64 string from data URI.

**Parameters:**
- `dataUri`: Data URI string or base64 string

**Returns:** `string` - Raw base64 string

**Usage:**
Use this function to extract base64 data from data URI format. Returns input as-is if not a data URI. Useful when API expects raw base64 instead of data URI.

### getDataUriExtension

Extract file extension from data URI.

**Parameters:**
- `dataUri`: Data URI string

**Returns:** `string | null` - File extension (e.g., 'jpeg', 'png') or null

**Usage:**
Use this function to determine image format from data URI. Returns null if input is not a valid data URI. Useful for format validation.

### isImageDataUri

Check if string is an image data URI.

**Parameters:**
- `str`: String to validate

**Returns:** `boolean` - True if string is image data URI

**Usage:**
Use this function to validate image data URI format. Checks for proper data URI prefix and image mime type.

## Display Functions

### formatCreditCost

Format credit cost for user display.

**Parameters:**
- `cost`: Number of credits

**Returns:** `string` - Formatted cost string

**Usage:**
Use this function to display credit costs in UI. Formats numbers with appropriate labels. Provides consistent cost display throughout application.

**Implementation:** See formatting logic in `src/infrastructure/utils/helpers.util.ts`

### formatJobDuration

Format job duration for display.

**Parameters:**
- `milliseconds`: Duration in milliseconds

**Returns:** `string` - Formatted duration string

**Usage:**
Use this function to display job duration in user-friendly format. Shows seconds, minutes, or "In progress" for incomplete jobs.

**Related:**
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

## Prompt Functions

### truncatePrompt

Truncate prompt text to maximum length.

**Parameters:**
- `prompt`: Prompt text to truncate
- `maxLength`: Maximum character length (optional)

**Returns:** `string` - Truncated prompt with ellipsis if needed

**Usage:**
Use this function to ensure prompts fit within API limits. Adds ellipsis (...) to truncated text. Preserves original text if under limit.

### sanitizePrompt

Sanitize prompt text for API submission.

**Parameters:**
- `prompt`: Prompt text to sanitize

**Returns:** `string` - Sanitized prompt text

**Usage:**
Use this function to clean user prompts before API submission. Removes problematic characters, normalizes whitespace, and ensures safe text submission.

## Time Functions

### calculateTimeoutWithJitter

Add random jitter to timeout value.

**Parameters:**
- `baseTimeout`: Base timeout in milliseconds
- `jitterPercent`: Percentage of jitter (optional)

**Returns:** `number` - Timeout with random jitter

**Usage:**
Use this function to prevent "thundering herd" problem when multiple requests retry simultaneously. Randomizes timeout slightly to distribute load.

**Implementation:** See jitter calculation in `src/infrastructure/utils/helpers.util.ts`

### sleep

Async sleep/delay function.

**Parameters:**
- `ms`: Milliseconds to sleep

**Returns:** `Promise<void>` - Resolves after delay

**Usage:**
Use this function for delays in retry logic, rate limiting, or async sequencing.

## Usage Guidelines

### For Image Data Handling

**Formatting Pattern:**
1. Receive base64 or data URI from source
2. Use `formatImageDataUri()` to ensure correct format
3. Pass formatted data to FAL API
4. Use `extractBase64()` if API needs raw base64
5. Use `getDataUriExtension()` for format validation

**Best Practices:**
- Always format before sending to API
- Validate with `isImageDataUri()` when needed
- Handle both data URI and raw base64 inputs
- Check format requirements in API docs

### For Display Formatting

**Credit Cost Display:**
1. Get credit cost from model configuration
2. Use `formatCreditCost()` for display
3. Show before generation starts
4. Update when model changes

**Duration Display:**
1. Get duration in milliseconds
2. Use `formatJobDuration()` for display
3. Handle null for incomplete jobs
4. Show in user-readable format

**Related:**
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`

### For Prompt Handling

**Sanitization Pattern:**
1. Receive user input prompt
2. Use `sanitizePrompt()` to clean text
3. Use `truncatePrompt()` if needed
4. Pass to FAL API
5. Store original if needed for display

**Best Practices:**
- Always sanitize user input
- Truncate to API limits
- Preserve original for display
- Log sanitization if needed

### For Retry Logic

**Timeout Management:**
1. Get base timeout from configuration
2. Use `calculateTimeoutWithJitter()` for retries
3. Use `sleep()` between retries
4. Implement exponential backoff

**Jitter Usage:**
- Apply jitter to prevent request clustering
- Use small jitter percentage (5-10%)
- Only apply for retry scenarios
- Keep base timeout reasonable

## Best Practices

### 1. Always Format Image Data

Ensure correct image format:
- Use `formatImageDataUri()` before API calls
- Validate with `isImageDataUri()`
- Handle both base64 and data URI inputs
- Check API documentation for format requirements

### 2. Validate Before Processing

Check data before use:
- Use type guard functions
- Validate prompt length
- Check image data format
- Handle invalid data gracefully

### 3. Format for Display

Use formatting functions for UI:
- Format credit costs before display
- Format durations for readability
- Use consistent formatting
- Follow locale conventions

### 4. Sanitize User Input

Clean all user-provided text:
- Sanitize prompts before API calls
- Remove dangerous characters
- Normalize whitespace
- Truncate to limits

### 5. Manage Timeouts Properly

Implement proper timeout handling:
- Use jitter for retries
- Implement exponential backoff
- Use sleep for delays
- Set reasonable timeout values

## For AI Agents

### When Using Helper Functions

**DO:**
- Import from package root
- Use `formatImageDataUri()` for images
- Sanitize all user prompts
- Format display values appropriately
- Use jitter for retry timeouts
- Validate data before processing
- Handle edge cases

**DON'T:**
- Manually format data URIs
- Skip prompt sanitization
- Show raw credit costs
- Hardcode timeout values
- Ignore validation functions
- Create duplicate utility functions
- Assume input format

### When Formatting Images

**DO:**
- Use `formatImageDataUri()` before API
- Validate with `isImageDataUri()`
- Extract base64 when needed
- Check data URI extension
- Handle both input formats
- Follow API format requirements

**DON'T:**
- Manually construct data URIs
- Assume input format
- Skip validation
- Hardcode mime types
- Ignore format requirements
- Create custom formatting logic

### When Handling Prompts

**DO:**
- Always sanitize user input
- Truncate to API limits
- Use provided functions
- Handle special characters
- Preserve original for display
- Log sanitization

**DON'T:**
- Skip sanitization
- Exceed API limits
- Manually clean text
- Lose original text
- Allow dangerous characters
- Hardcode limits

### When Adding Functions

**For New Formatting Functions:**
1. Add to helpers file
2. Follow existing patterns
3. Handle edge cases
4. Update exports
5. Document in this README
6. Add tests

**For New Validation Functions:**
1. Add type guard if needed
2. Return boolean for simple validation
3. Return detailed info if needed
4. Follow naming conventions
5. Document usage

**For New Utility Functions:**
1. Add to appropriate utility file
2. Keep functions pure
3. Handle null/undefined
4. Use TypeScript types
5. Document thoroughly

## Implementation Notes

**Location:** `src/infrastructure/utils/helpers.util.ts`

**Dependencies:**
- No external dependencies
- Pure utility functions
- Used throughout the provider

**Function Categories:**
- Image data formatting
- Display formatting
- Prompt handling
- Time management
- Data validation

**Import:**
```typescript
import {
  formatImageDataUri,
  extractBase64,
  formatCreditCost,
  truncatePrompt,
  sanitizePrompt
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Job format utilities: `src/infrastructure/utils/job-metadata/job-metadata-format.util.ts`
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

## Related Documentation

- [Type Guards](./type-guards.util.README.md)
- [Job Metadata Format](./job-metadata/job-metadata-format.util.README.md)
- [Image Feature Builders](./image-feature-builders.util.README.md)
