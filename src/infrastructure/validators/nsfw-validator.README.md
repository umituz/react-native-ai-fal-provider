# NSFW Content Validator

Validator for detecting NSFW (Not Safe For Work) content in AI-generated results.

**Location:** `src/infrastructure/validators/nsfw-validator.ts`

## Overview

The NSFW content validator provides content safety validation by checking AI-generated results for inappropriate content. It throws an `NSFWContentError` when NSFW concepts are detected, preventing the display or storage of policy-violating content.

## Purpose

Ensures content safety by:
- Validating AI generation results for NSFW concepts
- Throwing errors when inappropriate content is detected
- Preventing display of policy-violating content
- Supporting content policy enforcement
- Enabling safe content generation workflows

## Import

```typescript
import {
  validateNSFWContent,
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

## Functions

### validateNSFWContent

Validates AI-generated content for NSFW material.

**Parameters:**
- `result`: AI generation result to validate (Record<string, unknown>)

**Returns:** `void` - Throws error if NSFW content detected

**Throws:** `NSFWContentError` - When NSFW content is detected

**Validation Logic:**
- Checks for `has_nsfw_concepts` array in result
- Validates array contains boolean values
- Throws error if any value in array is true
- Passes validation if no NSFW concepts detected
- Handles missing or malformed data gracefully

**Usage:**
Call this function immediately after receiving generation results from FAL API. Use in try-catch blocks to handle NSFW detection. Implement user feedback when content is rejected.

**Implementation:** See complete validation logic in `src/infrastructure/validators/nsfw-validator.ts`

**Related:**
- NSFW content error: `src/infrastructure/services/nsfw-content-error.ts`
- Error types: `src/domain/entities/error.types.ts`

## Usage Guidelines

### For Content Validation

**Validation Pattern:**
1. Receive generation result from FAL API
2. Call `validateNSFWContent()` with result
3. Catch `NSFWContentError` if thrown
4. Display error message to user
5. Suggest alternative prompts

**Best Practices:**
- Always validate before displaying content
- Provide clear user feedback on violations
- Suggest content policy compliance
- Track violations for abuse prevention
- Log detection for analytics

**Related:**
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`

### For Error Handling

**NSFW Error Handling:**
1. Wrap validation in try-catch block
2. Check for `NSFWContentError` instance
3. Display user-friendly error message
4. Suggest prompt modifications
5. Log violation for tracking

**User Feedback:**
- Clearly explain content policy violation
- Suggest different prompts or subjects
- Provide examples of appropriate content
- Link to full content policy
- Allow retry with different input

**Related:**
- Error types: `src/domain/entities/error.types.ts`
- Error categorizer: `src/infrastructure/utils/error-categorizer.ts`

### For Integration

**React Hooks Integration:**
1. Use with `useFalGeneration` hook
2. Validate in error handler or result handler
3. Display alerts for NSFW content
4. Update UI state appropriately
5. Track violations in state management

**Provider Integration:**
1. Call validation in provider methods
2. Intercept results before returning
3. Throw NSFW errors to caller
4. Maintain consistent error handling
5. Support validation toggling

**Related:**
- FAL provider: `src/infrastructure/services/fal-provider.ts`
- useFalGeneration hook: `src/presentation/hooks/use-fal-generation.ts`

### For Violation Tracking

**Tracking Strategy:**
1. Count violations per user or session
2. Implement thresholds for restrictions
3. Log violations for analytics
4. Provide user feedback on violations
5. Consider temporary generation restrictions

**Analytics Integration:**
- Track NSFW detection events
- Monitor violation patterns
- Identify problematic prompts
- Measure policy compliance
- Generate safety reports

## Best Practices

### 1. Always Validate User-Facing Content

Validate all content before display:
- Call validation immediately after generation
- Never display content before validation
- Validate in all environments (production, staging)
- Test validation with various content types
- Handle validation errors consistently

### 2. Provide Clear User Feedback

