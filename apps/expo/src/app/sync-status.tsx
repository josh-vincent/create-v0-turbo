import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSyncQueue } from "@/hooks/useSyncQueue";

export default function SyncStatusScreen() {
  const networkStatus = useNetworkStatus();
  const { queue, isSyncing, syncQueue, clearQueue, removeItem, pendingCount, failedCount } = useSyncQueue();
  const [autoSync, setAutoSync] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncQueue();
    setRefreshing(false);
  };

  const handleClearQueue = () => {
    Alert.alert(
      "Clear Sync Queue",
      "Are you sure you want to clear all pending sync items? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearQueue();
            Alert.alert("Success", "Sync queue cleared");
          },
        },
      ]
    );
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Remove this item from the sync queue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItem(id),
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "syncing":
        return "bg-blue-500";
      case "synced":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏸️";
      case "syncing":
        return "🔄";
      case "synced":
        return "✓";
      case "failed":
        return "⚠️";
      default:
        return "📝";
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      default:
        return "📝";
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Sync Status" }} />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Network Status */}
        <View className="p-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Network Status
          </Text>

          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-foreground">Connection</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  networkStatus.isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <Text className="text-xs font-medium text-white">
                  {networkStatus.isConnected ? "Connected" : "Disconnected"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base text-foreground">Internet</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  networkStatus.isInternetReachable !== false
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <Text className="text-xs font-medium text-white">
                  {networkStatus.isInternetReachable !== false
                    ? "Reachable"
                    : "Unreachable"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base text-foreground">Type</Text>
              <Text className="text-sm text-muted-foreground capitalize">
                {networkStatus.type || "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        {/* Sync Settings */}
        <View className="p-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Sync Settings
          </Text>

          <View className="bg-card border border-border rounded-lg p-4 space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">
                  Auto Sync
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Automatically sync when online
                </Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: "#767577", true: "#818cf8" }}
                thumbColor={autoSync ? "#6366f1" : "#f4f3f4"}
              />
            </View>

            <View className="pt-4 border-t border-border">
              <TouchableOpacity
                onPress={() => syncQueue()}
                disabled={isSyncing || !networkStatus.isConnected}
                className={`py-3 rounded-lg items-center ${
                  isSyncing || !networkStatus.isConnected
                    ? "bg-muted"
                    : "bg-primary"
                }`}
              >
                <Text
                  className={`text-base font-semibold ${
                    isSyncing || !networkStatus.isConnected
                      ? "text-muted-foreground"
                      : "text-primary-foreground"
                  }`}
                >
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sync Statistics */}
        <View className="p-4 border-b border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Sync Statistics
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-2xl font-bold text-foreground">
                {queue.length}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Total Items
              </Text>
            </View>

            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-2xl font-bold text-amber-500">
                {pendingCount}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Pending
              </Text>
            </View>

            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-2xl font-bold text-red-500">
                {failedCount}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                Failed
              </Text>
            </View>
          </View>
        </View>

        {/* Sync Queue */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">
              Sync Queue
            </Text>
            {queue.length > 0 && (
              <TouchableOpacity
                onPress={handleClearQueue}
                className="px-3 py-1 bg-red-500 rounded-md"
              >
                <Text className="text-xs font-medium text-white">
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {queue.length === 0 ? (
            <View className="bg-card border border-border rounded-lg p-8 items-center">
              <Text className="text-4xl mb-3">✓</Text>
              <Text className="text-lg font-semibold text-foreground">
                All Synced
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                No pending sync items
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {queue.map((item) => (
                <View
                  key={item.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-xl">{getActionIcon(item.type)}</Text>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground capitalize">
                          {item.type} {item.entity}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View
                        className={`${getStatusColor(item.status)} w-8 h-8 rounded-full items-center justify-center`}
                      >
                        <Text className="text-sm">
                          {getStatusIcon(item.status)}
                        </Text>
                      </View>

                      {item.status !== "syncing" && (
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                        >
                          <Text className="text-white text-sm">✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {item.status === "failed" && item.retryCount > 0 && (
                    <View className="mt-2 pt-2 border-t border-border">
                      <Text className="text-xs text-red-500">
                        Failed after {item.retryCount} attempt(s)
                      </Text>
                    </View>
                  )}

                  {item.data && (
                    <View className="mt-2 pt-2 border-t border-border">
                      <Text className="text-xs text-muted-foreground">
                        {JSON.stringify(item.data).substring(0, 100)}...
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
