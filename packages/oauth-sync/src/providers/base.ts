import type { OAuthProviderConfig, OAuthTokens } from "../types";

/**
 * Base class for OAuth providers
 */
export abstract class BaseOAuthProvider {
  protected config: OAuthProviderConfig;

  constructor(config: OAuthProviderConfig) {
    this.config = config;
  }

  /**
   * Get authorization URL for OAuth flow
   */
  abstract getAuthUrl(state: string): string;

  /**
   * Exchange authorization code for tokens
   */
  abstract exchangeCodeForTokens(code: string): Promise<OAuthTokens>;

  /**
   * Refresh access token using refresh token
   */
  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;

  /**
   * Revoke access (disconnect)
   */
  abstract revokeAccess(accessToken: string): Promise<void>;

  /**
   * Check if tokens are expired
   */
  isTokenExpired(expiresAt?: Date): boolean {
    if (!expiresAt) return false;
    return new Date() >= expiresAt;
  }
}
