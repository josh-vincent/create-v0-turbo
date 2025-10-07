import { db } from "@tocld/db/client";
import { handleOAuthCallback } from "@tocld/features-integrations/callbacks";
import { createClient } from "@tocld/supabase/server";
import { NextResponse } from "next/server";

/**
 * Gmail OAuth callback handler
 * GET /api/auth/callback/gmail?code=...&state=...
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Get current user
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard/integrations?error=missing_code", req.url));
  }

  try {
    const result = await handleOAuthCallback({
      provider: "gmail",
      data: {
        code,
        state,
        error: error || undefined,
        errorDescription: errorDescription || undefined,
      },
      db,
      userId: session.user.id,
      teamId: session.user.id, // Using user ID as team ID for now
    });

    if (result.success) {
      return NextResponse.redirect(new URL("/dashboard/integrations?success=true", req.url));
    }

    return NextResponse.redirect(
      new URL(
        `/dashboard/integrations?error=${encodeURIComponent(result.error || "unknown")}`,
        req.url,
      ),
    );
  } catch (error) {
    console.error("[Gmail Callback] Error:", error);
    return NextResponse.redirect(new URL("/dashboard/integrations?error=callback_failed", req.url));
  }
}
