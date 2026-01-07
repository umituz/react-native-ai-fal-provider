/**
 * Job Storage Interface
 * Generic storage interface for job persistence
 */

/**
 * Generic storage interface for job persistence
 * Implement this interface with your preferred storage backend
 */
export interface IJobStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  getAllKeys?(): Promise<readonly string[]>;
}

/**
 * Simple in-memory storage for testing
 */
export class InMemoryJobStorage implements IJobStorage {
  private store = new Map<string, string>();

  setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
    return Promise.resolve();
  }

  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.store.get(key) ?? null);
  }

  removeItem(key: string): Promise<void> {
    this.store.delete(key);
    return Promise.resolve();
  }

  getAllKeys(): Promise<readonly string[]> {
    return Promise.resolve(Array.from(this.store.keys()));
  }

  clear(): void {
    this.store.clear();
  }
}
