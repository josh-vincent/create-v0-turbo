# Application Tiers

This project supports **three tiers** of functionality based on which features you enable. You can easily switch between tiers by copying the appropriate `.env` file.

## Quick Start

```bash
# Basic Tier (Auth + DB only)
cp .env.basic .env

# Standard Tier (+ Payments)
cp .env.standard .env

# Advanced Tier (Everything)
cp .env.advanced .env

# Then restart your dev server
bun dev
```

## Tier Overview

| Tier | Auth | Database | Payments | Integrations | Use Case |
|------|------|----------|----------|--------------|----------|
| **Basic** | ✅ | ✅ | ❌ | ❌ | MVP, prototypes, simple apps |
| **Standard** | ✅ | ✅ | ✅ | ❌ | SaaS products with subscriptions |
| **Advanced** | ✅ | ✅ | ✅ | ✅ | Full-featured platforms |

---

## 1. Basic Tier

**What's Included:**
- Supabase Authentication (email/password, OAuth, magic links)
- PostgreSQL Database via Supabase
- Core task management features
- Universal UI components (web + mobile)

**What's NOT Included:**
- Payment processing (Stripe/Polar)
- OAuth integrations (Gmail, Slack, etc.)
- Subscription management
- Billing portal

**Setup:**

```bash
# 1. Copy the basic env file
cp .env.basic .env

# 2. Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# 3. Start dev server
bun dev
```

**Dashboard Features:**
- Tasks management ✅
- Integrations (grayed out) 🔒
- Billing (grayed out) 🔒

**Perfect for:**
- Getting started quickly
- Building MVPs
- Simple CRUD applications
- Internal tools
- Prototypes

---

## 2. Standard Tier

**What's Included:**
- Everything in Basic tier
- Payment processing (Stripe OR Polar)
- Subscription management
- Billing portal
- Webhook handlers
- Customer portal

**What's NOT Included:**
- OAuth integrations (Gmail, Slack, etc.)

**Setup:**

```bash
# 1. Copy the standard env file
cp .env.standard .env

# 2. Add Supabase credentials (same as Basic)
# ...

# 3. Add payment provider credentials
# Choose ONE: Stripe OR Polar

# Option A: Stripe (recommended)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_PROVIDER=stripe

# Option B: Polar (alternative)
POLAR_ACCESS_TOKEN=polar_...
POLAR_WEBHOOK_SECRET=...
PAYMENT_PROVIDER=polar

# 4. Start dev server
bun dev
```

**Dashboard Features:**
- Tasks management ✅
- Billing & subscriptions ✅
- Integrations (grayed out) 🔒

**Available Pages:**
- `/pricing` - Pricing page with checkout
- `/dashboard/settings/billing` - Subscription management
- Webhook endpoints for payment events

**Perfect for:**
- SaaS applications
- Subscription-based products
- Membership sites
- Paid APIs
- Freemium models

---

## 3. Advanced Tier

**What's Included:**
- Everything in Standard tier
- OAuth integrations (Gmail, Outlook, Slack, GitHub, etc.)
- Token refresh & management
- Integration sync system
- Multi-provider support

**Setup:**

```bash
# 1. Copy the advanced env file
cp .env.advanced .env

# 2. Add Supabase credentials (same as Basic)
# ...

# 3. Add payment provider (same as Standard)
# ...

# 4. Add OAuth providers (enable as needed)

# Gmail OAuth
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret

# Outlook OAuth
OUTLOOK_CLIENT_ID=your-client-id
OUTLOOK_CLIENT_SECRET=your-client-secret
OUTLOOK_TENANT_ID=your-tenant-id

# Slack, GitHub, etc. (add as needed)
# ...

# 5. Start dev server
bun dev
```

**Dashboard Features:**
- Tasks management ✅
- Billing & subscriptions ✅
- OAuth integrations ✅

**Available Pages:**
- Everything from Standard tier
- `/dashboard/integrations` - OAuth connections dashboard
- OAuth callback endpoints for each provider

**Perfect for:**
- Full-featured platforms
- Integration-heavy apps
- Workflow automation tools
- Email clients
- CRM systems
- Data sync platforms

---

## Feature Detection

The app automatically detects which features are enabled based on environment variables. Here's how it works:

### Server-Side Detection

```typescript
import { getFeatureFlags, getCurrentTier } from "~/lib/features";

export default async function MyPage() {
  const features = getFeatureFlags();
  const tier = getCurrentTier();

  // features = { auth: true, database: true, payments: false, integrations: false }
  // tier = "basic"

  return (
    <div>
      {features.payments && <BillingSection />}
      {features.integrations && <IntegrationsSection />}
    </div>
  );
}
```

