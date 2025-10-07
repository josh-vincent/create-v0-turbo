/**
 * Query Provider - Web implementation
 * Uses localStorage for persistence with sync storage persister
 */
"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { type QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as React from "react";
import type { OfflineQueryConfig, QueryProviderProps } from "./query-provider";
import { defaultOfflineConfig } from "./query-provider";

export type { QueryProviderProps, OfflineQueryConfig };

interface WebQueryProviderProps extends QueryProviderProps {
  config?: OfflineQueryConfig;
  enableDevtools?: boolean;
}

// Create persister using localStorage
const createPersister = () => {
  if (typeof window === "undefined") return undefined;

  return createSyncStoragePersister({
    storage: window.localStorage,
    key: "REACT_QUERY_OFFLINE_CACHE",
  });
};

// Default query client configuration
const createDefaultQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });

export function QueryProvider({
  children,
  queryClient,
  config = defaultOfflineConfig,
  enableDevtools = process.env.NODE_ENV === "development",
}: WebQueryProviderProps) {
  const [client] = React.useState(() => queryClient ?? createDefaultQueryClient());
  const persister = React.useMemo(() => createPersister(), []);

  if (!persister) {
    // SSR or persister not available
    return (
      <QueryClientProvider client={client}>
        {children}
        {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: config.maxAge,
        dehydrateOptions: {
          shouldDehydrateQuery: config.shouldDehydrateQuery,
        },
      }}
    >
      {children}
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
