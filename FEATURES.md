# Modular Features System - Quick Start

This guide explains how to use the new **modular features system** to add or remove functionality like payments (Stripe/Polar) and OAuth integrations.

## 🎯 Philosophy

Instead of a monolithic codebase where everything is tightly coupled, this template uses **optional feature modules** that:

- ✅ Can be **added/removed** without breaking the app
- ✅ Are **self-contained** with their own types, routers, UI, and logic
- ✅ **Auto-register** with the main app (no manual wiring)
- ✅ Work with **mock mode** for development without external services
- ✅ Are **tree-shaken** when not used (no bundle bloat)

## 📦 Available Features

| Feature | Package | Status | What it does |
|---------|---------|--------|--------------|
| **Payments** | `@tocld/features-payments` | ✅ Ready | Stripe/Polar subscriptions, webhooks, billing portal |
| **Integrations** | `@tocld/features-integrations` | ✅ Ready | Gmail/Outlook OAuth, token management, sync |
| **Finance** | `@tocld/features-finance` | ✅ Ready | Invoices, expenses, time tracking with stats and reporting |
| **Voice Chat** | Built-in (ElevenLabs) | ✅ Ready | Conversational AI with voice and text, real-time streaming |

## 🚀 Quick Start

### 📍 Example Pages

We've included **fully functional example pages** in the Next.js app:

- **`/pricing`** - Pricing page with checkout buttons
- **`/dashboard/billing`** - Subscription management and billing portal
- **`/dashboard/integrations`** - OAuth integrations dashboard
- **`/dashboard/invoices`** - Invoice management with create, list, and stats
- **`/dashboard/expenses`** - Expense tracking by category with receipt uploads
- **`/dashboard/time`** - Time tracking with billable hours and project stats
- **`/dashboard/voice-chat`** - AI voice chat with ElevenLabs conversational AI

Visit these pages after starting the dev server to see the features in action!

### Using Payments (Stripe/Polar)

**1. Add environment variables:**

```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**2. Use in your app:**

```tsx
// apps/nextjs/src/app/pricing/page.tsx
import { CheckoutButton } from "@tocld/features-payments/ui";

export default function PricingPage() {
  return (
    <CheckoutButton
      priceId="price_1234"
      successUrl="/dashboard?success=true"
    >
      Subscribe Now
    </CheckoutButton>
  );
}
```

**3. Display subscription status:**

```tsx
// apps/nextjs/src/app/dashboard/page.tsx
import { SubscriptionCard } from "@tocld/features-payments/ui";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <SubscriptionCard />
    </div>
  );
}
```

**4. Test webhooks locally:**

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...

# Trigger test events
stripe trigger payment_intent.succeeded
```

---

### Using OAuth Integrations (Gmail/Outlook)

**1. Add environment variables:**

```bash
# .env
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**2. Create integrations page:**

```tsx
// apps/nextjs/src/app/dashboard/integrations/page.tsx
import { IntegrationsList } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div>
      <h1>Integrations</h1>
      <IntegrationsList />
    </div>
  );
}
```

**3. Or use individual components:**

```tsx
import { ConnectButton, IntegrationCard } from "@tocld/features-integrations/ui";

<ConnectButton provider="gmail" />
<ConnectButton provider="outlook" />
```

---

### Using Finance Module (Invoices, Expenses, Time Tracking)

**1. No environment variables needed!** Works in mock mode out of the box.

**2. Invoice Management:**

```tsx
// apps/nextjs/src/app/dashboard/invoices/page.tsx
import { InvoiceForm } from "@tocld/features-finance/ui";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function InvoicesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: invoices } = useQuery(trpc.invoice.list.queryOptions({}));
  const { data: stats } = useQuery(trpc.invoice.getStats.queryOptions());

  const createMutation = useMutation(trpc.invoice.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  }));

  return (
    <div>
      <h1>Invoices</h1>
      <InvoiceForm onSubmit={(data) => createMutation.mutate(data)} />
      {/* Display invoices list and stats */}
    </div>
  );
}
```

**3. Expense Tracking:**

```tsx
import { ExpenseForm } from "@tocld/features-finance/ui";

<ExpenseForm
  onSubmit={(data) => createExpense.mutate(data)}
  isLoading={createExpense.isPending}
/>
```

**4. Time Tracking:**

```tsx
import { TimeTracker } from "@tocld/features-finance/ui";

