# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**create-v0-turbo** is a modern monorepo starter with Supabase auth, modular schemas, offline-first support, and optional feature modules. It uses a hybrid architecture combining modular feature packages (full-stack modules) and Shadcn registry (installable UI components).

**Stack:** Bun + Turborepo + Next.js 15 + Expo 53 + Supabase + tRPC v11 + Drizzle ORM + Biome

**Package Namespace:** All packages use `@tocld` namespace.

## Common Commands

### Development
```bash
# Install dependencies
bun install

# Start all apps (Next.js + Expo)
bun dev

# Start Next.js dashboard only
bun dev:next

# Start mobile app (from apps/expo directory)
cd apps/expo && bun dev
```

### Database
```bash
# Push schema to Supabase
bun db:push

# Open Drizzle Studio
bun db:studio
```

### Linting & Formatting
```bash
# Format code with Biome
bun format

# Lint code with Biome
bun lint

# Type-check all packages
bun typecheck
```

### Mobile Development
```bash
# Run on Android
bun android

# Run on iOS
bun ios
```

### Shadcn Registry
```bash
# Build registry for public distribution
cd apps/nextjs && bun run registry:build

# Add UI component to Next.js app
bun ui-add
```

## Architecture

### Monorepo Structure
```
apps/
├── nextjs/          # Next.js 15 dashboard with App Router
└── expo/            # Expo 53 + React Native 0.79 mobile app

packages/
├── api/             # tRPC v11 API routes
├── db/              # Drizzle ORM with modular schemas
├── supabase/        # Supabase client (server/client/native/middleware)
├── oauth-sync/      # Offline-first OAuth providers
├── ui/              # Shared UI components
├── validators/      # Zod schemas
├── mocks/           # MSW mock handlers (disabled by default)
└── features/        # Optional feature modules
    ├── payments/    # Stripe/Polar integration
    ├── integrations/ # Gmail/Outlook OAuth
    └── finance/      # Invoices, expenses, time tracking

tooling/
├── tailwind/        # Shared Tailwind config
└── typescript/      # TypeScript configs
```

### Database Schemas (Modular)
All schemas are in `packages/db/src/schema/`:
- **profiles.ts** - User profiles linked to Supabase auth
- **teams.ts** - Team/workspace management
- **tasks.ts** - Example task tracking
- **payments.ts** - Stripe/Polar subscription tracking
- **integrations.ts** - OAuth connections
- **invoices.ts** - Invoice management and tracking
- **expenses.ts** - Expense tracking by category
- **time-entries.ts** - Time tracking with billable hours

### UI Components (Modular)
All UI components are centralized in `packages/ui/src/` for reuse across apps.

**ALWAYS use `@tocld/ui` imports:**
```typescript
// ✅ Correct - Import from shared package
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";

// ❌ Incorrect - Never use app-local imports
import { Button } from "@/components/ui/button";
```

**Available Components:**
- All shadcn/ui components are in `packages/ui/src/`
- Components are exported via `packages/ui/package.json` exports field
- Pattern supports cross-platform use (`.tsx` for web, `.native.tsx` for mobile)
- **Native component registry** at `packages/ui/registry/native.json`

**Cross-Platform Component Pattern:**
```
packages/ui/src/
├── components/
│   ├── button.ts         # Shared logic & variants (CVA)
│   ├── button.tsx        # Web implementation (div/button)
│   └── button.native.tsx # Native implementation (Pressable/View)
├── badge.tsx             # Web-only (auto-resolves)
├── badge.native.tsx      # Native variant
└── card.native.tsx       # Native variant
```

**Component Resolution:**
- Expo/React Native automatically uses `.native.tsx` files when present
- Next.js uses `.tsx` files
- Shared logic in `.ts` files with CVA variants
- All components import from `@tocld/ui/<component-name>`

**Adding New Components:**
```bash
# Web component (shadcn)
cd packages/ui
bun ui-add <component-name>

# Native variant (manual for now)
# 1. Create button.ts with CVA variants
# 2. Create button.native.tsx with View/Pressable/Text
# 3. Update registry/native.json
# 4. Export in package.json
```

