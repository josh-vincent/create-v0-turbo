"use client";

import { SubscriptionCard as BaseSubscriptionCard } from "@tocld/features-payments/ui";
import type { SubscriptionData } from "@tocld/features-payments/ui";
import { api } from "~/trpc/react";

interface SubscriptionCardProps {
  className?: string;
}

/**
 * App-specific SubscriptionCard that integrates with tRPC
 */
export function SubscriptionCard({ className }: SubscriptionCardProps) {
  // Check if subscription API is available (payments feature enabled)
  const subscriptionApi = (api as any).subscription;

  if (!subscriptionApi) {
    // Fallback when payments feature is not enabled
    return (
      <div className={className}>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Payments Not Configured</h3>
          <p className="text-sm text-muted-foreground">
            To enable billing features, add payment provider credentials (Stripe or Polar) to your
            .env file.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            See .env.standard or .env.advanced for configuration examples.
          </p>
        </div>
      </div>
    );
  }

  const { data: subscription, isLoading } = subscriptionApi.getCurrent.useQuery();
  const cancelMutation = subscriptionApi.cancel.useMutation();
  const resumeMutation = subscriptionApi.resume.useMutation();
  const portalMutation = subscriptionApi.createBillingPortal.useMutation();

  return (
    <BaseSubscriptionCard
      className={className}
      subscription={subscription as SubscriptionData}
      isLoading={isLoading}
      onCancel={async () => {
        await cancelMutation.mutateAsync();
      }}
      onResume={async () => {
        await resumeMutation.mutateAsync();
      }}
      onManageBilling={async () => {
        const result = await portalMutation.mutateAsync({
          returnUrl: window.location.href,
        });
        window.location.href = result.url;
      }}
    />
  );
}
