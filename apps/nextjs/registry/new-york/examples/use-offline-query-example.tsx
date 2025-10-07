/**
 * useOfflineQuery Hook Example
 * Shows how to use offline-first queries
 */
"use client";

import { useOfflineQuery } from "../ui/use-offline-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
}

export function TodoList() {
  const { data, isLoading, isError, error, isOffline } = useOfflineQuery<Todo[]>(
    ["todos"],
    fetchTodos,
    {
      showStaleWhenOffline: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (isError && !isOffline) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      {isOffline && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          📡 You're offline. Showing cached data.
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Todos</h2>

      <ul className="space-y-2">
        {data?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 p-3 border rounded">
            <input type="checkbox" checked={todo.completed} readOnly className="w-4 h-4" />
            <span className={todo.completed ? "line-through" : ""}>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example: Prefetch queries for offline use
/*
import { useQueryClient } from "@tanstack/react-query";

export function PrefetchButton() {
  const queryClient = useQueryClient();

  const prefetchTodos = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["todos"],
      queryFn: fetchTodos,
    });
  };

  return (
    <button onClick={prefetchTodos}>
      💾 Download for offline use
    </button>
  );
}
*/
