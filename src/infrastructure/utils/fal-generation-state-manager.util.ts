/**
 * FAL Generation State Manager
 * Manages state and refs for FAL generation operations
 */

import type { FalJobInput, FalLogEntry, FalQueueStatus } from "../../domain/entities/fal.types";

export interface GenerationState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isCancelling: boolean;
  requestId: string | null;
  lastRequest: { endpoint: string; input: FalJobInput } | null;
}

export interface GenerationStateOptions<T> {
  onQueueUpdate?: (status: FalQueueStatus) => void;
  onProgress?: (status: FalQueueStatus) => void;
  onError?: (error: Error) => void;
  onResult?: (result: T) => void;
}

export class FalGenerationStateManager<T> {
  private isMounted = true;
  private currentRequestId: string | null = null;
  private lastRequest: { endpoint: string; input: FalJobInput } | null = null;
  private lastNotifiedStatus: string | null = null; // Track last status to prevent duplicate callbacks

  constructor(
    private options?: GenerationStateOptions<T>
  ) {}

  setIsMounted(mounted: boolean): void {
    this.isMounted = mounted;
  }

  checkMounted(): boolean {
    return this.isMounted;
  }

  setCurrentRequestId(requestId: string | null): void {
    this.currentRequestId = requestId;
  }

  getCurrentRequestId(): string | null {
    return this.currentRequestId;
  }

  setLastRequest(endpoint: string, input: FalJobInput): void {
    this.lastRequest = { endpoint, input };
  }

  getLastRequest(): { endpoint: string; input: FalJobInput } | null {
    return this.lastRequest;
  }

  clearLastRequest(): void {
    this.lastRequest = null;
    this.currentRequestId = null;
    this.lastNotifiedStatus = null;
  }

  handleQueueUpdate(status: FalQueueStatus): void {
    if (!this.isMounted) return;

    if (status.requestId) {
      this.currentRequestId = status.requestId;
    }

    const normalizedStatus: FalQueueStatus = {
      status: status.status,
      requestId: status.requestId ?? this.currentRequestId ?? "",
      logs: status.logs?.map((log: FalLogEntry) => ({
        message: log.message,
        level: log.level,
        timestamp: log.timestamp,
      })),
      queuePosition: status.queuePosition,
    };

    // Only notify if status or queue position changed (idempotent callbacks)
    const statusKey = `${normalizedStatus.status}-${normalizedStatus.requestId}-${normalizedStatus.queuePosition ?? ""}`;
    if (this.lastNotifiedStatus !== statusKey) {
      this.lastNotifiedStatus = statusKey;
      this.options?.onQueueUpdate?.(normalizedStatus);
      this.options?.onProgress?.(normalizedStatus);
    }
  }

  handleResult(result: T): void {
    if (!this.isMounted) return;
    this.options?.onResult?.(result);
  }

  handleError(error: Error): void {
    if (!this.isMounted) return;
    this.options?.onError?.(error);
  }
}
