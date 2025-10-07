"use client";

import { api } from "@tocld/api/client";
import { cn } from "@tocld/ui/lib";
import * as React from "react";

interface SubscriptionCardProps {
  className?: string;
}

/**
 * Display current subscription status with management options
 */
export function SubscriptionCard({ className }: SubscriptionCardProps) {
  const { data: subscription, isLoading } = api.subscription.getCurrent.useQuery();
  const cancelMutation = api.subscription.cancel.useMutation();
  const resumeMutation = api.subscription.resume.useMutation();
  const portalMutation = api.subscription.createBillingPortal.useMutation();

  const handleManageBilling = async () => {
    try {
      const result = await portalMutation.mutateAsync({
        returnUrl: window.location.href,
      });
      window.location.href = result.url;
    } catch (error) {
      console.error("Billing portal error:", error);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      await cancelMutation.mutateAsync();
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeMutation.mutateAsync();
    } catch (error) {
      console.error("Resume error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("p-6 border rounded-lg", className)}>
        <p>Loading subscription...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={cn("p-6 border rounded-lg", className)}>
        <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
        <p className="text-muted-foreground">You don't have an active subscription yet.</p>
      </div>
    );
  }

  return (
    <div className={cn("p-6 border rounded-lg space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold">Your Subscription</h3>
        <p className="text-sm text-muted-foreground">{subscription.planName || "Active Plan"}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span
            className={cn(
              "font-medium capitalize",
              subscription.status === "active" && "text-green-600",
              subscription.status === "canceled" && "text-red-600",
              subscription.status === "past_due" && "text-yellow-600",
            )}
          >
            {subscription.status}
          </span>
        </div>

        {subscription.currentPeriodEnd && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {subscription.status === "active" ? "Renews on" : "Expires on"}
            </span>
            <span className="font-medium">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={handleManageBilling}
          disabled={portalMutation.isPending}
          className="px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium"
        >
          {portalMutation.isPending ? "Loading..." : "Manage Billing"}
        </button>

        {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium"
          >
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </button>
        )}

        {subscription.cancelAtPeriodEnd && (
          <button
            type="button"
            onClick={handleResume}
            disabled={resumeMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
          >
            {resumeMutation.isPending ? "Resuming..." : "Resume"}
          </button>
        )}
      </div>
    </div>
  );
}
