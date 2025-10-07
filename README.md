# create-v0-turbo

A modern, barebones monorepo starter with Supabase auth, modular schemas, and offline-first OAuth sync.

## Features

- ✅ **Bun** package manager for fast installs
- ✅ **Turborepo** for efficient monorepo management
- ✅ **Next.js 15** + React 19 for the dashboard
- ✅ **Expo 53** + React Native 0.79 for mobile
- ✅ **Supabase** for authentication and database
- ✅ **tRPC v11** for type-safe APIs
- ✅ **Drizzle ORM** with modular schemas
- ✅ **Biome** for linting and formatting
- ✅ **OAuth Sync** package with offline-first support
- ✅ **Modular Features** - Add/remove payments, OAuth, and more

## Structure

```
create-v0-turbo/
├── apps/
│   ├── nextjs/          # Next.js dashboard
│   └── expo/            # Mobile app
├── packages/
│   ├── api/             # tRPC API routes
│   ├── db/              # Drizzle schemas (modular)
│   ├── supabase/        # Supabase auth & client
│   ├── oauth-sync/      # OAuth providers with offline sync
│   ├── ui/              # Shared UI components
│   ├── validators/      # Zod schemas
│   └── features/        # Optional modular features 🆕
│       ├── payments/    # Stripe/Polar payments
│       └── integrations/ # OAuth integrations
└── tooling/
    ├── tailwind/        # Tailwind config
    └── typescript/      # TypeScript configs
```

## Package Namespace

All packages use the **`@tocld`** namespace:
- `@tocld/api` - tRPC API routes
- `@tocld/db` - Drizzle schemas and client
- `@tocld/supabase` - Supabase authentication
- `@tocld/mocks` - MSW mock handlers
- `@tocld/oauth-sync` - OAuth providers with offline sync
- `@tocld/ui` - Shared UI components
- `@tocld/validators` - Zod schemas

### Optional Feature Modules 🆕

- `@tocld/features-payments` - Stripe/Polar payment integration
- `@tocld/features-integrations` - OAuth integrations (Gmail, Outlook, etc.)
- `@tocld/features-finance` - Invoices, expenses, and time tracking

## Modular Database Schemas

All schemas are modular and located in `packages/db/src/schema/`:

- **profiles.ts** - User profiles (linked to Supabase auth)
- **teams.ts** - Team/workspace management
- **tasks.ts** - Example task tracking
- **payments.ts** - Stripe/Polar subscription tracking
- **integrations.ts** - OAuth connections (Gmail, Outlook, etc.)
- **invoices.ts** - Invoice management and tracking
- **expenses.ts** - Expense tracking by category
- **time-entries.ts** - Time tracking with billable hours

## Getting Started

### Quick Start (Zero Configuration) ⚡

Want to try it immediately? **Everything works in mock mode!**

```bash
# 1. Install dependencies
bun install

# 2. Start development
bun dev:next

# 3. Visit the app
open http://localhost:3000
```

**That's it!** Try these pages:
- `/pricing` - See pricing with Stripe checkout
- `/dashboard/billing` - Subscription management
- `/dashboard/integrations` - OAuth integrations

All features work with **mock data** - no Stripe or Gmail needed! See [QUICKSTART.md](./QUICKSTART.md) for more.

### Full Setup (With Supabase)

### 1. Install dependencies
```bash
bun install
```

### 2. Set up Supabase

