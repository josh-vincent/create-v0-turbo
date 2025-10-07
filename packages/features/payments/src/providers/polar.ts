import { Polar } from "@polar-sh/sdk";
import type {
  CheckoutSessionData,
  NormalizedSubscription,
  PaymentProviderConfig,
  SubscriptionStatus,
  WebhookEvent,
} from "../types";
import { PaymentProvider } from "./base";

/**
 * Polar payment provider implementation
 */
export class PolarProvider extends PaymentProvider {
  private polar: Polar;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.polar = new Polar({
      accessToken: config.secretKey,
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
    // Polar uses a different checkout flow
    // This is a simplified implementation - adjust based on Polar's actual API
    const checkout = await this.polar.checkouts.custom.create({
      productPriceId: params.priceId,
      successUrl: params.successUrl,
      customerEmail: params.customerEmail,
      metadata: params.metadata,
    });

    return {
      sessionId: checkout.id,
      url: checkout.url,
    };
  }

  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }> {
    // Polar's billing portal implementation
    // This is a placeholder - implement based on Polar's actual API
    throw new Error("Polar billing portal not yet implemented");
  }

  async getSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    const subscription = await this.polar.subscriptions.get({
      id: subscriptionId,
    });

    return {
      id: subscription.id,
      customerId: subscription.userId,
      status: this.normalizeStatus(subscription.status),
      planId: subscription.productId,
      currentPeriodStart: subscription.currentPeriodStart
        ? new Date(subscription.currentPeriodStart)
        : undefined,
      currentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    const subscription = await this.polar.subscriptions.cancel({
      id: subscriptionId,
    });

    return this.normalizeSubscription(subscription);
  }

  async resumeSubscription(subscriptionId: string): Promise<NormalizedSubscription> {
    // Polar may not support resuming subscriptions the same way as Stripe
    throw new Error("Resume subscription not yet implemented for Polar");
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent> {
    // Polar webhook verification
    // This is a placeholder - implement based on Polar's webhook signing
    const event = JSON.parse(payload);

    return {
      type: event.type,
      data: event.data,
      rawEvent: event,
    };
  }

  async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    console.log(`[Polar] Webhook event: ${event.type}`);
  }

  async getCustomerByEmail(email: string): Promise<string | null> {
    // Polar customer lookup by email
    // This is a placeholder
    return null;
  }

  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<string> {
    // Polar customer creation
    // This is a placeholder
    throw new Error("Create customer not yet implemented for Polar");
  }

  private normalizeSubscription(subscription: any): NormalizedSubscription {
    return {
      id: subscription.id,
      customerId: subscription.userId,
      status: this.normalizeStatus(subscription.status),
      planId: subscription.productId,
      currentPeriodStart: subscription.currentPeriodStart
        ? new Date(subscription.currentPeriodStart)
        : undefined,
      currentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : undefined,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
    };
  }

  private normalizeStatus(status: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      canceled: "canceled",
      past_due: "past_due",
      trialing: "trialing",
      incomplete: "trialing",
      incomplete_expired: "canceled",
      unpaid: "past_due",
    };
    return (statusMap[status] as SubscriptionStatus) || "canceled";
  }
}
