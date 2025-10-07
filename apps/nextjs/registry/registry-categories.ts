export interface RegistryCategory {
  name: string;
  slug: string;
  hidden?: boolean;
}

export const registryCategories: RegistryCategory[] = [
  {
    name: "Dashboard",
    slug: "dashboard",
    hidden: false,
  },
  {
    name: "Application",
    slug: "application",
    hidden: false,
  },
  {
    name: "Marketing",
    slug: "marketing",
    hidden: false,
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    hidden: false,
  },
  {
    name: "Authentication",
    slug: "authentication",
    hidden: false,
  },
  {
    name: "Forms",
    slug: "forms",
    hidden: false,
  },
  {
    name: "Payment",
    slug: "payment",
    hidden: false,
  },
  {
    name: "Integration",
    slug: "integration",
    hidden: false,
  },
  {
    name: "Settings",
    slug: "settings",
    hidden: false,
  },
];
