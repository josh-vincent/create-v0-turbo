import type { SyncOperation } from "../types";

/**
 * Offline-first queue for storing operations when offline
 * Uses IndexedDB for web, AsyncStorage for mobile
 */
export class OfflineQueue {
  private queueKey = "oauth_sync_queue";

  /**
   * Add operation to offline queue
   */
  async enqueue(operation: SyncOperation): Promise<void> {
    const queue = await this.getQueue();
    queue.push(operation);
    await this.saveQueue(queue);
  }

  /**
   * Get all pending operations
   */
  async getQueue(): Promise<SyncOperation[]> {
    if (typeof window === "undefined") {
      // Server-side: use memory or database
      return [];
    }

    try {
      const stored = localStorage.getItem(this.queueKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(queue: SyncOperation[]): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.queueKey, JSON.stringify(queue));
    } catch (error) {
      console.error("Failed to save sync queue:", error);
    }
  }

  /**
   * Remove operation from queue
   */
  async dequeue(operationId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter((op) => op.id !== operationId);
    await this.saveQueue(filtered);
  }

  /**
   * Clear all operations
   */
  async clear(): Promise<void> {
    await this.saveQueue([]);
  }

  /**
   * Get queue size
   */
  async size(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }
}
