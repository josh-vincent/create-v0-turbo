"use client";

import { cn } from "@tocld/ui/lib";
import * as React from "react";

export interface SubscriptionData {
  planName?: string;
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

interface SubscriptionCardProps {
  className?: string;
  subscription?: SubscriptionData | null;
  isLoading?: boolean;
  onCancel?: () => Promise<void>;
  onResume?: () => Promise<void>;
  onManageBilling?: () => Promise<void>;
}

/**
 * Display current subscription status with management options
 *
 * Note: This component uses dependency injection to stay framework-agnostic.
 * Pass subscription data and handlers as props.
 *
 * Example usage with tRPC:
 * ```tsx
 * import { api } from "~/trpc/react";
 *
 * function MyComponent() {
 *   const { data: subscription, isLoading } = api.subscription.getCurrent.useQuery();
 *   const cancelMutation = api.subscription.cancel.useMutation();
 *   const resumeMutation = api.subscription.resume.useMutation();
 *   const portalMutation = api.subscription.createBillingPortal.useMutation();
 *
 *   return (
 *     <SubscriptionCard
 *       subscription={subscription}
 *       isLoading={isLoading}
 *       onCancel={async () => { await cancelMutation.mutateAsync(); }}
 *       onResume={async () => { await resumeMutation.mutateAsync(); }}
 *       onManageBilling={async () => {
 *         const result = await portalMutation.mutateAsync({ returnUrl: window.location.href });
 *         window.location.href = result.url;
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function SubscriptionCard({
  className,
  subscription,
  isLoading,
  onCancel,
  onResume,
  onManageBilling,
}: SubscriptionCardProps) {
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [isResuming, setIsResuming] = React.useState(false);
  const [isManaging, setIsManaging] = React.useState(false);

  const handleManageBilling = async () => {
    if (!onManageBilling) return;
    setIsManaging(true);
    try {
      await onManageBilling();
    } catch (error) {
      console.error("Billing portal error:", error);
    } finally {
      setIsManaging(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    setIsCanceling(true);
    try {
      await onCancel();
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResume = async () => {
    if (!onResume) return;
    setIsResuming(true);
    try {
      await onResume();
    } catch (error) {
      console.error("Resume error:", error);
    } finally {
      setIsResuming(false);
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
          disabled={isManaging || !onManageBilling}
          className="px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium disabled:opacity-50"
        >
          {isManaging ? "Loading..." : "Manage Billing"}
        </button>

        {subscription.status === "active" && !subscription.cancelAtPeriodEnd && onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCanceling}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium disabled:opacity-50"
          >
            {isCanceling ? "Canceling..." : "Cancel"}
          </button>
        )}

        {subscription.cancelAtPeriodEnd && onResume && (
          <button
            type="button"
            onClick={handleResume}
            disabled={isResuming}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium disabled:opacity-50"
          >
            {isResuming ? "Resuming..." : "Resume"}
          </button>
        )}
      </div>
    </div>
  );
}
