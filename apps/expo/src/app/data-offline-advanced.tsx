import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Asset,
  Customer,
  Job,
  Location,
  networkStatus,
  offlineStorage,
  Subtask,
  syncOperations,
  syncQueue,
  SyncQueueItem,
} from "~/utils/offlineSync";

type TabType = "jobs" | "queue" | "data";
type EntityDetailType = "customer" | "asset" | "location" | "queue" | null;

export default function AdvancedOfflineDemo() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("jobs");
  const [isSyncing, setIsSyncing] = useState(false);

  // Detail modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState<EntityDetailType>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedQueueItem, setSelectedQueueItem] = useState<SyncQueueItem | null>(null);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = networkStatus.subscribe((connected) => {
      setIsOnline(connected);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      handleSync();
    }
  }, [isOnline]);

  // Load all data
  const jobsQuery = useQuery({
    queryKey: ["offline-jobs"],
    queryFn: () => offlineStorage.jobs.getAll(),
  });

  const subtasksQuery = useQuery({
    queryKey: ["offline-subtasks"],
    queryFn: () => offlineStorage.subtasks.getAll(),
  });

  const customersQuery = useQuery({
    queryKey: ["offline-customers"],
    queryFn: () => offlineStorage.customers.getAll(),
  });

  const assetsQuery = useQuery({
    queryKey: ["offline-assets"],
    queryFn: () => offlineStorage.assets.getAll(),
  });

  const locationsQuery = useQuery({
    queryKey: ["offline-locations"],
    queryFn: () => offlineStorage.locations.getAll(),
  });

  const queueQuery = useQuery({
    queryKey: ["offline-sync-queue"],
    queryFn: () => syncQueue.getAll(),
  });

  const statsQuery = useQuery({
    queryKey: ["offline-sync-stats"],
    queryFn: () => syncOperations.getSyncStats(),
    refetchInterval: 5000,
  });

  // Handle sync
  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert("Offline", "Cannot sync while offline");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncOperations.processQueue();
      await queryClient.invalidateQueries({ queryKey: ["offline-"] });

      if (result.success > 0 || result.failed > 0) {
        Alert.alert(
          "Sync Complete",
          `Success: ${result.success}, Failed: ${result.failed}`
        );
      }
    } catch (error: any) {
      Alert.alert("Sync Error", error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Create sample data
  const handleCreateSampleData = async () => {
    try {
      // Create location
      const location: Location = {
        id: `loc_${Date.now()}`,
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: 1,
      };
      await offlineStorage.locations.create(location);
      await syncQueue.add({
        entityType: "location",
        entityId: location.id,
        operation: "create",
        data: location,
      });

      // Create asset
      const asset: Asset = {
        id: `asset_${Date.now()}`,
        name: "HVAC Unit #1",
        type: "HVAC",
        serialNumber: "HVAC-2024-001",
        locationId: location.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: 1,
      };
      await offlineStorage.assets.create(asset);
      await syncQueue.add({
        entityType: "asset",
        entityId: asset.id,
        operation: "create",
        data: asset,
      });

      // Create customer
      const customer: Customer = {
        id: `cust_${Date.now()}`,
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        locationId: location.id,
        assetIds: [asset.id],
        notes: "VIP customer",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: 1,
      };
      await offlineStorage.customers.create(customer);
      await syncQueue.add({
        entityType: "customer",
        entityId: customer.id,
        operation: "create",
        data: customer,
      });

      // Create job
      const job: Job = {
        id: `job_${Date.now()}`,
        title: "Annual HVAC Maintenance",
        description: "Perform annual maintenance on all HVAC units",
        status: "pending",
        priority: "high",
        customerId: customer.id,
        locationId: location.id,
        assetIds: [asset.id],
        subtaskIds: [],
        scheduledDate: Date.now() + 86400000, // Tomorrow
        estimatedHours: 4,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: 1,
      };
      await offlineStorage.jobs.create(job);
      await syncQueue.add({
        entityType: "job",
        entityId: job.id,
        operation: "create",
        data: job,
      });

      // Create subtasks
      const subtasks = [
        "Inspect filters",
        "Check refrigerant levels",
        "Clean coils",
        "Test thermostat",
      ];

      for (const taskTitle of subtasks) {
        const subtask: Subtask = {
          id: `subtask_${Date.now()}_${Math.random()}`,
          jobId: job.id,
          title: taskTitle,
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          syncStatus: "pending",
          localVersion: 1,
        };
        await offlineStorage.subtasks.create(subtask);
        await syncQueue.add({
          entityType: "subtask",
          entityId: subtask.id,
          operation: "create",
          data: subtask,
        });

        job.subtaskIds.push(subtask.id);
      }

      // Update job with subtask IDs
      await offlineStorage.jobs.update(job.id, { subtaskIds: job.subtaskIds });

      await queryClient.invalidateQueries({ queryKey: ["offline-"] });
      Alert.alert("Success", "Sample job with related data created!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      const updated = await offlineStorage.subtasks.update(subtask.id, {
        completed: !subtask.completed,
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: subtask.localVersion + 1,
      });

      if (updated) {
        await syncQueue.add({
          entityType: "subtask",
          entityId: subtask.id,
          operation: "update",
          data: updated,
        });
        await queryClient.invalidateQueries({ queryKey: ["offline-"] });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Update job status
  const handleUpdateJobStatus = async (job: Job, status: Job["status"]) => {
    try {
      const updated = await offlineStorage.jobs.update(job.id, {
        status,
        updatedAt: Date.now(),
        syncStatus: "pending",
        localVersion: job.localVersion + 1,
        ...(status === "completed" ? { completedDate: Date.now() } : {}),
      });

      if (updated) {
        await syncQueue.add({
          entityType: "job",
          entityId: job.id,
          operation: "update",
          data: updated,
        });
        await queryClient.invalidateQueries({ queryKey: ["offline-"] });
        Alert.alert("Success", `Job marked as ${status}`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Advanced Offline Sync",
          headerShadowVisible: false,
        }}
      />

      {/* Network Status Banner */}
      <View className={`px-4 py-2 ${isOnline ? "bg-green-500/20" : "bg-red-500/20"}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
            <Text className={`text-sm font-medium ${isOnline ? "text-green-700" : "text-red-700"}`}>
              {isOnline ? "Online" : "Offline"}
            </Text>
            {statsQuery.data && statsQuery.data.totalPending > 0 && (
              <View className="bg-yellow-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-medium text-yellow-700">
                  {statsQuery.data.totalPending} pending
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSync}
            disabled={!isOnline || isSyncing}
            className={`px-3 py-1 rounded ${isOnline ? "bg-primary" : "bg-muted"}`}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className={`text-xs font-medium ${isOnline ? "text-primary-foreground" : "text-muted-foreground"}`}>
                Sync Now
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border bg-background">
        {[
          { key: "jobs" as const, label: "Jobs", count: jobsQuery.data?.length || 0 },
          { key: "queue" as const, label: "Sync Queue", count: statsQuery.data?.totalPending || 0 },
          { key: "data" as const, label: "Data", count: 0 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 ${activeTab === tab.key ? "border-b-2 border-primary" : ""}`}
          >
            <Text className={`text-center text-sm font-medium ${activeTab === tab.key ? "text-primary" : "text-muted-foreground"}`}>
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "jobs" && (
          <JobsTab
            jobs={jobsQuery.data || []}
            subtasks={subtasksQuery.data || []}
            customers={customersQuery.data || []}
            locations={locationsQuery.data || []}
            assets={assetsQuery.data || []}
            onToggleSubtask={handleToggleSubtask}
            onUpdateJobStatus={handleUpdateJobStatus}
            onCreateSample={handleCreateSampleData}
            isLoading={jobsQuery.isLoading}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["offline-"] })}
            isRefreshing={jobsQuery.isRefetching}
          />
        )}

        {activeTab === "queue" && (
          <QueueTab
            queue={queueQuery.data || []}
            stats={statsQuery.data}
            isLoading={queueQuery.isLoading}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["offline-"] })}
            isRefreshing={queueQuery.isRefetching}
            onItemPress={(item) => {
              setSelectedQueueItem(item);
              setDetailType("queue");
              setShowDetailModal(true);
            }}
          />
        )}

        {activeTab === "data" && (
          <DataTab
            jobs={jobsQuery.data || []}
            subtasks={subtasksQuery.data || []}
            customers={customersQuery.data || []}
            assets={assetsQuery.data || []}
            locations={locationsQuery.data || []}
            isLoading={
              jobsQuery.isLoading ||
              subtasksQuery.isLoading ||
              customersQuery.isLoading ||
              assetsQuery.isLoading ||
              locationsQuery.isLoading
            }
            onCustomerPress={(customer) => {
              setSelectedCustomer(customer);
              setDetailType("customer");
              setShowDetailModal(true);
            }}
            onAssetPress={(asset) => {
              setSelectedAsset(asset);
              setDetailType("asset");
              setShowDetailModal(true);
            }}
            onLocationPress={(location) => {
              setSelectedLocation(location);
              setDetailType("location");
              setShowDetailModal(true);
            }}
          />
        )}
      </View>

      {/* Detail Modal */}
      <EntityDetailModal
        visible={showDetailModal}
        type={detailType}
        customer={selectedCustomer}
        asset={selectedAsset}
        location={selectedLocation}
        queueItem={selectedQueueItem}
        jobs={jobsQuery.data || []}
        customers={customersQuery.data || []}
        assets={assetsQuery.data || []}
        locations={locationsQuery.data || []}
        onClose={() => {
          setShowDetailModal(false);
          setDetailType(null);
          setSelectedCustomer(null);
          setSelectedAsset(null);
          setSelectedLocation(null);
          setSelectedQueueItem(null);
        }}
      />
    </View>
  );
}

