import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@tocld/ui/button";
import { authConfig } from "~/lib/auth-config";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthShowcase } from "../_components/auth-showcase";
import { CreateTaskForm, TaskCardSkeleton, TaskList } from "../_components/tasks";

export default function HomePage() {
  // Prefetch tasks (works in both real and mock mode)
  prefetch(trpc.task.all.queryOptions());

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">V0</span> Turbo
          </h1>

          <Link href="/components">
            <Button variant="outline" size="lg">
              View Component Showcase →
            </Button>
          </Link>

          <AuthShowcase />

          <CreateTaskForm />
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              }
            >
              <TaskList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
