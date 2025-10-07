# 🧪 Testing Guide - Modular Features

This guide will help you test the payment and OAuth integration features.

## 🚀 Quick Start Test (No External Services)

The template works **out of the box** with mock mode - no Stripe, Polar, or Gmail accounts needed!

### 1. Install Dependencies

```bash
# Install all dependencies
bun install
```

### 2. Start Development Server

```bash
# Start Next.js app
bun dev:next

# Or start all apps (includes Expo)
bun dev
```

### 3. Visit Test Pages

Open your browser and test these routes:

#### Public Pages
- **http://localhost:3000** - Landing page (redirects to dashboard if logged in)
- **http://localhost:3000/pricing** - Pricing with checkout buttons
- **http://localhost:3000/login** - Login page
- **http://localhost:3000/signup** - Signup page

#### Dashboard Pages (requires login or mock mode)
- **http://localhost:3000/dashboard** - Dashboard home with tasks
- **http://localhost:3000/dashboard/billing** - Subscription management
- **http://localhost:3000/dashboard/integrations** - OAuth integrations

### 4. Test in Mock Mode

**Mock mode is automatically enabled** when you don't have Supabase credentials!

#### What Works in Mock Mode:
✅ Auto-login as `mock@example.com`
✅ View mock subscription (Pro Plan, Active)
✅ See mock integrations (Gmail connected)
✅ Create/delete tasks
✅ All UI components render correctly
✅ tRPC API calls return mock data

#### Test Checklist:
- [ ] Visit `/pricing` - All 3 pricing cards display
- [ ] Click "Get Started" button - Should redirect to mock checkout
- [ ] Visit `/dashboard/billing` - Shows "Pro Plan" subscription
- [ ] Click "Manage Billing" - Mock billing portal
- [ ] Visit `/dashboard/integrations` - Shows Gmail integration
- [ ] Click "Connect" buttons - Mock OAuth flow

---

## 💳 Testing Payments (Stripe)

### Setup Stripe Test Mode

#### 1. Get Stripe Test Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your test keys (they start with `sk_test_` and `pk_test_`)

#### 2. Create Test Products

1. Go to https://dashboard.stripe.com/test/products
2. Create 3 products (Starter, Pro, Enterprise)
3. Add pricing for each (e.g., $9, $29, $99)
4. Copy the **Price IDs** (they start with `price_`)

#### 3. Configure Environment Variables

```bash
# .env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...  # We'll get this next
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

#### 4. Update Price IDs

Edit `apps/nextjs/src/app/pricing/page.tsx`:

```tsx
const plans = [
  {
    name: "Starter",
    priceId: "price_1234567890", // ← Your Stripe Price ID
  },
  {
    name: "Pro",
    priceId: "price_0987654321", // ← Your Stripe Price ID
  },
  // ...
];
```

#### 5. Set Up Webhook (Local Testing)

Install Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe

# Or download from https://stripe.com/docs/stripe-cli
```

Start webhook forwarding:

```bash
# This will give you a webhook signing secret
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook secret (starts with `whsec_`) to your `.env`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 6. Test Stripe Checkout

1. **Restart dev server** (to load new env vars)
   ```bash
   bun dev:next
   ```

2. **Visit pricing page**
   ```
   http://localhost:3000/pricing
   ```

3. **Click "Get Started"**
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

4. **Complete checkout**
   - Should redirect back to `/dashboard?success=true`
   - Webhook should fire (check Stripe CLI terminal)
   - Visit `/dashboard/billing` to see active subscription

#### 7. Test Subscription Management

1. **Visit billing page**
   ```
   http://localhost:3000/dashboard/billing
   ```

2. **Test "Manage Billing" button**
   - Should redirect to Stripe Customer Portal
   - Can update payment method
   - Can view invoices

3. **Test "Cancel" button**
   - Should cancel at period end
   - Status updates in database
   - Can "Resume" subscription

#### 8. Test Webhooks Manually

Trigger test events with Stripe CLI:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test subscription created
stripe trigger customer.subscription.created

# Test subscription updated
stripe trigger customer.subscription.updated

# Test failed payment
stripe trigger invoice.payment_failed
```

