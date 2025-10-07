/**
 * Feature Detection Utilities
 *
 * Detect which features are enabled based on:
 * 1. Environment variables
 * 2. Installed packages
 * 3. Feature configuration
 */

import { env } from "~/env";

export interface FeatureFlags {
  auth: boolean;
  database: boolean;
  payments: boolean;
  integrations: boolean;
}

/**
 * Check if payment features are enabled
 */
export function isPaymentsEnabled(): boolean {
  // Check if payment environment variables are set
  const hasStripe = !!(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  const hasPolar = !!process.env.POLAR_ACCESS_TOKEN;

  return hasStripe || hasPolar;
}

/**
 * Check if OAuth integration features are enabled
 */
export function isIntegrationsEnabled(): boolean {
  // Check if any OAuth provider is configured
  const hasGmail = !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET);

  const hasOutlook = !!(process.env.OUTLOOK_CLIENT_ID && process.env.OUTLOOK_CLIENT_SECRET);

  const hasSlack = !!(process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET);

  const hasGitHub = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

  return hasGmail || hasOutlook || hasSlack || hasGitHub;
}

/**
 * Check if database is configured
 */
export function isDatabaseEnabled(): boolean {
  return !!process.env.POSTGRES_URL;
}

/**
 * Check if auth is enabled
 */
export function isAuthEnabled(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Get all feature flags
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    auth: isAuthEnabled(),
    database: isDatabaseEnabled(),
    payments: isPaymentsEnabled(),
    integrations: isIntegrationsEnabled(),
  };
}

/**
 * Get current tier based on enabled features
 */
export function getCurrentTier(): "basic" | "standard" | "advanced" {
  const features = getFeatureFlags();

  if (features.payments && features.integrations) {
    return "advanced";
  }

  if (features.payments) {
    return "standard";
  }

  return "basic";
}

/**
 * Get tier display name
 */
export function getTierName(tier: "basic" | "standard" | "advanced"): string {
  const names = {
    basic: "Basic (Auth + DB)",
    standard: "Standard (+ Payments)",
    advanced: "Advanced (Everything)",
  };

  return names[tier];
}

/**
 * Check if a specific feature router is available
 * This is used by the tRPC router for conditional imports
 */
export function isFeatureRouterAvailable(featureName: string): boolean {
  try {
    if (featureName === "payments") {
      require.resolve("@tocld/features-payments/routers");
      return isPaymentsEnabled();
    }

    if (featureName === "integrations") {
      require.resolve("@tocld/features-integrations/routers");
      return isIntegrationsEnabled();
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Client-side feature flags (safe to use in browser)
 */
export const clientFeatures = {
  auth: typeof window !== "undefined",
  // Add more client-safe checks as needed
} as const;
