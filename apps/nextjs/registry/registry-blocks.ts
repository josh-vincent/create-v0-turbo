export interface BlockFile {
  path: string;
  type: "registry:page" | "registry:component" | "registry:hook" | "registry:lib" | "registry:ui";
  target?: string;
}

export interface Block {
  name: string;
  author: string;
  title: string;
  description: string;
  type: "registry:block";
  registryDependencies?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  files: BlockFile[];
  categories: string[];
}

export const blocks: Block[] = [
  {
    name: "dashboard-01",
    author: "@tocld/ui",
    title: "Dashboard",
    description: "A simple dashboard with task management components.",
    type: "registry:block",
    registryDependencies: ["button", "input"],
    dependencies: [],
    files: [
      {
        path: "blocks/dashboard-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/dashboard-01/components/task-list.tsx",
        type: "registry:component",
      },
    ],
    categories: ["dashboard"],
  },
  {
    name: "pricing-block",
    author: "@tocld/ui",
    title: "Pricing Page",
    description:
      "Complete pricing page with multiple tiers and checkout integration. Uses Stripe/Polar payments.",
    type: "registry:block",
    registryDependencies: ["checkout-button"],
    dependencies: ["lucide-react"],
    files: [
      {
        path: "blocks/pricing-block/page.tsx",
        type: "registry:page",
        target: "app/pricing/page.tsx",
      },
      {
        path: "blocks/pricing-block/components/pricing-card.tsx",
        type: "registry:component",
      },
    ],
    categories: ["payment", "marketing"],
  },
  {
    name: "integrations-block",
    author: "@tocld/ui",
    title: "Integrations Dashboard",
    description:
      "OAuth integrations management page. Connect and manage third-party services like Gmail, Slack, etc.",
    type: "registry:block",
    registryDependencies: ["integrations-list"],
    dependencies: ["lucide-react"],
    files: [
      {
        path: "blocks/integrations-block/page.tsx",
        type: "registry:page",
        target: "app/dashboard/integrations/page.tsx",
      },
    ],
    categories: ["integration", "dashboard"],
  },
  {
    name: "settings-billing-block",
    author: "@tocld/ui",
    title: "Billing Settings",
    description:
      "Complete billing management page with subscription details, payment methods, and invoice history.",
    type: "registry:block",
    registryDependencies: ["subscription-card"],
    dependencies: ["lucide-react"],
    files: [
      {
        path: "blocks/settings-billing-block/page.tsx",
        type: "registry:page",
        target: "app/dashboard/settings/billing/page.tsx",
      },
      {
        path: "blocks/settings-billing-block/components/payment-method-card.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/settings-billing-block/components/invoices-table.tsx",
        type: "registry:component",
      },
    ],
    categories: ["payment", "dashboard", "settings"],
  },
];
