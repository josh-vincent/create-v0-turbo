import { http, HttpResponse } from "msw";

// Mock task data store (in-memory)
const mockTasks = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    teamId: "00000000-0000-0000-0000-000000000001",
    assigneeId: null,
    createdById: "00000000-0000-0000-0000-000000000001",
    title: "Example Task 1",
    description: "This is a mock task from MSW",
    status: "todo" as const,
    priority: "medium" as const,
    isArchived: false,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    completedAt: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    teamId: "00000000-0000-0000-0000-000000000001",
    assigneeId: null,
    createdById: "00000000-0000-0000-0000-000000000001",
    title: "Example Task 2",
    description: "Another mock task",
    status: "in_progress" as const,
    priority: "high" as const,
    isArchived: false,
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
    completedAt: null,
  },
];

export const taskHandlers = [
  // GET all tasks - tRPC: task.all (GET request with batch)
  http.get("*/api/trpc/task.all", async () => {
    console.log("🔶 MSW: Intercepted task.all");
    return HttpResponse.json({
      result: {
        data: mockTasks,
      },
    });
  }),

  // GET task by ID - tRPC: task.byId
  http.get("*/api/trpc/task.byId", async ({ request }) => {
    const url = new URL(request.url);
    const input = url.searchParams.get("input");
    const parsedInput = input ? JSON.parse(decodeURIComponent(input)) : null;
    const taskId = parsedInput?.id;

    const task = mockTasks.find((t) => t.id === taskId);

    if (!task) {
      return HttpResponse.json(
        {
          error: {
            message: "Task not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: {
        data: task,
      },
    });
  }),

  // CREATE task - tRPC: task.create (POST)
  http.post("*/api/trpc/task.create", async ({ request }) => {
    console.log("🔶 MSW: Intercepted task.create");

    const body = await request.json();
    const url = new URL(request.url);
    const isBatch = url.searchParams.has("batch");

    // Handle both batch and non-batch formats
    let input;
    if (isBatch) {
      // Batch format: { "0": { "input": {...} } }
      input = (body as any)["0"]?.input;
    } else {
      // Non-batch format: { "input": {...} }
      input = (body as any).input;
    }

    if (!input) {
      console.error("🔶 MSW: No input found in request body", body);
      return HttpResponse.json(
        {
          error: {
            message: "Invalid request format",
            code: "BAD_REQUEST",
          },
        },
        { status: 400 },
      );
    }

    const newTask = {
      id: crypto.randomUUID(),
      teamId: input.teamId,
      assigneeId: null,
      createdById: "00000000-0000-0000-0000-000000000001",
      title: input.title,
      description: input.description || null,
      status: "todo" as const,
      priority: input.priority || ("medium" as const),
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };

    mockTasks.push(newTask);

    // Return in batch format if request was batched
    if (isBatch) {
      return HttpResponse.json([
        {
          result: {
            data: [newTask],
          },
        },
      ]);
    }

    return HttpResponse.json({
      result: {
        data: [newTask],
      },
    });
  }),

  // DELETE task - tRPC: task.delete (POST)
  http.post("*/api/trpc/task.delete", async ({ request }) => {
    console.log("🔶 MSW: Intercepted task.delete");

    const body = await request.json();
    const url = new URL(request.url);
    const isBatch = url.searchParams.has("batch");

    // Handle both batch and non-batch formats
    let input;
    if (isBatch) {
      // Batch format: { "0": { "input": "taskId" } }
      input = (body as any)["0"]?.input;
    } else {
      // Non-batch format: { "input": "taskId" }
      input = (body as any).input;
    }

    if (!input) {
      console.error("🔶 MSW: No input found in request body", body);
      return HttpResponse.json(
        {
          error: {
            message: "Invalid request format",
            code: "BAD_REQUEST",
          },
        },
        { status: 400 },
      );
    }

    const taskId = input;
    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return HttpResponse.json(
        {
          error: {
            message: "Task not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    mockTasks.splice(taskIndex, 1);

    // Return in batch format if request was batched
    if (isBatch) {
      return HttpResponse.json([
        {
          result: {
            data: null,
          },
        },
      ]);
    }

    return HttpResponse.json({
      result: {
        data: null,
      },
    });
  }),
];