Watch your dev server logs to see webhook events being processed.

---

## 🔗 Testing OAuth Integrations (Gmail)

### Setup Gmail OAuth

#### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/gmail
   ```
7. Copy **Client ID** and **Client Secret**

#### 2. Configure Environment Variables

```bash
# .env
GMAIL_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3. Test OAuth Flow

1. **Restart dev server**
   ```bash
   bun dev:next
   ```

2. **Visit integrations page**
   ```
   http://localhost:3000/dashboard/integrations
   ```

3. **Click "Connect Gmail"**
   - Redirects to Google OAuth consent screen
   - Select your Google account
   - Grant permissions

4. **Callback processes**
   - Redirects to `/dashboard/integrations?success=true`
   - Integration appears in "Connected" section
   - Status shows as "connected"

5. **Test Disconnect**
   - Click "Disconnect" button
   - Confirms removal
   - Integration removed from database

#### 4. Test Token Refresh

The system automatically refreshes expired tokens. To test:

1. Manually expire a token in database
2. Make an API call that uses the integration
3. Check logs - should see token refresh

---

## 🔍 Testing Outlook OAuth

Similar to Gmail, but with Microsoft:

#### 1. Register App in Azure

1. Go to https://portal.azure.com
2. Azure Active Directory → App registrations → New registration
3. Add redirect URI: `http://localhost:3000/api/auth/callback/outlook`
4. Copy **Application (client) ID** and create **Client secret**

#### 2. Configure Environment

```bash
# .env
OUTLOOK_CLIENT_ID=12345678-1234-1234-1234-123456789012
OUTLOOK_CLIENT_SECRET=abc123...
OUTLOOK_TENANT_ID=common  # or your tenant ID
```

#### 3. Test Flow

Same as Gmail, but click "Connect Outlook" button.

---

## 🧪 API Testing

### Test tRPC Procedures

You can test API endpoints directly:

#### Test Subscription Endpoints

```typescript
// In browser console or test file
import { api } from "~/trpc/react";

// Get current subscription
const { data } = api.subscription.getCurrent.useQuery();
console.log(data);

// Create checkout (redirects to Stripe)
const createCheckout = api.subscription.createCheckout.useMutation();
await createCheckout.mutateAsync({
  priceId: "price_123",
  successUrl: "http://localhost:3000/success",
  cancelUrl: "http://localhost:3000/cancel",
});

// Cancel subscription
const cancel = api.subscription.cancel.useMutation();
await cancel.mutateAsync();
```

#### Test Integration Endpoints

```typescript
// List integrations
const { data } = api.integration.list.useQuery();
console.log(data);

// Get OAuth URL
const getAuthUrl = api.integration.getAuthUrl.useMutation();
const result = await getAuthUrl.mutateAsync({
  provider: "gmail",
  redirectUri: "http://localhost:3000/api/auth/callback/gmail",
});
console.log(result.authUrl); // Visit this URL

// Disconnect
const disconnect = api.integration.disconnect.useMutation();
await disconnect.mutateAsync({ integrationId: "int_123" });
```

---

## 🎨 Component Testing

### Test UI Components Directly

Create a test page to verify components work:

```tsx
// apps/nextjs/src/app/test/page.tsx
import { CheckoutButton, SubscriptionCard } from "@tocld/features-payments/ui";
import { ConnectButton, IntegrationCard } from "@tocld/features-integrations/ui";

export default function TestPage() {
  return (
    <div className="container py-8 space-y-8">
      <h1>Component Tests</h1>

      <section>
        <h2>Payment Components</h2>
        <CheckoutButton priceId="price_test" />
        <SubscriptionCard />
      </section>

      <section>
        <h2>Integration Components</h2>
        <ConnectButton provider="gmail" />
        <ConnectButton provider="outlook" />
      </section>
    </div>
  );
}
```

Visit `http://localhost:3000/test` to see all components.

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module '@tocld/features-payments'"

**Fix:** Run `bun install`

### Issue: "Payment provider not configured"

