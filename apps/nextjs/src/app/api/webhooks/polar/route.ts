import { db } from "@tocld/db/client";
import { handlePolarWebhook } from "@tocld/features-payments/webhooks";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Polar webhook handler
 * POST /api/webhooks/polar
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("polar-signature") || "";

    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    const secretKey = process.env.POLAR_ACCESS_TOKEN;

    if (!webhookSecret || !secretKey) {
      console.error("[Polar Webhook] Missing environment variables");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const result = await handlePolarWebhook({
      payload: body,
      signature,
      db,
      webhookSecret,
      secretKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Polar Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
