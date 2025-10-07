// Types
export * from "./types";

// Constants
export * from "./constants";

// Routers
export * from "./routers";

// Callbacks
export * from "./callbacks";

// Feature manifest
export const integrationsFeatureManifest = {
  name: "integrations",
  version: "1.0.0",
  description: "OAuth integrations (Gmail, Outlook, etc.)",
  enabled: true,
  requiredEnvVars: [
    "GMAIL_CLIENT_ID",
    "GMAIL_CLIENT_SECRET",
    // OR
    "OUTLOOK_CLIENT_ID",
    "OUTLOOK_CLIENT_SECRET",
  ],
  callbacks: [
    { path: "/api/auth/callback/gmail", provider: "gmail" },
    { path: "/api/auth/callback/outlook", provider: "outlook" },
  ],
  routers: ["integration"],
};
