/**
 * Input Preprocessor Utility
 * Detects and uploads base64/local file images to FAL storage before API calls
 *
 * Upload strategy:
 * - Array fields (image_urls): SEQUENTIAL uploads to avoid bandwidth contention
 * - Individual fields (image_url, face_image_url): parallel (typically only 1)
 */

import { uploadToFalStorage, uploadLocalFileToFalStorage } from "./fal-storage.util";
import { getErrorMessage } from './helpers/error-helpers.util';
import { IMAGE_URL_FIELDS } from './constants/image-fields.constants';
import { isImageDataUri as isBase64DataUri } from './validators/data-uri-validator.util';
import { generationLogCollector } from './log-collector';

const TAG = 'preprocessor';

function isLocalFileUri(value: unknown): value is string {
  return typeof value === "string" && (
    value.startsWith("file://") || value.startsWith("content://")
  );
}

/**
 * Classify a network error into a user-friendly message.
 * Technical details are preserved in Firestore logs/session subcollection.
 */
function classifyUploadError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();

  if (lower.includes('timed out') || lower.includes('timeout')) {
    return 'Photo upload took too long. Please try again on a stronger connection (WiFi recommended).';
  }
  if (lower.includes('network request failed') || lower.includes('network') || lower.includes('fetch')) {
    return 'Photo upload failed due to network issues. Please check your internet connection and try again.';
  }
  if (lower.includes('econnrefused') || lower.includes('enotfound')) {
    return 'Could not reach the upload server. Please check your internet connection and try again.';
  }

  return errorMsg;
}

/**
 * Preprocess input by uploading base64/local file images to FAL storage.
 * Also strips sync_mode to prevent base64 data URI responses.
 * Returns input with HTTPS URLs instead of base64/local URIs.
 *
 * Array fields are uploaded SEQUENTIALLY to avoid bandwidth contention
 * on slow mobile connections (prevents simultaneous upload failures).
 */
