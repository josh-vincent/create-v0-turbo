import { DocsLayout } from "@/components/docs/docs-layout";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { Alert, AlertDescription, AlertTitle } from "@tocld/ui/alert";
import { Badge } from "@tocld/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tocld/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tocld/ui/tabs";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  CreditCard,
  Clock,
  MessageSquare,
  Zap,
  DollarSign,
  Info,
  Server,
  Smartphone
} from "lucide-react";

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

        {/* Block Categories */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-2xl font-bold">Available Blocks</h2>

          {/* Dashboard Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Dashboard Block</CardTitle>
                  <CardDescription>Task management with stats overview</CardDescription>
                </div>
                <Badge className="ml-auto">Core</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">Server</Badge>
                <span>Server-side rendering with tRPC</span>
              </div>

              <Tabs defaultValue="server">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="server">Server Side</TabsTrigger>
                  <TabsTrigger value="client">Client Side</TabsTrigger>
                  <TabsTrigger value="ui">UI Components</TabsTrigger>
                </TabsList>

                <TabsContent value="server" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Server component with async data fetching:</p>
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`// app/dashboard/page.tsx
import { api } from "@/trpc/server";

export default async function DashboardPage() {
  // Server-side data fetching
  const tasks = await api.task.all();

  return (
    <div>
      <h1>Dashboard</h1>
      <CreateTaskForm />
      <TaskList initialData={tasks} />
    </div>
  );
}`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`// app/dashboard/page.tsx
import { api } from "@/trpc/server";

export default async function DashboardPage() {
  // Server-side data fetching
  const tasks = await api.task.all();

  return (
    <div>
      <h1>Dashboard</h1>
      <CreateTaskForm />
      <TaskList initialData={tasks} />
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="client" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Client component with mutations:</p>
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function CreateTaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.task.pathFilter());
      },
    })
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createTask.mutate({ title: "New Task" });
    }}>
      <Button type="submit">Create Task</Button>
    </form>
  );
}`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function CreateTaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.task.pathFilter());
      },
    })
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createTask.mutate({ title: "New Task" });
    }}>
      <Button type="submit">Create Task</Button>
    </form>
  );
}`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="ui" className="space-y-3">
                  <p className="text-sm text-muted-foreground">UI components used:</p>
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`import { Card, CardContent, CardHeader } from "@tocld/ui/card";
import { Button } from "@tocld/ui/button";
import { Input } from "@tocld/ui/input";
import { Badge } from "@tocld/ui/badge";

// All components are imported from @tocld/ui
// Platform-specific (.tsx for web, .native.tsx for mobile)`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`import { Card, CardContent, CardHeader } from "@tocld/ui/card";
import { Button } from "@tocld/ui/button";
import { Input } from "@tocld/ui/input";
import { Badge } from "@tocld/ui/badge";

// All components are imported from @tocld/ui
// Platform-specific (.tsx for web, .native.tsx for mobile)`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Badge variant="outline">tRPC Routes</Badge>
                <code className="text-xs">task.all</code>
                <code className="text-xs">task.create</code>
                <code className="text-xs">task.delete</code>
              </div>

              <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Analytics Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Analytics Block</CardTitle>
                  <CardDescription>Charts, metrics, and business insights</CardDescription>
                </div>
                <Badge className="ml-auto">Core</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="server">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="server">Server Side</TabsTrigger>
                  <TabsTrigger value="ui">Charts & UI</TabsTrigger>
                </TabsList>

                <TabsContent value="server" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`// Server-side with mock data
export default function AnalyticsPage() {
  const revenueData = [
    { month: "Jan", revenue: 4500, expenses: 2300 },
    { month: "Feb", revenue: 5200, expenses: 2800 },
    // ...
  ];

  return <AnalyticsCharts data={revenueData} />;
}`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`// Server-side with mock data
export default function AnalyticsPage() {
  const revenueData = [
    { month: "Jan", revenue: 4500, expenses: 2300 },
    { month: "Feb", revenue: 5200, expenses: 2800 },
    // ...
  ];

  return <AnalyticsCharts data={revenueData} />;
}`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="ui" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`import { ChartContainer, ChartTooltip } from "@tocld/ui/chart";
import { AreaChart, Area, BarChart, Bar } from "recharts";

<ChartContainer config={chartConfig}>
  <AreaChart data={data}>
    <Area dataKey="revenue" fill="#8884d8" />
    <Area dataKey="expenses" fill="#82ca9d" />
  </AreaChart>
</ChartContainer>`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`import { ChartContainer, ChartTooltip } from "@tocld/ui/chart";
import { AreaChart, Area, BarChart, Bar } from "recharts";

<ChartContainer config={chartConfig}>
  <AreaChart data={data}>
    <Area dataKey="revenue" fill="#8884d8" />
    <Area dataKey="expenses" fill="#82ca9d" />
  </AreaChart>
</ChartContainer>`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <a href="/dashboard/analytics" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Finance Blocks */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Invoice Block</CardTitle>
                  <CardDescription>Invoice management with CRUD operations</CardDescription>
                </div>
                <Badge className="ml-auto">Finance Module</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="client">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="client">Client Side</TabsTrigger>
                  <TabsTrigger value="router">tRPC Router</TabsTrigger>
                  <TabsTrigger value="ui">UI Components</TabsTrigger>
                </TabsList>

                <TabsContent value="client" className="space-y-3">
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
  const { data: stats } = useQuery(trpc.invoice.getStats.queryOptions());

  const createMutation = useMutation(
    trpc.invoice.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invoice.pathFilter());
      },
    })
  );

  return (
    <div>
      <InvoiceForm onSubmit={(data) => createMutation.mutate(data)} />
      <InvoiceTable data={invoices} />
    </div>
  );
}`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { InvoiceForm } from "@tocld/features-finance/ui";

export default function InvoicesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: invoices } = useQuery(trpc.invoice.list.queryOptions({}));
  const { data: stats } = useQuery(trpc.invoice.getStats.queryOptions());

  const createMutation = useMutation(
    trpc.invoice.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invoice.pathFilter());
      },
    })
  );

  return (
    <div>
      <InvoiceForm onSubmit={(data) => createMutation.mutate(data)} />
      <InvoiceTable data={invoices} />
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="router" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`// packages/features/finance/src/routers/invoice.ts
export const invoiceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      return getMockInvoices();
    }
    return ctx.db.query.invoices.findMany({
      where: eq(schema.invoices.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        return { id: "inv_mock", ...input };
      }
      return ctx.db.insert(schema.invoices).values(input);
    }),
});`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`// packages/features/finance/src/routers/invoice.ts
export const invoiceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      return getMockInvoices();
    }
    return ctx.db.query.invoices.findMany({
      where: eq(schema.invoices.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        return { id: "inv_mock", ...input };
      }
      return ctx.db.insert(schema.invoices).values(input);
    }),
});`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="ui" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`import { InvoiceForm } from "@tocld/features-finance/ui";
import { Table, TableBody, TableCell } from "@tocld/ui/table";
import { Badge } from "@tocld/ui/badge";

