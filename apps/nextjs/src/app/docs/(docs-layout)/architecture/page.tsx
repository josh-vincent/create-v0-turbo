import { DocsLayout } from "@/components/docs/docs-layout";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { Alert, AlertDescription, AlertTitle } from "@tocld/ui/alert";
import { Badge } from "@tocld/ui/badge";
import { Layers, Package, FileCode, Blocks } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <DocsLayout
      title="Architecture"
      description="Understand the hybrid modular system and design patterns"
      breadcrumbs={[{ label: "Architecture" }]}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground">
            This project uses a <strong>hybrid architecture</strong> combining modular feature packages
            (full-stack modules) with a shadcn registry system (installable UI components). This gives
            you backend modularity and frontend flexibility.
          </p>

          <Alert>
            <Layers className="h-4 w-4" />
            <AlertTitle>Two-Layer System</AlertTitle>
            <AlertDescription>
              <strong>Layer 1:</strong> Modular feature packages with backend logic
              <br />
              <strong>Layer 2:</strong> Shadcn registry for UI components
            </AlertDescription>
          </Alert>
        </section>

        {/* Monorepo Structure */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Monorepo Structure</h2>
          </div>

          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <CodeBlockCopy code={`create-v0-turbo/
├── apps/
│   ├── nextjs/          # Next.js 15 dashboard
│   └── expo/            # Expo 53 mobile app
├── packages/
│   ├── api/             # tRPC API routes
│   ├── db/              # Drizzle schemas (modular)
│   ├── supabase/        # Supabase client
│   ├── oauth-sync/      # OAuth with offline sync
│   ├── ui/              # Shared UI components
│   ├── validators/      # Zod schemas
│   └── features/        # Optional feature modules
│       ├── payments/    # Stripe/Polar integration
│       └── integrations/ # OAuth integrations
└── tooling/
    ├── tailwind/        # Tailwind config
    └── typescript/      # TypeScript configs`} />
            </div>
            <pre className="rounded-lg bg-muted p-4 pr-12">
              <code className="text-sm">
{`create-v0-turbo/
├── apps/
│   ├── nextjs/          # Next.js 15 dashboard
│   └── expo/            # Expo 53 mobile app
├── packages/
│   ├── api/             # tRPC API routes
│   ├── db/              # Drizzle schemas (modular)
│   ├── supabase/        # Supabase client
│   ├── oauth-sync/      # OAuth with offline sync
│   ├── ui/              # Shared UI components
│   ├── validators/      # Zod schemas
│   └── features/        # Optional feature modules
│       ├── payments/    # Stripe/Polar integration
│       └── integrations/ # OAuth integrations
└── tooling/
    ├── tailwind/        # Tailwind config
    └── typescript/      # TypeScript configs`}
              </code>
            </pre>
          </div>
        </section>

        {/* Package Namespace */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Package Namespace</h2>
          <p className="text-muted-foreground">
            All packages use the <code className="rounded bg-muted px-2 py-1 font-mono text-sm">@tocld</code> namespace:
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { name: "@tocld/api", desc: "tRPC API routes" },
              { name: "@tocld/db", desc: "Drizzle schemas" },
              { name: "@tocld/supabase", desc: "Auth client" },
              { name: "@tocld/mocks", desc: "MSW handlers" },
              { name: "@tocld/oauth-sync", desc: "OAuth sync" },
              { name: "@tocld/ui", desc: "UI components" },
              { name: "@tocld/validators", desc: "Zod schemas" },
            ].map((pkg) => (
              <div key={pkg.name} className="rounded-lg border bg-card p-3">
                <code className="text-sm font-semibold">{pkg.name}</code>
                <p className="mt-1 text-xs text-muted-foreground">{pkg.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Optional Feature Modules</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { name: "@tocld/features-payments", desc: "Stripe/Polar payments" },
                { name: "@tocld/features-integrations", desc: "OAuth integrations" },
              ].map((pkg) => (
                <div key={pkg.name} className="rounded-lg border border-dashed bg-card p-3">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold">{pkg.name}</code>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{pkg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modular Features */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Modular Feature Packages</h2>
          </div>

          <p className="text-muted-foreground">
            Features are full-stack modules that can be added or removed without affecting the core.
          </p>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">How It Works</h3>

            <div className="space-y-2">
              <h4 className="font-semibold">1. Conditional Imports</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`// packages/api/src/root.ts
let subscriptionRouter: any;
try {
  subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
} catch {
  // Feature not installed - skip
}

export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
});`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`// packages/api/src/root.ts
let subscriptionRouter: any;
try {
  subscriptionRouter = require("@tocld/features-payments/routers").subscriptionRouter;
} catch {
  // Feature not installed - skip
}

export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
});`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2. Feature Structure</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`packages/features/{feature}/
├── src/
│   ├── types.ts              # Zod schemas
│   ├── providers/            # Business logic
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers
│   ├── callbacks/            # OAuth callbacks
│   ├── ui/                   # UI components
│   └── index.ts              # Exports
├── package.json
└── tsconfig.json`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`packages/features/{feature}/
├── src/
│   ├── types.ts              # Zod schemas
│   ├── providers/            # Business logic
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers
│   ├── callbacks/            # OAuth callbacks
│   ├── ui/                   # UI components
│   └── index.ts              # Exports
├── package.json
└── tsconfig.json`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Database Schemas */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Modular Database Schemas</h2>
          </div>

          <p className="text-muted-foreground">
            All schemas are modular and located in <code className="rounded bg-muted px-2 py-1 font-mono text-sm">packages/db/src/schema/</code>:
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { file: "profiles.ts", desc: "User profiles (linked to Supabase)" },
              { file: "teams.ts", desc: "Team/workspace management" },
              { file: "tasks.ts", desc: "Example task tracking" },
              { file: "payments.ts", desc: "Stripe/Polar subscriptions" },
              { file: "integrations.ts", desc: "OAuth connections" },
            ].map((schema) => (
              <div key={schema.file} className="rounded-lg border bg-card p-3">
                <code className="text-sm font-semibold">{schema.file}</code>
                <p className="mt-1 text-xs text-muted-foreground">{schema.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Design Patterns */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Key Design Patterns</h2>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">1. Universal Components</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Components have both web and native implementations:
              </p>
              <ul className="space-y-1 text-sm">
                <li><code className="rounded bg-muted px-1 py-0.5">button.tsx</code> - Web (React)</li>
                <li><code className="rounded bg-muted px-1 py-0.5">button.native.tsx</code> - Native (React Native)</li>
                <li><code className="rounded bg-muted px-1 py-0.5">button.ts</code> - Shared logic</li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">2. Mock Mode Support</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                All tRPC procedures check <code className="rounded bg-muted px-1 py-0.5">ctx.isMockMode</code>:
              </p>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`if (ctx.isMockMode) {
  logMockUsage("task", "all");
  return getAllMockTasks();
}
// Real database query...`} />
                </div>
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
{`if (ctx.isMockMode) {
  logMockUsage("task", "all");
  return getAllMockTasks();
}
// Real database query...`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">3. Offline-First with TanStack Query</h3>
              <p className="text-sm text-muted-foreground">
                Data persists to localStorage (web) and AsyncStorage (mobile) automatically.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">4. Type-Safe APIs with tRPC</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end type safety from database to UI without code generation.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Learn More</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="/docs/features" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Features Guide →</h3>
              <p className="text-sm text-muted-foreground">How to use modular features</p>
            </a>
            <a href="/docs/testing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Testing →</h3>
              <p className="text-sm text-muted-foreground">Test your features</p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
