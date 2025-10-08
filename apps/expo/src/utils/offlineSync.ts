import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type SyncStatus = "pending" | "syncing" | "synced" | "failed" | "conflict";
export type SyncOperation = "create" | "update" | "delete";
export type EntityType = "job" | "subtask" | "customer" | "asset" | "location";

export interface Location {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates?: { lat: number; lng: number };
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  localVersion: number;
}

export interface Asset {
  id: string;
  name: string;
  type: "HVAC" | "Plumbing" | "Electrical" | "Other";
  serialNumber?: string;
  locationId: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  localVersion: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  locationId: string;
  assetIds: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  localVersion: number;
}

export interface Subtask {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  localVersion: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  customerId: string;
  locationId: string;
  assetIds: string[];
  subtaskIds: string[];
  scheduledDate?: number;
  completedDate?: number;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
  localVersion: number;
}

export interface SyncQueueItem {
  id: string;
  entityType: EntityType;
  entityId: string;
  operation: SyncOperation;
  data: any;
  timestamp: number;
  attempts: number;
  lastError?: string;
  status: SyncStatus;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  jobs: "@offline_jobs",
  subtasks: "@offline_subtasks",
  customers: "@offline_customers",
  assets: "@offline_assets",
  locations: "@offline_locations",
  syncQueue: "@offline_sync_queue",
  lastSync: "@offline_last_sync",
} as const;

// ============================================================================
// GENERIC STORAGE OPERATIONS
// ============================================================================

async function getItems<T>(key: string): Promise<T[]> {
  try {
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return [];
  }
}

async function setItems<T>(key: string, items: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

async function addItem<T extends { id: string }>(
  key: string,
  item: T
): Promise<void> {
  const items = await getItems<T>(key);
  items.push(item);
  await setItems(key, items);
}

async function updateItem<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const items = await getItems<T>(key);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  await setItems(key, items);
  return items[index];
}

async function deleteItem(key: string, id: string): Promise<void> {
  const items = await getItems<any>(key);
  const filtered = items.filter((item: any) => item.id !== id);
  await setItems(key, filtered);
}

// ============================================================================
// ENTITY-SPECIFIC OPERATIONS
// ============================================================================

export const offlineStorage = {
  // Jobs
  jobs: {
    getAll: () => getItems<Job>(STORAGE_KEYS.jobs),
    getById: async (id: string) => {
      const items = await getItems<Job>(STORAGE_KEYS.jobs);
      return items.find((item) => item.id === id) || null;
    },
    create: (job: Job) => addItem(STORAGE_KEYS.jobs, job),
    update: (id: string, updates: Partial<Job>) =>
      updateItem<Job>(STORAGE_KEYS.jobs, id, updates),
    delete: (id: string) => deleteItem(STORAGE_KEYS.jobs, id),
  },

  // Subtasks
  subtasks: {
    getAll: () => getItems<Subtask>(STORAGE_KEYS.subtasks),
    getByJobId: async (jobId: string) => {
      const items = await getItems<Subtask>(STORAGE_KEYS.subtasks);
      return items.filter((item) => item.jobId === jobId);
    },
    create: (subtask: Subtask) => addItem(STORAGE_KEYS.subtasks, subtask),
    update: (id: string, updates: Partial<Subtask>) =>
      updateItem<Subtask>(STORAGE_KEYS.subtasks, id, updates),
    delete: (id: string) => deleteItem(STORAGE_KEYS.subtasks, id),
  },

  // Customers
  customers: {
    getAll: () => getItems<Customer>(STORAGE_KEYS.customers),
    getById: async (id: string) => {
      const items = await getItems<Customer>(STORAGE_KEYS.customers);
      return items.find((item) => item.id === id) || null;
    },
    create: (customer: Customer) => addItem(STORAGE_KEYS.customers, customer),
    update: (id: string, updates: Partial<Customer>) =>
      updateItem<Customer>(STORAGE_KEYS.customers, id, updates),
    delete: (id: string) => deleteItem(STORAGE_KEYS.customers, id),
  },

  // Assets
  assets: {
    getAll: () => getItems<Asset>(STORAGE_KEYS.assets),
    getById: async (id: string) => {
      const items = await getItems<Asset>(STORAGE_KEYS.assets);
      return items.find((item) => item.id === id) || null;
    },
    getByIds: async (ids: string[]) => {
      const items = await getItems<Asset>(STORAGE_KEYS.assets);
      return items.filter((item) => ids.includes(item.id));
    },
    create: (asset: Asset) => addItem(STORAGE_KEYS.assets, asset),
    update: (id: string, updates: Partial<Asset>) =>
      updateItem<Asset>(STORAGE_KEYS.assets, id, updates),
    delete: (id: string) => deleteItem(STORAGE_KEYS.assets, id),
  },

  // Locations
  locations: {
    getAll: () => getItems<Location>(STORAGE_KEYS.locations),
    getById: async (id: string) => {
      const items = await getItems<Location>(STORAGE_KEYS.locations);
      return items.find((item) => item.id === id) || null;
    },
    create: (location: Location) => addItem(STORAGE_KEYS.locations, location),
    update: (id: string, updates: Partial<Location>) =>
      updateItem<Location>(STORAGE_KEYS.locations, id, updates),
    delete: (id: string) => deleteItem(STORAGE_KEYS.locations, id),
  },
};