<InvoiceForm
  onSubmit={(data) => createMutation.mutate(data)}
  isLoading={createMutation.isPending}
/>

<Table>
  {invoices?.map((invoice) => (
    <TableRow key={invoice.id}>
      <TableCell>{invoice.invoiceNumber}</TableCell>
      <TableCell>
        <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
          {invoice.status}
        </Badge>
      </TableCell>
    </TableRow>
  ))}
</Table>`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`import { InvoiceForm } from "@tocld/features-finance/ui";
import { Table, TableBody, TableCell } from "@tocld/ui/table";
import { Badge } from "@tocld/ui/badge";

<InvoiceForm
  onSubmit={(data) => createMutation.mutate(data)}
  isLoading={createMutation.isPending}
/>

<Table>
  {invoices?.map((invoice) => (
    <TableRow key={invoice.id}>
      <TableCell>{invoice.invoiceNumber}</TableCell>
      <TableCell>
        <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
          {invoice.status}
        </Badge>
      </TableCell>
    </TableRow>
  ))}
</Table>`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Badge variant="outline">tRPC Routes</Badge>
                <code className="text-xs">invoice.list</code>
                <code className="text-xs">invoice.create</code>
                <code className="text-xs">invoice.getStats</code>
              </div>

              <a href="/dashboard/invoices" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Expense Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Expense Block</CardTitle>
                  <CardDescription>Expense tracking by category</CardDescription>
                </div>
                <Badge className="ml-auto">Finance Module</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Track expenses with category breakdown, stats, and filtering.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Categories</Badge>
                <code className="text-xs">Software</code>
                <code className="text-xs">Marketing</code>
                <code className="text-xs">Operations</code>
              </div>
              <a href="/dashboard/expenses" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Time Tracking Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Time Tracking Block</CardTitle>
                  <CardDescription>Billable hours timer with project tracking</CardDescription>
                </div>
                <Badge className="ml-auto">Finance Module</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start/stop timer, track billable vs non-billable hours, and organize by project.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Features</Badge>
                <code className="text-xs">Timer</code>
                <code className="text-xs">Billable</code>
                <code className="text-xs">Projects</code>
              </div>
              <a href="/dashboard/time" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Voice Chat Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Voice Chat Block</CardTitle>
                  <CardDescription>ElevenLabs conversational AI integration</CardDescription>
                </div>
                <Badge className="ml-auto">AI</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="client">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client">Client Side</TabsTrigger>
                  <TabsTrigger value="ui">UI Components</TabsTrigger>
                </TabsList>

                <TabsContent value="client" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`"use client";
