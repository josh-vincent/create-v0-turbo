import { z } from "zod";

/**
 * Integration provider types
 */
export const integrationProviderSchema = z.enum([
  "gmail",
  "outlook",
  "google_drive",
  "dropbox",
  "slack",
  "github",
]);
export type IntegrationProvider = z.infer<typeof integrationProviderSchema>;

export const integrationStatusSchema = z.enum(["connected", "disconnected", "error", "expired"]);
export type IntegrationStatus = z.infer<typeof integrationStatusSchema>;

/**
 * OAuth callback data
 */
export interface OAuthCallbackData {
  code: string;
  state: string;
  error?: string;
  errorDescription?: string;
}

/**
 * Integration connection request
 */
export interface IntegrationConnectionRequest {
  provider: IntegrationProvider;
  teamId: string;
  scopes?: string[];
}

/**
 * Integration info (for UI display)
 */
export interface IntegrationInfo {
  id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  connectedAt: Date;
  lastSyncedAt?: Date;
  accountEmail?: string;
  accountName?: string;
}
