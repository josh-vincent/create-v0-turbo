/**
 * Centralized Mock Data
 * Used when database is not available (development mode)
 */

/**
 * In-memory task store for mock mode
 * Allows CRUD operations without a database
 */
const inMemoryTasks = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    teamId: "00000000-0000-0000-0000-000000000001",
    assigneeId: null,
    createdById: "00000000-0000-0000-0000-000000000001",
    title: "Example Task 1",
    description: "This is a mock task for development",
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
  {
    id: "00000000-0000-0000-0000-000000000003",
    teamId: "00000000-0000-0000-0000-000000000001",
    assigneeId: null,
    createdById: "00000000-0000-0000-0000-000000000001",
    title: "Completed Task Example",
    description: "A completed mock task",
    status: "done" as const,
    priority: "low" as const,
    isArchived: false,
    createdAt: new Date("2024-12-25"),
    updatedAt: new Date("2024-12-30"),
    completedAt: new Date("2024-12-30"),
  },
];

/**
 * Mock Tasks - Read-only access to mock data
 */
export const mockTasks = inMemoryTasks;

/**
 * Get all tasks from in-memory store
 */
export function getAllMockTasks() {
  return [...inMemoryTasks];
}

/**
 * Get task by ID from in-memory store
 */
export function getMockTaskById(id: string) {
  return inMemoryTasks.find((task) => task.id === id) ?? null;
}

/**
 * Add task to in-memory store
 */
export function addMockTask(task: (typeof inMemoryTasks)[0]) {
  inMemoryTasks.push(task);
  return task;
}

/**
 * Delete task from in-memory store
 */
export function deleteMockTask(id: string) {
  const index = inMemoryTasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    inMemoryTasks.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Helper to log mock mode usage
 */
export function logMockUsage(router: string, procedure: string) {
  console.log(`🔶 [MOCK] ${router}.${procedure} - Using mock data`);
}
