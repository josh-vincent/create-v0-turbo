# Example Pages Reference

This document lists all the example pages included in the Next.js app, demonstrating how to use the modular features.

## 🏠 Public Pages

### Landing Page (`/`)
**File:** `apps/nextjs/src/app/page.tsx`

Features:
- Hero section with CTA buttons
- Feature highlights grid
- Automatic redirect to `/dashboard` if logged in
- Links to pricing and signup

### Pricing Page (`/pricing`)
**File:** `apps/nextjs/src/app/pricing/page.tsx`

Features:
- Three-tier pricing cards (Starter, Pro, Enterprise)
- `<CheckoutButton>` component integration
- Stripe/Polar checkout flow
- Responsive design with "Most Popular" badge
- Customizable price IDs per plan

**How to customize:**
```tsx
const plans = [
  {
    name: "Starter",
    price: "$9",
    priceId: "price_your_stripe_id_here", // ← Change this
    features: ["Feature 1", "Feature 2"],
  },
];
```

## 🔐 Authentication Pages

### Login (`/login`)
**File:** `apps/nextjs/src/app/(auth)/login/page.tsx`

Features:
- Email/password login with Supabase
- Redirect to dashboard on success
- Error handling

### Signup (`/signup`)
**File:** `apps/nextjs/src/app/(auth)/signup/page.tsx`

Features:
- Email/password registration with Supabase
- Automatic profile creation
- Redirect to dashboard on success

## 📊 Dashboard Pages

### Dashboard Home (`/dashboard`)
**File:** `apps/nextjs/src/app/dashboard/page.tsx`

Features:
- Quick stats cards (tasks, integrations, subscription)
- Task list with CRUD operations
- Prefetched data with tRPC
- Responsive layout

### Billing & Subscription (`/dashboard/billing`)
**File:** `apps/nextjs/src/app/dashboard/billing/page.tsx`

Features:
- `<SubscriptionCard>` component
- Current subscription status display
- Billing portal access
- Cancel/resume subscription
- Payment method display
- Next billing date

**Usage:**
```tsx
import { SubscriptionCard } from "@tocld/features-payments/ui";

<SubscriptionCard />
```

### Integrations (`/dashboard/integrations`)
**File:** `apps/nextjs/src/app/dashboard/integrations/page.tsx`

Features:
- `<IntegrationsList>` component
- Connected integrations display
- Available integrations grid
- OAuth connect buttons (Gmail, Outlook, etc.)
- Success/error message handling
- Disconnect functionality

**Usage:**
```tsx
import { IntegrationsList } from "@tocld/features-integrations/ui";

<IntegrationsList />
```

## 🎨 Layout

### Dashboard Layout (`/dashboard/layout.tsx`)
**File:** `apps/nextjs/src/app/dashboard/layout.tsx`

Features:
- Persistent navigation bar
- Links to all dashboard sections
- User authentication check
- Responsive sidebar/header
- Sign out button

Navigation links:
- Home (`/dashboard`)
- Integrations (`/dashboard/integrations`)
- Billing (`/dashboard/billing`)
- Pricing (`/pricing`)

## 🔗 API Routes

### Webhooks

**Stripe Webhook:** `POST /api/webhooks/stripe`
**File:** `apps/nextjs/src/app/api/webhooks/stripe/route.ts`

Handles:
- `checkout.session.completed` - Create subscription
- `customer.subscription.updated` - Update subscription
- `customer.subscription.deleted` - Cancel subscription
- `invoice.payment_succeeded` - Payment success
- `invoice.payment_failed` - Payment failure

**Polar Webhook:** `POST /api/webhooks/polar`
**File:** `apps/nextjs/src/app/api/webhooks/polar/route.ts`

Handles:
- Polar subscription events
- Payment notifications

### OAuth Callbacks

**Gmail Callback:** `GET /api/auth/callback/gmail`
**File:** `apps/nextjs/src/app/api/auth/callback/gmail/route.ts`

Handles:
- OAuth code exchange
- Token storage
- Integration creation
- Error handling
- Redirect to integrations page

**Outlook Callback:** `GET /api/auth/callback/outlook`
**File:** `apps/nextjs/src/app/api/auth/callback/outlook/route.ts`

Same functionality as Gmail callback for Outlook/Microsoft accounts.

## 🚀 Quick Navigation

| Page | Path | Feature Module | Description |
|------|------|----------------|-------------|
| Landing | `/` | - | Public homepage |
| Login | `/login` | - | Authentication |
| Signup | `/signup` | - | Registration |
| **Pricing** | `/pricing` | `@tocld/features-payments` | Checkout with Stripe/Polar |
| Dashboard | `/dashboard` | - | Main dashboard |
| **Billing** | `/dashboard/billing` | `@tocld/features-payments` | Subscription management |
| **Integrations** | `/dashboard/integrations` | `@tocld/features-integrations` | OAuth connections |

## 📝 Customization Tips

### Change Price IDs

Edit `apps/nextjs/src/app/pricing/page.tsx`:

```tsx
const plans = [
  {
    name: "Pro",
    priceId: "price_1234", // ← Your Stripe price ID
  },
];
```

### Customize Plans

Add/remove plans in the `plans` array:

```tsx
const plans = [
  // Add your custom plan
  {
    name: "Custom",
    price: "$49",
    priceId: "price_custom",
    features: ["Everything", "Custom features"],
  },
];
```

### Add More OAuth Providers

1. Add provider to `@tocld/oauth-sync`
2. Add callback route in `apps/nextjs/src/app/api/auth/callback/[provider]/route.ts`
3. Provider automatically appears in `<IntegrationsList>`

### Customize Dashboard Layout

Edit `apps/nextjs/src/app/dashboard/layout.tsx` to:
- Add/remove navigation links
- Change styling
- Add user profile dropdown
- Add notifications

## 🔒 Authentication Flow

```
User visits /dashboard
  ↓
Middleware checks auth
  ↓
If not logged in → /login
  ↓
If logged in → /dashboard
```

## 💳 Checkout Flow

```
User clicks <CheckoutButton>
  ↓
tRPC: subscription.createCheckout
  ↓
Redirects to Stripe/Polar
  ↓
User completes payment
  ↓
Webhook: checkout.session.completed
  ↓
Database: Create subscription record
  ↓
Redirect to /dashboard?success=true
```

## 🔗 OAuth Flow

```
User clicks <ConnectButton provider="gmail">
  ↓
tRPC: integration.getAuthUrl
  ↓
Redirects to Gmail OAuth
  ↓
User grants permissions
  ↓
Callback: /api/auth/callback/gmail
  ↓
Exchange code for tokens
  ↓
Database: Store integration
  ↓
Redirect to /dashboard/integrations?success=true
```

## 📚 Related Documentation

- [Main README](./README.md) - Getting started
- [Features Guide](./FEATURES.md) - Detailed feature documentation
- [Feature Modules](./packages/features/README.md) - Architecture deep dive
- [Environment Variables](./.env.example) - Configuration reference

---

**Need help?** Check the [troubleshooting section](./FEATURES.md#-troubleshooting) in FEATURES.md.