### tRPC Router

The tRPC router automatically imports feature routers when available:

```typescript
// packages/api/src/root.ts
export const appRouter = createTRPCRouter({
  auth: authRouter,      // ✅ Always available
  task: taskRouter,      // ✅ Always available
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}), // ✅ Only if payments enabled
  ...(integrationRouter ? { integration: integrationRouter } : {}),   // ✅ Only if integrations enabled
});
```

---

## Switching Between Tiers

### Upgrade Path

```bash
# From Basic → Standard
cp .env.standard .env
# Add payment provider credentials
# Restart server

# From Standard → Advanced
cp .env.advanced .env
# Add OAuth provider credentials
# Restart server
```

### Downgrade Path

```bash
# From Advanced → Standard
cp .env.standard .env
# Restart server

# From Standard → Basic
cp .env.basic .env
# Restart server
```

**Note:** When downgrading, feature-specific data (subscriptions, integrations) remains in the database but won't be accessible through the UI.

---

## Development Workflow

### 1. Start with Basic

Always start with the Basic tier when:
- Learning the codebase
- Building core functionality
- Testing without external dependencies
- Developing new features

### 2. Add Payments (Standard)

Upgrade to Standard when:
- Implementing monetization
- Adding subscription logic
- Testing checkout flows
- Integrating Stripe/Polar webhooks

### 3. Add Integrations (Advanced)

Upgrade to Advanced when:
- Implementing OAuth flows
- Testing integration connections
- Building data sync features
- Adding third-party services

---

## Testing Each Tier

### Test Basic Tier

```bash
cp .env.basic .env
bun dev

# Visit http://localhost:3000
# ✅ Should work: Auth, Tasks
# 🔒 Should be grayed out: Billing, Integrations
```

### Test Standard Tier

```bash
cp .env.standard .env
# Add Stripe test keys
bun dev

# Visit http://localhost:3000/pricing
# ✅ Should work: Checkout flow
# ✅ Should work: Billing dashboard
# 🔒 Should be grayed out: Integrations
```

### Test Advanced Tier

```bash
cp .env.advanced .env
# Add Stripe + Gmail test keys
bun dev

# Visit http://localhost:3000/dashboard/integrations
# ✅ Should work: OAuth connections
# ✅ Should work: All features
```

---

## Environment Variables Reference

### Required (All Tiers)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Standard Tier (Payments)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_PROVIDER=stripe

# OR Polar
POLAR_ACCESS_TOKEN=polar_...
POLAR_WEBHOOK_SECRET=...
PAYMENT_PROVIDER=polar
```

### Advanced Tier (Integrations)

```bash
# Gmail
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=...

# Outlook
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
OUTLOOK_TENANT_ID=...

# Add more as needed (Slack, GitHub, etc.)
```

---

## Deployment

When deploying, make sure to:

1. Choose your tier (Basic/Standard/Advanced)
2. Set all required environment variables in your hosting platform
3. Set up webhooks (if using Standard/Advanced)
4. Test feature detection in production

### Vercel Example

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add STRIPE_SECRET_KEY
# ... etc

# Deploy
vercel deploy --prod
```

---

## Troubleshooting

### "Feature not available" errors

**Problem:** Trying to use a feature that's not enabled

**Solution:** Check your `.env` file has the required variables:
```bash
# Check which tier you're on
grep -E "STRIPE|POLAR|GMAIL|OUTLOOK" .env

# Or check in code
import { getCurrentTier } from "~/lib/features";
console.log(getCurrentTier()); // "basic" | "standard" | "advanced"
```

### Payments not working in Standard tier

**Problem:** Checkout button doesn't work

**Solution:**
1. Verify Stripe/Polar keys are set
2. Check `PAYMENT_PROVIDER` is set correctly
3. Restart dev server
4. Check browser console for errors

### Integrations grayed out in Advanced tier

**Problem:** Integration features not showing

**Solution:**
1. Verify at least one OAuth provider has credentials set
2. Restart dev server
3. Check `getFeatureFlags()` returns `integrations: true`

---

## Next Steps

- **Basic Tier Users:** [Set up Supabase](https://supabase.com/docs)
- **Standard Tier Users:** [Configure Stripe](https://stripe.com/docs) or [Polar](https://polar.sh/docs)
- **Advanced Tier Users:** [Set up OAuth providers](https://console.cloud.google.com)

For more information, see:
- [ARCHITECTURE.md](/ARCHITECTURE.md) - How the modular system works
- [packages/features/README.md](/packages/features/README.md) - Feature module documentation
- [REGISTRY.md](/apps/nextjs/REGISTRY.md) - Component registry guide
