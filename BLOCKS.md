# Blocks - Pre-built Feature Components

Beautiful, reusable feature blocks built with Shadcn UI. Copy and paste into your apps.

> **Note:** All blocks work in mock mode out of the box - no external services required for development!

## 📦 Available Blocks

| Block | Category | Components | Mock Mode | Live Demo |
|-------|----------|------------|-----------|-----------|
| [Dashboard](#dashboard-block) | Analytics | Charts, Stats Cards | ✅ | `/dashboard` |
| [Analytics](#analytics-block) | Analytics | Revenue Charts, User Growth | ✅ | `/dashboard/analytics` |
| [Invoices](#invoices-block) | Finance | Invoice List, Stats, Form | ✅ | `/dashboard/invoices` |
| [Expenses](#expenses-block) | Finance | Expense Tracker, Categories | ✅ | `/dashboard/expenses` |
| [Time Tracking](#time-tracking-block) | Finance | Timer, Entry List, Stats | ✅ | `/dashboard/time` |
| [Voice Chat](#voice-chat-block) | AI | Conversation UI, Voice Input | ✅ | `/dashboard/voice-chat` |
| [Integrations](#integrations-block) | OAuth | Connection Cards, OAuth Flow | ✅ | `/dashboard/integrations` |
| [Billing](#billing-block) | Payments | Subscription Card, Portal | ✅ | `/dashboard/billing` |

---

## Dashboard Block

**Full-featured dashboard with task management and stats overview**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Dashboard                                                │
│ Welcome back! Here's what's happening today.            │
│ Current tier: Free                                      │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │  Tasks   │  │ Integr-  │  │ Billing  │              │
│ │  📋      │  │ ations ⚡│  │  💳      │              │
│ └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│ Your Tasks                                              │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Create task form                                    ││
│ └─────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────┐│
│ │ Example Task 1                          [Delete]    ││
│ │ Priority: high                                      ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Already included in template!
# View at: /dashboard
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/page.tsx
import { api } from "@/trpc/server";
import { CreateTaskForm, TaskList } from "../../_components/tasks";

export default async function DashboardPage() {
  // Server-side data fetching
  const tasks = await api.task.all();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <CreateTaskForm />
        <TaskList />
      </div>
    </div>
  );
}
```

### Features
- ✅ Server-side rendering with tRPC
- ✅ Task CRUD operations
- ✅ Feature cards with conditional rendering
- ✅ Mock mode with in-memory data
- ✅ Optimistic updates

### tRPC Routes Used
- `task.all` - List all tasks
- `task.create` - Create new task
- `task.delete` - Delete task

---

## Analytics Block

**Beautiful analytics dashboard with charts and metrics**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Analytics Dashboard                                      │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │ Revenue  │  │  Users   │  │ Activity │  │ Conversi-││
│ │ $45.2K ↑ │  │  2,350   │  │   +12%   │  │ on 3.2%  ││
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘│
├─────────────────────────────────────────────────────────┤
│ Revenue vs Expenses                   User Growth       │
│ [Area Chart showing revenue/expenses] [Line Chart]      │
├─────────────────────────────────────────────────────────┤
│ Spending by Category                  Recent Trans...   │
│ [Bar Chart]                           [Table]           │
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Already included!
# View at: /dashboard/analytics
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/analytics/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@tocld/ui/card";
import { ChartContainer, ChartTooltip } from "@tocld/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track your business metrics and growth
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        {/* More stat cards... */}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="revenue" fill="#8884d8" />
                <Area dataKey="expenses" fill="#82ca9d" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* More charts... */}
      </div>
    </div>
  );
}
```

### Features
- ✅ Recharts integration
- ✅ Multiple chart types (Area, Bar, Line)
- ✅ Responsive grid layout
- ✅ Mock data for development
- ✅ Beautiful shadcn/ui components

### Components Used
- `Card`, `CardContent`, `CardHeader`
- `ChartContainer`, `ChartTooltip`
- `AreaChart`, `BarChart`, `LineChart` (recharts)
- `Badge`, `Table`

---

## Invoices Block

**Complete invoice management with create, list, stats, and delete**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Invoices                           [Create Invoice]     │
│ Manage your invoices and track payments                 │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │  Total   │  │  Total   │  │   Paid   │  │Outstand- ││
│ │   15     │  │ $12,500  │  │  $8,300  │  │ing $4.2K ││
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘│
├─────────────────────────────────────────────────────────┤
│ All Invoices                                            │
│ ┌─────────────────────────────────────────────────────┐│
│ │ #  │ Client      │ Date │ Due   │ Amount │ Status  ││
│ │ 001│ Acme Inc   │ 1/15 │ 2/15  │ $2,500 │ Paid    ││
│ │ 002│ TechCo     │ 1/20 │ 2/20  │ $5,200 │ Sent    ││
│ │ 003│ StartupXYZ │ 1/25 │ 2/25  │ $1,800 │ Overdue ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Feature module already included!
# View at: /dashboard/invoices
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/invoices/page.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { InvoiceForm } from "@tocld/features-finance/ui";

export default function InvoicesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: invoices } = useQuery(trpc.invoice.list.queryOptions({}));
  const { data: stats } = useQuery(trpc.invoice.getStats.queryOptions());

  // Mutations
  const createMutation = useMutation(trpc.invoice.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.invoice.pathFilter());
    },
  }));

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-sm font-medium">Total Invoices</div>
          <div className="text-2xl font-bold">{stats?.total}</div>
        </Card>
        {/* More stats... */}
      </div>

      {/* Invoice Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>
                  <Badge>{invoice.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

### Features
- ✅ Invoice CRUD operations
- ✅ Statistics dashboard
- ✅ Status badges (paid, sent, overdue)
- ✅ Mock mode with sample invoices
- ✅ Form validation with Zod

### tRPC Routes
- `invoice.list` - List all invoices
- `invoice.create` - Create invoice
- `invoice.getStats` - Get statistics
- `invoice.delete` - Delete invoice

### Database Schema
```typescript
// packages/db/src/schema/invoices.ts
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull(), // draft, sent, paid, overdue, cancelled
  subtotal: numeric("subtotal").notNull(),
  tax: numeric("tax").default("0"),
  total: numeric("total").notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

---

## Expenses Block

**Track expenses by category with visual breakdown**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Expenses                              [Add Expense]     │
│ Track and manage your business expenses                 │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │  Total   │  │  Total   │  │ Average  │  │Categories││
│ │   45     │  │  $8,450  │  │   $188   │  │    6     ││
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘│
├─────────────────────────────────────────────────────────┤
│ Expenses by Category                                    │
│ ┌─────────────┬─────────────┬─────────────┬──────────┐│
│ │ Software    │ Marketing   │ Operations  │    HR    ││
│ │   $2,500    │   $1,800    │   $1,200    │  $850   ││
│ └─────────────┴─────────────┴─────────────┴──────────┘│
├─────────────────────────────────────────────────────────┤
│ Recent Expenses                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Description │ Category  │ Vendor │ Date  │ Amount  ││
│ │ Figma Sub   │ Software  │ Figma  │ 2/10  │ $45    ││
│ │ Ads Campaign│ Marketing │ Google │ 2/12  │ $500   ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Already included in finance module!
# View at: /dashboard/expenses
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/expenses/page.tsx
import { ExpenseForm } from "@tocld/features-finance/ui";

export default function ExpensesPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: expenses } = useQuery(trpc.expense.list.queryOptions({}));
  const { data: stats } = useQuery(trpc.expense.getStats.queryOptions());

  const createMutation = useMutation(trpc.expense.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.expense.pathFilter());
    },
  }));

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><div className="text-2xl">{stats?.total}</div></Card>
        <Card><div className="text-2xl">{formatCurrency(stats?.totalAmount)}</div></Card>
        {/* More stats... */}
      </div>

      {/* Category Breakdown */}
      <Card>
        <h3>Expenses by Category</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          {Object.entries(stats?.byCategory).map(([category, amount]) => (
            <div key={category} className="p-3 border rounded-lg">
              <Badge>{category}</Badge>
              <div className="font-semibold">{formatCurrency(amount)}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Expense Table */}
      <Card>
        <Table>
          {/* Table content... */}
        </Table>
      </Card>
    </div>
  );
}
```

### Features
- ✅ Category-based expense tracking
- ✅ Visual category breakdown
- ✅ Receipt URL support
- ✅ Statistics by category
- ✅ Mock mode with sample data

### tRPC Routes
- `expense.list` - List all expenses
- `expense.create` - Create expense
- `expense.getStats` - Category statistics
- `expense.delete` - Delete expense

---

## Time Tracking Block

**Track billable hours with project-based timer**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Time Tracking                                            │
│ Track time spent on projects and tasks                   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ Project: Website Redesign          [00:00:00]       ││
│ │ Description: Homepage updates                        ││
│ │ Hourly Rate: $150     ☑ Billable   [Start Timer]   ││
│ └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │  Total   │  │  Total   │  │ Billable │  │Non-Bill  ││
│ │   23     │  │  45.5h   │  │  38.2h   │  │  7.3h    ││
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘│
├─────────────────────────────────────────────────────────┤
│ Time by Project                                         │
│ ┌─────────────┬─────────────┬─────────────┐            │
│ │ Website     │ Mobile App  │ Marketing   │            │
│ │   18.5h     │   15.2h     │   11.8h     │            │
│ └─────────────┴─────────────┴─────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Included in finance module!
# View at: /dashboard/time
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/time/page.tsx
import { TimeTracker } from "@tocld/features-finance/ui";

export default function TimePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: entries } = useQuery(trpc.time.list.queryOptions({}));
  const { data: runningTimer } = useQuery(trpc.time.getRunning.queryOptions());
  const { data: stats } = useQuery(trpc.time.getStats.queryOptions({}));

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
        onStart={(data) => startMutation.mutate(data)}
        onStop={(id) => stopMutation.mutate({ id })}
        runningTimer={runningTimer}
        isLoading={startMutation.isPending || stopMutation.isPending}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><div className="text-2xl">{stats?.totalEntries}</div></Card>
        <Card><div className="text-2xl">{stats?.totalHours.toFixed(1)}h</div></Card>
        <Card><div className="text-2xl text-green-600">{stats?.billableHours.toFixed(1)}h</div></Card>
        <Card><div className="text-2xl text-gray-600">{stats?.nonBillableHours.toFixed(1)}h</div></Card>
      </div>

      {/* Time by Project */}
      <Card>
        <h3>Time by Project</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats?.byProject.map(({ project, hours }) => (
            <div key={project} className="p-3 border rounded-lg">
              <div className="font-medium">{project}</div>
              <div className="text-sm font-semibold">{hours.toFixed(1)}h</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Time Entries Table */}
      <Card>
        <Table>{/* Entries list... */}</Table>
      </Card>
    </div>
  );
}
```

### Features
- ✅ Start/stop timer
- ✅ Billable/non-billable tracking
- ✅ Project-based organization
- ✅ Hourly rate support
- ✅ Duration calculation
- ✅ Statistics by project

### tRPC Routes
- `time.list` - List time entries
- `time.start` - Start timer
- `time.stop` - Stop timer
- `time.getRunning` - Get running timer
- `time.getStats` - Project statistics
- `time.delete` - Delete entry

---

## Voice Chat Block

**Conversational AI with ElevenLabs voice and text input**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ AI Voice Chat                                            │
│ Powered by ElevenLabs Conversational AI                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │         ╭──────────╮                                ││
│ │         │   [orb]  │  Demo Mode                     ││
│ │         ╰──────────╯                                ││
│ │   Configure an ElevenLabs agent to enable voice     ││
│ └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ Type a message...                [🎤] [📞] [Send]   ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Already included!
# Optional: Add ElevenLabs agent ID to .env
echo "NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id" >> .env.local
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/voice-chat/page.tsx
import {
  Conversation,
  ConversationContent,
  ConversationBar,
} from "@tocld/ui/conversation";
import { Orb } from "@tocld/ui/orb";
import { Message, MessageContent } from "@tocld/ui/message";

export default function VoiceChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSetupBanner, setShowSetupBanner] = useState(!AGENT_ID);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold">AI Voice Chat</h2>
        <p className="text-muted-foreground">
          Powered by ElevenLabs Conversational AI
        </p>
      </div>

      {/* Setup Banner (graceful degradation) */}
      {showSetupBanner && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50">
          <CardContent>
            <h3>🔶 ElevenLabs Agent Not Configured</h3>
            <p>Voice chat requires an ElevenLabs Conversational AI agent.</p>
            <details>
              <summary>Setup Instructions</summary>
              {/* Setup steps... */}
            </details>
            <button onClick={() => setShowSetupBanner(false)}>×</button>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="flex h-[calc(100vh-280px)] flex-col">
        <CardContent className="relative flex-1 overflow-hidden">
          <Conversation className="absolute inset-0 pb-[88px]">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Orb className="size-12" />}
                  title={!AGENT_ID ? "Demo Mode" : "Start a conversation"}
                  description="Tap the phone button or type a message to begin"
                />
              ) : (
                messages.map((msg, idx) => (
                  <Message key={idx} from={msg.role}>
                    <MessageContent>{msg.content}</MessageContent>
                    {msg.role === "assistant" && <Orb className="h-full w-full" />}
                  </Message>
                ))
              )}
            </ConversationContent>
          </Conversation>

          <div className="absolute bottom-0 left-0 right-0">
            <ConversationBar
              agentId={AGENT_ID || "demo-mode"}
              onConnect={() => setMessages([])}
              onMessage={(msg) => setMessages(prev => [...prev, msg])}
              onError={(error) => console.error(error)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Features
- ✅ Voice and text input
- ✅ Real-time streaming responses
- ✅ Conversation history
- ✅ Copy message to clipboard
- ✅ Graceful degradation (demo mode)
- ✅ Visual orb animation

### Components
- `Conversation`, `ConversationContent`
- `ConversationBar` - Input with voice/text
- `Orb` - Animated visual feedback
- `Message`, `MessageContent`

### Setup
1. Create account at [elevenlabs.io](https://elevenlabs.io)
2. Create Conversational AI agent
3. Copy agent ID
4. Add to `.env.local`: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id`
5. Restart dev server

---

## Integrations Block

**OAuth integrations dashboard (Gmail, Outlook)**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Integrations                                             │
│ Connect your favorite apps and services                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌─────────────────────────┐│
│ │ Gmail Integration       │  │ Outlook Integration     ││
│ │ [icon]                  │  │ [icon]                  ││
│ │                         │  │                         ││
│ │ Status: Not Connected   │  │ Status: Connected       ││
│ │ [Connect Gmail]         │  │ ✓ user@company.com      ││
│ │                         │  │ [Disconnect]            ││
│ └─────────────────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Feature module already included!
# Optional: Add OAuth credentials to .env
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/integrations/page.tsx
import { IntegrationsList, ConnectButton } from "@tocld/features-integrations/ui";

export default function IntegrationsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your favorite apps and services
        </p>
      </div>

      {/* Pre-built integrations list */}
      <IntegrationsList />

      {/* Or use individual connect buttons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gmail</CardTitle>
            <CardDescription>Connect your Gmail account</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectButton provider="gmail" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outlook</CardTitle>
            <CardDescription>Connect your Outlook account</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectButton provider="outlook" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Features
- ✅ OAuth flow handling
- ✅ Token refresh
- ✅ Connection status
- ✅ Disconnect functionality
- ✅ Works in mock mode

### tRPC Routes
- `integration.list` - List integrations
- `integration.getAuthUrl` - Get OAuth URL
- `integration.disconnect` - Disconnect
- `integration.refresh` - Refresh tokens

---

## Billing Block

**Stripe subscription management and billing portal**

### Preview

```
┌─────────────────────────────────────────────────────────┐
│ Billing                                                  │
│ Manage your subscription and billing                     │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ Current Plan: Pro                                   ││
│ │ Status: Active                                      ││
│ │ Next billing: March 1, 2025                         ││
│ │ Amount: $29.00/month                                ││
│ │                                                     ││
│ │ [Manage Subscription]  [Cancel]                     ││
│ └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│ Billing History                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Date       │ Description      │ Amount  │ Status   ││
│ │ Feb 1, 2025│ Pro Subscription │ $29.00  │ Paid    ││
│ │ Jan 1, 2025│ Pro Subscription │ $29.00  │ Paid    ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Installation

```bash
# Feature module already included!
# Add Stripe credentials to .env
```

### Code

```tsx
// apps/nextjs/src/app/dashboard/(sidebar-layout)/billing/page.tsx
import { SubscriptionCard } from "@tocld/features-payments/ui";

export default function BillingPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      {/* Pre-built subscription card */}
      <SubscriptionCard />
    </div>
  );
}
```

### Features
- ✅ Subscription status display
- ✅ Billing portal access
- ✅ Cancel subscription
- ✅ Billing history
- ✅ Mock mode support

### tRPC Routes
- `subscription.getCurrent` - Get subscription
- `subscription.createBillingPortal` - Portal URL
- `subscription.cancel` - Cancel sub
- `subscription.resume` - Resume sub

---

## 🚀 Quick Start

### View All Blocks

```bash
bun dev:next
# Visit http://localhost:3000/dashboard
```

### Use a Block

1. **Copy the code** from any block above
2. **Paste into your app** at the desired route
3. **Customize** styling and functionality
4. **Deploy!**

All blocks work in **mock mode** - no external services required!

---

## 📝 Block Conventions

All blocks follow these conventions:

### File Structure
```
apps/nextjs/src/app/dashboard/(sidebar-layout)/
├── [feature]/
│   └── page.tsx          # Main block component
```

### Component Pattern
```tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export default function FeaturePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // 1. Queries
  const { data } = useQuery(trpc.feature.list.queryOptions({}));

  // 2. Mutations with cache invalidation
  const mutation = useMutation(trpc.feature.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.feature.pathFilter());
    },
  }));

  // 3. Render with shadcn/ui components
  return <div>{/* UI */}</div>;
}
```

### tRPC Pattern
```typescript
// All routers support mock mode
export const featureRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      return getMockData();
    }
    return ctx.db.query.items.findMany();
  }),
});
```

---

## 🎨 Customization

All blocks use:
- **Shadcn/UI** components for consistent styling
- **Tailwind CSS** for easy customization
- **tRPC** for type-safe APIs
- **Mock mode** for development

Customize any block by:
1. Modifying Tailwind classes
2. Replacing mock data
3. Extending tRPC routes
4. Adding new features

---

## 📚 Learn More

- [FEATURES.md](./FEATURES.md) - Feature setup guides
- [README.md](./README.md) - Project overview
- [CLAUDE.md](./CLAUDE.md) - Architecture details

---

## 🤝 Contributing

Want to add a new block?

1. Create the feature page in `/dashboard/(sidebar-layout)/`
2. Add mock mode support
3. Document in this file
4. Submit a PR!

---

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.
