"use client";

import { api } from "@tocld/api/client";

export type IntegrationProvider =
  | "gmail"
  | "outlook"
  | "google_drive"
  | "dropbox"
  | "slack"
  | "github";

export interface UseIntegrationStatusReturn {
  isConnected: (provider: IntegrationProvider) => boolean;
  connectedProviders: IntegrationProvider[];
  integrations: any[];
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Hook to check integration connection status
 * @returns Helper functions and data for checking OAuth connections
 */
export function useIntegrationStatus(): UseIntegrationStatusReturn {
  const { data: integrations, isLoading, refetch } = api.integration.list.useQuery();

  const connectedProviders = (integrations || []).map((int) => int.provider as IntegrationProvider);

  const isConnected = (provider: IntegrationProvider) => {
    return connectedProviders.includes(provider);
  };

  return {
    isConnected,
    connectedProviders,
    integrations: integrations || [],
    isLoading,
    refetch,
  };
}
