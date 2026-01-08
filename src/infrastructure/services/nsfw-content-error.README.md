# NSFW Content Error

Error class for NSFW (Not Safe For Work) content detection.

**Location:** `src/infrastructure/services/nsfw-content-error.ts`

## Overview

`NSFWContentError` is a custom error class thrown when AI-generated content violates NSFW or content policy guidelines.

## Purpose

Provides NSFW error handling by:
- Identifying NSFW content violations
- Supporting error categorization
- Enabling specific error handling
- Facilitating user feedback
- Preventing inappropriate content

## Import

```typescript
import {
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

## Class

### NSFWContentError

Custom error class for NSFW content detection.

**Inheritance:**
- Extends: `Error`
- Name: `'NSFWContentError'`
- Default message: `'NSFW content detected'`

**Constructor:**
- `message`: Optional custom error message

**Properties:**
- `name`: Error class name
- `message`: Error description
- `stack`: Call stack (inherited from Error)

## Usage Guidelines

### For Error Throwing

**Throw Pattern:**
1. Detect NSFW content
2. Throw NSFWContentError
3. Provide descriptive message
4. Let error propagate
5. Handle at appropriate level

**Best Practices:**
- Use specific, clear messages
- Explain what was detected
- Guide users to fix issue
- Don't use vague messages
- Be consistent in messaging

### For Error Handling

**Handling Pattern:**
1. Catch errors from generation
2. Check instanceof NSFWContentError
3. Display user-friendly message
4. Suggest corrective action
5. Prevent retry for NSFW

**Best Practices:**
- Check type specifically
- Show clear error messages
- Block inappropriate content
- Don't allow retry
- Guide user behavior

## Best Practices

### 1. Use Descriptive Messages

Provide clear error messages:
- Explain what was detected
- Be specific about violation
- Use user-friendly language
- Suggest alternatives
- Maintain consistent messaging

### 2. Handle Separately

Treat NSFW errors differently:
- Catch NSFWContentError specifically
- Use different UI for NSFW
- Prevent retry attempts
- Track NSFW occurrences
- Inform content policy

### 3. Guide Users

Help users understand:
- Explain why content was blocked
- Describe what violates policy
- Suggest acceptable alternatives
- Provide clear guidance
- Enable quick correction

### 4. Track Occurrences

Monitor NSFW detection:
- Log NSFW occurrences
- Track frequency
- Identify patterns
- Implement rate limiting
- Prevent abuse

### 5. Prevent Retry

Block NSFW retry attempts:
- Mark errors as non-retryable
- Disable retry buttons
- Show appropriate messaging
- Enforce content policy
- Protect service integrity

## For AI Agents

### When Throwing NSFW Errors

**DO:**
- Throw NSFWContentError for violations
- Use descriptive messages
- Explain what was detected
- Guide users to fix
- Be specific and clear
- Maintain consistency
- Follow content policy

**DON'T:**
- Use generic error types
- Provide vague messages
- Skip explanations
- Leave users confused
- Use inconsistent messaging
- Ignore policy guidelines
- Allow inappropriate content

### When Handling NSFW Errors

**DO:**
- Check instanceof NSFWContentError
- Display user-friendly messages
- Block retry attempts
- Track occurrences
- Inform users clearly
- Suggest alternatives
- Follow content policy

**DON'T:**
- Handle like other errors
- Show technical details
- Allow retry
- Skip tracking
- Confuse users
- Hide the issue
- Ignore violations

### When Validating Content

**DO:**
- Validate all generated content
- Check NSFW concepts array
- Throw error for violations
- Be consistent in checking
- Log violations
- Prevent inappropriate content
- Update validation regularly

**DON'T:**
- Skip validation
- Ignore NSFW concepts
- Allow violations through
- Be inconsistent
- Forget logging
- Allow inappropriate content
- Use outdated rules

## Implementation Notes

**Location:** `src/infrastructure/services/nsfw-content-error.ts`

**Dependencies:**
- No external dependencies
- Extends built-in Error class

**Error Characteristics:**
- Named error class
- Default and custom messages
- Stack trace support
- Type-checkable with instanceof
- Compatible with try-catch

**Import:**
```typescript
import {
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

**Related:**
- NSFW validator: `src/infrastructure/validators/nsfw-validator.ts`
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
