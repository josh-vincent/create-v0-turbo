"use client";

import { Button } from "@/registry/new-york/ui/button";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Setup blocks infrastructure", completed: true },
    { id: "2", title: "Create example block", completed: false },
    { id: "3", title: "Test the registry", completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent/50 transition-colors"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span
              className={task.completed ? "line-through text-muted-foreground" : "text-foreground"}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm">
          Add Task
        </Button>
      </div>
    </div>
  );
}
