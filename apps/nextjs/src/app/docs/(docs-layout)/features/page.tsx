import { DocsLayout } from "@/components/docs/docs-layout";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { Alert, AlertDescription, AlertTitle } from "@tocld/ui/alert";
import { Badge } from "@tocld/ui/badge";
import { CreditCard, Zap, Info } from "lucide-react";

export default function FeaturesPage() {
  return (
    <DocsLayout
      title="Features"
      description="Learn how to use the modular features system"
      breadcrumbs={[{ label: "Features" }]}
    >
      <div className="space-y-8">
        {/* Philosophy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Philosophy</h2>
          <p className="text-muted-foreground">
            This template uses <strong>optional feature modules</strong> that can be added or removed
            without breaking the app. Each feature is self-contained with its own types, routers, UI, and logic.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Add/remove without breaking",
              "Self-contained modules",
              "Auto-register with main app",
              "Work with mock mode",
              "Tree-shaken when unused",
              "Zero bundle bloat"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="shrink-0">✓</Badge>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Available Features */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Available Features</h2>

          {/* Payments Feature */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Payments</h3>
                <code className="text-xs text-muted-foreground">@tocld/features-payments</code>
              </div>
              <Badge className="ml-auto">Ready</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Stripe/Polar subscriptions, webhooks, and billing portal integration.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">What's Included:</h4>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li>• Checkout buttons</li>
                <li>• Subscription management</li>
                <li>• Billing portal</li>
                <li>• Webhook handlers</li>
                <li>• Payment tracking</li>
                <li>• Cancel/resume subscriptions</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Usage Example:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`import { CheckoutButton } from "@tocld/features-payments/ui";

export default function PricingPage() {
  return (
    <CheckoutButton
      priceId="price_1234"
      successUrl="/dashboard?success=true"
    >
      Subscribe Now
    </CheckoutButton>
  );
}`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`import { CheckoutButton } from "@tocld/features-payments/ui";

export default function PricingPage() {
  return (
    <CheckoutButton
      priceId="price_1234"
      successUrl="/dashboard?success=true"
    >
      Subscribe Now
    </CheckoutButton>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Environment Variables:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`} />
                </div>
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
{`STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`}
                  </code>
                </pre>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Mock Mode Support</AlertTitle>
              <AlertDescription>
                Works without Stripe credentials in development - returns mock subscription data.
              </AlertDescription>
            </Alert>
          </div>

          {/* Finance Feature */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Finance</h3>
                <code className="text-xs text-muted-foreground">@tocld/features-finance</code>
              </div>
              <Badge className="ml-auto">Ready</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Complete finance management with invoices, expenses, and time tracking.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">What's Included:</h4>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li>• Invoice management</li>
                <li>• Expense tracking by category</li>
                <li>• Time tracking with timer</li>
                <li>• Billable hours calculation</li>
                <li>• Statistics dashboard</li>
                <li>• Project-based organization</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Usage Example:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { InvoiceForm } from "@tocld/features-finance/ui";

export default function InvoicesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: invoices } = useQuery(trpc.invoice.list.queryOptions({}));

  const createMutation = useMutation(trpc.invoice.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  }));

  return (
    <div>
      <InvoiceForm onSubmit={(data) => createMutation.mutate(data)} />
      <InvoiceList data={invoices} />
    </div>
  );
}`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { InvoiceForm } from "@tocld/features-finance/ui";

export default function InvoicesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: invoices } = useQuery(trpc.invoice.list.queryOptions({}));

  const createMutation = useMutation(trpc.invoice.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  }));

  return (
    <div>
      <InvoiceForm onSubmit={(data) => createMutation.mutate(data)} />
      <InvoiceList data={invoices} />
    </div>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Mock Mode Support</AlertTitle>
              <AlertDescription>
                Works without database - returns mock invoices, expenses, and time entries.
              </AlertDescription>
            </Alert>
          </div>

          {/* Voice Chat Feature */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Voice Chat</h3>
                <code className="text-xs text-muted-foreground">@tocld/ui/conversation</code>
              </div>
              <Badge className="ml-auto">Ready</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              ElevenLabs conversational AI integration with voice and text input.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">What's Included:</h4>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li>• Voice input and output</li>
                <li>• Text chat interface</li>
                <li>• Real-time streaming</li>
                <li>• Conversation history</li>
                <li>• Visual orb animation</li>
                <li>• Demo mode (no API key)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Usage Example:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`"use client";