**Fix:** Add Stripe/Polar env vars to `.env`

### Issue: Webhook signature verification fails

**Fix:**
1. Make sure you're using the webhook secret from `stripe listen`
2. Check it's added to `.env` as `STRIPE_WEBHOOK_SECRET`
3. Restart dev server

### Issue: OAuth callback fails with "redirect_uri_mismatch"

**Fix:**
1. Add callback URL to OAuth app settings
2. Make sure URL exactly matches (including http/https)
3. For Gmail: `http://localhost:3000/api/auth/callback/gmail`
4. For Outlook: `http://localhost:3000/api/auth/callback/outlook`

### Issue: Components not styled correctly

**Fix:**
1. Check Tailwind is configured: `apps/nextjs/tailwind.config.ts`
2. Verify `globals.css` imports Tailwind
3. Run `bun install` to get `clsx` dependency

### Issue: TypeScript errors in components

**Fix:**
1. Run `bun install` to ensure all packages are installed
2. Restart TypeScript server in your IDE
3. Check `tsconfig.json` includes feature packages

---

## ✅ Test Checklist

### Mock Mode (No Setup Required)
- [ ] Landing page loads
- [ ] Pricing cards display
- [ ] Dashboard loads with mock data
- [ ] Billing shows mock subscription
- [ ] Integrations shows mock Gmail
- [ ] Tasks can be created/deleted

### Stripe Integration
- [ ] Checkout button redirects to Stripe
- [ ] Test card completes checkout
- [ ] Webhook receives events
- [ ] Subscription created in database
- [ ] Billing portal opens
- [ ] Can cancel subscription
- [ ] Can resume subscription

### OAuth Integration (Gmail)
- [ ] Connect button redirects to Google
- [ ] OAuth consent screen appears
- [ ] Callback processes successfully
- [ ] Integration appears in list
- [ ] Can disconnect integration
- [ ] Tokens stored in database

### OAuth Integration (Outlook)
- [ ] Connect button redirects to Microsoft
- [ ] OAuth consent screen appears
- [ ] Callback processes successfully
- [ ] Integration appears in list
- [ ] Can disconnect integration

### API Testing
- [ ] `subscription.getCurrent` returns data
- [ ] `subscription.createCheckout` works
- [ ] `integration.list` returns integrations
- [ ] `integration.getAuthUrl` generates URL

---

## 📊 Monitoring & Debugging

### Check Logs

Watch your terminal for:
```
🔶 [DATABASE] No connection string found - running in MOCK MODE
🔶 [MOCK] subscription.getCurrent - Using mock data
✅ [Stripe] Created subscription for user abc123
🔗 [OAuth] Gmail connected for user xyz789
```

### Database Inspection

Check what's in your database:

```bash
# Open Drizzle Studio
bun db:studio

# Or connect directly to Supabase
psql $POSTGRES_URL
```

### Network Tab

In browser DevTools → Network:
- Check tRPC calls to `/api/trpc/*`
- Verify webhooks POST to `/api/webhooks/stripe`
- Check OAuth callbacks to `/api/auth/callback/*`

---

## 🚀 Production Testing

Before deploying:

### 1. Update to Production Keys

```bash
# .env.production
STRIPE_SECRET_KEY=sk_live_...  # NOT test key!
STRIPE_WEBHOOK_SECRET=whsec_...  # From production webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Update Webhook Endpoint

In Stripe Dashboard:
1. Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to send: Select all subscription and invoice events
4. Copy webhook secret to `.env.production`

### 3. Update OAuth Redirect URIs

Update in Google Cloud Console and Azure:
- From: `http://localhost:3000/api/auth/callback/gmail`
- To: `https://yourdomain.com/api/auth/callback/gmail`

### 4. Test in Production

- [ ] Real Stripe checkout works
- [ ] Webhooks deliver successfully
- [ ] OAuth flows complete
- [ ] Subscriptions sync to database

---

## 📚 Additional Resources

- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Setup](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)

---

**Need help?** Check [FEATURES.md](./FEATURES.md) for troubleshooting or open an issue on GitHub.
