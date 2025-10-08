import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

import type { Session } from "@supabase/supabase-js";
import { supabase } from "~/utils/auth";

export default function ProfileScreen() {
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

  const userEmail = isMockMode ? "mock@example.com" : session?.user.email;

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Profile" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Profile
            </Text>
            <Text className="text-base text-muted-foreground">
              Manage your account information
            </Text>
          </View>

          {/* Profile Card */}
          <View className="bg-card border border-border rounded-lg p-6 mb-6">
            <View className="items-center mb-4">
              {/* Avatar Placeholder */}
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-4">
                <Text className="text-4xl font-bold text-primary-foreground">
                  {userEmail?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <Text className="text-xl font-bold text-foreground">
                {userEmail || "Not logged in"}
              </Text>
              {isMockMode && (
                <View className="bg-muted rounded-full px-3 py-1 mt-2">
                  <Text className="text-xs text-muted-foreground">🔓 Mock Mode</Text>
                </View>
              )}
            </View>
          </View>

          {/* Account Details */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Account Details
            </Text>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="p-4 border-b border-border">
                <Text className="text-sm text-muted-foreground mb-1">Email</Text>
                <Text className="text-base font-medium text-foreground">
                  {userEmail || "No email"}
                </Text>
              </View>
              <View className="p-4 border-b border-border">
                <Text className="text-sm text-muted-foreground mb-1">Member Since</Text>
                <Text className="text-base font-medium text-foreground">
                  {isMockMode ? "Mock Account" : session?.user.created_at ? new Date(session.user.created_at).toLocaleDateString() : "N/A"}
                </Text>
              </View>
              <View className="p-4">
                <Text className="text-sm text-muted-foreground mb-1">Status</Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  <Text className="text-base font-medium text-foreground">Active</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="space-y-3">
            <TouchableOpacity className="bg-card border border-border rounded-lg p-4">
              <Text className="text-base font-medium text-foreground text-center">
                Edit Profile
              </Text>
            </TouchableOpacity>

            {session && !isMockMode && (
              <TouchableOpacity
                onPress={() => supabase.auth.signOut()}
                className="bg-destructive rounded-lg p-4"
              >
                <Text className="text-base font-semibold text-destructive-foreground text-center">
                  Sign Out
                </Text>
              </TouchableOpacity>
            )}

            {isMockMode && (
              <View className="bg-muted rounded-lg p-4">
                <Text className="text-sm text-muted-foreground text-center">
                  Sign out is disabled in mock mode
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
