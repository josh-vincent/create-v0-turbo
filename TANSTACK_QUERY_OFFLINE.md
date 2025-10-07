# TanStack Query Offline Components

Universal offline-first query components for Next.js and Expo, now available in our component registry.

## 📦 Components

### 1. **QueryProvider** - Provider with Persistence
Universal TanStack Query provider with automatic offline persistence.

- **Web**: Uses `localStorage` via `createSyncStoragePersister`
- **Native**: Uses `AsyncStorage` via `createAsyncStoragePersister`
- **Features**: Auto-persist queries, configurable TTL, dev tools (web only)

### 2. **useOfflineQuery** - Offline-First Hook
Enhanced `useQuery` that automatically handles offline scenarios.

- Shows stale data when offline
- Prevents refetching when offline
- Auto-refetches when reconnected
- Returns `isOffline` flag

### 3. **useNetworkStatus** - Network Detection
Universal hook to detect online/offline status.

- **Web**: Uses `navigator.onLine` + event listeners
- **Native**: Uses `@react-native-community/netinfo`
- Returns `{ isOnline, isOffline }`

## 🚀 Installation

### Using Shadcn CLI

```bash
# Install all query components
npx shadcn@latest add http://localhost:3000/r/query-provider
npx shadcn@latest add http://localhost:3000/r/use-offline-query
npx shadcn@latest add http://localhost:3000/r/use-network-status
```

### Dependencies

These components require:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.87.1",
    "@tanstack/react-query-persist-client": "^5.87.1",
    "@tanstack/query-sync-storage-persister": "^5.87.1",      // Web
    "@tanstack/query-async-storage-persister": "^5.87.1",     // Native
    "@react-native-async-storage/async-storage": "^2.1.0",    // Native
    "@react-native-community/netinfo": "^11.0.0"              // Native
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.87.1"               // Web only
  }
}
```

## 📖 Usage

### 1. Setup QueryProvider

#### Next.js (app/layout.tsx)
```tsx
import { QueryProvider } from "@/components/query-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider
          config={{
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            throttleTime: 1000,
          }}
          enableDevtools={true}
        >
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

#### Expo (app/_layout.tsx)
```tsx
import { QueryProvider } from "@/components/query-provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider
      config={{
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }}
    >
      <Stack />
    </QueryProvider>
  );
}
```

### 2. Use Offline Query

```tsx
"use client"; // Next.js only

import { useOfflineQuery } from "@/hooks/use-offline-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("https://api.example.com/todos");
  return res.json();
}

export function TodoList() {
  const { data, isLoading, isOffline } = useOfflineQuery<Todo[]>(
    ["todos"],
    fetchTodos,
    {
      showStaleWhenOffline: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  return (
    <div>
      {isOffline && (
        <div className="bg-yellow-100 p-4 rounded">
          📡 You're offline. Showing cached data.
        </div>
      )}

      {isLoading && <div>Loading...</div>}

      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Network Status Banner

```tsx
"use client"; // Next.js only

import { useNetworkStatus } from "@/hooks/use-network-status";

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 w-full bg-yellow-500 text-white p-2 text-center">
      📡 You're offline. Some features may be limited.
    </div>
  );
}
```

## 🎯 Features

### Automatic Persistence

Queries are automatically persisted to storage:

- **Web**: `localStorage` with key `REACT_QUERY_OFFLINE_CACHE`
- **Native**: `AsyncStorage` with key `REACT_QUERY_OFFLINE_CACHE`

### Smart Offline Behavior

When offline, queries:
- ✅ Don't attempt to refetch
- ✅ Show stale data indefinitely
- ✅ Return `isOffline: true`
- ✅ Auto-refetch when reconnected

### Configurable Options

```tsx
<QueryProvider
  config={{
    // Maximum age of cached data
    maxAge: 1000 * 60 * 60 * 24, // 24 hours

    // Throttle persist frequency
    throttleTime: 1000, // 1 second

    // Custom filter for what to persist
    shouldDehydrateQuery: (query) => {
      return query.state.status === "success";
    },
  }}
/>
```

## 🔧 Advanced Usage

### Prefetch for Offline Use

```tsx
import { useQueryClient } from "@tanstack/react-query";

function DownloadButton() {
  const queryClient = useQueryClient();

  const downloadData = async () => {
    // Prefetch multiple queries for offline use
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["todos"],
        queryFn: fetchTodos,
      }),
      queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
      }),
    ]);

    alert("Data downloaded for offline use!");
  };

  return (
    <button onClick={downloadData}>
      💾 Download for Offline
    </button>
  );
}
```

### Clear Offline Cache

```tsx
import { useQueryClient } from "@tanstack/react-query";

function ClearCacheButton() {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.clear();
    // Also clear persisted data
    if (typeof window !== "undefined") {
      localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
    }
  };

  return <button onClick={clearCache}>🗑️ Clear Cache</button>;
}
```

### Conditional Mutations

```tsx
import { useMutation } from "@tanstack/react-query";
import { useNetworkStatus } from "@/hooks/use-network-status";

function CreateTodoButton() {
  const { isOnline } = useNetworkStatus();

  const mutation = useMutation({
    mutationFn: createTodo,
    // Only enable when online
    enabled: isOnline,
  });

  return (
    <button
      onClick={() => mutation.mutate({ title: "New todo" })}
      disabled={!isOnline}
    >
      {isOnline ? "Create Todo" : "Cannot Create (Offline)"}
    </button>
  );
}
```

## 🌐 Platform Differences

| Feature | Web | Native |
|---------|-----|--------|
| Storage | localStorage | AsyncStorage |
| Network Detection | navigator.onLine | NetInfo |
| DevTools | ✅ Yes | ❌ No |
| Persistence | Sync | Async |

## 🐛 Troubleshooting

### Web: DevTools Not Showing

Make sure you're in development mode:
```tsx
<QueryProvider enableDevtools={process.env.NODE_ENV === "development"} />
```

### Native: NetInfo Not Found

Install the dependency:
```bash
npm install @react-native-community/netinfo
```

### Cache Not Persisting

Check storage keys match:
```tsx
// Both web and native use the same key
const CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";
```

## 📚 Learn More

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Persistence & Offline](https://tanstack.com/query/latest/docs/react/plugins/persistQueryClient)
- [NetInfo Documentation](https://github.com/react-native-netinfo/react-native-netinfo)

## 🎨 Example Apps

See working examples in:
- `apps/nextjs` - Next.js implementation
- `apps/expo` - React Native implementation

Both apps use these components for offline-first data fetching!
