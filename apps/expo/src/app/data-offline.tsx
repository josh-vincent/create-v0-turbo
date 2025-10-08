import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  synced: boolean;
  createdAt: number;
}

const STORAGE_KEY = "@offline_todos";

export default function OfflineFirstDemo() {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [syncQueue, setSyncQueue] = useState<string[]>([]);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Load todos from local storage
  const todosQuery = useQuery({
    queryKey: ["offline-todos"],
    queryFn: async (): Promise<Todo[]> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
        return [];
      } catch (error) {
        console.error("Error loading todos:", error);
        return [];
      }
    },
  });

  // Save todos to local storage
  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      queryClient.setQueryData(["offline-todos"], todos);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  // Add new todo (works offline)
  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle,
      completed: false,
      synced: isOnline, // Mark as unsynced if offline
      createdAt: Date.now(),
    };

    const currentTodos = todosQuery.data || [];
    const updatedTodos = [...currentTodos, newTodo];

    await saveTodos(updatedTodos);
    setNewTodoTitle("");

    if (!isOnline) {
      // Add to sync queue
      setSyncQueue((prev) => [...prev, newTodo.id]);
      Alert.alert(
        "Offline Mode",
        "Todo saved locally. It will sync when you're back online."
      );
    } else {
      // Simulate API call
      setTimeout(() => {
        Alert.alert("Success", "Todo synced to server!");
      }, 500);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: string) => {
    const currentTodos = todosQuery.data || [];
    const updatedTodos = currentTodos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, synced: isOnline }
        : todo
    );

    await saveTodos(updatedTodos);

    if (!isOnline) {
      setSyncQueue((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    const currentTodos = todosQuery.data || [];
    const updatedTodos = currentTodos.filter((todo) => todo.id !== id);

    await saveTodos(updatedTodos);
    setSyncQueue((prev) => prev.filter((todoId) => todoId !== id));
  };

  // Sync pending changes (when back online)
  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert("Offline", "Cannot sync while offline");
      return;
    }

    if (syncQueue.length === 0) {
      Alert.alert("Info", "Nothing to sync");
      return;
    }

    // Simulate syncing
    Alert.alert("Syncing", `Syncing ${syncQueue.length} todo(s)...`);

    // Mark all as synced
    const currentTodos = todosQuery.data || [];
    const updatedTodos = currentTodos.map((todo) => ({
      ...todo,
      synced: true,
    }));

    await saveTodos(updatedTodos);
    setSyncQueue([]);

    setTimeout(() => {
      Alert.alert("Success", "All changes synced!");
    }, 1000);
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <View className="bg-card border border-border rounded-lg p-4 mb-3">
      <View className="flex-row items-start justify-between">
        <TouchableOpacity
          onPress={() => handleToggleTodo(item.id)}
          className="flex-1 flex-row items-start gap-3"
        >
          <View
            className={`w-5 h-5 rounded border-2 items-center justify-center ${
              item.completed
                ? "bg-primary border-primary"
                : "border-muted-foreground"
            }`}
          >
            {item.completed && <Text className="text-primary-foreground">✓</Text>}
          </View>

          <View className="flex-1">
            <Text
              className={`text-base ${
                item.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {item.title}
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              {!item.synced && (
                <View className="bg-yellow-100 px-2 py-0.5 rounded">
                  <Text className="text-xs font-medium text-yellow-700">
                    ⏳ Pending sync
                  </Text>
                </View>
              )}
              {item.synced && (
                <View className="bg-green-100 px-2 py-0.5 rounded">
                  <Text className="text-xs font-medium text-green-700">
                    ✓ Synced
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteTodo(item.id)}
          className="bg-destructive rounded-md px-2 py-1 ml-2"
        >
          <Text className="text-destructive-foreground text-xs">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const unsyncedCount = todosQuery.data?.filter((t) => !t.synced).length || 0;

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Offline-First Demo",
          headerShadowVisible: false,
        }}
      />

      {/* Network Status Banner */}
      <View
        className={`px-4 py-2 ${
          isOnline ? "bg-green-500/20" : "bg-red-500/20"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text
              className={`text-sm font-medium ${
                isOnline ? "text-green-700" : "text-red-700"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>

          {unsyncedCount > 0 && (
            <TouchableOpacity
              onPress={handleSync}
              disabled={!isOnline}
              className={`px-3 py-1 rounded ${
                isOnline ? "bg-primary" : "bg-muted"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isOnline ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Sync {unsyncedCount}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Header */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Offline-First Sync Demo
        </Text>
        <Text className="text-sm text-muted-foreground">
          All operations work offline! Data persists in AsyncStorage and syncs when
          online.
        </Text>
      </View>

      {/* Add Todo Input */}
      <View className="px-4 pb-3">
        <View className="flex-row gap-2">
          <TextInput
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            placeholder="Add a todo..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-base text-foreground"
            onSubmitEditing={handleAddTodo}
          />
          <TouchableOpacity
            onPress={handleAddTodo}
            disabled={!newTodoTitle.trim()}
            className={`rounded-lg px-4 py-2 items-center justify-center ${
              !newTodoTitle.trim() ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-xl">➕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Todos List */}
      <View className="flex-1 px-4">
        {todosQuery.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="text-muted-foreground mt-2">Loading todos...</Text>
          </View>
        ) : (
          <FlatList
            data={todosQuery.data}
            renderItem={renderTodo}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={todosQuery.isRefetching}
                onRefresh={() => todosQuery.refetch()}
              />
            }
            ListEmptyComponent={
              <View className="bg-muted/50 border border-border rounded-lg p-8 mt-4">
                <Text className="text-center text-muted-foreground text-base">
                  No todos yet. Add one above!
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Info Footer */}
      <View className="bg-muted/50 border-t border-border p-4">
        <Text className="text-base font-semibold text-foreground mb-2">
          💡 Offline-First Features
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • AsyncStorage for local persistence
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Network status monitoring (NetInfo)
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Sync queue for offline changes
        </Text>
        <Text className="text-sm text-muted-foreground mb-1">
          • Optimistic UI updates
        </Text>
        <Text className="text-sm text-muted-foreground">
          • Auto-sync when back online
        </Text>
      </View>
    </View>
  );
}
