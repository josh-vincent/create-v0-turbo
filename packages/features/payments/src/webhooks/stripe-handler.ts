import { eq } from "@tocld/db";
import type { Database } from "@tocld/db/client";
import { subscriptions } from "@tocld/db/schema";
import { StripeProvider } from "../providers/stripe";
import type { WebhookEvent } from "../types";

/**
 * Handle Stripe webhook events and sync to database
 */
export async function handleStripeWebhook(params: {
  payload: string;
  signature: string;
  db: Database;
  webhookSecret: string;
  secretKey: string;
}): Promise<{ success: boolean; message: string }> {
  const provider = new StripeProvider({
    provider: "stripe",
    secretKey: params.secretKey,
    webhookSecret: params.webhookSecret,
  });

  try {
    const event = await provider.verifyWebhook(params.payload, params.signature);
    await handleStripeEvent(event, params.db);

    return { success: true, message: `Event ${event.type} processed` };
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    throw error;
  }
}

async function handleStripeEvent(event: WebhookEvent, db: Database): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event, db);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event, db);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event, db);
      break;

    case "invoice.payment_succeeded":
      await handlePaymentSucceeded(event, db);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(event, db);
      break;

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutCompleted(event: WebhookEvent, db: Database): Promise<void> {
  const session = event.data as any;
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const userId = session.metadata?.userId;

  if (!userId || !customerId || !subscriptionId) {
    console.error("[Stripe] Missing required data in checkout.session.completed");
    return;
  }

  // Create subscription record
  await db.insert(subscriptions).values({
    teamId: userId,
    provider: "stripe",
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    status: "active",
  });

  console.log(`[Stripe] Created subscription for user ${userId}`);
}

async function handleSubscriptionUpdated(event: WebhookEvent, db: Database): Promise<void> {
  const subscription = event.data as any;

  const existing = await db.query.subscriptions.findFirst({
    where: (subs, { eq }) => eq(subs.stripeSubscriptionId, subscription.id),
  });

  if (!existing) {
    console.error(`[Stripe] Subscription ${subscription.id} not found in database`);
    return;
  }

  // Update subscription
  await db
    .update(subscriptions)
    .set({
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, existing.id));

  console.log(`[Stripe] Updated subscription ${subscription.id}`);
}

async function handleSubscriptionDeleted(event: WebhookEvent, db: Database): Promise<void> {
  const subscription = event.data as any;

  const existing = await db.query.subscriptions.findFirst({
    where: (subs, { eq }) => eq(subs.stripeSubscriptionId, subscription.id),
  });

  if (!existing) {
    console.error(`[Stripe] Subscription ${subscription.id} not found in database`);
    return;
  }

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, existing.id));

  console.log(`[Stripe] Cancelled subscription ${subscription.id}`);
}

async function handlePaymentSucceeded(event: WebhookEvent, db: Database): Promise<void> {
  const invoice = event.data as any;
  console.log(`[Stripe] Payment succeeded for invoice ${invoice.id}`);
  // Add any additional logic (e.g., send receipt email)
}

async function handlePaymentFailed(event: WebhookEvent, db: Database): Promise<void> {
  const invoice = event.data as any;
  console.log(`[Stripe] Payment failed for invoice ${invoice.id}`);

  // Update subscription to past_due
  const subscription = await db.query.subscriptions.findFirst({
    where: (subs, { eq }) => eq(subs.stripeSubscriptionId, invoice.subscription),
  });

  if (subscription) {
    await db
      .update(subscriptions)
      .set({
        status: "past_due",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));
  }
}
