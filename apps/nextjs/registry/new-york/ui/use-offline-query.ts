/**
 * Offline Query Hook
 * Enhanced useQuery hook with offline-first behavior
 */
import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useNetworkStatus } from "./use-network-status";

export interface OfflineQueryOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  /** Whether to show stale data when offline (default: true) */
  showStaleWhenOffline?: boolean;
  /** Custom error message when offline */
  offlineMessage?: string;
}

/**
 * Enhanced useQuery that works offline
 *
 * @example
 * ```tsx
 * const { data, isOffline } = useOfflineQuery({
 *   queryKey: ['todos'],
 *   queryFn: fetchTodos,
 *   showStaleWhenOffline: true
 * });
 *
 * if (isOffline) {
 *   return <Banner>Showing cached data</Banner>
 * }
 * ```
 */
export function useOfflineQuery<TData = unknown, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options: OfflineQueryOptions<TData, TError> = {},
): UseQueryResult<TData, TError> & { isOffline: boolean } {
  const { isOnline } = useNetworkStatus();
  const {
    showStaleWhenOffline = true,
    offlineMessage = "You are offline. Showing cached data.",
    ...queryOptions
  } = options;

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...queryOptions,
    // When offline, prevent refetching and show stale data
    enabled: isOnline && (queryOptions.enabled ?? true),
    staleTime: isOnline ? queryOptions.staleTime : Number.POSITIVE_INFINITY,
    refetchOnMount: isOnline && (queryOptions.refetchOnMount ?? true),
    refetchOnWindowFocus: isOnline && (queryOptions.refetchOnWindowFocus ?? true),
    refetchOnReconnect: true, // Always refetch when reconnecting
  });

  return {
    ...query,
    isOffline: !isOnline,
  };
}
