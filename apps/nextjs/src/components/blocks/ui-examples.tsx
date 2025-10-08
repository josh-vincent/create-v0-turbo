"use client";

import { Button } from "@tocld/ui/button";
import { Input } from "@tocld/ui/input";
import { Badge } from "@tocld/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tocld/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tocld/ui/table";
import { BarChart, FileText, Clock, DollarSign, TrendingUp } from "lucide-react";

export function DashboardBlockExample() {
  const stats = [
    { label: "Total Tasks", value: "12", icon: FileText },
    { label: "Active", value: "8", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs">{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Task title..." />
          <Button className="w-full">Create Task</Button>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { title: "Update documentation", priority: "high" },
              { title: "Review pull requests", priority: "medium" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground">Priority: {task.priority}</div>
                </div>
                <Button variant="ghost" size="sm">Delete</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsBlockExample() {
  const stats = [
    { label: "Revenue", value: "$45.2K", change: "+20.1%", icon: DollarSign },
    { label: "Users", value: "2,350", change: "+15.3%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs">{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-lg border bg-muted/50">
            <BarChart className="h-12 w-12 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InvoiceBlockExample() {
  const invoices = [
    { number: "INV-001", client: "Acme Inc", amount: "$2,500", status: "paid" },
    { number: "INV-002", client: "TechCo", amount: "$5,200", status: "sent" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,500</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Invoice #</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.number}>
                  <TableCell className="text-xs">{invoice.number}</TableCell>
                  <TableCell className="text-xs">{invoice.client}</TableCell>
                  <TableCell className="text-xs">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "paid" ? "default" : "secondary"} className="text-xs">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExpenseBlockExample() {
  const categories = [
    { name: "Software", amount: "$2,500" },
    { name: "Marketing", amount: "$1,800" },
  ];

  return (
    <div className="space-y-4">
      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.name} className="rounded-lg border p-3">
                <Badge variant="outline" className="mb-2 text-xs">{cat.name}</Badge>
                <div className="text-lg font-semibold">{cat.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Expense */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Description..." />
          <Input placeholder="Amount..." type="number" />
          <Button className="w-full">Add Expense</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function TimeTrackingBlockExample() {
  return (
    <div className="space-y-4">
      {/* Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Time Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-4xl font-bold tabular-nums">00:15:42</div>
            <div className="mt-2 text-sm text-muted-foreground">Project: Website Redesign</div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Start</Button>
            <Button variant="outline" className="flex-1">Stop</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.5h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Billable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">38.2h</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function VoiceChatBlockExample() {
  // Demo messages to show the UI
  const demoMessages = [
    { role: "user" as const, content: "Hello! Can you help me with my project?" },
    { role: "assistant" as const, content: "Of course! I'd be happy to help. What's your project about?" },
  ];

  return (
    <div className="space-y-4">
      {/* Voice Chat UI Preview */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">AI Voice Chat</CardTitle>
          <p className="text-xs text-muted-foreground">
            ElevenLabs Conversational AI with voice & text
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Messages Preview */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3 min-h-[120px]">
            {demoMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === "assistant" ? "flex-row-reverse" : ""}`}
              >
                <div className={`rounded-lg px-3 py-2 text-xs max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Voice Bar Preview */}
          <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
            <div className="h-8 flex-1 rounded bg-muted/50 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">🎤 Voice Waveform</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-xs">🎤</Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-xs">⌨️</Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-xs">📞</Button>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Uses: Conversation, ConversationBar, Message, Orb components
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function IntegrationsBlockExample() {
  const integrations = [
    { name: "Gmail", status: "Connected", email: "user@gmail.com" },
    { name: "Outlook", status: "Not Connected", email: null },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <CardDescription className="text-xs">
                {integration.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integration.email ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">{integration.email}</div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </>
              ) : (
                <Button size="sm">Connect</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BillingBlockExample() {
  return (
    <div className="space-y-4">
      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
          <CardDescription>Pro Subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge>Active</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next billing</span>
              <span className="font-medium">March 1, 2025</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">$29.00/month</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">Manage</Button>
            <Button variant="ghost" className="flex-1">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export function SettingsBlockExample() {
  const teamMember = {
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
          <CardDescription>1 member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {teamMember.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium">{teamMember.name}</p>
                <p className="text-xs text-muted-foreground">{teamMember.email}</p>
              </div>
            </div>
            <Badge variant="outline">{teamMember.role}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