Communicate violations effectively:
- Use clear, non-judgmental language
- Explain what violated the policy
- Suggest alternative approaches
- Provide examples of appropriate content
- Link to complete content policy

### 3. Track Violations Appropriately

Monitor NSFW detection patterns:
- Count violations per user/session
- Implement threshold-based restrictions
- Log violations for analytics
- Identify abuse patterns
- Consider automatic restrictions

### 4. Handle Errors Gracefully

Implement robust error handling:
- Use try-catch blocks around validation
- Check for `NSFWContentError` instance
- Display user-friendly messages
- Allow retry with different prompts
- Maintain application stability

### 5. Respect User Context

Consider user-specific validation:
- Different validation for different user types
- Optional validation for admin users
- Age-appropriate validation rules
- Premium user validation options
- Context-aware validation settings

## For AI Agents

### When Using NSFW Validator

**DO:**
- Import from package root
- Validate all user-facing content
- Handle NSFWContentError appropriately
- Provide clear user feedback
- Track violations for analytics
- Suggest alternative prompts
- Link to content policy

**DON'T:**
- Skip validation for user content
- Display content before validating
- Show technical error messages
- Ignore violation patterns
- Allow retry with same prompt
- Hide policy details from users
- Forget to log violations

### When Handling Errors

**DO:**
- Use try-catch blocks
- Check for NSFWContentError instance
- Display user-friendly messages
- Suggest prompt modifications
- Log violations appropriately
- Consider user context
- Implement graceful degradation

**DON'T:**
- Let errors propagate uncaught
- Show technical error details
- Blame the user
- Use vague error messages
- Skip violation tracking
- Allow repeated violations
- Ignore user feedback

### When Integrating

**DO:**
- Validate in provider or hooks
- Implement consistent handling
- Support validation toggling
- Track violations globally
- Monitor detection patterns
- Update error handling
- Test with various content

**DON'T:**
- Validate inconsistently
- Skip validation in some paths
- Ignore violation patterns
- Allow validation bypass
- Forget user feedback
- Hardcode validation logic
- Create duplicate validators

### When Adding Validation

**For New Validation Rules:**
1. Review existing validation logic
2. Add new validators if needed
3. Update error types
4. Document validation behavior
5. Update this README
6. Test with edge cases

**For Enhanced Tracking:**
1. Add violation tracking
2. Implement threshold logic
3. Update analytics integration
4. Add user feedback mechanisms
5. Test tracking accuracy
6. Document tracking behavior

**For Custom Validation:**
1. Extend validator classes
2. Add configuration options
3. Support user-specific rules
4. Maintain backward compatibility
5. Update TypeScript types
6. Document custom behavior

## Implementation Notes

**Location:** `src/infrastructure/validators/nsfw-validator.ts`

**Dependencies:**
- Uses NSFWContentError from `src/infrastructure/services/nsfw-content-error.ts`
- No external dependencies
- Pure validation logic

**Validation Approach:**
- Checks for `has_nsfw_concepts` array
- Validates array contains boolean values
- Throws error if any value is true
- Handles missing or malformed data
- Logs detection in development mode

**Import:**
```typescript
import {
  validateNSFWContent,
  NSFWContentError
} from '@umituz/react-native-ai-fal-provider';
```

**Development Mode:**
In development mode, the validator logs when NSFW content is detected for debugging purposes.

**Related:**
- NSFW content error: `src/infrastructure/services/nsfw-content-error.ts`
- Error types: `src/domain/entities/error.types.ts`
- Error mapper: `src/infrastructure/utils/error-mapper.ts`
- FAL provider: `src/infrastructure/services/fal-provider.ts`

## Related Documentation

- [NSFW Content Error](../services/nsfw-content-error.README.md)
- [Error Types](../../domain/entities/error.types.README.md)
- [Error Mapper](../utils/error-mapper.README.md)
- [Error Categorizer](../utils/error-categorizer.README.md)
