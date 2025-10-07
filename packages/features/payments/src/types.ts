import { z } from "zod";

/**
 * Feature module manifest schema
 */
export const featureManifestSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  enabled: z.boolean().default(true),

  // Dependencies
  requiredEnvVars: z.array(z.string()).optional(),
  requiredPackages: z.array(z.string()).optional(),

  // Routes and endpoints
  webhooks: z
    .array(
      z.object({
        path: z.string(),
        provider: z.string(),
      }),
    )
    .optional(),

  callbacks: z
    .array(
      z.object({
        path: z.string(),
        provider: z.string(),
      }),
    )
    .optional(),

  // tRPC routers
  routers: z.array(z.string()).optional(),
});

export type FeatureManifest = z.infer<typeof featureManifestSchema>;

/**
 * Payment provider types
 */
export const paymentProviderSchema = z.enum(["stripe", "polar"]);
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;

export const subscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "past_due",
  "trialing",
  "paused",
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/**
 * Payment configuration
 */
export interface PaymentProviderConfig {
  provider: PaymentProvider;
  secretKey: string;
  webhookSecret: string;
  publicKey?: string;
}

/**
 * Subscription data structure (normalized across providers)
 */
export interface NormalizedSubscription {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  planId?: string;
  planName?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * Checkout session data
 */
export interface CheckoutSessionData {
  sessionId: string;
  url: string;
}

/**
 * Webhook event (normalized)
 */
export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  rawEvent: unknown;
}