Create a [Supabase project](https://supabase.com) and get your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `POSTGRES_URL` (from Database Settings → Connection String → URI)

### 3. Configure environment variables

**For Next.js app:**
```bash
cp .env.example .env
# Fill in your Supabase credentials
```

**For Expo app:**
```bash
cp apps/expo/.env.example apps/expo/.env
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Push database schema
```bash
bun db:push
```

This will create all tables (profiles, teams, tasks, payments, integrations) in your Supabase database.

### 5. Start development

**All apps:**
```bash
bun dev
```

**Dashboard only:**
```bash
bun dev:next
```

**Mobile app:**
```bash
cd apps/expo
bun dev
```

### 6. Create your first user

Visit `http://localhost:3000/signup` and create an account. The dashboard will be available at `http://localhost:3000`.

## Mock Mode (Auto-Enabled)

The template features **intelligent mock mode** that automatically activates when Supabase credentials are missing:

### How It Works:

**🔍 Auto-Detection:**
1. **Development + No Supabase credentials** → Mock mode auto-enabled ✅
2. **Development + Has Supabase credentials** → Real Supabase auth ✅
3. **Production + No Supabase credentials** → Build fails with error (safety) ⚠️
4. **Explicit override** → Set `NEXT_PUBLIC_MOCK_AUTH=true` to force mock mode 🔧

**What Mock Mode Provides:**
- ✅ Zero configuration required
- ✅ Auto-detected in development
- ✅ Mock user session (`mock@example.com`)
- ✅ **MSW intercepts all API calls** (no database needed)
- ✅ Data persists in TanStack Query cache (in-memory)
- ✅ Visual indicator showing mock credentials
- ✅ Production safety - fails if credentials missing
- ⚠️ **Development/testing only - NOT for production**

**Force Mock Mode (Optional):**
```bash
# Explicitly enable mock mode (overrides Supabase detection)
NEXT_PUBLIC_MOCK_AUTH=true
```

**How It Works:**

1. **MSW intercepts network requests** at the fetch/XHR layer
2. **Returns mock data** from `packages/mocks/src/handlers/`
3. **TanStack Query caches** the responses (just like real API)
4. **Data lives in-memory** - resets on app restart

**Mock User ID:** `00000000-0000-0000-0000-000000000001`

**Mock Task Data:**
- Pre-loaded with 2 example tasks
- Create/delete operations update in-memory store
- Data persists during session (lost on refresh)

**Benefits:**
- ✅ Zero external dependencies (no Supabase, no Postgres)
- ✅ Instant startup - no setup required
- ✅ Same code paths as production
- ✅ Can be used for automated testing
- ✅ Works offline

**Use Cases:**
- Quick prototyping without auth setup
- Testing UI/UX without login flow
- Demo/presentation purposes
- CI/CD testing environments
- Offline development

### Adding Custom Mock Handlers

Extend mock mode with your own API responses:

```typescript
// packages/mocks/src/handlers/custom.ts
import { http, HttpResponse } from "msw";

export const customHandlers = [
  http.post("*/api/trpc/yourProcedure.name", async ({ request }) => {
    const body = await request.json();
    // Your mock logic here
    return HttpResponse.json({
      result: {
        data: { /* your mock data */ },
      },
    });
  }),
];
```

Then add to `packages/mocks/src/handlers/index.ts`:
```typescript
import { customHandlers } from "./custom";

export const handlers = [
  ...taskHandlers,
  ...customHandlers,
];
```

## OAuth Sync Package

The `@tocld/oauth-sync` package provides offline-first OAuth integration:

- **Providers**: Gmail, Outlook (extensible)
- **Offline Queue**: Store operations when offline
- **Auto-Sync**: Syncs when connection restored
- **Token Management**: Auto-refresh expired tokens

## What's Included

### ✅ Fully Integrated Features

- **Authentication**: Email/password login and signup pages with Supabase
- **Dashboard**: Next.js 15 app with task management example
- **Mobile App**: Expo app with Supabase auth and task sync
- **tRPC API**: Type-safe routes for tasks (create, read, delete)
- **Database**: Modular schemas ready to extend (profiles, teams, tasks, payments, integrations)
- **Offline Sync**: OAuth providers with offline-first queue

## 🎯 Modular Features (NEW!)

This template now includes **optional feature modules** that can be easily added or removed:

### 💳 Payments (`@tocld/features-payments`)
- ✅ Stripe & Polar integration
- ✅ Subscription management with billing portal
- ✅ Webhook handlers (`/api/webhooks/stripe`, `/api/webhooks/polar`)
- ✅ UI components (`<CheckoutButton>`, `<SubscriptionCard>`)
- ✅ tRPC routers: `subscription.*`
- ✅ **Example pages:** `/pricing`, `/dashboard/billing`

### 🔗 Integrations (`@tocld/features-integrations`)
- ✅ Gmail, Outlook OAuth flows
- ✅ Connection management with token refresh
- ✅ OAuth callbacks (`/api/auth/callback/gmail`, etc.)
- ✅ UI components (`<ConnectButton>`, `<IntegrationsList>`)
- ✅ tRPC routers: `integration.*`
- ✅ **Example page:** `/dashboard/integrations`

### 💼 Finance (`@tocld/features-finance`)
- ✅ Invoice management (create, track, export)
- ✅ Expense tracking by category with receipts
- ✅ Time tracking with billable/non-billable hours
- ✅ UI components (`<InvoiceForm>`, `<ExpenseForm>`, `<TimeTracker>`)
- ✅ tRPC routers: `invoice.*`, `expense.*`, `time.*`
- ✅ **Example pages:** `/dashboard/invoices`, `/dashboard/expenses`, `/dashboard/time`

### 🎙️ Voice Chat (ElevenLabs)
- ✅ Conversational AI with voice and text input
- ✅ Real-time streaming responses
- ✅ Graceful degradation without agent configured
- ✅ UI components (`<Conversation>`, `<ConversationBar>`, `<Orb>`)
- ✅ **Example page:** `/dashboard/voice-chat`

**Learn more:**
- [FEATURES.md](./FEATURES.md) - Quick start guide
- [packages/features/README.md](./packages/features/README.md) - Architecture deep dive
- [PAGES.md](./PAGES.md) - Example pages reference
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's included

### 🚀 Next Steps

- [x] Add payment integration (Stripe/Polar) ✅
- [x] Add OAuth provider UI in dashboard ✅
- [x] Add finance module (invoices, expenses, time tracking) ✅
- [x] Add voice chat with ElevenLabs ✅
- [ ] Extend task schema with more fields (due dates, tags, etc.)
- [ ] Implement team creation and invites
- [ ] Deploy to Vercel/Expo

## Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router, Server Components, and Turbopack
- **React 19** - Latest React with improved server components
- **Expo 53** - Cross-platform mobile development
- **React Native 0.79** - Mobile app framework
- **TanStack Query v5** - Server state management with offline persistence
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI component library

### Backend
- **tRPC v11** - End-to-end typesafe APIs
- **Supabase** - Authentication and PostgreSQL database
- **Drizzle ORM** - TypeScript ORM with modular schemas
- **Zod** - TypeScript-first schema validation

### Development & Testing
- **MSW (Mock Service Worker) v2.7.0** - API mocking for development and testing
- **Biome** - Fast linting and formatting
- **Bun** - Fast JavaScript runtime and package manager
- **Turborepo** - High-performance build system for monorepos
- **TypeScript** - Static type checking

### Integration & Payments
- **OAuth Sync** - Gmail, Outlook integration with offline support
- **Stripe/Polar** - Payment processing support

## License

MIT
