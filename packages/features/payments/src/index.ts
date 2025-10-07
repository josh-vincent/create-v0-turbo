// Types
export * from "./types";

// Constants
export * from "./constants";

// Providers
export * from "./providers";

// Routers
export * from "./routers";

// Webhooks
export * from "./webhooks";

// Feature manifest
export const paymentsFeatureManifest = {
  name: "payments",
  version: "1.0.0",
  description: "Stripe and Polar payment integrations",
  enabled: true,
  requiredEnvVars: [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    // OR
    "POLAR_ACCESS_TOKEN",
    "POLAR_WEBHOOK_SECRET",
  ],
  webhooks: [
    { path: "/api/webhooks/stripe", provider: "stripe" },
    { path: "/api/webhooks/polar", provider: "polar" },
  ],
  routers: ["subscription"],
};