export async function preprocessInput(
  input: Record<string, unknown>,
  sessionId: string,
): Promise<Record<string, unknown>> {
  const startTime = Date.now();
  const inputKeys = Object.keys(input);
  generationLogCollector.log(sessionId, TAG, `Starting preprocessing...`, { keys: inputKeys });

  const result = { ...input };
  const uploadPromises: Promise<unknown>[] = [];

  if ("sync_mode" in result) {
    delete result.sync_mode;
    generationLogCollector.warn(sessionId, TAG, `Stripped sync_mode from input`);
  }

  // Handle individual image URL keys (parallel — typically only 1 field)
  let individualUploadCount = 0;
  for (const key of IMAGE_URL_FIELDS) {
    const value = result[key];

    if (isBase64DataUri(value)) {
      individualUploadCount++;
      generationLogCollector.log(sessionId, TAG, `Found base64 field: ${key} (${Math.round(String(value).length / 1024)}KB)`);
      const uploadPromise = uploadToFalStorage(value, sessionId)
        .then((url) => {
          result[key] = url;
          return url;
        })
        .catch((error) => {
          const errorMessage = `Failed to upload ${key}: ${getErrorMessage(error)}`;
          generationLogCollector.error(sessionId, TAG, errorMessage);
          throw new Error(errorMessage);
        });
      uploadPromises.push(uploadPromise);
    } else if (isLocalFileUri(value)) {
      individualUploadCount++;
      generationLogCollector.log(sessionId, TAG, `Found local file field: ${key}`);
      const uploadPromise = uploadLocalFileToFalStorage(value, sessionId)
        .then((url) => {
          result[key] = url;
          return url;
        })
        .catch((error) => {
          const errorMessage = `Failed to upload local file ${key}: ${getErrorMessage(error)}`;
          generationLogCollector.error(sessionId, TAG, errorMessage);
          throw new Error(errorMessage);
        });
      uploadPromises.push(uploadPromise);
    }
  }

  if (individualUploadCount > 0) {
    generationLogCollector.log(sessionId, TAG, `${individualUploadCount} individual field upload(s) queued`);
  }

  // Handle image URL arrays — SEQUENTIAL to avoid bandwidth contention
  for (const arrayField of ["image_urls", "input_image_urls", "reference_image_urls"] as const) {
    if (Array.isArray(result[arrayField]) && (result[arrayField] as unknown[]).length > 0) {
      const imageUrls = result[arrayField] as unknown[];
      generationLogCollector.log(sessionId, TAG, `Processing ${arrayField}: ${imageUrls.length} item(s) (sequential)`);

      const processedUrls: string[] = [];
      const arrayStartTime = Date.now();

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];

        if (!imageUrl) {
          throw new Error(`${arrayField}[${i}] is null or undefined`);
        }

        if (isBase64DataUri(imageUrl)) {
          const sizeKB = Math.round(String(imageUrl).length / 1024);
          generationLogCollector.log(sessionId, TAG, `${arrayField}[${i}/${imageUrls.length}]: base64 (${sizeKB}KB) - uploading...`);

          try {
            const url = await uploadToFalStorage(imageUrl, sessionId);
            processedUrls.push(url);
            generationLogCollector.log(sessionId, TAG, `${arrayField}[${i}/${imageUrls.length}]: upload OK`);
          } catch (error) {
            const elapsed = Date.now() - arrayStartTime;
            const technicalMsg = getErrorMessage(error);
            generationLogCollector.error(sessionId, TAG, `${arrayField}[${i}] upload FAILED after ${elapsed}ms: ${technicalMsg}`);
            throw new Error(classifyUploadError(technicalMsg));
          }
        } else if (isLocalFileUri(imageUrl)) {
          generationLogCollector.log(sessionId, TAG, `${arrayField}[${i}/${imageUrls.length}]: local file - uploading...`);

          try {
            const url = await uploadLocalFileToFalStorage(imageUrl, sessionId);
            processedUrls.push(url);
            generationLogCollector.log(sessionId, TAG, `${arrayField}[${i}/${imageUrls.length}]: local file upload OK`);
          } catch (error) {
            const elapsed = Date.now() - arrayStartTime;
            const technicalMsg = getErrorMessage(error);
            generationLogCollector.error(sessionId, TAG, `${arrayField}[${i}] local file upload FAILED after ${elapsed}ms: ${technicalMsg}`);
            throw new Error(classifyUploadError(technicalMsg));
          }
        } else if (typeof imageUrl === "string") {
          generationLogCollector.log(sessionId, TAG, `${arrayField}[${i}/${imageUrls.length}]: already URL - pass through`);
          processedUrls.push(imageUrl);
        } else {
          throw new Error(`${arrayField}[${i}] has invalid type: ${typeof imageUrl}`);
        }
      }

      const arrayElapsed = Date.now() - arrayStartTime;
      generationLogCollector.log(sessionId, TAG, `${arrayField}: all ${processedUrls.length} upload(s) succeeded in ${arrayElapsed}ms`);
      result[arrayField] = processedUrls;
    }
  }

  // Wait for ALL individual field uploads
  if (uploadPromises.length > 0) {
    generationLogCollector.log(sessionId, TAG, `Waiting for ${uploadPromises.length} individual field upload(s)...`);
    const individualUploadResults = await Promise.allSettled(uploadPromises);

    const failedUploads = individualUploadResults.filter(
      (r) => r.status === 'rejected'
    );

    if (failedUploads.length > 0) {
      const successCount = individualUploadResults.length - failedUploads.length;
      const errorMessages = failedUploads.map((r) =>
        r.status === 'rejected' ? getErrorMessage(r.reason) : 'Unknown error'
      );
      generationLogCollector.error(sessionId, TAG, `Individual uploads: ${successCount}/${individualUploadResults.length} succeeded`, { errors: errorMessages });
      throw new Error(classifyUploadError(errorMessages[0]));
    }
  }

  const totalElapsed = Date.now() - startTime;
  generationLogCollector.log(sessionId, TAG, `Preprocessing complete in ${totalElapsed}ms`);
  return result;
}
