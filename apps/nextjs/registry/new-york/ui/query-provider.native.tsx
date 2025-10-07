import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
/**
 * Query Provider - Native implementation
 * Uses AsyncStorage for persistence with async storage persister
 */
import * as React from "react";
import type { OfflineQueryConfig, QueryProviderProps } from "./query-provider";
import { defaultOfflineConfig } from "./query-provider";

export type { QueryProviderProps, OfflineQueryConfig };

interface NativeQueryProviderProps extends QueryProviderProps {
  config?: OfflineQueryConfig;
}

// Create persister using AsyncStorage
const createPersister = () => {
  return createAsyncStoragePersister({
    storage: AsyncStorage,
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
        refetchOnWindowFocus: false, // Not applicable on mobile
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
}: NativeQueryProviderProps) {
  const [client] = React.useState(() => queryClient ?? createDefaultQueryClient());
  const persister = React.useMemo(() => createPersister(), []);

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
    </PersistQueryClientProvider>
  );
}
