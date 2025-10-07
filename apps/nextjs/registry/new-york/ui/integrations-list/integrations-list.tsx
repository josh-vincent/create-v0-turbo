"use client";

import { api } from "@tocld/api/client";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import type { IntegrationProvider } from "../types";
import { ConnectButton } from "./connect-button";
import { IntegrationCard } from "./integration-card";

interface IntegrationsListProps {
  className?: string;
}

const AVAILABLE_PROVIDERS: IntegrationProvider[] = [
  "gmail",
  "outlook",
  "google_drive",
  "dropbox",
  "slack",
  "github",
];

/**
 * List of integrations with connect/manage options
 */
export function IntegrationsList({ className }: IntegrationsListProps) {
  const { data: integrations, isLoading, refetch } = api.integration.list.useQuery();

  const connectedProviders = new Set(integrations?.map((int) => int.provider) || []);

  const availableProviders = AVAILABLE_PROVIDERS.filter(
    (provider) => !connectedProviders.has(provider),
  );

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <p>Loading integrations...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Connected integrations */}
      {integrations && integrations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Connected</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onDisconnect={() => refetch()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available integrations */}
      {availableProviders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableProviders.map((provider) => (
              <div
                key={provider}
                className="p-6 border rounded-lg flex flex-col items-center justify-center space-y-3"
              >
                <h3 className="text-lg font-medium capitalize">{provider}</h3>
                <ConnectButton provider={provider} onSuccess={() => refetch()} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!integrations?.length && !availableProviders.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No integrations available</p>
        </div>
      )}
    </div>
  );
}
