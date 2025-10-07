"use client";

import { api } from "@tocld/api/client";
import { cn } from "@tocld/ui/lib";
import * as React from "react";
import { type CheckoutButtonProps, checkoutButtonVariants } from "./checkout-button";

/**
 * Web version of CheckoutButton (uses Stripe/Polar checkout)
 */
export function CheckoutButton({
  priceId,
  successUrl,
  cancelUrl,
  children = "Subscribe",
  variant,
  size,
  disabled,
  onSuccess,
  onError,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const createCheckout = api.subscription.createCheckout.useMutation();

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const result = await createCheckout.mutateAsync({
        priceId,
        successUrl: successUrl || `${window.location.origin}/dashboard?success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
      });

      onSuccess?.(result.sessionId);

      // Redirect to checkout
      window.location.href = result.url;
    } catch (error) {
      console.error("Checkout error:", error);
      onError?.(error as Error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={cn(checkoutButtonVariants({ variant, size }))}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
