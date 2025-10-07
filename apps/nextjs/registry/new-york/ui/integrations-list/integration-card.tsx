"use client";

import { api } from "@tocld/api/client";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import type { IntegrationInfo } from "../types";

interface IntegrationCardProps {
  integration: IntegrationInfo;
  onDisconnect?: () => void;
  className?: string;
}

/**
 * Display integration status with management options
 */
export function IntegrationCard({ integration, onDisconnect, className }: IntegrationCardProps) {
  const disconnectMutation = api.integration.disconnect.useMutation();
  const refreshMutation = api.integration.refresh.useMutation();

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${integration.provider}?`)) return;

    try {
      await disconnectMutation.mutateAsync({
        integrationId: integration.id,
      });
      onDisconnect?.();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync({
        integrationId: integration.id,
      });
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  return (
    <div className={cn("p-6 border rounded-lg space-y-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold capitalize">{integration.provider}</h3>
          {integration.accountEmail && (
            <p className="text-sm text-muted-foreground">{integration.accountEmail}</p>
          )}
        </div>
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            integration.status === "connected" && "bg-green-100 text-green-700",
            integration.status === "disconnected" && "bg-gray-100 text-gray-700",
            integration.status === "error" && "bg-red-100 text-red-700",
            integration.status === "expired" && "bg-yellow-100 text-yellow-700",
          )}
        >
          {integration.status}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Connected</span>
          <span className="font-medium">
            {new Date(integration.connectedAt).toLocaleDateString()}
          </span>
        </div>
        {integration.lastSyncedAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last synced</span>
            <span className="font-medium">
              {new Date(integration.lastSyncedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          className="px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium"
        >
          {refreshMutation.isPending ? "Refreshing..." : "Refresh"}
        </button>
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={disconnectMutation.isPending}
          className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium"
        >
          {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
        </button>
      </div>
    </div>
  );
}
