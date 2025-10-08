import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return networkStatus;
}

export function useIsOnline() {
  const { isConnected, isInternetReachable } = useNetworkStatus();

  // Consider online if connected and internet is reachable
  // If isInternetReachable is null, fall back to isConnected
  return isInternetReachable !== false && isConnected === true;
}
