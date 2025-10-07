import { DocsLayout } from "@/components/docs/docs-layout";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Terminal, Rocket, CreditCard, Link as LinkIcon } from "lucide-react";

export default function QuickStartPage() {
  return (
    <DocsLayout
      title="Quick Start"
      description="Get up and running in under 60 seconds"
      breadcrumbs={[{ label: "Quick Start" }]}
    >
      <div className="space-y-8">
        {/* Zero Config Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Option 1: Zero Config (Mock Mode)</h2>
          </div>

          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Setup Required!</AlertTitle>
            <AlertDescription>
              Everything works with mock data - no Stripe, Gmail, or database needed.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CodeBlockCopy code="bun install" />
              </div>
              <pre className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  {`# 1. Install dependencies
bun install

# 2. Start dev server
bun dev:next

# 3. Open browser
open http://localhost:3000`}
                </code>
              </pre>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-semibold">Try these pages:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code className="rounded bg-muted px-2 py-1">http://localhost:3000/pricing</code> - Pricing with checkout
                </li>
                <li>
                  <code className="rounded bg-muted px-2 py-1">http://localhost:3000/dashboard/billing</code> - Mock subscription
                </li>
                <li>
                  <code className="rounded bg-muted px-2 py-1">http://localhost:3000/dashboard/integrations</code> - Mock OAuth
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">What Works:</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "All UI components render",
                  "tRPC API returns mock data",
                  "Checkout buttons work",
                  "Subscription management",
                  "OAuth integrations",
                  "Full development workflow"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="shrink-0">✓</Badge>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stripe Section */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Option 2: Test With Real Stripe</h2>
            <Badge>5 Minutes</Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">1. Get Stripe Test Keys</h3>
              <ol className="list-decimal space-y-1 pl-6 text-sm">
                <li>Sign up at <a href="https://dashboard.stripe.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">dashboard.stripe.com</a></li>
                <li>Go to Developers → API keys</li>
                <li>Copy your test keys (start with <code className="rounded bg-muted px-1 py-0.5">sk_test_</code>)</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. Create Test Products</h3>
              <ol className="list-decimal space-y-1 pl-6 text-sm">
                <li>Go to Products → Add product</li>
                <li>Create "Pro Plan" at $29/month</li>
                <li>Copy the Price ID (starts with <code className="rounded bg-muted px-1 py-0.5">price_</code>)</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">3. Configure</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`} />
                </div>
                <pre className="rounded-lg bg-muted p-4">
                  <code className="text-sm">
                    {`# .env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">4. Update Pricing Page</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`const plans = [
  {
    name: "Pro",
    priceId: "price_YOUR_STRIPE_PRICE_ID",
  },
];`} />
                </div>
                <pre className="rounded-lg bg-muted p-4">
                  <code className="text-sm">
                    {`// apps/nextjs/src/app/pricing/page.tsx
const plans = [
  {
    name: "Pro",
    priceId: "price_YOUR_STRIPE_PRICE_ID", // ← Paste here
  },
];`}
                  </code>
                </pre>
              </div>
            </div>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Test Card</AlertTitle>
              <AlertDescription>
                Use <code className="rounded bg-muted px-1 py-0.5">4242 4242 4242 4242</code> with any future date and CVC
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Gmail OAuth Section */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Option 3: Add Gmail OAuth</h2>
            <Badge>5 Minutes</Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">1. Create Google Cloud Project</h3>
              <ol className="list-decimal space-y-1 pl-6 text-sm">
                <li>Go to <a href="https://console.cloud.google.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">console.cloud.google.com</a></li>
                <li>Create project → Enable Gmail API</li>
                <li>OAuth consent screen → External → Create</li>
                <li>Credentials → Create OAuth Client ID → Web application</li>
                <li>Add redirect: <code className="rounded bg-muted px-1 py-0.5">http://localhost:3000/api/auth/callback/gmail</code></li>
                <li>Copy Client ID and Secret</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. Configure</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000`} />
                </div>
                <pre className="rounded-lg bg-muted p-4">
                  <code className="text-sm">
                    {`# .env
GMAIL_CLIENT_ID=...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">3. Test</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`bun dev:next
open http://localhost:3000/dashboard/integrations`} />
                </div>
                <pre className="rounded-lg bg-muted p-4">
                  <code className="text-sm">
                    {`# Restart server
bun dev:next

# Visit integrations
open http://localhost:3000/dashboard/integrations

# Click "Connect Gmail" → Real OAuth flow!`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Next Steps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="/docs/testing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Testing Guide →</h3>
              <p className="text-sm text-muted-foreground">Comprehensive testing documentation</p>
            </a>
            <a href="/docs/features" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Features →</h3>
              <p className="text-sm text-muted-foreground">How to use modular features</p>
            </a>
            <a href="/docs/architecture" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Architecture →</h3>
              <p className="text-sm text-muted-foreground">Understand the system design</p>
            </a>
            <a href="/pricing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Try It Live →</h3>
              <p className="text-sm text-muted-foreground">Test the pricing page</p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
