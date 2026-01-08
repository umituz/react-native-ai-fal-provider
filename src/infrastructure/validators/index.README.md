# Validators Module

Central export point for all validator functions.

**Location:** `src/infrastructure/validators/index.ts`

## Overview

The validators module provides content validation utilities to ensure AI-generated content meets safety and quality standards. Currently, it focuses on NSFW (Not Safe For Work) content detection.

## Purpose

Provides validation by:
- Checking content safety
- Preventing inappropriate content
- Enforcing content policies
- Supporting custom validators
- Enabling content filtering

## Import

```typescript
import {
  validateNSFWContent
} from '@umituz/react-native-ai-fal-provider';
```

## Exports

### validateNSFWContent

Validates AI-generated content for NSFW material.

**Path:** `src/infrastructure/validators/nsfw-validator.ts`

**Documentation:** See `nsfw-validator.README.md`

**Usage:**
Validate content immediately after generation. Throw NSFWContentError if violation detected. Handle error specifically in UI.

## Usage Guidelines

### For Content Validation

**Validation Pattern:**
1. Receive generation result
2. Call validateNSFWContent
3. Catch NSFWContentError
4. Display user-friendly message
5. Block inappropriate content

**Best Practices:**
- Always validate user-facing content
- Validate immediately after generation
- Handle NSFW errors specifically
- Don't retry NSFW requests
- Track NSFW occurrences
- Enforce content policies

### For Error Handling

**Error Pattern:**
1. Catch NSFWContentError specifically
2. Display clear error messages
3. Guide users to acceptable content
4. Block retry attempts
5. Log violations appropriately

**Best Practices:**
- Check instanceof NSFWContentError
- Show specific error messages
- Prevent content display
- Inform users clearly
- Track violation patterns

## Best Practices

### 1. Always Validate User-Facing Content

Validate all generated content before displaying:
- Call validateNSFWContent after generation
- Validate before saving to storage
- Check before displaying in UI
- Prevent NSFW content display
- Enforce content policies

### 2. Handle Validation Errors

Process NSFW content errors:
- Catch NSFWContentError specifically
- Display user-friendly messages
- Block inappropriate content display
- Guide users to corrections
- Track violation occurrences

### 3. Validate Early

Validate content as early as possible:
- Validate immediately after generation
- Check before saving to storage
- Validate before displaying
- Prevent NSFW content spread
- Minimize exposure time

### 4. Provide Context

Track validation with context:
- Log violation with user ID
- Include prompt that caused violation
- Timestamp the occurrence
- Track violation patterns
- Enforce rate limiting

### 5. Enforce Consistently

Apply validation uniformly:
- Validate all user-generated content
- Don't skip validation for any users
- Apply same rules consistently
- Update validation rules regularly
- Monitor validation effectiveness

## For AI Agents

### When Using Validators

**DO:**
- Import from package root
- Validate all user-facing content
- Handle NSFW errors specifically
- Display clear error messages
- Track violation occurrences
- Enforce content policies
- Update validation rules

**DON'T:**
- Skip content validation
- Display NSFW content
- Ignore validation errors
- Hide violation details
- Allow inappropriate content
- Forget policy enforcement
- Create security issues

### When Validating Content

**DO:**
- Validate immediately after generation
- Check for NSFW concepts array
- Throw NSFWContentError for violations
- Handle validation errors gracefully
- Log violations appropriately
- Guide users to corrections

**DON'T:**
- Skip validation
- Ignore NSFW concepts
- Allow violations through
- Display inappropriate content
- Forget logging
- Leave users uninformed
- Create liability issues

### When Handling Violations

**DO:**
- Check instanceof NSFWContentError
- Display user-friendly messages
- Block inappropriate content
- Track violation patterns
- Implement rate limiting
- Suggest corrections

**DON'T:**
- Handle like other errors
- Show technical details
- Allow content display
- Skip tracking
- Enable retry attempts
- Create policy violations

## Implementation Notes

**Location:** `src/infrastructure/validators/index.ts`

**Dependencies:**
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`
- NSFW error: `src/infrastructure/services/nsfw-content-error.ts`

**Validation Categories:**
- Content safety validation
- Policy enforcement
- User-facing content checks

**Import:**
```typescript
import {
  validateNSFWContent
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`
- NSFW error: `src/infrastructure/services/nsfw-content-error.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
