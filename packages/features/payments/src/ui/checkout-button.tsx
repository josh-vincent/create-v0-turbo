"use client";

import { cn } from "@tocld/ui/lib";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

/**
 * Checkout button variants (shared across platforms)
 */
export const checkoutButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type CheckoutButtonVariants = VariantProps<typeof checkoutButtonVariants>;

export interface CheckoutButtonProps extends CheckoutButtonVariants {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onCheckout?: (params: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) => Promise<{ url: string; sessionId: string }>;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Web version of CheckoutButton (uses Stripe/Polar checkout)
 *
 * Note: You need to provide an onCheckout callback that calls your API.
 * This keeps the component framework-agnostic.
 *
 * Example usage:
 * ```tsx
 * import { api } from "~/trpc/react";
 *
 * function MyComponent() {
 *   const createCheckout = api.subscription.createCheckout.useMutation();
 *
 *   return (
 *     <CheckoutButton
 *       priceId="price_123"
 *       onCheckout={async (params) => {
 *         return await createCheckout.mutateAsync(params);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function CheckoutButton({
  priceId,
  successUrl,
  cancelUrl,
  children = "Subscribe",
  variant,
  size,
  disabled,
  onCheckout,
  onSuccess,
  onError,
  className,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onCheckout) {
      console.error("CheckoutButton: onCheckout callback is required");
      return;
    }

    setIsLoading(true);

    try {
      const resolvedSuccessUrl = successUrl || `${window.location.origin}/dashboard?success=true`;
      const resolvedCancelUrl = cancelUrl || `${window.location.origin}/pricing`;

      const result = await onCheckout({
        priceId,
        successUrl: resolvedSuccessUrl,
        cancelUrl: resolvedCancelUrl,
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
      className={cn(checkoutButtonVariants({ variant, size }), className)}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
