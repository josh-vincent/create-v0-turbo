"use client";

import type { IntegrationProvider } from "@tocld/features-integrations";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import { api } from "~/trpc/react";
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

// Map providers to their env variable checks
const PROVIDER_CONFIG_MAP: Record<IntegrationProvider, () => boolean> = {
  gmail: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_HAS_GMAIL === "true"),
  outlook: () =>
    typeof window !== "undefined" &&
    !!(
      process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || process.env.NEXT_PUBLIC_HAS_OUTLOOK === "true"
    ),
  google_drive: () =>
    typeof window !== "undefined" &&
    !!(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_HAS_GOOGLE_DRIVE === "true"
    ),
  dropbox: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || process.env.NEXT_PUBLIC_HAS_DROPBOX === "true"),
  slack: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || process.env.NEXT_PUBLIC_HAS_SLACK === "true"),
  github: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_HAS_GITHUB === "true"),
};

const PROVIDER_DESCRIPTIONS: Record<IntegrationProvider, string> = {
  gmail: "Email and calendar integration",
  outlook: "Microsoft email and calendar",
  google_drive: "Cloud storage and documents",
  dropbox: "File storage and sharing",
  slack: "Team communication",
  github: "Code repository integration",
};

/**
 * List of integrations with connect/manage options
 */
export function IntegrationsList({ className }: IntegrationsListProps) {
  // Check if integration API is available
  const integrationApi = (api as any).integration;

  if (!integrationApi) {
    // Fallback when integrations feature is not enabled
    return (
      <div className={className}>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Integrations Not Configured</h3>
          <p className="text-sm text-muted-foreground">
            To enable OAuth integrations, configure your providers (Gmail, Outlook, etc.) in your
            .env file.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            See the integration setup guide for details.
          </p>
        </div>
      </div>
    );
  }

  const { data: integrations, isLoading, refetch } = integrationApi.list.useQuery();

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
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableProviders.map((provider) => {
            const isConfigured = PROVIDER_CONFIG_MAP[provider]();

            return (
              <div key={provider} className="p-6 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium capitalize">
                      {provider.replace(/_/g, " ")}
                    </h3>
                    {isConfigured ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Configured
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        Not configured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{PROVIDER_DESCRIPTIONS[provider]}</p>
                </div>
                <ConnectButton
                  provider={provider}
                  onSuccess={() => refetch()}
                  disabled={!isConfigured}
                  className="w-full"
                >
                  {isConfigured ? "Connect" : "Not Available"}
                </ConnectButton>
              </div>
            );
          })}
        </div>
      </div>

      {availableProviders.length === 0 && !integrations?.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">All available integrations are connected</p>
        </div>
      )}

      {/* Configuration Notice */}
      {availableProviders.some((p) => !PROVIDER_CONFIG_MAP[p]()) && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Some integrations are not configured. Add the required OAuth
            credentials to your .env file to enable them.
          </p>
        </div>
      )}
    </div>
  );
}
