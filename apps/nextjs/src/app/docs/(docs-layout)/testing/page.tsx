import { DocsLayout } from "@/components/docs/docs-layout";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TestTube, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function TestingPage() {
  return (
    <DocsLayout
      title="Testing Guide"
      description="Comprehensive testing guide for all features"
      breadcrumbs={[{ label: "Testing" }]}
    >
      <div className="space-y-8">
        {/* Quick Start */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Quick Start (No Setup)</h2>
          </div>

          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Works Out of the Box!</AlertTitle>
            <AlertDescription>
              The template works immediately with mock mode - no external services needed.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test Checklist</h3>
            <div className="grid gap-2">
              {[
                { page: "/pricing", desc: "All 3 pricing cards display" },
                { page: "/dashboard/billing", desc: "Shows Pro Plan subscription" },
                { page: "/dashboard/integrations", desc: "Shows Gmail integration" },
                { page: "/dashboard", desc: "Tasks can be created/deleted" },
              ].map((item) => (
                <div key={item.page} className="flex items-start gap-2 text-sm border rounded p-2">
                  <Badge variant="outline" className="shrink-0 mt-0.5">✓</Badge>
                  <div>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{item.page}</code>
                    <span className="text-muted-foreground"> - {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testing Payments */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Testing Payments (Stripe)</h2>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">1. Setup Stripe CLI</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe

# Linux
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12 text-xs">
                  <code>
{`# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. Start Webhook Forwarding</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code="stripe listen --forward-to localhost:3000/api/webhooks/stripe" />
                </div>
                <pre className="rounded-lg bg-muted p-3 text-xs">
                  <code>stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Copy the webhook secret (starts with <code className="rounded bg-muted px-1 py-0.5">whsec_</code>) to your <code className="rounded bg-muted px-1 py-0.5">.env</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">3. Test Checkout Flow</h3>
              <ol className="space-y-2 pl-6 list-decimal text-sm">
                <li>Visit <code className="rounded bg-muted px-1 py-0.5">http://localhost:3000/pricing</code></li>
                <li>Click "Get Started" button</li>
                <li>Use test card: <code className="rounded bg-muted px-1 py-0.5">4242 4242 4242 4242</code></li>
                <li>Any future date and CVC</li>
                <li>Complete checkout → Redirects to dashboard</li>
                <li>Check Stripe CLI terminal for webhook events</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">4. Trigger Test Events</h3>
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`# Test successful payment
stripe trigger payment_intent.succeeded

# Test subscription created
stripe trigger customer.subscription.created

# Test failed payment
stripe trigger invoice.payment_failed`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12 text-xs">
                  <code>
{`# Test successful payment
stripe trigger payment_intent.succeeded

# Test subscription created
stripe trigger customer.subscription.created

# Test failed payment
stripe trigger invoice.payment_failed`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Testing OAuth */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Testing OAuth Integrations</h2>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Gmail OAuth</h3>
              <ol className="space-y-2 pl-6 list-decimal text-sm">
                <li>Create Google Cloud project at <a href="https://console.cloud.google.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">console.cloud.google.com</a></li>
                <li>Enable Gmail API</li>
                <li>Create OAuth 2.0 Client ID (Web application)</li>
                <li>Add redirect URI: <code className="rounded bg-muted px-1 py-0.5">http://localhost:3000/api/auth/callback/gmail</code></li>
                <li>Add credentials to <code className="rounded bg-muted px-1 py-0.5">.env</code></li>
              </ol>

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

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Test OAuth Flow</h3>
              <ol className="space-y-1 pl-6 list-decimal text-sm">
                <li>Visit <code className="rounded bg-muted px-1 py-0.5">/dashboard/integrations</code></li>
                <li>Click "Connect Gmail"</li>
                <li>Google OAuth consent screen appears</li>
                <li>Grant permissions</li>
                <li>Redirects back to app with success message</li>
                <li>Gmail appears in "Connected" section</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Common Issues & Fixes</h2>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">Cannot find module '@tocld/features-payments'</h3>
                  <p className="text-sm text-muted-foreground">Run <code className="rounded bg-muted px-1 py-0.5">bun install</code></p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">Webhook signature verification fails</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure you're using the webhook secret from <code className="rounded bg-muted px-1 py-0.5">stripe listen</code>
                  </p>
                  <pre className="rounded bg-muted p-2 text-xs">
                    <code>STRIPE_WEBHOOK_SECRET=whsec_...</code>
                  </pre>
                  <p className="text-sm text-muted-foreground">Restart dev server after adding</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">OAuth redirect_uri_mismatch</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the exact callback URL to your OAuth app settings:
                  </p>
                  <pre className="rounded bg-muted p-2 text-xs">
                    <code>http://localhost:3000/api/auth/callback/gmail</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold">Payment provider not configured</h3>
                  <p className="text-sm text-muted-foreground">
                    Add Stripe environment variables to <code className="rounded bg-muted px-1 py-0.5">.env</code> and restart server
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Checklist */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Complete Test Checklist</h2>

          <div className="space-y-3">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">Mock Mode (No Setup)</h3>
              <div className="space-y-2">
                {[
                  "Landing page loads",
                  "Pricing cards display",
                  "Dashboard loads with mock data",
                  "Billing shows mock subscription",
                  "Integrations shows mock Gmail",
                  "Tasks can be created/deleted"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">Stripe Integration</h3>
              <div className="space-y-2">
                {[
                  "Checkout button redirects to Stripe",
                  "Test card completes checkout",
                  "Webhook receives events",
                  "Subscription created in database",
                  "Billing portal opens",
                  "Can cancel subscription",
                  "Can resume subscription"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold">OAuth Integration</h3>
              <div className="space-y-2">
                {[
                  "Connect button redirects to provider",
                  "OAuth consent screen appears",
                  "Callback processes successfully",
                  "Integration appears in list",
                  "Can disconnect integration",
                  "Tokens stored in database"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Next Steps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="/docs/quickstart" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Quick Start →</h3>
              <p className="text-sm text-muted-foreground">Get up and running in 60 seconds</p>
            </a>
            <a href="/docs/features" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Features →</h3>
              <p className="text-sm text-muted-foreground">Learn about modular features</p>
            </a>
            <a href="/pricing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Try Pricing →</h3>
              <p className="text-sm text-muted-foreground">Test the pricing page</p>
            </a>
            <a href="/dashboard/billing" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Test Billing →</h3>
              <p className="text-sm text-muted-foreground">See subscription management</p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
