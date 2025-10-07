/**
 * Query Provider - Shared types and configuration
 * This file contains the shared logic for TanStack Query setup with offline support
 */
import type { QueryClient } from "@tanstack/react-query";

export interface QueryProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export interface OfflineQueryConfig {
  /** Maximum age of cached data in milliseconds (default: 24 hours) */
  maxAge?: number;
  /** Whether to restore queries on mount (default: true) */
  shouldDehydrateQuery?: (query: any) => boolean;
  /** Throttle time for persisting in milliseconds (default: 1000ms) */
  throttleTime?: number;
}

export const defaultOfflineConfig: OfflineQueryConfig = {
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  throttleTime: 1000,
  shouldDehydrateQuery: (query) => {
    // Don't persist queries with errors or empty data
    return query.state.status === "success" && query.state.data != null;
  },
};