import { useState } from "react";
import { Conversation, ConversationBar } from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message } from "@tocld/ui/message";

export default function VoiceChatPage() {
  const [messages, setMessages] = useState([]);

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((msg) => (
          <Message key={msg.id} from={msg.role}>
            {msg.content}
          </Message>
        ))}
      </ConversationContent>
      <ConversationBar
        agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        onMessage={(msg) => setMessages([...messages, msg])}
      />
    </Conversation>
  );
}`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`"use client";
import { useState } from "react";
import { Conversation, ConversationBar } from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message } from "@tocld/ui/message";

export default function VoiceChatPage() {
  const [messages, setMessages] = useState([]);

  return (
    <Conversation>
      <ConversationContent>
        {messages.map((msg) => (
          <Message key={msg.id} from={msg.role}>
            {msg.content}
          </Message>
        ))}
      </ConversationContent>
      <ConversationBar
        agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        onMessage={(msg) => setMessages([...messages, msg])}
      />
    </Conversation>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Environment Variables:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`# Optional - works in demo mode without this
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-agent-id`} />
                </div>
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
{`# Optional - works in demo mode without this
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-agent-id`}
                  </code>
                </pre>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Graceful Degradation</AlertTitle>
              <AlertDescription>
                Works in demo mode without ElevenLabs credentials. Shows setup banner when not configured.
              </AlertDescription>
            </Alert>
          </div>

          {/* Integrations Feature */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Integrations</h3>
                <code className="text-xs text-muted-foreground">@tocld/features-integrations</code>
              </div>
              <Badge className="ml-auto">Ready</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              OAuth integrations for Gmail, Outlook, and more with token management and sync.
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">What's Included:</h4>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li>• Gmail OAuth flow</li>
                <li>• Outlook OAuth flow</li>
                <li>• Token management</li>
                <li>• Auto-refresh tokens</li>
                <li>• Connection status</li>
                <li>• Disconnect functionality</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Usage Example:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`import { IntegrationsList } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div>
      <h1>Connected Apps</h1>
      <IntegrationsList />
    </div>
  );
}`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12">
                  <code className="text-sm">
{`import { IntegrationsList } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div>
      <h1>Connected Apps</h1>
      <IntegrationsList />
    </div>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Environment Variables:</h4>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000`} />
                </div>
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
{`GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* How Features Work */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">How Features Work</h2>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">1. Auto-Detection</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                The main tRPC router automatically detects installed features:
              </p>
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
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
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

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">2. Conditional Imports</h3>
              <p className="text-sm text-muted-foreground">
                Your app code can safely import feature modules. If removed, build fails with clear error.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">3. Mock Mode Support</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                All routers check <code className="rounded bg-muted px-1 py-0.5">ctx.isMockMode</code>:
              </p>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`if (ctx.isMockMode) {
  return { id: "sub_mock", status: "active", ... };
}
// Real implementation
return ctx.db.query.subscriptions.findFirst(...);`} />
                </div>
                <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                  <code>
{`if (ctx.isMockMode) {
  return { id: "sub_mock", status: "active", ... };
}
// Real implementation
return ctx.db.query.subscriptions.findFirst(...);`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Removing Features */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Removing Features</h2>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Clean Removal Process</AlertTitle>
            <AlertDescription>
              Features can be completely removed without affecting the core app.
            </AlertDescription>
          </Alert>

          <ol className="space-y-3 pl-6 list-decimal">
            <li className="text-sm">
              <strong>Delete the feature directory:</strong>
              <pre className="mt-2 rounded-lg bg-muted p-2 text-xs">
                <code>rm -rf packages/features/payments</code>
              </pre>
            </li>

            <li className="text-sm">
              <strong>Remove imports</strong> from your app code (optional - build will fail with clear errors if you miss any)
            </li>

            <li className="text-sm">
              <strong>Restart dev server:</strong>
              <pre className="mt-2 rounded-lg bg-muted p-2 text-xs">
                <code>bun dev</code>
              </pre>
            </li>
          </ol>

          <p className="text-sm text-muted-foreground">
            The feature router will no longer be registered, and your bundle size will be reduced automatically.
          </p>
        </section>

        {/* Adding New Features */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Adding New Features</h2>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Feature Structure</h3>
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CodeBlockCopy code={`packages/features/my-feature/
├── src/
│   ├── types.ts              # Zod schemas
│   ├── providers/            # Business logic
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers
│   ├── ui/                   # UI components
│   └── index.ts              # Exports
├── package.json
└── tsconfig.json`} />
              </div>
              <pre className="rounded-lg bg-muted p-4 pr-12">
                <code className="text-sm">
{`packages/features/my-feature/
├── src/
│   ├── types.ts              # Zod schemas
│   ├── providers/            # Business logic
│   ├── routers/              # tRPC routers
│   ├── webhooks/             # Webhook handlers
│   ├── ui/                   # UI components
│   └── index.ts              # Exports
├── package.json
└── tsconfig.json`}
                </code>
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Feature Manifest</h3>
            <p className="text-sm text-muted-foreground">Every feature exports a manifest:</p>
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CodeBlockCopy code={`export const myFeatureManifest = {
  name: "my-feature",
  version: "1.0.0",
  description: "What this feature does",
  enabled: true,
  requiredEnvVars: ["MY_API_KEY"],
  webhooks: [{ path: "/api/webhooks/my-service", provider: "my-service" }],
  routers: ["myRouter"],
};`} />
              </div>
              <pre className="rounded-lg bg-muted p-4 pr-12">
                <code className="text-sm">
{`export const myFeatureManifest = {
  name: "my-feature",
  version: "1.0.0",
  description: "What this feature does",
  enabled: true,
  requiredEnvVars: ["MY_API_KEY"],
  webhooks: [{ path: "/api/webhooks/my-service", provider: "my-service" }],
  routers: ["myRouter"],
};`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Example Pages */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Example Pages</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/pricing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Payments</Badge>
              <h3 className="mb-1 font-semibold">Pricing Page →</h3>
              <p className="text-sm text-muted-foreground">Checkout with Stripe/Polar</p>
            </a>
            <a href="/dashboard/billing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Payments</Badge>
              <h3 className="mb-1 font-semibold">Billing →</h3>
              <p className="text-sm text-muted-foreground">Subscription management</p>
            </a>
            <a href="/dashboard/invoices" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Finance</Badge>
              <h3 className="mb-1 font-semibold">Invoices →</h3>
              <p className="text-sm text-muted-foreground">Invoice management</p>
            </a>
            <a href="/dashboard/expenses" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Finance</Badge>
              <h3 className="mb-1 font-semibold">Expenses →</h3>
              <p className="text-sm text-muted-foreground">Expense tracking</p>
            </a>
            <a href="/dashboard/time" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Finance</Badge>
              <h3 className="mb-1 font-semibold">Time Tracking →</h3>
              <p className="text-sm text-muted-foreground">Billable hours timer</p>
            </a>
            <a href="/dashboard/voice-chat" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">AI</Badge>
              <h3 className="mb-1 font-semibold">Voice Chat →</h3>
              <p className="text-sm text-muted-foreground">ElevenLabs AI conversation</p>
            </a>
            <a href="/dashboard/integrations" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Integrations</Badge>
              <h3 className="mb-1 font-semibold">Integrations →</h3>
              <p className="text-sm text-muted-foreground">OAuth connections</p>
            </a>
            <a href="/docs/blocks" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Blocks</Badge>
              <h3 className="mb-1 font-semibold">Feature Blocks →</h3>
              <p className="text-sm text-muted-foreground">Copy-paste ready components</p>
            </a>
            <a href="/docs/testing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <Badge className="mb-2">Testing</Badge>
              <h3 className="mb-1 font-semibold">Testing Guide →</h3>
              <p className="text-sm text-muted-foreground">Test all features</p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
