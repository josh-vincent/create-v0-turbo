"use client";

import { TaskList } from "./components/task-list";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Manage your tasks and stay organized.
        </p>
      </div>

      <div className="grid gap-6">
        <TaskList />
      </div>
    </div>
  );
}
