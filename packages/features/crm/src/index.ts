/**
 * CRM Feature Module
 * Customer Relationship Management with searchable customer database
 */

export const crmFeatureManifest = {
  name: "crm",
  version: "1.0.0",
  description: "Customer Relationship Management with contacts, notes, and activities",
  enabled: true,
  routers: ["customer", "customerNote", "customerActivity"],
  features: [
    {
      id: "customers",
      name: "Customer Management",
      description: "Manage customer contacts and information",
      tier: "free" as const,
    },
    {
      id: "customer-search",
      name: "Customer Search",
      description: "Advanced customer search and filtering",
      tier: "free" as const,
    },
    {
      id: "customer-notes",
      name: "Customer Notes",
      description: "Add notes and comments to customer records",
      tier: "free" as const,
    },
    {
      id: "customer-activities",
      name: "Customer Activities",
      description: "Track calls, emails, meetings, and tasks",
      tier: "pro" as const,
    },
  ],
  dependencies: ["@tocld/db", "@tocld/validators"],
  optionalDependencies: [],
};

export * from "./types";
