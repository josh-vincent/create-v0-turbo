import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { useIsOnline } from "./useNetworkStatus";

export interface SyncQueueItem {
  id: string;
  type: "create" | "update" | "delete";
  entity: string; // 'customer', 'task', 'note', etc.
  data: any;
  timestamp: number;
  retryCount: number;
  status: "pending" | "syncing" | "synced" | "failed";
}

const SYNC_QUEUE_KEY = "@sync_queue";
const MAX_RETRIES = 3;

export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useIsOnline();

  // Load queue from storage on mount
  useEffect(() => {
    loadQueue();
  }, []);

  // Auto-sync when online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      syncQueue();
    }
  }, [isOnline, queue.length]);

  const loadQueue = async () => {
    try {
      const stored = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    }
  };

  const saveQueue = async (items: SyncQueueItem[]) => {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(items));
      setQueue(items);
    } catch (error) {
      console.error("Failed to save sync queue:", error);
    }
  };

  const addToQueue = async (item: Omit<SyncQueueItem, "id" | "timestamp" | "retryCount" | "status">) => {
    const newItem: SyncQueueItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      status: "pending",
    };

    const updatedQueue = [...queue, newItem];
    await saveQueue(updatedQueue);

    // Try to sync immediately if online
    if (isOnline) {
      syncQueue();
    }
  };

  const syncQueue = async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);

    const pendingItems = queue.filter(
      (item) => item.status === "pending" || (item.status === "failed" && item.retryCount < MAX_RETRIES)
    );

    for (const item of pendingItems) {
      try {
        // Update status to syncing
        const updatedQueue = queue.map((q) =>
          q.id === item.id ? { ...q, status: "syncing" as const } : q
        );
        setQueue(updatedQueue);

        // Simulate API call - replace with actual tRPC mutation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Call actual tRPC mutation based on item.type and item.entity
        // Example:
        // if (item.entity === 'customer' && item.type === 'create') {
        //   await api.customer.create.mutate(item.data);
        // }

        // Mark as synced
        const syncedQueue = queue.map((q) =>
          q.id === item.id ? { ...q, status: "synced" as const } : q
        );
        await saveQueue(syncedQueue);

        // Remove synced items after a delay
        setTimeout(async () => {
          const filteredQueue = queue.filter((q) => q.id !== item.id);
          await saveQueue(filteredQueue);
        }, 5000);

      } catch (error) {
        console.error("Sync failed for item:", item.id, error);

        // Mark as failed and increment retry count
        const failedQueue = queue.map((q) =>
          q.id === item.id
            ? { ...q, status: "failed" as const, retryCount: q.retryCount + 1 }
            : q
        );
        await saveQueue(failedQueue);
      }
    }

    setIsSyncing(false);
  };

  const clearQueue = async () => {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    setQueue([]);
  };

  const removeItem = async (id: string) => {
    const updatedQueue = queue.filter((item) => item.id !== id);
    await saveQueue(updatedQueue);
  };

  return {
    queue,
    isSyncing,
    addToQueue,
    syncQueue,
    clearQueue,
    removeItem,
    pendingCount: queue.filter((item) => item.status === "pending").length,
    failedCount: queue.filter((item) => item.status === "failed").length,
  };
}
