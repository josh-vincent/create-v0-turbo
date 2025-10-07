"use client";

import { Card } from "@/components/ui/card";
import { CreditCard, DollarSign, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./checkout-button";
import { PAYMENT_PROVIDER_METADATA, type PaymentProvider } from "@tocld/features-payments/constants";

const ICON_MAP: Record<PaymentProvider, LucideIcon> = {
  stripe: CreditCard,
  polar: DollarSign,
};

const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
};

const ENV_CHECK_MAP: Record<PaymentProvider, () => boolean> = {
  stripe: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_HAS_STRIPE === "true"),
  polar: () =>
    typeof window !== "undefined" &&
    !!(process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN || process.env.NEXT_PUBLIC_HAS_POLAR === "true"),
};

const PAYMENT_PROVIDERS = (Object.keys(PAYMENT_PROVIDER_METADATA) as PaymentProvider[]).map(
  (provider) => ({
    id: provider,
    title: PAYMENT_PROVIDER_METADATA[provider].name,
    description: PAYMENT_PROVIDER_METADATA[provider].description,
    icon: ICON_MAP[provider],
    color: COLOR_MAP[PAYMENT_PROVIDER_METADATA[provider].color],
    priceId: `price_${provider}_pro`,
    envCheck: ENV_CHECK_MAP[provider],
  }),
);

export function BillingCards() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment Providers</h2>
        <p className="text-sm text-muted-foreground">
          Choose your preferred payment provider to start your subscription
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PAYMENT_PROVIDERS.map((provider) => {
          const isConfigured = provider.envCheck();

          return (
            <Card key={provider.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                      <provider.icon className={`size-5 ${provider.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{provider.title}</h3>
                      {isConfigured ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          Not configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{provider.description}</p>

                <div className="pt-2">
                  <CheckoutButton
                    priceId={provider.priceId}
                    variant="default"
                    size="sm"
                    disabled={!isConfigured}
                    className="w-full"
                  >
                    {isConfigured ? "Start Subscription" : "Unavailable"}
                  </CheckoutButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {PAYMENT_PROVIDERS.every((p) => !p.envCheck()) && (
        <Card className="p-6 bg-muted/50">
          <div className="space-y-2">
            <h3 className="font-semibold">Setup Required</h3>
            <p className="text-sm text-muted-foreground">
              Configure your payment provider credentials in your environment variables to enable subscriptions.
            </p>
            <Link href="/pricing" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              View pricing details
              <ChevronRight className="size-3" />
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
