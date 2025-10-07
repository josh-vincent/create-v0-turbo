/**
 * Network Status Hook - Web implementation
 * Detects online/offline status using browser APIs
 */
"use client";

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
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}
