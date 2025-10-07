"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@tocld/api";
import { CreateTaskSchema } from "@tocld/db/schema";
import { cn } from "@tocld/ui";
import { Button } from "@tocld/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, useForm } from "@tocld/ui/form";
import { Input } from "@tocld/ui/input";
import { toast } from "@tocld/ui/toast";

import { useTRPC } from "~/trpc/react";

export function CreateTaskForm() {
  const trpc = useTRPC();
  const form = useForm({
    schema: CreateTaskSchema,
    defaultValues: {
      teamId: "00000000-0000-0000-0000-000000000000", // Replace with actual team ID
      title: "",
      description: "",
      priority: "medium" as const,
    },
  });

  const queryClient = useQueryClient();
  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.task.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to create a task"
            : "Failed to create task",
        );
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          createTask.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Task title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Description (optional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Create Task</Button>
      </form>
    </Form>
  );
}

export function TaskList() {
  const trpc = useTRPC();
  const { data: tasks } = useSuspenseQuery(trpc.task.all.queryOptions());

  if (tasks.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <TaskCardSkeleton pulse={false} />
        <TaskCardSkeleton pulse={false} />
        <TaskCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No tasks yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {tasks.map((t) => {
        return <TaskCard key={t.id} task={t} />;
      })}
    </div>
  );
}

export function TaskCard(props: {
  task: RouterOutputs["task"]["all"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.task.pathFilter());
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete a task"
            : "Failed to delete task",
        );
      },
    }),
  );

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.task.title}</h2>
        {props.task.description && <p className="mt-2 text-sm">{props.task.description}</p>}
        <p className="mt-1 text-xs text-muted-foreground">Priority: {props.task.priority}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deleteTask.mutate(props.task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function TaskCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className={cn("w-1/4 rounded bg-primary text-2xl font-bold", pulse && "animate-pulse")}>
          &nbsp;
        </h2>
        <p className={cn("mt-2 w-1/3 rounded bg-current text-sm", pulse && "animate-pulse")}>
          &nbsp;
        </p>
      </div>
    </div>
  );
}
