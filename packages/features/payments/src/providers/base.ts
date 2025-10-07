import type {
  CheckoutSessionData,
  NormalizedSubscription,
  PaymentProvider,
  PaymentProviderConfig,
  WebhookEvent,
} from "../types";

/**
 * Base class for payment providers (Stripe, Polar, etc.)
 * Similar pattern to OAuth providers in @tocld/oauth-sync
 */
export abstract class PaymentProvider {
  protected config: PaymentProviderConfig;
  protected provider: PaymentProvider;

  constructor(config: PaymentProviderConfig) {
    this.config = config;
    this.provider = config.provider;
  }

  /**
   * Create a checkout session for a subscription
   */
  abstract createCheckoutSession(params: {
    customerId?: string;
    customerEmail: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSessionData>;

  /**
   * Create a billing portal session
   */
  abstract createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }>;

  /**
   * Get subscription by ID
   */
  abstract getSubscription(subscriptionId: string): Promise<NormalizedSubscription>;

  /**
   * Cancel subscription
   */
  abstract cancelSubscription(subscriptionId: string): Promise<NormalizedSubscription>;

  /**
   * Resume subscription
   */
  abstract resumeSubscription(subscriptionId: string): Promise<NormalizedSubscription>;

  /**
   * Verify webhook signature
   */
  abstract verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>;

  /**
   * Handle webhook events (normalized)
   */
  abstract handleWebhookEvent(event: WebhookEvent): Promise<void>;

  /**
   * Get customer by email
   */
  abstract getCustomerByEmail(email: string): Promise<string | null>;

  /**
   * Create customer
   */
  abstract createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<string>;
}
