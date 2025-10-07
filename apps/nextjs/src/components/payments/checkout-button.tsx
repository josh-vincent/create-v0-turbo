"use client";

import { CheckoutButton as BaseCheckoutButton } from "@tocld/features-payments/ui";
import type { CheckoutButtonProps as BaseCheckoutButtonProps } from "@tocld/features-payments/ui";
import * as React from "react";
import { api } from "~/trpc/react";

export type CheckoutButtonProps = Omit<BaseCheckoutButtonProps, "onCheckout">;

/**
 * App-specific CheckoutButton that integrates with tRPC
 */
export function CheckoutButton(props: CheckoutButtonProps) {
  // Check if subscription API is available (payments feature enabled)
  const createCheckout = (api as any).subscription?.createCheckout?.useMutation?.();

  if (!createCheckout) {
    // Fallback when payments feature is not enabled
    const { className, children, disabled } = props;
    return (
      <button
        type="button"
        className={className}
        disabled={disabled ?? true}
        onClick={() =>
          alert("Payments feature not configured. Please add payment provider credentials to .env")
        }
      >
        {children || "Subscribe"}
      </button>
    );
  }

  return (
    <BaseCheckoutButton
      {...props}
      onCheckout={async (params: any) => {
        return await createCheckout.mutateAsync(params);
      }}
    />
  );
}
