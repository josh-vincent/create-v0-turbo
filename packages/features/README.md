# Modular Features

This directory contains **optional feature modules** that can be easily added or removed from your application.

## Available Features

### 🔒 Payments (`@tocld/features-payments`)

**What it does:**
- Stripe and Polar payment integration
- Subscription management with billing portal
- Webhook handlers for payment events
- Universal UI components (CheckoutButton, SubscriptionCard)

**Installation:**
```bash
# Feature is already scaffolded, just install dependencies
bun install

# Add to app router (already done in packages/api/src/root.ts)
```

**Environment variables:**
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OR Polar
POLAR_ACCESS_TOKEN=polar_...
POLAR_WEBHOOK_SECRET=...
```

**Usage:**
```tsx
import { CheckoutButton, SubscriptionCard } from "@tocld/features-payments/ui";

<CheckoutButton priceId="price_123" />
<SubscriptionCard />
```

**Webhooks:**
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/polar` - Polar webhook handler

**tRPC Routes:**
- `subscription.getCurrent` - Get current subscription
- `subscription.createCheckout` - Create checkout session
- `subscription.createBillingPortal` - Open billing portal
- `subscription.cancel` - Cancel subscription
- `subscription.resume` - Resume subscription

---

### 💼 Finance (`@tocld/features-finance`)

**What it does:**
- Invoice management (create, track, export)
- Expense tracking by category with receipt uploads
- Time tracking with billable/non-billable hours
- Comprehensive stats and reporting
- Universal UI components (InvoiceForm, ExpenseForm, TimeTracker)

**Installation:**
```bash
# Feature is already scaffolded, just install dependencies
bun install

# Add to app router (already done in packages/api/src/root.ts)
```

**Environment variables:**
```bash
# None required! Works in mock mode out of the box
```

**Usage:**
```tsx
import { InvoiceForm, ExpenseForm, TimeTracker } from "@tocld/features-finance/ui";

// Invoice management
<InvoiceForm
  onSubmit={(data) => createInvoice.mutate(data)}
  isLoading={createInvoice.isPending}
/>

// Expense tracking
<ExpenseForm
  onSubmit={(data) => createExpense.mutate(data)}
  isLoading={createExpense.isPending}
/>

// Time tracking
<TimeTracker
  onStart={(data) => startTimer.mutate(data)}
  onStop={(id) => stopTimer.mutate({ id })}
  runningTimer={runningTimer}
  isLoading={isLoading}
/>
```

**tRPC Routes:**
- `invoice.list` - List all invoices with filters
- `invoice.create` - Create new invoice
- `invoice.getStats` - Get invoice statistics (total, paid, outstanding)
- `invoice.delete` - Delete invoice
- `expense.list` - List all expenses with filters
- `expense.create` - Create new expense
- `expense.getStats` - Get expense stats by category
- `expense.delete` - Delete expense
- `time.list` - List time entries
- `time.start` - Start timer for project
- `time.stop` - Stop running timer
- `time.getRunning` - Get currently running timer
- `time.getStats` - Get time stats by project (billable/non-billable hours)
- `time.delete` - Delete time entry

**Database Schemas:**
- `invoices.ts` - Invoice records with line items
- `expenses.ts` - Expense tracking with categories
- `time-entries.ts` - Time entries with billable hours

**Example Pages:**
- `/dashboard/invoices` - Full invoice management UI
- `/dashboard/expenses` - Expense tracking dashboard
- `/dashboard/time` - Time tracking with stats

---

### 🔗 OAuth Integrations (`@tocld/features-integrations`)

**What it does:**
- Gmail, Outlook, and other OAuth integrations
- Connection management with token refresh
- Universal UI components for OAuth flows
- Offline-first sync with `@tocld/oauth-sync`

**Environment variables:**
```bash
# Gmail
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=...

# Outlook
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
OUTLOOK_TENANT_ID=...

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Usage:**
```tsx
import { ConnectButton, IntegrationsList } from "@tocld/features-integrations/ui";

<ConnectButton provider="gmail" />
<IntegrationsList />
```

**OAuth Callbacks:**
- `GET /api/auth/callback/gmail` - Gmail OAuth callback
- `GET /api/auth/callback/outlook` - Outlook OAuth callback

**tRPC Routes:**
- `integration.list` - List all integrations
- `integration.getAuthUrl` - Get OAuth authorization URL
- `integration.disconnect` - Disconnect integration
- `integration.refresh` - Refresh tokens

---

## Architecture

### Feature Module Structure

Each feature module follows this structure:

```
packages/features/{feature-name}/
├── src/
│   ├── types.ts              # Zod schemas and TypeScript types
│   ├── providers/            # Payment/OAuth provider abstractions
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers (for payments)
│   ├── callbacks/            # OAuth callbacks (for integrations)
│   ├── ui/                   # Universal React components
│   └── index.ts              # Feature manifest + exports
├── package.json
└── tsconfig.json
```

### Feature Manifest

Each feature exports a manifest describing its requirements:

```typescript
export const paymentsFeatureManifest = {
  name: "payments",
  version: "1.0.0",
  description: "Stripe and Polar payment integrations",
  enabled: true,
  requiredEnvVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  webhooks: [{ path: "/api/webhooks/stripe", provider: "stripe" }],
  routers: ["subscription"],
};
```

### How It Works

**1. Conditional Import**

The main tRPC router (`packages/api/src/root.ts`) conditionally imports feature routers:

```typescript
let subscriptionRouter: any;
try {
  subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
} catch {
  // Feature not installed
}

