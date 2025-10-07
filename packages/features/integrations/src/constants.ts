import type { IntegrationProvider } from "./types";

/**
 * Integration provider metadata
 */
export const INTEGRATION_METADATA: Record<
  IntegrationProvider,
  {
    name: string;
    description: string;
    color: string;
    category: "email" | "storage" | "communication" | "development";
  }
> = {
  gmail: {
    name: "Gmail",
    description: "Connect your Gmail account to send and receive emails directly from your dashboard.",
    color: "red",
    category: "email",
  },
  outlook: {
    name: "Microsoft Outlook",
    description: "Integrate with Outlook for email and calendar management across your organization.",
    color: "blue",
    category: "email",
  },
  google_drive: {
    name: "Google Drive",
    description: "Access and manage your Google Drive files with seamless cloud storage integration.",
    color: "green",
    category: "storage",
  },
  dropbox: {
    name: "Dropbox",
    description: "Sync and share files with Dropbox integration for team collaboration.",
    color: "blue",
    category: "storage",
  },
  slack: {
    name: "Slack",
    description: "Connect your Slack workspace to receive notifications and updates in real-time.",
    color: "purple",
    category: "communication",
  },
  github: {
    name: "GitHub",
    description: "Link your GitHub repositories to track issues, pull requests, and deployments.",
    color: "gray",
    category: "development",
  },
};

/**
 * Get integration metadata
 */
export function getIntegrationMetadata(provider: IntegrationProvider) {
  return INTEGRATION_METADATA[provider];
}

/**
 * Get all integrations by category
 */
export function getIntegrationsByCategory(
  category: "email" | "storage" | "communication" | "development",
) {
  return Object.entries(INTEGRATION_METADATA)
    .filter(([, meta]) => meta.category === category)
    .map(([provider]) => provider as IntegrationProvider);
}
