# Image Feature Builders

Input builder functions for image processing features.

**Location:** `src/infrastructure/utils/image-feature-builders.util.ts`

## Overview

This module provides builder functions for creating input objects for image processing operations including upscaling, photo restoration, face swapping, background removal, and more.

## Purpose

Simplifies image feature integration by:
- Providing feature-specific input builders
- Handling image formatting automatically
- Supporting feature-specific options
- Abstracting FAL API parameter structures
- Enabling type-safe input construction

## Import

```typescript
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildHDTouchUpInput,
  buildReplaceBackgroundInput,
  buildKontextStyleTransferInput
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### buildUpscaleInput

Build input for image upscaling operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Upscale options (optional)
  - `scaleFactor`: 2 or 4 (default: 2)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for upscaling

**Usage:**
Use to increase image resolution and quality. Configure scaling factor and optional face enhancement for portraits.

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Base builders: `src/infrastructure/utils/base-builders.util.ts`

### buildPhotoRestoreInput

Build input for photo restoration operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Restoration options (optional)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for restoration

**Usage:**
Use to restore old or low-quality photos. Enhance quality and sharpness. Optional face enhancement for portraits.

### buildFaceSwapInput

Build input for face swapping operations.

**Parameters:**
- `sourceBase64`: Source image with face to swap (base64 or data URI)
- `targetBase64`: Target image (base64 or data URI)
- `options`: Face swap options (optional)

**Returns:** Formatted input object for face swapping

**Usage:**
Use to swap faces between two images. Source image provides the face, target image receives the face.

### buildRemoveBackgroundInput

Build input for background removal operations.

**Parameters:**
- `base64`: Base64 image data or data URI

**Returns:** Formatted input object for background removal

**Usage:**
Use to remove image background automatically. Returns PNG format with transparent background.

### buildRemoveObjectInput

Build input for object removal operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Removal options (optional)
  - `mask`: Base64 mask of area to remove
  - `prompt`: Description for fill content

**Returns:** Formatted input object for object removal

**Usage:**
Use to remove objects and fill the area. Provide mask to specify removal area. Prompt describes desired fill content.

### buildHDTouchUpInput

Build input for HD enhancement operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Enhancement options (optional)
  - `scaleFactor`: 2 or 4 (default: 2)
  - `enhanceFaces`: Enable face enhancement (default: false)

**Returns:** Formatted input object for HD enhancement

**Usage:**
Use for high-definition image enhancement. Combines upscaling with quality improvements.

### buildReplaceBackgroundInput

Build input for background replacement operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Replacement options
  - `prompt`: Description of new background

**Returns:** Formatted input object for background replacement

**Usage:**
Use to replace image background with AI-generated scene. Prompt describes desired new background.

### buildKontextStyleTransferInput

Build input for style transfer operations.

**Parameters:**
- `base64`: Base64 image data or data URI
- `options`: Style transfer options
  - `prompt`: Style description
  - `guidance_scale`: Style strength (optional)

**Returns:** Formatted input object for style transfer

**Usage:**
Use to transform image style (e.g., anime conversion). Prompt describes desired artistic style.

## Usage Guidelines

### For Image Enhancement

**Enhancement Pattern:**
1. Select appropriate builder (upscale, restore, HD touch-up)
2. Prepare base64 image data or data URI
3. Configure options (scale factor, face enhancement)
4. Build input using selected function
5. Pass to FAL provider subscribe method
6. Handle enhanced result

**Best Practices:**
- Use appropriate scale factor for use case
- Enable face enhancement for portraits
- Consider processing time for large scale factors
- Validate image quality before enhancement
- Test with different settings

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### For Face Operations

**Face Operations Pattern:**
1. Prepare source and target images for face swap
2. Use `buildFaceSwapInput()` with both images
3. For enhancement, enable face enhancement option
4. Submit to appropriate model
5. Handle result with swapped/enhanced faces

**Best Practices:**
- Use clear, well-lit portraits
- Ensure faces are clearly visible
- Enable face enhancement for best results
- Test with various image qualities
- Consider group photo limitations

### For Background Operations

**Background Operations Pattern:**
1. Prepare base64 image data
2. For removal: Use `buildRemoveBackgroundInput()`
3. For replacement: Use `buildReplaceBackgroundInput()` with prompt
4. Submit to background model
5. Handle result appropriately

**Background Removal:**
- Returns PNG with transparent background
- Can compose over new backgrounds
- Works with various image types
- Automatic background detection

**Background Replacement:**
- Requires descriptive prompt
- AI generates new background
- Maintain subject consistency
- Describe lighting and atmosphere

### For Object Removal

**Removal Pattern:**
1. Create mask for area to remove
2. Prepare base64 image data
3. Use `buildRemoveObjectInput()` with image and mask
4. Optionally provide fill prompt
5. Submit to object removal model
6. Handle result with object removed

**Mask Creation:**
- White (255) indicates removal area
- Black (0) indicates preservation area
- Size must match input image
- Can be created programmatically

## Best Practices

### 1. Validate Image Data

Check inputs before building:
- Validate base64 format
- Check image resolution
- Verify image quality
- Ensure correct format (JPEG/PNG)
- Use type guards for validation

**Related:**
- Type guards: `src/infrastructure/utils/type-guards.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`

### 2. Use Appropriate Options

Configure features correctly:
- Select correct scale factor
- Enable face enhancement for portraits
- Provide clear prompts for AI generation
- Create accurate masks for removal
- Test with different settings

### 3. Handle Results Appropriately

Process feature results:
- Handle PNG format for transparency
- Display enhanced images correctly
- Compose backgrounds appropriately
- Show before/after comparisons
- Save processed images

### 4. Consider Processing Time

Manage user expectations:
- Larger scale factors take longer
- Face enhancement adds processing time
- Show progress indicators
- Handle timeouts appropriately
- Queue multiple operations

### 5. Test With Various Inputs

Verify builders work correctly:
- Test with different image sizes
- Check various image qualities
- Test edge cases
- Validate output format
- Ensure consistent results

## For AI Agents

### When Using Image Feature Builders

**DO:**
- Import from package root
- Use correct builder for each feature
- Validate image data before building
- Configure options appropriately
- Check model requirements
- Handle image formats correctly
- Test with sample images

**DON'T:**
- Use wrong builder for feature
- Skip image validation
- Ignore feature-specific options
- Forget model requirements
- Process invalid images
- Use incorrect parameter types
- Skip testing

### When Building Inputs

**DO:**
- Select appropriate builder function
- Provide required parameters
- Configure options correctly
- Validate image format
- Check resolution requirements
- Handle base64 encoding
- Test output structure

**DON'T:**
- Use generic builders
- Skip required parameters
- Ignore option types
- Forget data URI format
- Process corrupted images
- Assume default options
- Mix up parameters

### When Handling Results

**DO:**
- Handle PNG format for transparency
- Display results appropriately
- Save processed images
- Show before/after when applicable
- Handle errors gracefully
- Validate result format
- Test with real API

**DON'T:**
- Assume JPEG format always
- Display invalid results
- Forget transparency handling
- Skip error handling
- Lose processed images
- Ignore result validation
- Skip API testing

### When Adding Builders

**For New Image Feature Builders:**
1. Add builder function to module
2. Define options interface
3. Document feature and model
4. Update exports
5. Add tests
6. Update this README

**For Enhanced Options:**
1. Review existing option interfaces
2. Add new options appropriately
3. Set sensible defaults
4. Update TypeScript types
5. Document new options
6. Test with various inputs

**For New Features:**
1. Research FAL model requirements
2. Design builder interface
3. Implement builder function
4. Test with real API
5. Document usage patterns
6. Update related code

## Implementation Notes

**Location:** `src/infrastructure/utils/image-feature-builders.util.ts`

**Dependencies:**
- Uses base builders from `src/infrastructure/utils/base-builders.util.ts`
- Uses helper utilities from `src/infrastructure/utils/helpers.util.ts`
- No external dependencies

**Builder Categories:**
- Image enhancement (upscale, restore, HD touch-up)
- Face manipulation (face swap)
- Background operations (remove, replace)
- Object manipulation (remove object)
- Style transfer (kontext style transfer)

**Import:**
```typescript
import {
  buildUpscaleInput,
  buildPhotoRestoreInput,
  buildFaceSwapInput,
  buildRemoveBackgroundInput,
  buildRemoveObjectInput,
  buildHDTouchUpInput,
  buildReplaceBackgroundInput,
  buildKontextStyleTransferInput
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- Image feature builder: `src/infrastructure/builders/image-feature-builder.ts`
- Base builders: `src/infrastructure/utils/base-builders.util.ts`
- Helper utilities: `src/infrastructure/utils/helpers.util.ts`
- Type guards: `src/infrastructure/utils/type-guards.util.ts`

## Related Documentation

- [Image Feature Builder](../builders/image-feature-builder.README.md)
- [Base Builders](./base-builders.util.README.md)
- [Helper Utilities](./helpers.util.README.md)
- [Type Guards](./type-guards.util.README.md)
