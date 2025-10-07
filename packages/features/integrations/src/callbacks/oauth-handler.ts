import type { Database } from "@tocld/db/client";
import { integrations } from "@tocld/db/schema";
import { GmailProvider, type OAuthProvider, OutlookProvider } from "@tocld/oauth-sync";
import type { IntegrationProvider, OAuthCallbackData } from "../types";

/**
 * Handle OAuth callback and store integration
 */
export async function handleOAuthCallback(params: {
  provider: IntegrationProvider;
  data: OAuthCallbackData;
  db: Database;
  userId: string;
  teamId: string;
}): Promise<{ success: boolean; integrationId?: string; error?: string }> {
  const { provider, data, db, userId, teamId } = params;

  // Check for OAuth errors
  if (data.error) {
    return {
      success: false,
      error: data.errorDescription || data.error,
    };
  }

  try {
    // Get OAuth provider instance
    const oauthProvider = getOAuthProvider(provider);
    if (!oauthProvider) {
      return { success: false, error: "Provider not configured" };
    }

    // Exchange code for tokens
    const tokens = await oauthProvider.exchangeCodeForTokens(data.code);

    // Store integration in database
    const [integration] = await db
      .insert(integrations)
      .values({
        teamId,
        profileId: userId,
        provider,
        status: "connected",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        syncEnabled: true,
      })
      .returning();

    return {
      success: true,
      integrationId: integration!.id,
    };
  } catch (error) {
    console.error(`[OAuth] Error handling ${provider} callback:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get OAuth provider instance based on integration provider
 */
function getOAuthProvider(provider: IntegrationProvider): OAuthProvider | null {
  switch (provider) {
    case "gmail": {
      const clientId = process.env.GMAIL_CLIENT_ID;
      const clientSecret = process.env.GMAIL_CLIENT_SECRET;
      if (!clientId || !clientSecret) return null;

      return new GmailProvider({
        clientId,
        clientSecret,
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/gmail`,
        scopes: [
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.send",
        ],
      });
    }

    case "outlook": {
      const clientId = process.env.OUTLOOK_CLIENT_ID;
      const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
      if (!clientId || !clientSecret) return null;

      return new OutlookProvider({
        clientId,
        clientSecret,
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/outlook`,
        scopes: ["Mail.Read", "Mail.Send"],
        tenantId: process.env.OUTLOOK_TENANT_ID,
      });
    }

    default:
      return null;
  }
}
