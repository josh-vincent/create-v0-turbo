import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import { useIsOnline } from "@/hooks/useNetworkStatus";
import { useSyncQueue } from "@/hooks/useSyncQueue";

export function SyncStatusIndicator() {
  const isOnline = useIsOnline();
  const { isSyncing, pendingCount, failedCount } = useSyncQueue();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when syncing
  useEffect(() => {
    if (isSyncing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isSyncing]);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        color: "bg-amber-500",
        icon: "📡",
        text: "Offline",
        subtext: pendingCount > 0 ? `${pendingCount} pending` : "",
      };
    }

    if (isSyncing) {
      return {
        color: "bg-blue-500",
        icon: "🔄",
        text: "Syncing",
        subtext: `${pendingCount} items`,
      };
    }

    if (failedCount > 0) {
      return {
        color: "bg-red-500",
        icon: "⚠️",
        text: "Sync Failed",
        subtext: `${failedCount} failed`,
      };
    }

    if (pendingCount > 0) {
      return {
        color: "bg-amber-500",
        icon: "⏸️",
        text: "Pending",
        subtext: `${pendingCount} queued`,
      };
    }

    return {
      color: "bg-green-500",
      icon: "✓",
      text: "Synced",
      subtext: "All up to date",
    };
  };

  const status = getStatusInfo();

  return (
    <TouchableOpacity
      onPress={() => router.push("/sync-status")}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      <View className="flex-row items-center p-3">
        <Animated.View
          style={{ transform: [{ scale: isSyncing ? pulseAnim : 1 }] }}
          className={`w-10 h-10 ${status.color} rounded-full items-center justify-center mr-3`}
        >
          <Text className="text-xl">{status.icon}</Text>
        </Animated.View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {status.text}
          </Text>
          {status.subtext && (
            <Text className="text-sm text-muted-foreground">
              {status.subtext}
            </Text>
          )}
        </View>

        <View className="bg-muted rounded-full px-3 py-1">
          <Text className="text-xs font-medium text-foreground">
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
