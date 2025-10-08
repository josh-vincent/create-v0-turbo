import type { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import { trpc } from "~/utils/api";
import { supabase } from "~/utils/auth";


function MobileAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const isMockMode = process.env.EXPO_PUBLIC_MOCK_AUTH === "true";

  useEffect(() => {
    if (isMockMode) {
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
      <View className="bg-card border border-border rounded-lg p-4 mb-6">
        <Text className="text-center text-base font-semibold text-foreground">
          Logged in as mock@example.com
        </Text>
        <Text className="text-center text-xs text-muted-foreground mt-1">
          🔓 Mock Mode Active
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-card border border-border rounded-lg p-4 mb-6">
      <Text className="text-center text-base font-semibold text-foreground">
        {session?.user.email ? `Logged in as ${session.user.email}` : "Not logged in"}
      </Text>
      {session && (
        <View className="mt-3">
          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
            className="bg-destructive rounded-md px-4 py-2 items-center"
          >
            <Text className="text-destructive-foreground font-semibold text-sm">Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function Index() {
  const taskQuery = useQuery(trpc.task.all.queryOptions());

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Home" }} />

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-foreground mb-2">
              Create <Text className="text-primary">V0</Text> Turbo
            </Text>
            <Text className="text-base text-muted-foreground">
              Welcome back! Here's what's happening today.
            </Text>
          </View>

          {/* Auth Status */}
          <MobileAuth />

          {/* Sync Status */}
          <View className="mb-6">
            <SyncStatusIndicator />
          </View>

          {/* Quick Stats Grid */}
          <View className="mb-6">
            <Text className="text-xl font-semibold mb-4 text-foreground">Overview</Text>
            <View className="flex-row flex-wrap gap-3">
              {/* Total Tasks Card */}
              <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
                <Text className="text-sm text-muted-foreground mb-2">Total Tasks</Text>
                <Text className="text-3xl font-bold text-primary">
                  {taskQuery.data?.length || 0}
                </Text>
              </View>

              {/* Completed Card */}
              <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
                <Text className="text-sm text-muted-foreground mb-2">Completed</Text>
                <Text className="text-3xl font-bold text-green-600">0</Text>
              </View>

              {/* In Progress Card */}
              <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
                <Text className="text-sm text-muted-foreground mb-2">In Progress</Text>
                <Text className="text-3xl font-bold text-blue-600">
                  {taskQuery.data?.length || 0}
                </Text>
              </View>

              {/* Pending Card */}
              <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
                <Text className="text-sm text-muted-foreground mb-2">Pending</Text>
                <Text className="text-3xl font-bold text-orange-600">0</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-xl font-semibold mb-4 text-foreground">Quick Actions</Text>
            <View className="space-y-3">
              <Link href="/tasks" asChild>
                <TouchableOpacity className="bg-primary rounded-lg p-4 flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-primary-foreground">
                      View All Tasks
                    </Text>
                    <Text className="text-sm text-primary-foreground/80 mt-1">
                      Manage and track your tasks
                    </Text>
                  </View>
                  <Text className="text-2xl text-primary-foreground">→</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/settings" asChild>
                <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-foreground">Settings</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      Customize your experience
                    </Text>
                  </View>
                  <Text className="text-2xl text-muted-foreground">⚙️</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/profile" asChild>
                <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-foreground">Profile</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      Manage your account
                    </Text>
                  </View>
                  <Text className="text-2xl text-muted-foreground">👤</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Tech Stack Footer */}
          <View className="mt-8 bg-muted rounded-lg p-4">
            <Text className="text-xs text-center text-muted-foreground mb-2">
              Powered by
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              <Text className="text-xs text-foreground">Expo 54</Text>
              <Text className="text-xs text-muted-foreground">•</Text>
              <Text className="text-xs text-foreground">React Native 0.81.4</Text>
              <Text className="text-xs text-muted-foreground">•</Text>
              <Text className="text-xs text-foreground">NativeWind 4</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
