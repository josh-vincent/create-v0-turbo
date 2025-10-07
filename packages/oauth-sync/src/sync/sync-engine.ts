import type { SyncOperation, SyncStatus } from "../types";
import { OfflineQueue } from "./offline-queue";

/**
 * Sync engine for processing offline operations when connection is restored
 */
export class SyncEngine {
  private queue: OfflineQueue;
  private isOnline: boolean;
  private syncInProgress = false;

  constructor() {
    this.queue = new OfflineQueue();
    this.isOnline = typeof window !== "undefined" ? window.navigator.onLine : true;

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.processPendingOperations();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
      });
    }
  }

  /**
   * Add operation to queue (will process immediately if online)
   */
  async addOperation(
    operation: Omit<SyncOperation, "id" | "timestamp" | "retryCount">,
  ): Promise<void> {
    const fullOperation: SyncOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      retryCount: 0,
    };

    await this.queue.enqueue(fullOperation);

    if (this.isOnline) {
      await this.processPendingOperations();
    }
  }

  /**
   * Process all pending operations in the queue
   */
  async processPendingOperations(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;

    try {
      const operations = await this.queue.getQueue();

      for (const operation of operations) {
        try {
          await this.processOperation(operation);
          await this.queue.dequeue(operation.id);
        } catch (error) {
          console.error(`Failed to process operation ${operation.id}:`, error);

          // Retry logic
          if (operation.retryCount < 3) {
            operation.retryCount++;
            // Keep in queue for retry
          } else {
            // Max retries reached, remove from queue
            await this.queue.dequeue(operation.id);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Process a single operation (implement based on your API)
   */
  private async processOperation(operation: SyncOperation): Promise<void> {
    // TODO: Implement actual API calls based on operation type
    // Example:
    // if (operation.type === 'create') {
    //   await api.create(operation.resourceType, operation.data);
    // }
    console.log("Processing operation:", operation);
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const queueSize = await this.queue.size();

    if (queueSize === 0) return "completed";
    if (this.syncInProgress) return "syncing";
    if (!this.isOnline) return "pending";

    return "pending";
  }
}
