import type { Database } from "@tocld/db/client";
import { PolarProvider } from "../providers/polar";
import type { WebhookEvent } from "../types";

/**
 * Handle Polar webhook events and sync to database
 */
export async function handlePolarWebhook(params: {
  payload: string;
  signature: string;
  db: Database;
  webhookSecret: string;
  secretKey: string;
}): Promise<{ success: boolean; message: string }> {
  const provider = new PolarProvider({
    provider: "polar",
    secretKey: params.secretKey,
    webhookSecret: params.webhookSecret,
  });

  try {
    const event = await provider.verifyWebhook(params.payload, params.signature);
    await handlePolarEvent(event, params.db);

    return { success: true, message: `Event ${event.type} processed` };
  } catch (error) {
    console.error("[Polar Webhook] Error:", error);
    throw error;
  }
}

async function handlePolarEvent(event: WebhookEvent, db: Database): Promise<void> {
  switch (event.type) {
    case "subscription.created":
    case "subscription.updated":
      console.log(`[Polar] Subscription event: ${event.type}`);
      // Implement Polar subscription sync logic
      break;

    case "subscription.canceled":
      console.log(`[Polar] Subscription canceled: ${event.type}`);
      // Implement Polar cancellation logic
      break;

    default:
      console.log(`[Polar] Unhandled event type: ${event.type}`);
  }
}
