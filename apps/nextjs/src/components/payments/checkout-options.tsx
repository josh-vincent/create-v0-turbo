"use client";

import { CheckoutButton } from "./checkout-button";

interface CheckoutOptionsProps {
  className?: string;
}

/**
 * Display checkout buttons for available payment providers
 * Shows which providers are configured (Stripe/Polar)
 */
export function CheckoutOptions({ className }: CheckoutOptionsProps) {
  // Check environment for configured providers
  const hasStripe =
    typeof window !== "undefined" &&
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_HAS_STRIPE === "true");

  const hasPolar =
    typeof window !== "undefined" &&
    (process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN || process.env.NEXT_PUBLIC_HAS_POLAR === "true");

  return (
    <div className={className}>
      <div className="border rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Start a Subscription</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your payment provider to get started
          </p>
        </div>

        <div className="space-y-3">
          {/* Stripe Checkout */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Stripe</h4>
                {hasStripe && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Configured
                  </span>
                )}
                {!hasStripe && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Not configured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Credit cards, Apple Pay, Google Pay
              </p>
            </div>
            <CheckoutButton
              priceId="price_stripe_pro"
              variant="default"
              size="sm"
              disabled={!hasStripe}
            >
              {hasStripe ? "Checkout" : "Unavailable"}
            </CheckoutButton>
          </div>

          {/* Polar Checkout */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Polar</h4>
                {hasPolar && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Configured
                  </span>
                )}
                {!hasPolar && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    Not configured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Alternative payment processor</p>
            </div>
            <CheckoutButton
              priceId="price_polar_pro"
              variant="default"
              size="sm"
              disabled={!hasPolar}
            >
              {hasPolar ? "Checkout" : "Unavailable"}
            </CheckoutButton>
          </div>
        </div>

        {!hasStripe && !hasPolar && (
          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> No payment providers are currently configured. Add your Stripe
              or Polar credentials to your .env file to enable checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
