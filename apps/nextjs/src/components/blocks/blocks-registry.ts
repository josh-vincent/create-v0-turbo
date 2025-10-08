import {
  LayoutDashboard,
  BarChart,
  FileText,
  CreditCard,
  Clock,
  MessageSquare,
  Zap,
  DollarSign,
  Settings,
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
    code: {
      "page.tsx": `"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@tocld/ui/dialog";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { ExpenseForm } from "@tocld/features-finance/ui";

export default function ExpensesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: expenses } = useQuery(trpc.expense.list.queryOptions({}));
  const { data: stats } = useQuery(trpc.expense.getStats.queryOptions());

  // Mutations
  const createMutation = useMutation(trpc.expense.create.mutationOptions({
    onSuccess: async () => {
      setIsCreateOpen(false);
      await queryClient.invalidateQueries(trpc.expense.pathFilter());
    },
  }));

  const deleteMutation = useMutation(trpc.expense.delete.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.expense.pathFilter());
    },
  }));

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          {/* More stat cards... */}
        </div>
      )}

      {/* Expense List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge>{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}`,
      "router.ts": `// packages/features/finance/src/routers/expense.ts
export const expenseRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      return getMockExpenses();
    }
    return ctx.db.query.expenses.findMany({
      where: eq(schema.expenses.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        return { id: "exp_mock", ...input };
      }
      return ctx.db.insert(schema.expenses).values(input);
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Calculate stats from expenses
    const expenses = await ctx.db.query.expenses.findMany();
    return {
      total: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      byCategory: groupBy(expenses, 'category'),
    };
  }),
});`,
    },
    routes: ["expense.list", "expense.create", "expense.getStats"],
  },
  {
    name: "time-tracking",
    title: "Time Tracking Block",
    description: "Billable hours timer with project tracking",
    category: "Finance Module",
    icon: Clock,
    liveUrl: "/dashboard/time",
    code: {
      "page.tsx": `"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { Card } from "@tocld/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { TimeTracker } from "@tocld/features-finance/ui";
import { Badge } from "@tocld/ui/badge";
import { Button } from "@tocld/ui/button";

export default function TimePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: entries } = useQuery(trpc.time.list.queryOptions({}));
  const { data: runningTimer } = useQuery(trpc.time.getRunning.queryOptions());
  const { data: stats } = useQuery(trpc.time.getStats.queryOptions({}));

  // Mutations
  const startMutation = useMutation(trpc.time.start.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.time.pathFilter());
    },
  }));

  const stopMutation = useMutation(trpc.time.stop.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.time.pathFilter());
    },
  }));

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Timer Component */}
      <TimeTracker
        onStart={(data) => startMutation.mutateAsync(data)}
        onStop={(id) => stopMutation.mutateAsync({ id })}
        runningTimer={runningTimer}
        isLoading={startMutation.isPending || stopMutation.isPending}
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Hours</div>
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
            </div>
          </Card>
          {/* More stats... */}
        </div>
      )}

      {/* Time Entries List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.projectName}</TableCell>
                  <TableCell>{entry.duration}</TableCell>
                  <TableCell>
                    <Badge variant={entry.billable ? "default" : "secondary"}>
                      {entry.billable ? "Billable" : "Non-billable"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}`,
      "router.ts": `// packages/features/finance/src/routers/time.ts
export const timeRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      return getMockTimeEntries();
    }
    return ctx.db.query.timeEntries.findMany({
      where: eq(schema.timeEntries.userId, ctx.session.user.id),
    });
  }),

  start: protectedProcedure
    .input(startTimeSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        return { id: "time_mock", ...input, startTime: new Date() };
      }
      return ctx.db.insert(schema.timeEntries).values({
        ...input,
        startTime: new Date(),
        userId: ctx.session.user.id,
      });
    }),

  stop: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        return { success: true };
      }
      return ctx.db.update(schema.timeEntries)
        .set({ endTime: new Date() })
        .where(eq(schema.timeEntries.id, input.id));
    }),

  getRunning: protectedProcedure.query(async ({ ctx }) => {
    // Find any running timer (no endTime)
    return ctx.db.query.timeEntries.findFirst({
      where: and(
        eq(schema.timeEntries.userId, ctx.session.user.id),
        isNull(schema.timeEntries.endTime)
      ),
    });
  }),
});`,
    },
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
import { Card, CardContent } from "@tocld/ui/card";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@tocld/ui/conversation";
import { ConversationBar } from "@tocld/ui/conversation-bar";
import { Message, MessageContent } from "@tocld/ui/message";
import { Orb } from "@tocld/ui/orb";
import { Response } from "@tocld/ui/response";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function VoiceChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Voice Chat</h2>
        <p className="text-muted-foreground">
          Powered by ElevenLabs Conversational AI
        </p>
      </div>

      <Card className="flex h-[calc(100vh-280px)] w-full flex-col gap-0 overflow-hidden">
        <CardContent className="relative flex-1 overflow-hidden p-0">
          <Conversation className="absolute inset-0 pb-[88px]">
            <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-6">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Orb className="size-12" />}
                  title="Start a conversation"
                  description="Tap the phone button or type a message to begin"
                />
              ) : (
                messages.map((message, index) => (
                  <Message key={index} from={message.role}>
                    <MessageContent className="max-w-full min-w-0">
                      <Response className="w-auto [overflow-wrap:anywhere] whitespace-pre-wrap">
                        {message.content}
                      </Response>
                    </MessageContent>
                    {message.role === "assistant" && (
                      <div className="ring-border size-6 flex-shrink-0 self-end overflow-hidden rounded-full ring-1">
                        <Orb className="h-full w-full" />
                      </div>
                    )}
                  </Message>
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-[100px]" />
          </Conversation>
          <div className="absolute right-0 bottom-0 left-0 flex justify-center">
            <ConversationBar
              className="w-full max-w-2xl"
              agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!}
              onMessage={(message) => {
                const newMessage: ChatMessage = {
                  role: message.source === "user" ? "user" : "assistant",
                  content: message.message,
                };
                setMessages((prev) => [...prev, newMessage]);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,
      ".env": `# Get your agent ID from https://elevenlabs.io/app/conversational-ai
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-agent-id-here`,
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
  {
    name: "settings",
    title: "Settings Block",
    description: "User settings and team management",
    category: "Core",
    icon: Settings,
    liveUrl: "/dashboard/settings/team",
    code: {
      "page.tsx": `import { Separator } from "@tocld/ui/separator";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Input } from "@tocld/ui/input";
import { Label } from "@tocld/ui/label";
import { Badge } from "@tocld/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@tocld/ui/avatar";
import { UserPlus, Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tocld/ui/dropdown-menu";

export default function TeamSettingsPage() {
  const teamMembers = [
    {
      id: "1",
      name: "You",
      email: "user@example.com",
      role: "Owner",
      avatar: null,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and invitations
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Separator />

      {/* Team Members List */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Team Members</h2>
            <p className="text-sm text-muted-foreground">
              {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}`,
    },
  },
] as const;

export type BlockName = (typeof blocksRegistry)[number]["name"];
