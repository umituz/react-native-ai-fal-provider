# Base Builders

Base input builder functions for FAL API operations.

**Location:** `src/infrastructure/utils/base-builders.util.ts`

## Overview

Base builders create standardized input objects for image processing operations. These functions convert raw base64 strings to data URI format and add necessary parameters for FAL API requests.

## Purpose

Simplifies input construction by:
- Standardizing image input format across operations
- Converting base64 to data URI automatically
- Supporting single and dual image inputs
- Merging optional parameters
- Providing consistent input structure

## Import

```typescript
import {
  buildSingleImageInput,
  buildDualImageInput
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### buildSingleImageInput

Create input object with single image.

**Parameters:**
- `base64`: Base64 format image (data URI or raw string)
- `extraParams`: Optional additional parameters

**Returns:**
Input object with:
- `image_url`: Data URI formatted image
- `...extraParams`: Additional parameters merged in

**Usage:**
Use to build input for single-image operations. Automatically converts raw base64 to data URI. Preserves existing data URI format. Merges optional parameters into result.

**Implementation:** See complete implementation in `src/infrastructure/utils/base-builders.util.ts`

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### buildDualImageInput

Create input object with two images.

**Parameters:**
- `sourceBase64`: Source image (base64)
- `targetBase64`: Target image (base64)
- `extraParams`: Optional additional parameters

**Returns:**
Input object with:
- `image_url`: Source image as data URI
- `second_image_url`: Target image as data URI
- `...extraParams`: Additional parameters merged in

**Usage:**
Use to build input for dual-image operations like face swap. Both images automatically converted to data URI format. Preserves existing data URI format. Merges optional parameters.

## Usage Guidelines

### For Single Image Operations

**Building Pattern:**
1. Prepare base64 image data or data URI
2. Call `buildSingleImageInput()` with image
3. Add optional parameters if needed
4. Pass result to FAL provider
5. Handle response appropriately

**Best Practices:**
- Validate image format before building
- Use data URI format for consistency
- Add model-specific parameters in extraParams
- Check model documentation for required parameters
- Handle optional parameters appropriately

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

### For Dual Image Operations

**Building Pattern:**
1. Prepare both source and target images
2. Call `buildDualImageInput()` with both images
3. Add optional parameters if needed
4. Pass result to FAL provider
5. Handle response appropriately

**Parameter Order:**
- First parameter: source/target image (depends on model)
- Second parameter: second image
- Check model documentation for correct order

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`

### For Parameter Configuration

**Optional Parameters:**
- Define in extraParams object
- Model-specific parameters
- Type-safe parameter objects recommended
- Check model documentation for available options

**Parameter Merging:**
- ExtraParams shallow merged into result
- Image properties not overwritten
- Use specific parameter names from model docs
- Test with different parameter combinations

### For Pipeline Operations

**Sequential Processing:**
1. Build input for first operation
2. Get result from first operation
3. Extract image URL from result
4. Convert to base64 if needed for next operation
5. Build input for next operation
6. Continue through pipeline

**Parallel Processing:**
1. Build inputs for multiple operations
2. Execute operations in parallel
3. Wait for all operations to complete
4. Combine results as needed

## Best Practices

### 1. Validate Before Building

Check image data:
- Validate base64 format
- Check image data is not corrupted
- Ensure minimum resolution requirements
- Verify image format (JPEG/PNG)
- Use type guards for validation

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### 2. Use Data URI Format

Maintain consistent format:
- Builders automatically convert to data URI
- Use data URI format for all images
- Preserve existing data URI format
- Don't double-format images
- Check format before building

### 3. Handle Parameters Correctly

Configure model parameters:
- Add model-specific parameters in extraParams
- Check documentation for parameter names
- Use typed parameter objects
- Provide required parameters
- Set appropriate defaults

### 4. Build Reusable Wrappers

Create specialized builders:
- Wrap base builders for specific operations
- Add validation in wrapper
- Set default parameters
- Simplify common operations
- Maintain type safety

### 5. Test Image Inputs

Verify inputs work:
- Test with real images
- Check parameter combinations
- Validate output format
- Handle edge cases
- Test with various image sizes

## For AI Agents

### When Using Base Builders

**DO:**
- Import from package root
- Validate image data before building
- Use appropriate builder for image count
- Add model-specific parameters
- Check model documentation
- Handle data URI format correctly
- Test with sample images

**DON'T:**
- Skip image validation
- Use wrong builder for image count
- Ignore model parameter requirements
- Forget data URI conversion
- Manually format data URIs
- Mix up source/target order
- Skip parameter documentation

### When Building Inputs

**DO:**
- Use `buildSingleImageInput()` for single images
- Use `buildDualImageInput()` for two images
- Provide base64 or data URI format
- Add optional parameters in extraParams
- Validate before building
- Check model requirements
- Test output format

**DON'T:**
- Manually construct input objects
- Skip data URI formatting
- Forget required parameters
- Use wrong parameter names
- Ignore validation
- Mix up parameter order
- Create duplicate builders

### When Handling Results

**DO:**
- Validate input format
- Handle image URLs appropriately
- Extract results correctly
- Process returned data
- Handle errors gracefully
- Log issues for debugging
- Test with real API

**DON'T:**
- Assume input format
- Ignore image URLs
- Skip result validation
- Process data incorrectly
- Forget error handling
- Lose image data
- Skip API testing

### When Adding Builders

**For New Base Builders:**
1. Add function to base builders file
2. Follow existing patterns
3. Handle data URI formatting
4. Support optional parameters
5. Update exports
6. Document in this README

**For Enhanced Builders:**
1. Review existing builders
2. Add validation if needed
3. Improve error handling
4. Support new formats
5. Update TypeScript types
6. Test with various inputs

**For Specialized Builders:**
1. Wrap base builders appropriately
2. Add domain-specific logic
3. Set default parameters
4. Validate inputs
5. Export from appropriate module
6. Document usage patterns

## Implementation Notes

**Location:** `src/infrastructure/utils/base-builders.util.ts`

**Dependencies:**
- Uses helper utilities from `src/infrastructure/utils/helpers.util.ts`
- No external dependencies
- Pure builder functions

**Builder Categories:**
- Single image input builders
- Dual image input builders
- Parameter merging utilities
- Data URI formatting

**Import:**
```typescript
import {
  buildSingleImageInput,
  buildDualImageInput
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Image feature builders: `src/infrastructure/utils/image-feature-builders.util.ts`
- Video feature builders: `src/infrastructure/utils/video-feature-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Related Documentation

- [Image Feature Builders](./image-feature-builders.util.README.md)
- [Video Feature Builders](./video-feature-builders.util.README.md)
- [Helper Utilities](./helpers.util.README.md)
- [Type Guards](./type-guards.util.README.md)
