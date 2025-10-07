import { CreditCard, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { getCurrentTier, getFeatureFlags, getTierName } from "~/lib/features";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { CreateTaskForm, TaskList } from "../../_components/tasks";

export default async function DashboardPage() {
  prefetch(trpc.task.all.queryOptions());

  const features = getFeatureFlags();
  const tier = getCurrentTier();

  return (
    <HydrateClient>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Current tier:{" "}
            <span className="font-semibold text-primary">
              {getTierName(tier)}
            </span>
          </p>
        </div>

        {/* Feature Quick Links */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Tasks - Always available */}
          <Link
            href="/dashboard"
            className="bg-card border rounded-lg p-6 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                <Settings className="size-5 text-primary" />
              </div>
              <p className="font-semibold">Tasks</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your tasks and projects
            </p>
          </Link>

          {/* Integrations - Only if enabled */}
          {features.integrations ? (
            <Link
              href="/dashboard/integrations"
              className="bg-card border rounded-lg p-6 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                  <Zap className="size-5 text-primary" />
                </div>
                <p className="font-semibold">Integrations</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your favorite apps
              </p>
            </Link>
          ) : (
            <div className="bg-card border border-dashed rounded-lg p-6 opacity-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                  <Zap className="size-5 text-muted-foreground" />
                </div>
                <p className="font-semibold text-muted-foreground">
                  Integrations
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Upgrade to Advanced tier
              </p>
            </div>
          )}

          {/* Billing - Only if payments enabled */}
          {features.payments ? (
            <Link
              href="/dashboard/billing"
              className="bg-card border rounded-lg p-6 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                  <CreditCard className="size-5 text-primary" />
                </div>
                <p className="font-semibold">Billing</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage your subscription
              </p>
            </Link>
          ) : (
            <div className="bg-card border border-dashed rounded-lg p-6 opacity-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
                  <CreditCard className="size-5 text-muted-foreground" />
                </div>
                <p className="font-semibold text-muted-foreground">Billing</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Upgrade to Standard tier
              </p>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <CreateTaskForm />
          <TaskList />
        </div>
      </div>
    </HydrateClient>
  );
}