export const appRouter = createTRPCRouter({
  // Only add if feature is installed
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
});
```

**2. Module Resolution**

Features are referenced as workspace packages in `package.json`:

```json
{
  "dependencies": {
    "@tocld/features-payments": "workspace:*"
  }
}
```

**3. Tree Shaking**

Unused features are automatically tree-shaken during build, so there's no bloat.

---

## Adding/Removing Features

### ✅ Enable a Feature

1. **Install dependencies** (already done for scaffolded features):
   ```bash
   bun install
   ```

2. **Add environment variables** to `.env`:
   ```bash
   # See feature-specific docs above
   STRIPE_SECRET_KEY=...
   ```

3. **Restart dev server**:
   ```bash
   bun dev
   ```

That's it! The feature router will be automatically detected and added.

### ❌ Remove a Feature

1. **Remove from dependencies**:
   ```bash
   # Edit package.json and remove the feature package reference
   ```

2. **Remove feature directory**:
   ```bash
   rm -rf packages/features/{feature-name}
   ```

3. **Restart dev server**:
   ```bash
   bun dev
   ```

The feature will be tree-shaken and no longer bundled.

---

## Creating New Features

### Using the Generator (Coming Soon)

```bash
bun run turbo gen feature
```

### Manual Setup

1. **Create feature directory**:
   ```bash
   mkdir -p packages/features/my-feature/src/{providers,routers,ui}
   ```

2. **Add package.json**:
   ```json
   {
     "name": "@tocld/features-my-feature",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "exports": {
       ".": "./src/index.ts",
       "./routers/*": "./src/routers/*.ts",
       "./ui": "./src/ui/index.ts"
     },
     "dependencies": {
       "@tocld/api": "workspace:*",
       "@tocld/db": "workspace:*"
     }
   }
   ```

3. **Create tRPC router** in `src/routers/my-router.ts`:
   ```typescript
   import { createTRPCRouter, protectedProcedure } from "@tocld/api/trpc";

   export const myRouter = createTRPCRouter({
     hello: protectedProcedure.query(() => "Hello from my feature!"),
   });
   ```

4. **Export from index.ts**:
   ```typescript
   export * from "./routers";
   export const myFeatureManifest = { name: "my-feature", ... };
   ```

5. **Add to app router** (optional import in `packages/api/src/root.ts`):
   ```typescript
   let myRouter: any;
   try {
     myRouter = require("@tocld/features-my-feature/routers").myRouter;
   } catch {}

   export const appRouter = createTRPCRouter({
     ...(myRouter ? { myFeature: myRouter } : {}),
   });
   ```

---

## Best Practices

### ✅ DO

- Keep features **self-contained** with minimal dependencies
- Use **universal components** (`.tsx` + `.native.tsx`) for UI
- Include **mock mode** support in routers
- Add **comprehensive types** with Zod schemas
- Document **environment variables** in manifest
- Handle **errors gracefully** with try/catch

### ❌ DON'T

- Don't import features directly in core packages
- Don't hardcode feature-specific logic in core
- Don't skip environment variable validation
- Don't forget webhook signature verification
- Don't expose sensitive data in frontend

---

## Feature Status

| Feature | Status | Version | Router | UI | Webhooks |
|---------|--------|---------|--------|----|----|
| **Payments** | ✅ Complete | 1.0.0 | `subscription.*` | ✅ | ✅ |
| **Integrations** | ✅ Complete | 1.0.0 | `integration.*` | ✅ | ✅ |
| **Finance** | ✅ Complete | 1.0.0 | `invoice.*`, `expense.*`, `time.*` | ✅ | - |
| Email | 🚧 Planned | - | - | - | - |
| Analytics | 🚧 Planned | - | - | - | - |
| Notifications | 🚧 Planned | - | - | - | - |

---

## Support

For questions or issues:
- Check the main [README.md](../../README.md)
- Open an issue on GitHub
- Review example implementations in `apps/nextjs/src/app`

---

## License

MIT - See [LICENSE](../../LICENSE) for details.
