# Architecture: Hybrid Modular System

This project uses a **hybrid architecture** combining:
1. **Modular Feature Packages** - Full-stack feature modules (backend + frontend)
2. **Shadcn Registry** - Installable UI components and blocks

This gives you the best of both worlds: backend modularity and frontend flexibility.

## Table of Contents

- [Overview](#overview)
- [Modular Feature Packages](#modular-feature-packages)
- [Shadcn Registry System](#shadcn-registry-system)
- [How They Work Together](#how-they-work-together)
- [When to Use Each](#when-to-use-each)
- [Examples](#examples)

## Overview

```
┌─────────────────────────────────────────────┐
│        Modular Feature Packages             │
│  (Backend Logic + Feature-Specific UI)      │
│                                             │
│  packages/features/                         │
│    ├── payments/                            │
│    │   ├── routers/      (tRPC routes)     │
│    │   ├── webhooks/     (Stripe/Polar)    │
│    │   ├── providers/    (Business logic)  │
│    │   └── ui/           (Feature UI)      │
│    │                                        │
│    └── integrations/                        │
│        ├── routers/      (tRPC routes)     │
│        ├── callbacks/    (OAuth)           │
│        └── ui/           (Feature UI)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Shadcn Registry System             │
│   (Installable UI Components & Blocks)      │
│                                             │
│  apps/nextjs/registry/                      │
│    ├── ui/                                  │
│    │   ├── button                           │
│    │   ├── input                            │
│    │   ├── checkout-button  (from features) │
│    │   └── connect-button   (from features) │
│    │                                        │
│    ├── blocks/                              │
│    │   ├── pricing-block    (uses checkout) │
│    │   ├── integrations-block               │
│    │   └── settings-billing-block           │
│    │                                        │
│    └── hooks/                               │
│        ├── use-subscription-status          │
│        └── use-integration-status           │
└─────────────────────────────────────────────┘
```

## Modular Feature Packages

### Purpose
Full-stack feature modules that can be **added or removed** from your application without affecting the core.

### Location
```
packages/features/
├── payments/
└── integrations/
```

### Structure
Each feature follows this pattern:

```
packages/features/{feature}/
├── src/
│   ├── types.ts              # Zod schemas + TypeScript types
│   ├── providers/            # Business logic abstraction
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers (payments)
│   ├── callbacks/            # OAuth callbacks (integrations)
│   ├── ui/                   # Feature-specific UI components
│   └── index.ts              # Exports + manifest
├── package.json
└── tsconfig.json
```

### How It Works

**1. Conditional Imports**

The main API router conditionally imports feature routers:

```typescript
// packages/api/src/root.ts
let subscriptionRouter: any;
try {
  subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
} catch {
  // Feature not installed - skip
}

export const appRouter = createTRPCRouter({
  // Only add if feature is installed
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
});
```

**2. Workspace References**

Features are referenced in `package.json`:

```json
{
  "dependencies": {
    "@tocld/features-payments": "workspace:*",
    "@tocld/features-integrations": "workspace:*"
  }
}
```

**3. Automatic Tree-Shaking**

Unused features are automatically removed during build, so there's zero bloat.

### Available Features

| Feature | Package | Contains |
|---------|---------|----------|
| **Payments** | `@tocld/features-payments` | Stripe/Polar integration, subscriptions, billing portal, webhooks |
| **Integrations** | `@tocld/features-integrations` | OAuth connections (Gmail, Slack, etc.), token management, sync |

### Adding/Removing Features

**✅ To Add:**
1. Feature is already scaffolded
2. Add environment variables to `.env`
3. Restart dev server

**❌ To Remove:**
1. Remove from `package.json` dependencies
2. Delete the feature directory
3. Restart dev server

## Shadcn Registry System

### Purpose
Installable UI components, hooks, and blocks that users can add via CLI.

### Location
```
apps/nextjs/
├── registry.json              # Component definitions
├── registry/
│   ├── registry-blocks.ts     # Block definitions
│   └── new-york/
│       ├── ui/                # UI components
│       ├── blocks/            # Page blocks
│       └── hooks/             # React hooks
└── public/r/                  # Built JSON files (served)
```

### How It Works

**1. Component Installation**

Users can install components from your registry:

```bash
# Install a single component
npx shadcn@latest add https://your-domain.com/r/checkout-button

# Install a block (page + components)
npx shadcn@latest add https://your-domain.com/r/blocks/pricing-block
```

**2. Registry Definition**

Components are defined in `registry.json`:

```json
{
  "name": "checkout-button",
  "type": "registry:ui",
  "files": [
    { "path": "registry/new-york/ui/checkout-button/checkout-button.ts" },
    { "path": "registry/new-york/ui/checkout-button/checkout-button.tsx" },
    { "path": "registry/new-york/ui/checkout-button/checkout-button.native.tsx" }
  ],
  "dependencies": ["class-variance-authority"],
  "categories": ["payment"]
}
```

**3. Building the Registry**

Build the registry to generate JSON files:

```bash
bun run registry:build
```

This creates `public/r/*.json` files that shadcn CLI reads.

### Available Registry Items

#### UI Components
- `button` - Universal button
- `input` - Universal input
- `primitives` - Cross-platform primitives
- `checkout-button` - Stripe/Polar checkout
- `subscription-card` - Subscription management
- `connect-button` - OAuth connect
- `integrations-list` - Full integrations UI

#### Blocks (Page Templates)
- `dashboard-01` - Simple dashboard
- `pricing-block` - Complete pricing page
- `integrations-block` - OAuth dashboard
- `settings-billing-block` - Billing settings

#### Hooks
- `use-network-status` - Online/offline detection
- `use-offline-query` - Offline-first queries
- `use-subscription-status` - Check subscription state
- `use-integration-status` - Check OAuth connections

### Categories
- `dashboard` - Dashboard components
- `payment` - Payment & billing
- `integration` - OAuth integrations
- `settings` - Settings pages
- `application` - General app UI
- `marketing` - Marketing pages
- `authentication` - Auth UI
- `forms` - Form components

## How They Work Together

### Example: Payment Flow

**1. Feature Package (Backend)**
```typescript
// packages/features/payments/src/routers/subscription.ts
export const subscriptionRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Create Stripe/Polar checkout session
      return { url: checkoutUrl, sessionId };
    }),
});
```

**2. Registry Component (Frontend)**
```typescript
// apps/nextjs/registry/new-york/ui/checkout-button/checkout-button.tsx
"use client";

export function CheckoutButton({ priceId }: Props) {
  const createCheckout = api.subscription.createCheckout.useMutation();

  const handleClick = async () => {
    const result = await createCheckout.mutateAsync({ priceId });
    window.location.href = result.url;
  };

  return <button onClick={handleClick}>Subscribe</button>;
}
```

**3. Registry Block (Complete Page)**
```typescript
// apps/nextjs/registry/new-york/blocks/pricing-block/page.tsx
import { CheckoutButton } from "@/components/ui/checkout-button";

export default function PricingPage() {
  return (
    <div>
      <h1>Pricing</h1>
      <CheckoutButton priceId="price_123" />
    </div>
  );
}
```

**4. User Installs Block**
```bash
npx shadcn@latest add https://your-domain.com/r/blocks/pricing-block
```

This installs:
- ✅ The pricing page
- ✅ The CheckoutButton component
- ✅ All dependencies

The feature package handles the backend automatically!

## When to Use Each

### Use Modular Feature Packages For:

✅ Features with backend logic (APIs, webhooks, database)
✅ Complete opt-in/out functionality
✅ Features requiring environment variables
✅ Business logic that shouldn't be in frontend
✅ Third-party integrations (Stripe, OAuth, etc.)

**Examples:**
- Payment processing
- OAuth integrations
- Email sending
- Analytics tracking
- Background jobs

### Use Shadcn Registry For:

✅ Pure UI components and patterns
✅ Cross-platform primitives (web + native)
✅ Hooks and utilities
✅ Composable UI blocks
✅ Components you want to share publicly

**Examples:**
- Button, Input, Dialog components
- useNetworkStatus, useOfflineQuery hooks
- Pricing page templates
- Dashboard layouts
- Form patterns

## Examples

### Example 1: Adding a New Payment Provider

**Step 1:** Add to feature package

```typescript
// packages/features/payments/src/providers/lemonsqueezy.ts
export class LemonSqueezyProvider extends BasePaymentProvider {
  async createCheckout(priceId: string) {
    // LemonSqueezy checkout logic
  }
}
```

**Step 2:** Update router to use new provider

```typescript
// packages/features/payments/src/routers/subscription.ts
const provider = process.env.PAYMENT_PROVIDER === 'lemonsqueezy'
  ? new LemonSqueezyProvider()
  : new StripeProvider();
```

**Step 3:** No changes needed to UI!

The `CheckoutButton` component in the registry continues to work because it just calls the tRPC endpoint.

### Example 2: Creating a Custom Dashboard Block

**Step 1:** Create block files

```typescript
// apps/nextjs/registry/new-york/blocks/analytics-dashboard/page.tsx
import { SubscriptionCard } from "@/components/ui/subscription-card";
import { IntegrationsList } from "@/components/ui/integrations-list";

export default function AnalyticsDashboard() {
  return (
    <div>
      <SubscriptionCard />
      <IntegrationsList />
      {/* Your custom analytics charts */}
    </div>
  );
}
```

**Step 2:** Register in `registry-blocks.ts`

```typescript
{
  name: "analytics-dashboard",
  type: "registry:block",
  registryDependencies: ["subscription-card", "integrations-list"],
  files: [{ path: "blocks/analytics-dashboard/page.tsx" }],
  categories: ["dashboard"],
}
```

**Step 3:** Rebuild registry

```bash
bun run registry:build
```

Users can now install your custom dashboard!

## Best Practices

### For Feature Packages

✅ **DO:**
- Keep features self-contained
- Use universal components (`.tsx` + `.native.tsx`)
- Include mock mode support
- Add comprehensive Zod schemas
- Handle errors gracefully

❌ **DON'T:**
- Import features directly in core packages
- Hardcode feature logic in core
- Skip environment validation
- Expose sensitive data in frontend

### For Registry Items

✅ **DO:**
- Follow shadcn conventions
- Include clear descriptions
- Document dependencies
- Test on both platforms (web + native)
- Use semantic versioning

❌ **DON'T:**
- Include environment secrets
- Hard-code API endpoints
- Skip accessibility
- Forget mobile responsiveness

## Deployment

### Feature Packages
- Automatically included in build if installed
- Environment variables required in production
- Webhooks need to be configured

### Registry
- Build with `bun run registry:build`
- Deploy `public/r/` directory
- Serve from your domain or CDN

## Further Reading

- [Modular Features README](/packages/features/README.md)
- [Registry Documentation](/apps/nextjs/REGISTRY.md)
- [shadcn Registry Docs](https://ui.shadcn.com/docs/registry)
- [Contributing Guide](/CONTRIBUTING.md)
