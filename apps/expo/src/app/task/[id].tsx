import { useQuery } from "@tanstack/react-query";
import { Stack, useGlobalSearchParams } from "expo-router";
import {  Text, View } from "react-native";

import { trpc } from "~/utils/api";

export default function Task() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data } = useQuery(trpc.task.byId.queryOptions({ id }));

  if (!data) return null;

  return (
    <View className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">{data.title}</Text>
        {data.description && <Text className="py-4 text-foreground">{data.description}</Text>}
        <View className="mt-4 flex gap-2">
          <Text className="text-foreground">
            <Text className="font-semibold">Priority:</Text> {data.priority}
          </Text>
          <Text className="text-foreground">
            <Text className="font-semibold">Status:</Text> {data.status || "todo"}
          </Text>
          {data.createdAt && (
            <Text className="text-muted-foreground">
              Created: {new Date(data.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
