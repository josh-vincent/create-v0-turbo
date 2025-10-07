"use client";

import { api } from "@tocld/api/client";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "trialing"
  | "none";

export interface UseSubscriptionStatusReturn {
  status: SubscriptionStatus;
  isActive: boolean;
  isPastDue: boolean;
  isLoading: boolean;
  subscription: any | null;
  refetch: () => void;
}

/**
 * Hook to check user's subscription status
 * @returns Subscription status and helper booleans
 */
export function useSubscriptionStatus(): UseSubscriptionStatusReturn {
  const { data: subscription, isLoading, refetch } = api.subscription.getCurrent.useQuery();

  const status: SubscriptionStatus = subscription?.status || "none";
  const isActive = status === "active" || status === "trialing";
  const isPastDue = status === "past_due";

  return {
    status,
    isActive,
    isPastDue,
    isLoading,
    subscription: subscription || null,
    refetch,
  };
}
