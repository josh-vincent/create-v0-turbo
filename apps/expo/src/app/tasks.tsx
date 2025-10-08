import { LegendList } from "@legendapp/list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

function TaskCard(props: {
  task: RouterOutputs["task"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View className="flex flex-row rounded-lg bg-card border border-border p-4 mb-3">
      <View className="flex-1">
        <Link
          href={{
            pathname: "/task/[id]",
            params: { id: props.task.id },
          }}
        >
          <Text className="text-xl font-bold text-foreground">{props.task.title}</Text>
          {props.task.description && (
            <Text className="mt-2 text-sm text-muted-foreground">{props.task.description}</Text>
          )}
          <Text className="mt-1 text-xs text-muted-foreground">
            Priority: {props.task.priority}
          </Text>
        </Link>
      </View>
      <View className="justify-center">
        <TouchableOpacity
          onPress={props.onDelete}
          className="bg-destructive rounded-md px-3 py-2"
        >
          <Text className="text-destructive-foreground font-semibold text-xs">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TasksScreen() {
  const queryClient = useQueryClient();

  const taskQuery = useQuery(trpc.task.all.queryOptions());

  const deleteTaskMutation = useMutation(
    trpc.task.delete.mutationOptions({
      onSettled: () => queryClient.invalidateQueries(trpc.task.all.queryFilter()),
    }),
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Tasks" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              All Tasks
            </Text>
            <Text className="text-base text-muted-foreground">
              Manage and track your tasks
            </Text>
          </View>

          {/* Tasks List */}
          <View>
            {taskQuery.isLoading ? (
              <View className="bg-muted rounded-lg p-6">
                <Text className="text-center text-muted-foreground">Loading tasks...</Text>
              </View>
            ) : taskQuery.data && taskQuery.data.length > 0 ? (
              <LegendList
                data={taskQuery.data}
                estimatedItemSize={100}
                keyExtractor={(item) => item.id}
                renderItem={(t) => (
                  <TaskCard
                    task={t.item}
                    onDelete={() => deleteTaskMutation.mutate(t.item.id)}
                  />
                )}
              />
            ) : (
              <View className="bg-card border border-dashed border-border rounded-lg p-8">
                <Text className="text-center text-lg font-semibold text-muted-foreground mb-2">
                  No tasks yet
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  Create your first task from the home screen
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