**Native Component Examples:**

1. **Badge** (packages/ui/src/components/badge.native.tsx:1):
```typescript
import { Badge } from "@tocld/ui/badge";

<Badge>New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
```

2. **Card** (packages/ui/src/card.native.tsx:1):
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@tocld/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

3. **Button** (packages/ui/src/components/button.native.tsx:1):
```typescript
import { Button } from "@tocld/ui/button";

<Button onPress={() => console.log('pressed')}>
  Click me
</Button>
<Button variant="destructive">Delete</Button>
```

This will:
1. Install component to `packages/ui/src/`
2. Auto-add export to `package.json`
3. Make it available to all apps via `@tocld/ui/<component-name>`

## Mock Mode System

The project uses a **centralized tRPC mock system** for development without database:

### How It Works
1. **Database client** (`packages/db/src/client.ts`) checks for valid `POSTGRES_URL`
2. **tRPC context** (`packages/api/src/trpc.ts`) includes `ctx.isMockMode` flag
3. **Mock data** (`packages/api/src/mock-data.ts`) provides in-memory CRUD operations
4. **Routers** check `ctx.isMockMode` and return mock data when true

### Key Points
- MSW is **disabled by default** - mocking happens at tRPC layer, not HTTP layer
- All procedures return data (mock or real) - never undefined
- In-memory store supports full CRUD (persists until server restart)
- Mock mode auto-detects when `POSTGRES_URL` is missing
- Logs show: `🔶 [DATABASE] No connection string found - running in MOCK MODE`

### Pattern for New Routers
```typescript
import { logMockUsage, getAllMockItems, addMockItem } from "../mock-data";

export const myRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      logMockUsage("my-router", "all");
      return getAllMockItems();
    }
    return ctx.db.query.items.findMany();
  }),

  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.isMockMode) {
      logMockUsage("my-router", "create");
      const newItem = { id: crypto.randomUUID(), ...input };
      addMockItem(newItem);
      return newItem;
    }
    return ctx.db.insert(schema.items).values(input);
  }),
};
```

## Modular Features System

Features are **optional packages** that can be added/removed without breaking the app.

### How Features Work
1. **Conditional imports** in `packages/api/src/root.ts`:
   ```typescript
   let subscriptionRouter: any;
   try {
     subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
   } catch {
     // Feature not installed
   }

   export const appRouter = createTRPCRouter({
     auth: authRouter,
     task: taskRouter,
     ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
   });
   ```

2. **Feature structure**:
   ```
   packages/features/{feature}/
   ├── src/
   │   ├── types.ts              # Zod schemas
   │   ├── providers/            # Business logic
   │   ├── routers/              # tRPC routers
   │   ├── webhooks/             # Webhook handlers
   │   ├── callbacks/            # OAuth callbacks
   │   ├── ui/                   # React components (.tsx + .native.tsx)
   │   └── index.ts              # Exports + manifest
   ```

3. **Auto-tree-shaking** - Unused features removed during build

### Adding/Removing Features
- **Add**: Already scaffolded, just add env vars and restart
- **Remove**: Delete directory, remove from package.json, restart

## Supabase Authentication

### Client Creation
- **Server components**: `createClient()` from `@tocld/supabase/server`
- **Client components**: `createClient()` from `@tocld/supabase/client`
- **Native (Expo)**: `createClient()` from `@tocld/supabase/native`
- **Middleware**: `updateSession()` from `@tocld/supabase/middleware`

### Session Management
- tRPC automatically handles session refresh in `apps/nextjs/src/trpc/react.tsx:78-100`
- Error link redirects to `/login?return_to=...` on UNAUTHORIZED (line 31-58)
- 60-second buffer before token expiry triggers refresh

## tRPC Usage

### In Next.js
```typescript
import { api } from "@/trpc/react";

export function MyComponent() {
  const tasks = api.task.all.useSuspenseQuery();
  const createTask = api.task.create.useMutation();
  // ...
}
```

### In Expo
```typescript
import { api } from "@/utils/api";

export function MyScreen() {
  const tasks = api.task.all.useQuery();
  const createTask = api.task.create.useMutation();
  // ...
}
```

