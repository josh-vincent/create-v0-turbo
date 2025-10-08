"use client";

import { SubscriptionCard as BaseSubscriptionCard } from "@tocld/features-payments/ui";
import { useTRPC } from "~/trpc/react";

interface SubscriptionCardProps {
  className?: string;
}

/**
 * App-specific SubscriptionCard that integrates with tRPC
 */
export function SubscriptionCard({ className }: SubscriptionCardProps) {
  const api = useTRPC();

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

  return <BaseSubscriptionCard className={className} api={api} />;
}
