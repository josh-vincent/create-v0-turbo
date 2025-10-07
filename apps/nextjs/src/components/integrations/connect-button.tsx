"use client";

import type { IntegrationProvider } from "@tocld/features-integrations";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import { api } from "~/trpc/react";

interface ConnectButtonProps {
  provider: IntegrationProvider;
  redirectUri?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PROVIDER_LABELS: Record<IntegrationProvider, string> = {
  gmail: "Connect Gmail",
  outlook: "Connect Outlook",
  google_drive: "Connect Google Drive",
  dropbox: "Connect Dropbox",
  slack: "Connect Slack",
  github: "Connect GitHub",
};

/**
 * OAuth connect button for integrations
 */
export function ConnectButton({
  provider,
  redirectUri,
  onSuccess,
  onError,
  children,
  className,
  disabled: externalDisabled,
}: ConnectButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if integration API is available
  const integrationApi = (api as any).integration;
  const getAuthUrl = integrationApi?.getAuthUrl?.useMutation?.();

  const isDisabled = externalDisabled || isLoading || !getAuthUrl;

  const handleConnect = async () => {
    if (!getAuthUrl) return;

    setIsLoading(true);

    try {
      const result = await getAuthUrl.mutateAsync({
        provider,
        redirectUri: redirectUri || `${window.location.origin}/api/auth/callback/${provider}`,
      });

      onSuccess?.();

      // Redirect to OAuth provider
      window.location.href = result.authUrl;
    } catch (error) {
      console.error("OAuth error:", error);
      onError?.(error as Error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? "Connecting..." : children || PROVIDER_LABELS[provider]}
    </button>
  );
}