### Server Components (Next.js)
```typescript
import { api } from "@/trpc/server";

export default async function Page() {
  const tasks = await api.task.all();
  return <TaskList tasks={tasks} />;
}
```

## Key Implementation Details

### Offline Support
- TanStack Query persists cache to localStorage (Next.js) and AsyncStorage (Expo)
- OAuth sync package (`@tocld/oauth-sync`) includes offline queue for operations
- Network status hooks: `useNetworkStatus()`, `useOfflineQuery()`

### Universal Components
- Components have `.tsx` (web) and `.native.tsx` (mobile) variants
- Shared logic in `.ts` files
- Pattern used in feature UI and registry components

### Example Pages
- `/pricing` - Pricing page with Stripe/Polar checkout
- `/dashboard/billing` - Subscription management
- `/dashboard/integrations` - OAuth connections dashboard

## Environment Variables

### Required for Production
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
POSTGRES_URL=postgresql://user:pass@host:5432/db

# Optional Features
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
GMAIL_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxx
```

### Mock Mode (Development)
- No env vars needed - just run `bun dev`
- Auto-detects missing credentials and enables mock mode
- Set `NEXT_PUBLIC_MOCK_AUTH=true` to force mock mode

## Testing

### Run Tests
```bash
# All packages
bun test

# Specific package
bun test --filter @tocld/api
```

### Testing with Mock Mode
```bash
unset POSTGRES_URL
bun dev
# Visit http://localhost:3000 - shows mock data
```

## Deployment

### Next.js (Vercel)
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Configure webhook URLs in Stripe/OAuth providers
4. Deploy automatically on push to main

### Expo (EAS)
```bash
cd apps/expo
eas build --platform all
eas submit --platform all
```

## NativeWind Configuration (Expo)

**CRITICAL: The Expo app uses NativeWind v4.x (stable) - DO NOT upgrade to v5 preview versions!**

### Why NativeWind v4?
- NativeWind v5.0.0-preview.1 has critical bugs:
  - CSS deserialization failures with `@tailwind` directives
  - Incomplete className processing
  - Unstable preview release with missing features
- NativeWind v4.2.1+ is stable and works reliably with Expo 54 + React Native 0.81.4

### Working Configuration (DO NOT MODIFY)

**apps/expo/package.json:**
```json
{
  "dependencies": {
    "nativewind": "^4.1.23"  // Keep on v4.x - do not upgrade to v5 preview
  }
}
```

**apps/expo/src/styles.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**apps/expo/babel.config.js:**
```javascript
module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"],  // No jsxImportSource needed
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

**apps/expo/metro.config.js:**
```javascript
module.exports = withNativeWind(configWithCache, {
  input: "./src/styles.css",  // Must point to CSS file
  configPath: "./tailwind.config.ts",
});
```

**apps/expo/src/app/_layout.tsx:**
```typescript
import "../styles.css";  // Must import CSS at top of root layout
```

**apps/expo/tailwind.config.ts:**
- Uses standard Tailwind v3.4.17
- Includes NativeWind preset: `presets: [baseConfig, nativewind]`
- Colors defined directly in theme (no CSS variables)

### If Styles Break
1. Check NativeWind version is v4.x (not v5)
2. Verify CSS import is in `_layout.tsx`
3. Confirm `metro.config.js` has `input: "./src/styles.css"`
4. Clear all caches: `rm -rf .expo node_modules/.cache .cache && npx expo start --clear`
5. DO NOT add `jsxImportSource: "nativewind"` to babel config (causes runtime errors)

## Important Notes

- **Always check `ctx.isMockMode`** in new tRPC procedures that need database
- **Use conditional imports** for feature modules in root router
- **Create universal components** with `.tsx` + `.native.tsx` variants
- **Add mock data** to `packages/api/src/mock-data.ts` for new entities
- **Export from `packages/db/src/schema.ts`** after adding new schema files
- **Rebuild registry** (`bun run registry:build`) after modifying shadcn components
- **NEVER upgrade NativeWind** in apps/expo to v5 preview - keep on v4.x stable
