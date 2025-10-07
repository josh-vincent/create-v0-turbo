import { LegendList } from "@legendapp/list";
import type { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Button as RNButton, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@tocld/ui/components";
import { Pressable, TextInput } from "@tocld/ui/primitives";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { supabase } from "~/utils/auth";

function TaskCard(props: {
  task: RouterOutputs["task"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View className="flex flex-row rounded-lg bg-muted p-4">
      <View className="flex-grow">
        <Link
          asChild
          href={{
            pathname: "/task/[id]",
            params: { id: props.task.id },
          }}
        >
          <Pressable className="">
            <Text className="text-xl font-semibold text-primary">{props.task.title}</Text>
            {props.task.description && (
              <Text className="mt-2 text-foreground">{props.task.description}</Text>
            )}
            <Text className="mt-1 text-sm text-muted-foreground">
              Priority: {props.task.priority}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Button
        variant="ghost"
        size="sm"
        onPress={props.onDelete}
        className="font-bold uppercase text-primary"
      >
        Delete
      </Button>
    </View>
  );
}

function CreateTask() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, error } = useMutation(
    trpc.task.create.mutationOptions({
      async onSuccess() {
        setTitle("");
        setDescription("");
        await queryClient.invalidateQueries(trpc.task.all.queryFilter());
      },
    }),
  );

  return (
    <View className="mt-4 flex gap-2">
      <TextInput
        className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="mb-2 text-destructive">{error.data.zodError.fieldErrors.title}</Text>
      )}
      <TextInput
        className="items-center rounded-md border border-input bg-background px-3 text-lg leading-[1.25] text-foreground"
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <Button
        variant="primary"
        size="md"
        onPress={() => {
          mutate({
            teamId: "00000000-0000-0000-0000-000000000000", // Replace with actual team ID
            title,
            description,
            priority: "medium",
          });
        }}
      >
        Create
      </Button>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text className="mt-2 text-destructive">You need to be logged in to create a task</Text>
      )}
    </View>
  );
}

function MobileAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const isMockMode = process.env.EXPO_PUBLIC_MOCK_AUTH === "true";

  useEffect(() => {
    if (isMockMode) {
      // Skip auth in mock mode
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [isMockMode]);

  if (isMockMode) {
    return (
      <>
        <Text className="pb-2 text-center text-xl font-semibold text-foreground">
          Logged in as mock@example.com
        </Text>
        <Text className="text-center text-xs text-muted-foreground">🔓 Mock Mode Active</Text>
      </>
    );
  }

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-foreground">
        {session?.user.email ? `Logged in as ${session.user.email}` : "Not logged in"}
      </Text>
      {session && (
        <RNButton onPress={() => supabase.auth.signOut()} title="Sign Out" color={"#5B65E9"} />
      )}
    </>
  );
}

export default function Index() {
  const queryClient = useQueryClient();

  const taskQuery = useQuery(trpc.task.all.queryOptions());

  const deleteTaskMutation = useMutation(
    trpc.task.delete.mutationOptions({
      onSettled: () => queryClient.invalidateQueries(trpc.task.all.queryFilter()),
    }),
  );

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">V0</Text> Turbo
        </Text>

        <MobileAuth />

        <View className="py-2">
          <Text className="font-semibold italic text-primary">Press on a task</Text>
        </View>

        <LegendList
          data={taskQuery.data ?? []}
          estimatedItemSize={20}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(t) => (
            <TaskCard task={t.item} onDelete={() => deleteTaskMutation.mutate(t.item.id)} />
          )}
        />

        <CreateTask />
      </View>
    </SafeAreaView>
  );
}
