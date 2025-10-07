import type { PaymentProvider, PaymentProviderConfig } from "../types";
import { PolarProvider } from "./polar";
import { StripeProvider } from "./stripe";

export * from "./base";
export * from "./stripe";
export * from "./polar";

/**
 * Factory function to create payment provider instances
 */
export function createPaymentProvider(config: PaymentProviderConfig): PaymentProvider {
  switch (config.provider) {
    case "stripe":
      return new StripeProvider(config);
    case "polar":
      return new PolarProvider(config);
    default:
      throw new Error(`Unsupported payment provider: ${config.provider}`);
  }
}

/**
 * Get payment provider from environment variables
 */
export function getPaymentProviderFromEnv(): PaymentProvider | null {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const polarKey = process.env.POLAR_ACCESS_TOKEN;

  if (stripeKey) {
    return createPaymentProvider({
      provider: "stripe",
      secretKey: stripeKey,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  }

  if (polarKey) {
    return createPaymentProvider({
      provider: "polar",
      secretKey: polarKey,
      webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
    });
  }

  return null;
}
