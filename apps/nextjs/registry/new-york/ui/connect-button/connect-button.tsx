"use client";

import { api } from "@tocld/api/client";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import type { IntegrationProvider } from "../types";

interface ConnectButtonProps {
  provider: IntegrationProvider;
  redirectUri?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  className?: string;
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
}: ConnectButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const getAuthUrl = api.integration.getAuthUrl.useMutation();

  const handleConnect = async () => {
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
      disabled={isLoading}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
    >
      {isLoading ? "Connecting..." : children || PROVIDER_LABELS[provider]}
    </button>
  );
}
