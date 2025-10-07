# ⚡ Quick Start - 60 Seconds to Live Demo

Get the modular features up and running in under a minute!

## 🚀 Option 1: Zero Config (Mock Mode)

**No Stripe, no Gmail, no setup!** Everything works with mock data.

```bash
# 1. Install dependencies
bun install

# 2. Start dev server
bun dev:next

# 3. Open browser
open http://localhost:3000
```

**That's it!** Visit these pages:
- **http://localhost:3000/pricing** - See pricing with checkout buttons
- **http://localhost:3000/dashboard/billing** - See mock Pro subscription
- **http://localhost:3000/dashboard/integrations** - See mock Gmail integration

### What Works:
✅ All UI components render
✅ tRPC API returns mock data
✅ Checkout buttons (redirect to mock)
✅ Subscription management (mock)
✅ OAuth integrations (mock)
✅ Full development workflow

---

## 💳 Option 2: Test With Real Stripe (5 Minutes)

Add real Stripe checkout and billing.

### 1. Get Stripe Test Keys

1. Sign up at https://dashboard.stripe.com
2. Go to Developers → API keys
3. Copy your test keys (start with `sk_test_` and `pk_test_`)

### 2. Create Test Products

1. Go to Products → Add product
2. Create "Pro Plan" at $29/month
3. Copy the **Price ID** (starts with `price_`)

### 3. Configure

```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional for now
```

### 4. Update Pricing Page

```tsx
// apps/nextjs/src/app/pricing/page.tsx
const plans = [
  {
    name: "Pro",
    priceId: "price_YOUR_STRIPE_PRICE_ID", // ← Paste here
  },
];
```

### 5. Test

```bash
# Restart server
bun dev:next

# Visit pricing page
open http://localhost:3000/pricing

# Click "Get Started" → Uses real Stripe!
```

**Test Card:** `4242 4242 4242 4242` with any future date and CVC.

---

## 🔗 Option 3: Add Gmail OAuth (5 Minutes)

Enable real Gmail integration.

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create project → Enable Gmail API
3. OAuth consent screen → External → Create
4. Credentials → Create OAuth Client ID → Web application
5. Add redirect: `http://localhost:3000/api/auth/callback/gmail`
6. Copy Client ID and Secret

### 2. Configure

```bash
# .env
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Test

```bash
# Restart server
bun dev:next

# Visit integrations
open http://localhost:3000/dashboard/integrations

# Click "Connect Gmail" → Real OAuth flow!
```

---

## 📋 Quick Test Checklist

### Mock Mode (Default - Works Immediately)
- [ ] Visit `/pricing` - 3 cards display
- [ ] Click "Get Started" - Mock checkout
- [ ] Visit `/dashboard/billing` - Shows Pro Plan
- [ ] Visit `/dashboard/integrations` - Shows Gmail
- [ ] All pages load without errors

### With Stripe Keys
- [ ] Click "Get Started" - Redirects to Stripe
- [ ] Complete checkout with test card
- [ ] Returns to dashboard
- [ ] Subscription appears in billing page

### With Gmail OAuth
- [ ] Click "Connect Gmail"
- [ ] OAuth consent screen appears
- [ ] After granting access, returns to app
- [ ] Gmail appears in connected integrations

---

## 🎯 Next Steps

Once you've tested the basics:

1. **Read [TESTING.md](./TESTING.md)** - Comprehensive testing guide
2. **Read [FEATURES.md](./FEATURES.md)** - How to use features
3. **Read [PAGES.md](./PAGES.md)** - Page reference
4. **Customize** - Update pricing, add providers, etc.

---

## 🐛 Troubleshooting

### "Cannot find module '@tocld/features-payments'"
```bash
bun install
```

### Pages show errors
```bash
# Check logs in terminal
# Should see: 🔶 [DATABASE] No connection string found - running in MOCK MODE
```

### Stripe checkout fails
1. Check env vars are loaded (restart server)
2. Verify price IDs are correct
3. Use test card: `4242 4242 4242 4242`

### OAuth fails
1. Check redirect URI matches exactly
2. Verify client ID/secret are correct
3. Make sure `NEXT_PUBLIC_APP_URL` is set

---

## 📚 More Info

- **[README.md](./README.md)** - Project overview
- **[TESTING.md](./TESTING.md)** - Detailed testing
- **[FEATURES.md](./FEATURES.md)** - Feature usage
- **[packages/features/README.md](./packages/features/README.md)** - Architecture

---

**Questions?** Check the docs or open an issue on GitHub!
