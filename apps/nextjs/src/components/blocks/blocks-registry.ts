import {
  LayoutDashboard,
  BarChart,
  FileText,
  CreditCard,
  Clock,
  MessageSquare,
  Zap,
  DollarSign,
} from "lucide-react";

export const blocksRegistry = [
  {
    name: "dashboard",
    title: "Dashboard Block",
    description: "Task management with stats overview",
    category: "Core",
    icon: LayoutDashboard,
    liveUrl: "/dashboard",
    code: {
      "page.tsx": `// app/dashboard/page.tsx
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
}`,
      "client.tsx": `"use client";
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
}`,
    },
    routes: ["task.all", "task.create", "task.delete"],
  },
  {
    name: "analytics",
    title: "Analytics Block",
    description: "Charts, metrics, and business insights",
    category: "Core",
    icon: BarChart,
    liveUrl: "/dashboard/analytics",
    code: {
      "page.tsx": `// app/dashboard/analytics/page.tsx
import { ChartContainer, ChartTooltip } from "@tocld/ui/chart";
import { AreaChart, Area } from "recharts";

export default function AnalyticsPage() {
  const data = [
    { month: "Jan", revenue: 4500, expenses: 2300 },
    { month: "Feb", revenue: 5200, expenses: 2800 },
  ];

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={data}>
        <Area dataKey="revenue" fill="#8884d8" />
        <Area dataKey="expenses" fill="#82ca9d" />
      </AreaChart>
    </ChartContainer>
  );
}`,
    },
  },
  {
    name: "invoices",
    title: "Invoice Block",
    description: "Invoice management with CRUD operations",
    category: "Finance Module",
    icon: FileText,
    liveUrl: "/dashboard/invoices",
    code: {
      "page.tsx": `"use client";
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
}`,
      "router.ts": `// packages/features/finance/src/routers/invoice.ts
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
});`,
    },
    routes: ["invoice.list", "invoice.create", "invoice.getStats"],
  },
  {
    name: "expenses",
    title: "Expense Block",
    description: "Expense tracking by category",
    category: "Finance Module",
    icon: CreditCard,
    liveUrl: "/dashboard/expenses",
    routes: ["expense.list", "expense.create", "expense.getStats"],
  },
  {
    name: "time-tracking",
    title: "Time Tracking Block",
    description: "Billable hours timer with project tracking",
    category: "Finance Module",
    icon: Clock,
    liveUrl: "/dashboard/time",
    routes: ["time.list", "time.start", "time.stop", "time.getRunning"],
  },
  {
    name: "voice-chat",
    title: "Voice Chat Block",
    description: "ElevenLabs conversational AI integration",
    category: "AI",
    icon: MessageSquare,
    liveUrl: "/dashboard/voice-chat",
    code: {
      "page.tsx": `"use client";
import { useState } from "react";
import { Conversation, ConversationBar } from "@tocld/ui/conversation";
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
}`,
    },
  },
  {
    name: "integrations",
    title: "Integrations Block",
    description: "OAuth connections (Gmail, Outlook)",
    category: "Integrations Module",
    icon: Zap,
    liveUrl: "/dashboard/integrations",
    code: {
      "page.tsx": `import { IntegrationsList, ConnectButton } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div>
      <h1>Connected Apps</h1>
      <IntegrationsList />

      {/* Or use individual buttons */}
      <ConnectButton provider="gmail" />
      <ConnectButton provider="outlook" />
    </div>
  );
}`,
    },
    routes: ["integration.list", "integration.getAuthUrl", "integration.disconnect"],
  },
  {
    name: "billing",
    title: "Billing Block",
    description: "Stripe subscription management",
    category: "Payments Module",
    icon: DollarSign,
    liveUrl: "/dashboard/billing",
    code: {
      "page.tsx": `import { SubscriptionCard } from "@tocld/features-payments/ui";

export default function BillingPage() {
  return (
    <div>
      <h1>Billing</h1>
      <SubscriptionCard />
    </div>
  );
}`,
    },
    routes: ["subscription.getCurrent", "subscription.createBillingPortal"],
  },
] as const;

export type BlockName = (typeof blocksRegistry)[number]["name"];
