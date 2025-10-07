import { DocsLayout } from "@/components/docs/docs-layout";
import { Alert, AlertDescription, AlertTitle } from "@tocld/ui/alert";
import { Badge } from "@tocld/ui/badge";
import { Info, Server, Smartphone } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { BlockWrapper } from "@/components/blocks/block-wrapper";
import { ComponentPreview } from "@/components/blocks/component-preview";
import { BlockCodeViewer } from "@/components/blocks/block-code-viewer";
import { blocksRegistry } from "@/components/blocks/blocks-registry";
import {
  DashboardBlockExample,
  AnalyticsBlockExample,
  InvoiceBlockExample,
  ExpenseBlockExample,
  TimeTrackingBlockExample,
  VoiceChatBlockExample,
  IntegrationsBlockExample,
  BillingBlockExample,
} from "../_components/ui-examples";

// Map block names to their preview components
const blockPreviews: Record<string, React.ReactNode> = {
  dashboard: <DashboardBlockExample />,
  analytics: <AnalyticsBlockExample />,
  invoices: <InvoiceBlockExample />,
  expenses: <ExpenseBlockExample />,
  "time-tracking": <TimeTrackingBlockExample />,
  "voice-chat": <VoiceChatBlockExample />,
  integrations: <IntegrationsBlockExample />,
  billing: <BillingBlockExample />,
};

export default function BlocksPage() {
  return (
    <DocsLayout
      title="Feature Blocks"
      description="Pre-built, copy-paste ready feature components with server-side, client-side, and UI examples"
      breadcrumbs={[{ label: "Blocks" }]}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>What are Blocks?</AlertTitle>
            <AlertDescription>
              Blocks are complete, production-ready feature components that you can copy and paste into your app.
              Each block includes server-side data fetching, client-side interactions, and beautiful UI components.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Server className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Server Components</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Client Interactions</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Shadcn UI</span>
            </div>
          </div>
        </section>

        {/* Available Blocks */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-2xl font-bold">Available Blocks</h2>

          {blocksRegistry.map((block) => (
            <BlockWrapper
              key={block.name}
              name={block.name}
              title={block.title}
              description={block.description}
              category={block.category}
              icon={<block.icon className="h-5 w-5 text-primary" />}
              liveUrl={block.liveUrl}
            >
              {/* Preview */}
              <ComponentPreview name={block.name}>
                {blockPreviews[block.name]}
              </ComponentPreview>

              {/* Code */}
              {block.code && <BlockCodeViewer code={block.code} />}

              {/* tRPC Routes */}
              {block.routes && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">tRPC Routes</Badge>
                  {block.routes.map((route) => (
                    <code key={route} className="text-xs rounded bg-muted px-2 py-1">
                      {route}
                    </code>
                  ))}
                </div>
              )}
            </BlockWrapper>
          ))}
        </section>

        {/* Common Patterns */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Common Patterns</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Server Components</h3>
              <BlockCodeViewer
                code={`import { api } from "@/trpc/server";

export default async function Page() {
  const data = await api.router.query();
  return <div>{data}</div>;
}`}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Client Components</h3>
              <BlockCodeViewer
                code={`"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.router.query.queryOptions()
  );
  return <div>{data}</div>;
}`}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Mutations</h3>
              <BlockCodeViewer
                code={`const queryClient = useQueryClient();

const mutation = useMutation(
  trpc.router.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.router.pathFilter()
      );
    },
  })
);`}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">UI Components</h3>
              <BlockCodeViewer
                code={`// Always use @tocld/ui
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";

// Platform-specific:
// .tsx for web
// .native.tsx for mobile`}
              />
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Next Steps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="/docs/features"
              className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <h3 className="mb-1 font-semibold">Feature Modules →</h3>
              <p className="text-sm text-muted-foreground">
                Learn about the modular features system
              </p>
            </a>
            <a
              href="/docs/quickstart"
              className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <h3 className="mb-1 font-semibold">Quick Start →</h3>
              <p className="text-sm text-muted-foreground">
                Get started in 3 simple steps
              </p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
