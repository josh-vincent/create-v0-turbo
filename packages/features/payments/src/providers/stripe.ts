import Stripe from "stripe";
import type {
  CheckoutSessionData,
  NormalizedSubscription,
  PaymentProviderConfig,
  SubscriptionStatus,
  WebhookEvent,
} from "../types";
import { PaymentProvider } from "./base";

/**
 * Stripe payment provider implementation
 */
export class StripeProvider extends PaymentProvider {
  private stripe: Stripe;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: "2025-02-28.acacia",
      typescript: true,
    });
  }

  async createCheckoutSession(params: {
    customerId?: string;
    customerEmail: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSessionData> {
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: params.customerId,
      customer_email: params.customerId ? undefined : params.customerEmail,
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });

    return { url: session.url };
  }

  async getSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    return this.normalizeSubscription(subscription);
  }

  async cancelSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return this.normalizeSubscription(subscription);
  }

  async resumeSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return this.normalizeSubscription(subscription);
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.webhookSecret,
    );

    return {
      type: event.type,
      data: event.data.object as Record<string, unknown>,
      rawEvent: event,
    };
  }

  async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    // To be implemented by the application layer
    // This is where you'd update your database based on webhook events
    console.log(`[Stripe] Webhook event: ${event.type}`);
  }

  async getCustomerByEmail(email: string): Promise<string | null> {
    const customers = await this.stripe.customers.list({ email, limit: 1 });
    return customers.data[0]?.id ?? null;
  }

  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
    return customer.id;
  }

  /**
   * Normalize Stripe subscription to common format
   */
  private normalizeSubscription(subscription: Stripe.Subscription): NormalizedSubscription {
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: this.normalizeStatus(subscription.status),
      planId: subscription.items.data[0]?.price.id,
      planName: subscription.items.data[0]?.price.nickname ?? undefined,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }

  private normalizeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
      active: "active",
      canceled: "canceled",
      past_due: "past_due",
      trialing: "trialing",
      paused: "paused",
      incomplete: "trialing",
      incomplete_expired: "canceled",
      unpaid: "past_due",
    };
    return statusMap[status] || "canceled";
  }
}
