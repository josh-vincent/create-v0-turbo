import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { teams } from "./teams";

export const integrationProviderEnum = pgEnum("integration_provider", [
  "gmail",
  "outlook",
  "google_drive",
  "dropbox",
  "slack",
  "github",
]);

export const integrationStatusEnum = pgEnum("integration_status", [
  "connected",
  "disconnected",
  "error",
  "expired",
]);

/**
 * OAuth integrations table
 * Stores OAuth tokens and connection status
 */
export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),

  provider: integrationProviderEnum("provider").notNull(),
  status: integrationStatusEnum("status").notNull().default("connected"),

  // OAuth tokens (encrypted in production)
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),

  // Provider-specific data
  providerAccountId: text("provider_account_id"),
  providerAccountEmail: text("provider_account_email"),
  scopes: text("scopes"), // JSON array of scopes

  // Sync metadata
  lastSyncedAt: timestamp("last_synced_at"),
  syncEnabled: boolean("sync_enabled").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
