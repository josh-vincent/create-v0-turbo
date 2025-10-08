import type { ReactNode } from "react";
import { useState } from "react";
import { RefreshControl as RNRefreshControl, ScrollView } from "react-native";

interface RefreshableScrollViewProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
}

export function RefreshableScrollView({
  children,
  onRefresh,
  refreshing = false,
}: RefreshableScrollViewProps) {
  return (
    <ScrollView
      refreshControl={
        <RNRefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#f472b6" // primary color
          colors={["#f472b6"]} // for Android
        />
      }
    >
      {children}
    </ScrollView>
  );
}

// Hook for managing refresh state
export function useRefresh(callback: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await callback();
    } finally {
      setRefreshing(false);
    }
  };

  return { refreshing, onRefresh: handleRefresh };
}