import { useState } from "react";
import { Conversation, ConversationBar } from "@tocld/ui/conversation";

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
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`"use client";
import { useState } from "react";
import { Conversation, ConversationBar } from "@tocld/ui/conversation";

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
}`}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="ui" className="space-y-3">
                  <div className="relative">
                    <div className="absolute right-2 top-2 z-10">
                      <CodeBlockCopy code={`import {
  Conversation,
  ConversationContent,
  ConversationBar
} from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message, MessageContent } from "@tocld/ui/message";

// Conversation - Container with scroll
// ConversationBar - Voice/text input
// Orb - Animated visual feedback
// Message - Chat message bubble`} />
                    </div>
                    <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                      <code>{`import {
  Conversation,
  ConversationContent,
  ConversationBar
} from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message, MessageContent } from "@tocld/ui/message";

// Conversation - Container with scroll
// ConversationBar - Voice/text input
// Orb - Animated visual feedback
// Message - Chat message bubble`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Graceful Degradation</AlertTitle>
                <AlertDescription>
                  Works in demo mode without ElevenLabs credentials. Shows setup banner when not configured.
                </AlertDescription>
              </Alert>

              <a href="/dashboard/voice-chat" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Integrations Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Integrations Block</CardTitle>
                  <CardDescription>OAuth connections (Gmail, Outlook)</CardDescription>
                </div>
                <Badge className="ml-auto">Integrations Module</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`import { IntegrationsList, ConnectButton } from "@tocld/features-integrations/ui";

// Pre-built integrations list
<IntegrationsList />

// Or individual connect buttons
<ConnectButton provider="gmail" />
<ConnectButton provider="outlook" />`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                  <code>{`import { IntegrationsList, ConnectButton } from "@tocld/features-integrations/ui";

// Pre-built integrations list
<IntegrationsList />

// Or individual connect buttons
<ConnectButton provider="gmail" />
<ConnectButton provider="outlook" />`}</code>
                </pre>
              </div>

              <a href="/dashboard/integrations" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>

          {/* Billing Block */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Billing Block</CardTitle>
                  <CardDescription>Stripe subscription management</CardDescription>
                </div>
                <Badge className="ml-auto">Payments Module</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CodeBlockCopy code={`import { SubscriptionCard } from "@tocld/features-payments/ui";

// Drop-in subscription management
export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <SubscriptionCard />
    </div>
  );
}`} />
                </div>
                <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
                  <code>{`import { SubscriptionCard } from "@tocld/features-payments/ui";

// Drop-in subscription management
export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <SubscriptionCard />
    </div>
  );
}`}</code>
                </pre>
              </div>

              <a href="/dashboard/billing" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                View Live Example →
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Usage Patterns */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Common Patterns</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Server Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10">
                    <CodeBlockCopy code={`import { api } from "@/trpc/server";

export default async function Page() {
  const data = await api.router.query();
  return <div>{data}</div>;
}`} />
                  </div>
                  <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                    <code>{`import { api } from "@/trpc/server";

export default async function Page() {
  const data = await api.router.query();
  return <div>{data}</div>;
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Client Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10">
                    <CodeBlockCopy code={`"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.router.query.queryOptions()
  );
  return <div>{data}</div>;
}`} />
                  </div>
                  <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                    <code>{`"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function Component() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.router.query.queryOptions()
  );
  return <div>{data}</div>;
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mutations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10">
                    <CodeBlockCopy code={`const queryClient = useQueryClient();

const mutation = useMutation(
  trpc.router.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.router.pathFilter()
      );
    },
  })
);`} />
                  </div>
                  <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                    <code>{`const queryClient = useQueryClient();

const mutation = useMutation(
  trpc.router.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.router.pathFilter()
      );
    },
  })
);`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">UI Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10">
                    <CodeBlockCopy code={`// Always use @tocld/ui
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";

// Platform-specific:
// .tsx for web
// .native.tsx for mobile`} />
                  </div>
                  <pre className="rounded-lg bg-muted p-3 pr-12 text-xs">
                    <code>{`// Always use @tocld/ui
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";

// Platform-specific:
// .tsx for web
// .native.tsx for mobile`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-bold">Next Steps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href="/docs/features" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Feature Modules →</h3>
              <p className="text-sm text-muted-foreground">Learn about the modular features system</p>
            </a>
            <a href="/docs/quickstart" className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
              <h3 className="mb-1 font-semibold">Quick Start →</h3>
              <p className="text-sm text-muted-foreground">Get started in 3 simple steps</p>
            </a>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