<TimeTracker
  onStart={(data) => startTimer.mutate(data)}
  onStop={(id) => stopTimer.mutate({ id })}
  runningTimer={runningTimer}
  isLoading={isLoading}
/>
```

**tRPC Routes:**
- `invoice.list` - List all invoices
- `invoice.create` - Create new invoice
- `invoice.getStats` - Get invoice statistics
- `invoice.delete` - Delete invoice
- `expense.list` - List all expenses
- `expense.create` - Create new expense
- `expense.getStats` - Get expense stats by category
- `expense.delete` - Delete expense
- `time.list` - List time entries
- `time.start` - Start timer
- `time.stop` - Stop timer
- `time.getRunning` - Get currently running timer
- `time.getStats` - Get time stats by project
- `time.delete` - Delete time entry

---

### Using Voice Chat (ElevenLabs)

**1. Add environment variable (optional for production):**

```bash
# .env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

**2. Works without credentials!** Shows setup banner in demo mode.

**3. Use in your app:**

```tsx
// apps/nextjs/src/app/dashboard/voice-chat/page.tsx
import { Conversation, ConversationContent, ConversationBar } from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message, MessageContent } from "@tocld/ui/message";

export default function VoiceChatPage() {
  const [messages, setMessages] = useState([]);

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((msg) => (
          <Message from={msg.role}>
            <MessageContent>{msg.content}</MessageContent>
          </Message>
        ))}
      </ConversationContent>

      <ConversationBar
        agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "demo-mode"}
        onMessage={(message) => setMessages(prev => [...prev, message])}
      />
    </Conversation>
  );
}
```

**4. Graceful degradation pattern:**

```tsx
const [showSetupBanner, setShowSetupBanner] = useState(!AGENT_ID);

{showSetupBanner && (
  <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
    <CardContent>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3>🔶 ElevenLabs Agent Not Configured</h3>
          <p>Voice chat requires an ElevenLabs Conversational AI agent.</p>
          <details>
            <summary>Setup Instructions</summary>
            {/* Setup steps */}
          </details>
        </div>
        <button onClick={() => setShowSetupBanner(false)}>×</button>
      </div>
    </CardContent>
  </Card>
)}
```

**Setup ElevenLabs:**
1. Create account at [elevenlabs.io](https://elevenlabs.io)
2. Create a Conversational AI agent
3. Copy your agent ID
4. Add to `.env.local`: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id`
5. Restart dev server

---

## 🔧 How It Works

### 1. Feature Auto-Detection

The main tRPC router (`packages/api/src/root.ts`) automatically detects installed features:

```typescript
// Try to import feature router
let subscriptionRouter: any;
try {
  subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
} catch {
  // Feature not installed - skip
}

// Only add if available
export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
});
```

### 2. Conditional Imports

Your app code can safely import feature modules:

```typescript
import { CheckoutButton } from "@tocld/features-payments/ui";
```

If the feature is removed, the import will fail at build time (not runtime), giving you a clear error.

### 3. Mock Mode Support

All feature routers support mock mode:

```typescript
export const subscriptionRouter = {
  getCurrent: protectedProcedure.query(({ ctx }) => {
    // Mock mode
    if (ctx.isMockMode) {
      return { id: "sub_mock", status: "active", ... };
    }

    // Real implementation
    return ctx.db.query.subscriptions.findFirst(...);
  }),
};
```

This means you can develop without Stripe/Gmail credentials!

---

## ❌ Removing Features

To remove a feature module:

1. **Delete the feature directory:**
   ```bash
   rm -rf packages/features/payments
   ```

2. **Remove imports** from your app code (optional - build will fail if you miss any)

3. **Restart dev server:**
   ```bash
   bun dev
   ```

The feature router will no longer be registered, and your bundle size will be reduced.

---

## ➕ Adding New Features

### Using the Existing Pattern

Create a new feature by copying the structure of an existing one:

```bash
# Copy payments as a template
cp -r packages/features/payments packages/features/my-feature

