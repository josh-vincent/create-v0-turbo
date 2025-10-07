import type { OAuthTokens } from "../types";
import { BaseOAuthProvider } from "./base";

/**
 * Gmail OAuth provider
 */
export class GmailProvider extends BaseOAuthProvider {
  private readonly AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
  private readonly TOKEN_URL = "https://oauth2.googleapis.com/token";
  private readonly REVOKE_URL = "https://oauth2.googleapis.com/revoke";

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      state,
      access_type: "offline",
      prompt: "consent",
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Keep the same refresh token
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
    };
  }

  async revokeAccess(accessToken: string): Promise<void> {
    await fetch(`${this.REVOKE_URL}?token=${accessToken}`, {
      method: "POST",
    });
  }
}