// ============================================================================
// JOBS TAB
// ============================================================================

function JobsTab({
  jobs,
  subtasks,
  customers,
  locations,
  assets,
  onToggleSubtask,
  onUpdateJobStatus,
  onCreateSample,
  isLoading,
  onRefresh,
  isRefreshing,
}: {
  jobs: Job[];
  subtasks: Subtask[];
  customers: Customer[];
  locations: Location[];
  assets: Asset[];
  onToggleSubtask: (subtask: Subtask) => void;
  onUpdateJobStatus: (job: Job, status: Job["status"]) => void;
  onCreateSample: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJob = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const renderJob = ({ item: job }: { item: Job }) => {
    const isExpanded = expandedJobs.has(job.id);
    const jobSubtasks = subtasks.filter((st) => job.subtaskIds.includes(st.id));
    const customer = customers.find((c) => c.id === job.customerId);
    const location = locations.find((l) => l.id === job.locationId);
    const jobAssets = assets.filter((a) => job.assetIds.includes(a.id));
    const completedSubtasks = jobSubtasks.filter((st) => st.completed).length;

    const priorityColors = {
      low: "bg-blue-100 text-blue-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };

    const statusColors = {
      pending: "bg-gray-100 text-gray-700",
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return (
      <View className="bg-card border border-border rounded-lg mb-3 overflow-hidden">
        <TouchableOpacity onPress={() => toggleJob(job.id)} className="p-4">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground mb-1">{job.title}</Text>
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                {job.description}
              </Text>
            </View>
            <View className="ml-2">
              <Text className="text-lg">{isExpanded ? "▼" : "▶"}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 flex-wrap">
            <View className={`px-2 py-1 rounded ${priorityColors[job.priority]}`}>
              <Text className="text-xs font-medium">{job.priority.toUpperCase()}</Text>
            </View>
            <View className={`px-2 py-1 rounded ${statusColors[job.status]}`}>
              <Text className="text-xs font-medium">{job.status.replace("_", " ").toUpperCase()}</Text>
            </View>
            {job.syncStatus !== "synced" && (
              <View className="bg-yellow-100 px-2 py-1 rounded">
                <Text className="text-xs font-medium text-yellow-700">⏳ {job.syncStatus}</Text>
              </View>
            )}
            <View className="bg-muted px-2 py-1 rounded">
              <Text className="text-xs font-medium text-muted-foreground">
                {completedSubtasks}/{jobSubtasks.length} tasks
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="border-t border-border p-4 bg-muted/30">
            {/* Customer Info */}
            {customer && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-muted-foreground mb-2">CUSTOMER</Text>
                <View className="bg-card border border-border rounded-lg p-3">
                  <Text className="text-sm font-semibold text-foreground">{customer.name}</Text>
                  <Text className="text-xs text-muted-foreground">{customer.email}</Text>
                  <Text className="text-xs text-muted-foreground">{customer.phone}</Text>
                </View>
              </View>
            )}

            {/* Location */}
            {location && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-muted-foreground mb-2">LOCATION</Text>
                <View className="bg-card border border-border rounded-lg p-3">
                  <Text className="text-sm text-foreground">{location.address}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {location.city}, {location.state} {location.zip}
                  </Text>
                </View>
              </View>
            )}

            {/* Assets */}
            {jobAssets.length > 0 && (
              <View className="mb-4">
                <Text className="text-xs font-semibold text-muted-foreground mb-2">ASSETS</Text>
                {jobAssets.map((asset) => (
                  <View key={asset.id} className="bg-card border border-border rounded-lg p-2 mb-2">
                    <Text className="text-sm font-medium text-foreground">{asset.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {asset.type} • {asset.serialNumber}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Subtasks */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-muted-foreground mb-2">SUBTASKS</Text>
              {jobSubtasks.map((subtask) => (
                <TouchableOpacity
                  key={subtask.id}
                  onPress={() => onToggleSubtask(subtask)}
                  className="flex-row items-center bg-card border border-border rounded-lg p-3 mb-2"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                      subtask.completed ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  >
                    {subtask.completed && <Text className="text-primary-foreground">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 text-sm ${
                      subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {subtask.title}
                  </Text>
                  {subtask.syncStatus !== "synced" && (
                    <View className="bg-yellow-100 px-2 py-0.5 rounded ml-2">
                      <Text className="text-xs text-yellow-700">⏳</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row gap-2">
              {job.status === "pending" && (
                <TouchableOpacity
                  onPress={() => onUpdateJobStatus(job, "in_progress")}
                  className="flex-1 bg-primary rounded-lg py-2"
                >
                  <Text className="text-center text-sm font-medium text-primary-foreground">
                    Start Job
                  </Text>
                </TouchableOpacity>
              )}
              {job.status === "in_progress" && (
                <TouchableOpacity
                  onPress={() => onUpdateJobStatus(job, "completed")}
                  className="flex-1 bg-green-600 rounded-lg py-2"
                >
                  <Text className="text-center text-sm font-medium text-white">Complete Job</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="bg-muted/50 border border-border rounded-lg p-8">
            <Text className="text-center text-muted-foreground text-base mb-4">
              No jobs yet. Create sample data to get started!
            </Text>
            <TouchableOpacity
              onPress={onCreateSample}
              className="bg-primary rounded-lg py-3 px-4"
            >
              <Text className="text-center text-base font-semibold text-primary-foreground">
                Create Sample Job
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

// ============================================================================
// QUEUE TAB
// ============================================================================

function QueueTab({
  queue,
  stats,
  isLoading,
  onRefresh,
  isRefreshing,
  onItemPress,
}: {
  queue: SyncQueueItem[];
  stats?: Awaited<ReturnType<typeof syncOperations.getSyncStats>>;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onItemPress: (item: SyncQueueItem) => void;
}) {
  const renderQueueItem = ({ item }: { item: SyncQueueItem }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-700",
      syncing: "bg-blue-100 text-blue-700",
      synced: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      conflict: "bg-orange-100 text-orange-700",
    };

    const operationIcons = {
      create: "➕",
      update: "✏️",
      delete: "🗑️",
    };

    return (
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        className="bg-card border border-border rounded-lg p-4 mb-3"
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg">{operationIcons[item.operation]}</Text>
              <Text className="text-sm font-semibold text-foreground">
                {item.operation.toUpperCase()} {item.entityType.toUpperCase()}
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground">ID: {item.entityId.substring(0, 20)}...</Text>
          </View>
          <View className={`px-2 py-1 rounded ${statusColors[item.status]}`}>
            <Text className="text-xs font-medium">{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4">
          <Text className="text-xs text-muted-foreground">
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <Text className="text-xs text-muted-foreground">Attempts: {item.attempts}</Text>
        </View>

        {item.lastError && (
          <View className="mt-2 bg-red-50 border border-red-200 rounded p-2">
            <Text className="text-xs text-red-700">{item.lastError}</Text>
          </View>
        )}

        <View className="mt-2 pt-2 border-t border-border">
          <Text className="text-xs text-primary font-medium">Tap to view details →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">Loading queue...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Stats */}
      {stats && (
        <View className="p-4 bg-muted/30 border-b border-border">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-card border border-border rounded-lg p-3">
              <Text className="text-xs text-muted-foreground mb-1">Total Pending</Text>
              <Text className="text-2xl font-bold text-foreground">{stats.totalPending}</Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-3">
              <Text className="text-xs text-muted-foreground mb-1">Failed</Text>
              <Text className="text-2xl font-bold text-red-600">{stats.failedItems}</Text>
            </View>
          </View>

          <View className="bg-card border border-border rounded-lg p-3">
            <Text className="text-xs font-semibold text-muted-foreground mb-2">BY ENTITY</Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(stats.byEntity).map(([entity, count]) =>
                count > 0 ? (
                  <View key={entity} className="bg-primary/10 px-2 py-1 rounded">
                    <Text className="text-xs text-primary">
                      {entity}: {count}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={queue}
        renderItem={renderQueueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="bg-muted/50 border border-border rounded-lg p-8">
            <Text className="text-center text-muted-foreground text-base">
              ✓ All synced! No pending operations.
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ============================================================================
// DATA TAB
// ============================================================================

function DataTab({
  jobs,
  subtasks,
  customers,
  assets,
  locations,
  isLoading,
  onCustomerPress,
  onAssetPress,
  onLocationPress,
}: {
  jobs: Job[];
  subtasks: Subtask[];
  customers: Customer[];
  assets: Asset[];
  locations: Location[];
  isLoading: boolean;
  onCustomerPress: (customer: Customer) => void;
  onAssetPress: (asset: Asset) => void;
  onLocationPress: (location: Location) => void;
}) {
  const dataSets = [
    { label: "Jobs", count: jobs.length, icon: "💼" },
    { label: "Subtasks", count: subtasks.length, icon: "✓" },
    { label: "Customers", count: customers.length, icon: "👥" },
    { label: "Assets", count: assets.length, icon: "🔧" },
    { label: "Locations", count: locations.length, icon: "📍" },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-2">Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <View className="bg-card border border-border rounded-lg p-4 mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">📊 Data Overview</Text>

        <View className="gap-3">
          {dataSets.map((set) => (
            <View
              key={set.label}
              className="flex-row items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{set.icon}</Text>
                <Text className="text-base font-medium text-foreground">{set.label}</Text>
              </View>
              <View className="bg-primary rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-sm font-bold text-primary-foreground">{set.count}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Customers List */}
      {customers.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">👥 Customers ({customers.length})</Text>
          <View className="gap-2">
            {customers.map((customer) => (
              <TouchableOpacity
                key={customer.id}
                onPress={() => onCustomerPress(customer)}
                className="bg-muted/30 border border-border rounded-lg p-3"
              >
                <Text className="text-sm font-semibold text-foreground">{customer.name}</Text>
                <Text className="text-xs text-muted-foreground">{customer.email}</Text>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs text-muted-foreground">{customer.phone}</Text>
                  {customer.syncStatus !== "synced" && (
                    <View className="bg-yellow-100 px-2 py-0.5 rounded">
                      <Text className="text-xs text-yellow-700">⏳ {customer.syncStatus}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Assets List */}
      {assets.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">🔧 Assets ({assets.length})</Text>
          <View className="gap-2">
            {assets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                onPress={() => onAssetPress(asset)}
                className="bg-muted/30 border border-border rounded-lg p-3"
              >
                <Text className="text-sm font-semibold text-foreground">{asset.name}</Text>
                <View className="flex-row items-center justify-between mt-1">
                  <View>
                    <Text className="text-xs text-muted-foreground">{asset.type}</Text>
                    {asset.serialNumber && (
                      <Text className="text-xs text-muted-foreground">S/N: {asset.serialNumber}</Text>
                    )}
                  </View>
                  {asset.syncStatus !== "synced" && (
                    <View className="bg-yellow-100 px-2 py-0.5 rounded">
                      <Text className="text-xs text-yellow-700">⏳ {asset.syncStatus}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Locations List */}
      {locations.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">📍 Locations ({locations.length})</Text>
          <View className="gap-2">
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                onPress={() => onLocationPress(location)}
                className="bg-muted/30 border border-border rounded-lg p-3"
              >
                <Text className="text-sm font-semibold text-foreground">{location.address}</Text>
                <Text className="text-xs text-muted-foreground">
                  {location.city}, {location.state} {location.zip}
                </Text>
                {location.syncStatus !== "synced" && (
                  <View className="bg-yellow-100 px-2 py-0.5 rounded mt-1 self-start">
                    <Text className="text-xs text-yellow-700">⏳ {location.syncStatus}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
        <Text className="text-base font-semibold text-foreground mb-2">
          💡 Advanced Features
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Complex relational data (Jobs → Customers → Assets → Locations)
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Hierarchical structures (Jobs with multiple subtasks)
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Optimistic updates with local version tracking
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Sync queue with retry logic and error handling
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Network status monitoring with auto-sync
        </Text>
        <Text className="text-sm text-muted-foreground">
          • Per-entity sync status tracking
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// ENTITY DETAIL MODAL
// ============================================================================

function EntityDetailModal({
  visible,
  type,
  customer,
  asset,
  location,
  queueItem,
  jobs,
  customers,
  assets,
  locations,
  onClose,
}: {
  visible: boolean;
  type: EntityDetailType;
  customer: Customer | null;
  asset: Asset | null;
  location: Location | null;
  queueItem: SyncQueueItem | null;
  jobs: Job[];
  customers: Customer[];
  assets: Asset[];
  locations: Location[];
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} className="bg-background rounded-t-3xl max-h-[80%]">
            <View className="p-4 border-b border-border">
              <View className="w-12 h-1 bg-muted rounded-full self-center mb-4" />
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">
                  {type === "customer" && "Customer Details"}
                  {type === "asset" && "Asset Details"}
                  {type === "location" && "Location Details"}
                  {type === "queue" && "Sync Queue Item"}
                </Text>
                <TouchableOpacity onPress={onClose} className="bg-muted rounded-full p-2">
                  <Text className="text-lg">✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-4">
              {type === "customer" && customer && (
                <CustomerDetail customer={customer} jobs={jobs} assets={assets} locations={locations} />
              )}
              {type === "asset" && asset && (
                <AssetDetail asset={asset} jobs={jobs} customers={customers} location={locations.find(l => l.id === asset.locationId)} />
              )}
              {type === "location" && location && (
                <LocationDetail location={location} customers={customers} assets={assets} jobs={jobs} />
              )}
              {type === "queue" && queueItem && (
                <QueueItemDetail item={queueItem} />
              )}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function CustomerDetail({ customer, jobs, assets, locations }: {
  customer: Customer;
  jobs: Job[];
  assets: Asset[];
  locations: Location[];
}) {
  const customerJobs = jobs.filter(j => j.customerId === customer.id);
  const customerAssets = assets.filter(a => customer.assetIds.includes(a.id));
  const customerLocation = locations.find(l => l.id === customer.locationId);

  return (
    <View className="gap-4">
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">CONTACT INFO</Text>
        <Text className="text-lg font-bold text-foreground mb-1">{customer.name}</Text>
        <Text className="text-sm text-muted-foreground mb-1">📧 {customer.email}</Text>
        <Text className="text-sm text-muted-foreground mb-1">📞 {customer.phone}</Text>
        {customer.notes && (
          <Text className="text-sm text-muted-foreground mt-2">{customer.notes}</Text>
        )}
      </View>

      {customerLocation && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">LOCATION</Text>
          <Text className="text-sm text-foreground">{customerLocation.address}</Text>
          <Text className="text-sm text-muted-foreground">
            {customerLocation.city}, {customerLocation.state} {customerLocation.zip}
          </Text>
        </View>
      )}

      {customerAssets.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">ASSETS ({customerAssets.length})</Text>
          {customerAssets.map(asset => (
            <View key={asset.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{asset.name}</Text>
              <Text className="text-xs text-muted-foreground">{asset.type} • {asset.serialNumber}</Text>
            </View>
          ))}
        </View>
      )}

      {customerJobs.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">RELATED JOBS ({customerJobs.length})</Text>
          {customerJobs.map(job => (
            <View key={job.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{job.title}</Text>
              <Text className="text-xs text-muted-foreground">{job.status} • {job.priority}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="bg-muted/50 border border-border rounded-lg p-3">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">SYNC STATUS</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-foreground">Status</Text>
          <View className={`px-2 py-1 rounded ${customer.syncStatus === "synced" ? "bg-green-100" : "bg-yellow-100"}`}>
            <Text className={`text-xs font-medium ${customer.syncStatus === "synced" ? "text-green-700" : "text-yellow-700"}`}>
              {customer.syncStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm text-foreground">Local Version</Text>
          <Text className="text-sm text-muted-foreground">{customer.localVersion}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm text-foreground">Created</Text>
          <Text className="text-sm text-muted-foreground">{new Date(customer.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

function AssetDetail({ asset, jobs, customers, location }: {
  asset: Asset;
  jobs: Job[];
  customers: Customer[];
  location?: Location;
}) {
  const assetJobs = jobs.filter(j => j.assetIds.includes(asset.id));
  const assetCustomers = customers.filter(c => c.assetIds.includes(asset.id));

  return (
    <View className="gap-4">
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">ASSET INFO</Text>
        <Text className="text-lg font-bold text-foreground mb-1">{asset.name}</Text>
        <Text className="text-sm text-muted-foreground mb-1">Type: {asset.type}</Text>
        {asset.serialNumber && (
          <Text className="text-sm text-muted-foreground">S/N: {asset.serialNumber}</Text>
        )}
      </View>

      {location && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">LOCATION</Text>
          <Text className="text-sm text-foreground">{location.address}</Text>
          <Text className="text-sm text-muted-foreground">
            {location.city}, {location.state} {location.zip}
          </Text>
        </View>
      )}

      {assetCustomers.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">OWNERS ({assetCustomers.length})</Text>
          {assetCustomers.map(customer => (
            <View key={customer.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{customer.name}</Text>
              <Text className="text-xs text-muted-foreground">{customer.email}</Text>
            </View>
          ))}
        </View>
      )}

      {assetJobs.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">RELATED JOBS ({assetJobs.length})</Text>
          {assetJobs.map(job => (
            <View key={job.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{job.title}</Text>
              <Text className="text-xs text-muted-foreground">{job.status} • {job.priority}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="bg-muted/50 border border-border rounded-lg p-3">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">SYNC STATUS</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-foreground">Status</Text>
          <View className={`px-2 py-1 rounded ${asset.syncStatus === "synced" ? "bg-green-100" : "bg-yellow-100"}`}>
            <Text className={`text-xs font-medium ${asset.syncStatus === "synced" ? "text-green-700" : "text-yellow-700"}`}>
              {asset.syncStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm text-foreground">Local Version</Text>
          <Text className="text-sm text-muted-foreground">{asset.localVersion}</Text>
        </View>
      </View>
    </View>
  );
}

function LocationDetail({ location, customers, assets, jobs }: {
  location: Location;
  customers: Customer[];
  assets: Asset[];
  jobs: Job[];
}) {
  const locationCustomers = customers.filter(c => c.locationId === location.id);
  const locationAssets = assets.filter(a => a.locationId === location.id);
  const locationJobs = jobs.filter(j => j.locationId === location.id);

  return (
    <View className="gap-4">
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">ADDRESS</Text>
        <Text className="text-lg font-bold text-foreground mb-1">{location.address}</Text>
        <Text className="text-sm text-muted-foreground">
          {location.city}, {location.state} {location.zip}
        </Text>
        {location.coordinates && (
          <Text className="text-xs text-muted-foreground mt-2">
            📍 {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
          </Text>
        )}
      </View>

      {locationCustomers.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">CUSTOMERS ({locationCustomers.length})</Text>
          {locationCustomers.map(customer => (
            <View key={customer.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{customer.name}</Text>
              <Text className="text-xs text-muted-foreground">{customer.email}</Text>
            </View>
          ))}
        </View>
      )}

      {locationAssets.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">ASSETS ({locationAssets.length})</Text>
          {locationAssets.map(asset => (
            <View key={asset.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{asset.name}</Text>
              <Text className="text-xs text-muted-foreground">{asset.type}</Text>
            </View>
          ))}
        </View>
      )}

      {locationJobs.length > 0 && (
        <View className="bg-card border border-border rounded-lg p-4">
          <Text className="text-xs font-semibold text-muted-foreground mb-2">JOBS ({locationJobs.length})</Text>
          {locationJobs.map(job => (
            <View key={job.id} className="bg-muted/30 rounded p-2 mb-2">
              <Text className="text-sm font-medium text-foreground">{job.title}</Text>
              <Text className="text-xs text-muted-foreground">{job.status}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="bg-muted/50 border border-border rounded-lg p-3">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">SYNC STATUS</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-foreground">Status</Text>
          <View className={`px-2 py-1 rounded ${location.syncStatus === "synced" ? "bg-green-100" : "bg-yellow-100"}`}>
            <Text className={`text-xs font-medium ${location.syncStatus === "synced" ? "text-green-700" : "text-yellow-700"}`}>
              {location.syncStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm text-foreground">Local Version</Text>
          <Text className="text-sm text-muted-foreground">{location.localVersion}</Text>
        </View>
      </View>
    </View>
  );
}

function QueueItemDetail({ item }: { item: SyncQueueItem }) {
  const operationIcons = {
    create: "➕",
    update: "✏️",
    delete: "🗑️",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    syncing: "bg-blue-100 text-blue-700",
    synced: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    conflict: "bg-orange-100 text-orange-700",
  };

  return (
    <View className="gap-4">
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">OPERATION</Text>
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-2xl">{operationIcons[item.operation]}</Text>
          <Text className="text-lg font-bold text-foreground">
            {item.operation.toUpperCase()} {item.entityType.toUpperCase()}
          </Text>
        </View>
        <View className={`px-3 py-2 rounded self-start ${statusColors[item.status]}`}>
          <Text className="text-sm font-medium">{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">DETAILS</Text>
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">Entity ID</Text>
            <Text className="text-sm text-foreground font-mono">{item.entityId.substring(0, 16)}...</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">Timestamp</Text>
            <Text className="text-sm text-foreground">{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">Attempts</Text>
            <Text className="text-sm text-foreground">{item.attempts}</Text>
          </View>
        </View>
      </View>

      {item.lastError && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Text className="text-xs font-semibold text-red-700 mb-2">ERROR</Text>
          <Text className="text-sm text-red-700">{item.lastError}</Text>
        </View>
      )}

      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-xs font-semibold text-muted-foreground mb-2">PAYLOAD DATA</Text>
        <ScrollView className="bg-muted rounded p-3 max-h-60">
          <Text className="text-xs font-mono text-foreground">
            {JSON.stringify(item.data, null, 2)}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}