// ============================================================================
// SYNC QUEUE OPERATIONS
// ============================================================================

export const syncQueue = {
  getAll: async (): Promise<SyncQueueItem[]> => {
    return getItems<SyncQueueItem>(STORAGE_KEYS.syncQueue);
  },

  add: async (item: Omit<SyncQueueItem, "id" | "timestamp" | "attempts" | "status">): Promise<void> => {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      attempts: 0,
      status: "pending",
    };
    await addItem(STORAGE_KEYS.syncQueue, queueItem);
  },

  update: async (id: string, updates: Partial<SyncQueueItem>): Promise<void> => {
    await updateItem<SyncQueueItem>(STORAGE_KEYS.syncQueue, id, updates);
  },

  remove: async (id: string): Promise<void> => {
    await deleteItem(STORAGE_KEYS.syncQueue, id);
  },

  clear: async (): Promise<void> => {
    await setItems(STORAGE_KEYS.syncQueue, []);
  },

  getPending: async (): Promise<SyncQueueItem[]> => {
    const items = await getItems<SyncQueueItem>(STORAGE_KEYS.syncQueue);
    return items.filter((item) => item.status === "pending" || item.status === "failed");
  },

  getByEntity: async (entityType: EntityType, entityId: string): Promise<SyncQueueItem[]> => {
    const items = await getItems<SyncQueueItem>(STORAGE_KEYS.syncQueue);
    return items.filter((item) => item.entityType === entityType && item.entityId === entityId);
  },
};

// ============================================================================
// SYNC OPERATIONS
// ============================================================================

export const syncOperations = {
  async processQueue(): Promise<{ success: number; failed: number }> {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      return { success: 0, failed: 0 };
    }

    const pending = await syncQueue.getPending();
    let success = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        await syncQueue.update(item.id, { status: "syncing" });

        // Simulate API call (in production, this would be a real API call)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate random failures for demo purposes
        if (Math.random() > 0.8) {
          throw new Error("Simulated network error");
        }

        // Update entity sync status
        const entityKey = `@offline_${item.entityType}s` as keyof typeof STORAGE_KEYS;
        await updateItem(STORAGE_KEYS[entityKey], item.entityId, {
          syncStatus: "synced",
        });

        // Remove from queue
        await syncQueue.remove(item.id);
        success++;
      } catch (error: any) {
        failed++;
        await syncQueue.update(item.id, {
          status: "failed",
          attempts: item.attempts + 1,
          lastError: error.message,
        });
      }
    }

    // Update last sync timestamp
    await AsyncStorage.setItem(STORAGE_KEYS.lastSync, Date.now().toString());

    return { success, failed };
  },

  async getLastSyncTime(): Promise<number | null> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.lastSync);
      return lastSync ? parseInt(lastSync, 10) : null;
    } catch {
      return null;
    }
  },

  async getSyncStats(): Promise<{
    totalPending: number;
    byEntity: Record<EntityType, number>;
    byOperation: Record<SyncOperation, number>;
    failedItems: number;
  }> {
    const queue = await syncQueue.getAll();
    const pending = queue.filter((item) => item.status === "pending" || item.status === "failed");

    const byEntity: Record<EntityType, number> = {
      job: 0,
      subtask: 0,
      customer: 0,
      asset: 0,
      location: 0,
    };

    const byOperation: Record<SyncOperation, number> = {
      create: 0,
      update: 0,
      delete: 0,
    };

    let failedItems = 0;

    pending.forEach((item) => {
      byEntity[item.entityType]++;
      byOperation[item.operation]++;
      if (item.status === "failed") failedItems++;
    });

    return {
      totalPending: pending.length,
      byEntity,
      byOperation,
      failedItems,
    };
  },
};

// ============================================================================
// NETWORK STATUS
// ============================================================================

export const networkStatus = {
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  subscribe(callback: (isConnected: boolean) => void) {
    return NetInfo.addEventListener((state) => {
      callback(state.isConnected ?? false);
    });
  },
};
