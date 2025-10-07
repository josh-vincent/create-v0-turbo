import { db } from "@tocld/db/client";
import { handleStripeWebhook } from "@tocld/features-payments/webhooks";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Stripe webhook handler
 * POST /api/webhooks/stripe
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!webhookSecret || !secretKey) {
      console.error("[Stripe Webhook] Missing environment variables");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const result = await handleStripeWebhook({
      payload: body,
      signature,
      db,
      webhookSecret,
      secretKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
