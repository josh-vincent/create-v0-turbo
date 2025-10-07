# Centralized Mock System

## Overview

This project uses a **centralized mock system** to allow development without requiring a database connection. This prevents the "Query data cannot be undefined" errors and ensures consistent behavior across all tRPC procedures.

## Important: MSW is Disabled

MSW (Mock Service Worker) is **disabled by default** in favor of the centralized tRPC mock system. The tRPC approach is cleaner because:
- Mocking happens at the API layer, not the HTTP layer
- Easier to maintain and debug
- Type-safe and consistent
- No request interception conflicts

MSW can be re-enabled in `apps/nextjs/src/mocks/msw-provider.tsx` if you need to mock non-tRPC APIs.

## Architecture

### 1. Database Client (`packages/db/src/client.ts`)

The database client now:
- **Checks for valid connection string** before initializing
- **Exports `isDatabaseAvailable()`** function for runtime checks
- **Only initializes Postgres client** if connection string is valid
- **Logs clear status** on startup

```typescript
🔶 [DATABASE] No connection string found - running in MOCK MODE
✅ [DATABASE] Initializing with connection string
```

### 2. tRPC Context (`packages/api/src/trpc.ts`)

The tRPC context now includes:
- **`ctx.isMockMode`** - Boolean flag indicating if running in mock mode
- Automatically set based on `isDatabaseAvailable()`
- Available to all procedures

```typescript
export const createTRPCContext = async (opts) => {
  const isMockMode = !isDatabaseAvailable();
  return {
    session: opts.session,
    db,
    isMockMode, // ← NEW
  };
};
```

### 3. Centralized Mock Data (`packages/api/src/mock-data.ts`)

All mock data is centralized in one file with **in-memory CRUD operations**:
- **`getAllMockTasks()`** - Get all tasks
- **`getMockTaskById(id)`** - Get single task
- **`addMockTask(task)`** - Create new task
- **`deleteMockTask(id)`** - Delete task
- **`logMockUsage()`** - Consistent logging helper
- Easy to extend with more mock entities

### 4. Router Implementation Pattern

All routers follow this pattern:

```typescript
export const taskRouter = {
  // READ operations - return mock data from in-memory store
  all: publicProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      logMockUsage("task", "all");
      return getAllMockTasks();
    }
    // Real database query...
  }),

  // WRITE operations - use in-memory store
  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.isMockMode) {
      logMockUsage("task", "create");
      const newTask = {
        id: crypto.randomUUID(),
        ...input,
        // ... other fields
      };
      addMockTask(newTask);
      return [newTask];
    }
    // Real database mutation...
  }),
};
```

## Benefits

### ✅ Prevents Undefined Returns
- Queries **always return data** (mock or real)
- No more "Query data cannot be undefined" errors
- Works seamlessly with TanStack Query's `useSuspenseQuery`

### ✅ Consistent Behavior
- All procedures check `ctx.isMockMode`
- Single source of truth for mock detection
- No scattered try-catch blocks

### ✅ Clear Logging
```
🔶 [DATABASE] No connection string found - running in MOCK MODE
🔶 [MOCK] task.all - Using mock data
[TRPC] task.all took 225ms to execute
```

### ✅ Easy to Extend
Add new mock data in one place:
```typescript
// packages/api/src/mock-data.ts
export const mockUsers = [...];
export const mockProjects = [...];
```

### ✅ Full CRUD Support
- **Read operations** return mock data from in-memory store
- **Write operations** (create/delete) work with in-memory store
- Changes persist for the session (reset on server restart)
- No database required for full development workflow

## Usage

### Development Without Database
```bash
# No environment variables needed
bun run dev
```

Logs will show:
```
🔶 [DATABASE] No connection string found - running in MOCK MODE
🔶 [MOCK] task.all - Using mock data
```

### Development With Database
```bash
# .env
POSTGRES_URL=postgresql://user:pass@localhost:5432/db

bun run dev
```

Logs will show:
```
✅ [DATABASE] Initializing with connection string
```

## Adding New Mock Routers

When creating a new router that queries the database:

1. **Add in-memory store and helpers** to `packages/api/src/mock-data.ts`:
```typescript
// In-memory store
let inMemoryProjects = [
  { id: "1", name: "Project 1", ... },
  { id: "2", name: "Project 2", ... },
];

// CRUD helpers
export function getAllMockProjects() {
  return [...inMemoryProjects];
}

export function addMockProject(project) {
  inMemoryProjects.push(project);
  return project;
}

export function deleteMockProject(id) {
  const index = inMemoryProjects.findIndex((p) => p.id === id);
  if (index !== -1) {
    inMemoryProjects.splice(index, 1);
    return true;
  }
  return false;
}
```

2. **Use in router**:
```typescript
import {
  logMockUsage,
  getAllMockProjects,
  addMockProject,
  deleteMockProject
} from "../mock-data";

export const projectRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      logMockUsage("project", "all");
      return getAllMockProjects();
    }
    // Real query...
  }),

  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    if (ctx.isMockMode) {
      logMockUsage("project", "create");
      const newProject = {
        id: crypto.randomUUID(),
        ...input,
      };
      addMockProject(newProject);
      return newProject;
    }
    // Real mutation...
  }),
};
```

## Error Handling

### Before (Scattered, Inconsistent)
```typescript
// Each procedure had its own try-catch
try {
  const data = await ctx.db.query.tasks.findMany();
  return data; // Could be undefined!
} catch {
  return mockTasks; // Only some procedures had this
}
```

### After (Centralized, Consistent)
```typescript
// Centralized check at the start
if (ctx.isMockMode) {
  logMockUsage("task", "all");
  return mockTasks; // Always returns data
}
// Real query (with fallback to mock on error)
```

## Testing

To test mock mode behavior:
```bash
# Remove database URL
unset POSTGRES_URL

# Start server
bun run dev

# Check logs for mock mode messages
# Visit http://localhost:3000 - should show mock tasks
```

## Configuration

### Environment Variables
- `POSTGRES_URL` - If set and valid, uses real database
- `POSTGRES_URL` - If not set, uses mock mode

### No Additional Configuration Needed
The system automatically detects database availability and switches modes.

## Best Practices

1. **Always check `ctx.isMockMode` first** in procedures that need database
2. **Use `logMockUsage()`** for consistent logging
3. **Return meaningful data** in mock mode (not empty arrays)
4. **Throw clear errors** for write operations in mock mode
5. **Add fallback** to mock data if database queries fail unexpectedly

## Summary

The centralized mock system provides:
- ✅ **Zero configuration** development experience
- ✅ **No undefined** query returns
- ✅ **Full CRUD** support with in-memory store
- ✅ **Clear, consistent** logging
- ✅ **Easy to extend** and maintain
- ✅ **Graceful degradation** when database unavailable
- ✅ **MSW disabled** - no HTTP interception conflicts

All achieved through:
- **One flag**: `ctx.isMockMode` in tRPC context
- **One file**: `mock-data.ts` with in-memory CRUD helpers
- **Consistent pattern**: Check `isMockMode` first in all procedures

### Task Creation Now Works!

You can now:
- ✅ Create tasks in mock mode (stored in-memory)
- ✅ Delete tasks in mock mode
- ✅ See changes immediately (until server restart)
- ✅ Develop full workflows without database

No more "Cannot create tasks in mock mode" errors!
