import NetInfo from "@react-native-community/netinfo";
/**
 * Network Status Hook - Native implementation
 * Detects online/offline status using @react-native-community/netinfo
 */
import { useEffect, useState } from "react";

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
}

/**
 * Hook to detect network connectivity status
 *
 * @example
 * ```tsx
 * const { isOnline, isOffline } = useNetworkStatus();
 *
 * if (isOffline) {
 *   return <OfflineBanner />;
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}
