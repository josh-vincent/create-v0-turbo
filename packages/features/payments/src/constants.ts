/**
 * Payment provider metadata
 */
export const PAYMENT_PROVIDER_METADATA = {
  stripe: {
    name: "Stripe",
    description: "Industry-leading payment processing with support for credit cards, Apple Pay, and Google Pay.",
    color: "blue",
    features: [
      "Credit & Debit Cards",
      "Apple Pay & Google Pay",
      "Bank Transfers",
      "International Payments",
    ],
  },
  polar: {
    name: "Polar",
    description: "Developer-first payment platform with seamless integration and transparent pricing.",
    color: "purple",
    features: [
      "Simplified Pricing",
      "Developer-Friendly API",
      "Instant Payouts",
      "Built for SaaS",
    ],
  },
} as const;

export type PaymentProvider = keyof typeof PAYMENT_PROVIDER_METADATA;

/**
 * Get payment provider metadata
 */
export function getPaymentProviderMetadata(provider: PaymentProvider) {
  return PAYMENT_PROVIDER_METADATA[provider];
}

/**
 * Get all payment providers
 */
export function getAllPaymentProviders(): PaymentProvider[] {
  return Object.keys(PAYMENT_PROVIDER_METADATA) as PaymentProvider[];
}