# Update package.json
sed -i '' 's/features-payments/features-my-feature/g' packages/features/my-feature/package.json
```

### Feature Structure

```
packages/features/my-feature/
├── src/
│   ├── types.ts              # Zod schemas and types
│   ├── providers/            # External service abstractions
│   │   ├── base.ts
│   │   └── provider-impl.ts
│   ├── routers/              # tRPC routers
│   │   └── my-router.ts
│   ├── webhooks/             # Webhook handlers (if needed)
│   │   └── webhook-handler.ts
│   ├── ui/                   # Universal React components
│   │   ├── component.ts      # Shared logic
│   │   ├── component.tsx     # Web implementation
│   │   └── component.native.tsx  # Native implementation
│   └── index.ts              # Exports + manifest
├── package.json
└── tsconfig.json
```

### Feature Manifest

Every feature exports a manifest:

```typescript
// packages/features/my-feature/src/index.ts
export const myFeatureManifest = {
  name: "my-feature",
  version: "1.0.0",
  description: "What this feature does",
  enabled: true,
  requiredEnvVars: ["MY_API_KEY"],
  webhooks: [{ path: "/api/webhooks/my-service", provider: "my-service" }],
  routers: ["myRouter"],
};
```

---

## 🧪 Testing Features

### Unit Tests

```typescript
// packages/features/payments/src/providers/stripe.test.ts
import { StripeProvider } from "./stripe";

test("creates checkout session", async () => {
  const provider = new StripeProvider({ ... });
  const session = await provider.createCheckoutSession({ ... });
  expect(session.url).toContain("checkout.stripe.com");
});
```

### Integration Tests

```typescript
// apps/nextjs/src/app/api/webhooks/stripe/route.test.ts
import { POST } from "./route";

test("handles subscription created webhook", async () => {
  const response = await POST(new Request(...));
  expect(response.status).toBe(200);
});
```

---

## 📚 Examples

### Example 1: Pricing Page with Stripe

```tsx
// apps/nextjs/src/app/pricing/page.tsx
import { CheckoutButton } from "@tocld/features-payments/ui";

const plans = [
  { name: "Starter", priceId: "price_starter", price: "$9/mo" },
  { name: "Pro", priceId: "price_pro", price: "$29/mo" },
  { name: "Enterprise", priceId: "price_enterprise", price: "$99/mo" },
];

export default function PricingPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div key={plan.priceId} className="border rounded-lg p-6">
          <h3>{plan.name}</h3>
          <p>{plan.price}</p>
          <CheckoutButton priceId={plan.priceId} />
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Account Settings with Subscription Management

```tsx
// apps/nextjs/src/app/settings/billing/page.tsx
import { SubscriptionCard } from "@tocld/features-payments/ui";

export default function BillingSettings() {
  return (
    <div>
      <h1>Billing Settings</h1>
      <SubscriptionCard />
    </div>
  );
}
```

### Example 3: OAuth Integrations Dashboard

```tsx
// apps/nextjs/src/app/dashboard/integrations/page.tsx
import { IntegrationsList } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div>
      <h1>Connected Apps</h1>
      <p>Manage your connected email and calendar accounts.</p>
      <IntegrationsList />
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ **DO** use environment variables for secrets
- ✅ **DO** validate env vars on server startup
- ❌ **DON'T** expose secrets to the client

### Webhook Verification

```typescript
// Always verify webhook signatures
const event = await provider.verifyWebhook(payload, signature);
```

### OAuth State Validation

```typescript
// Always validate OAuth state parameter
if (state !== expectedState) {
  throw new Error("Invalid state");
}
```

---

## 🐛 Troubleshooting

### "Cannot find module '@tocld/features-payments'"

**Solution:** Run `bun install` to install the feature package.

### "Payment provider not configured"

**Solution:** Add required environment variables to `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook signature verification fails

**Solution:** Make sure you're using the correct webhook secret:
```bash
# For local testing with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret it outputs
STRIPE_WEBHOOK_SECRET=whsec_...
```

### OAuth callback fails with "Invalid redirect URI"

**Solution:** Add the callback URL to your OAuth app settings:
```
http://localhost:3000/api/auth/callback/gmail
```

---

## 📖 Learn More

- [Full Features Documentation](./packages/features/README.md)
- [Payments Feature](./packages/features/payments/)
- [Integrations Feature](./packages/features/integrations/)
- [Main README](./README.md)

---

## 🤝 Contributing

Want to add a new feature module?

1. Follow the structure in `packages/features/payments`
2. Include types, routers, webhooks/callbacks, and UI
3. Add comprehensive docs
4. Submit a PR!

---

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.
