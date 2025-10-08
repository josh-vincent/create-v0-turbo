import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "~/utils/auth";

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function SupabaseDirectDemo() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all profiles using Supabase client directly
  const profilesQuery = useQuery({
    queryKey: ["supabase-profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Search profiles by name
  const searchQuery2 = useQuery({
    queryKey: ["supabase-profiles-search", searchQuery],
    queryFn: async (): Promise<Profile[]> => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("display_name", `%${searchQuery.trim()}%`)
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: searchQuery.trim().length > 0,
  });

  // Get current user
  const userQuery = useQuery({
    queryKey: ["supabase-current-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleCreateProfile = async () => {
    if (!userQuery.data?.id) {
      Alert.alert("Error", "You must be logged in to create a profile");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userQuery.data.id,
          email: userQuery.data.email,
          display_name: userQuery.data.user_metadata?.name || "User",
        })
        .select()
        .single();

      if (error) throw error;

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["supabase-profiles"] });

      Alert.alert("Success", "Profile created successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Supabase Direct Query",
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={profilesQuery.isRefetching}
            onRefresh={() => profilesQuery.refetch()}
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">
            Supabase Direct Query Demo
          </Text>
          <Text className="text-sm text-muted-foreground">
            Querying Supabase directly using the native client. Bypasses tRPC for
            direct database access.
          </Text>
        </View>

        {/* Current User */}
        {userQuery.data && (
          <View className="mb-6 bg-card border border-border rounded-lg p-4">
            <Text className="text-base font-semibold text-foreground mb-2">
              👤 Current User
            </Text>
            <Text className="text-sm text-muted-foreground">
              {userQuery.data.email}
            </Text>
            <Text className="text-xs text-muted-foreground mt-1">
              ID: {userQuery.data.id}
            </Text>
          </View>
        )}

        {/* Search Profiles */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">
            Search Profiles
          </Text>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name..."
            placeholderTextColor="#9ca3af"
            className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
          />

          {searchQuery.trim() && (
            <View className="mt-3">
              {searchQuery2.isLoading ? (
                <ActivityIndicator size="small" />
              ) : searchQuery2.data && searchQuery2.data.length > 0 ? (
                <View className="space-y-2">
                  <Text className="text-sm text-muted-foreground">
                    Found {searchQuery2.data.length} result(s)
                  </Text>
                  {searchQuery2.data.map((profile) => (
                    <View
                      key={profile.id}
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <Text className="text-base font-semibold text-foreground">
                        {profile.display_name || "Unnamed User"}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {profile.email || "No email"}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-muted-foreground">
                  No profiles found
                </Text>
              )}
            </View>
          )}
        </View>

        {/* All Profiles */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-foreground">
              All Profiles
            </Text>
            <TouchableOpacity
              onPress={handleCreateProfile}
              className="bg-primary rounded-md px-3 py-1.5"
            >
              <Text className="text-xs font-medium text-primary-foreground">
                Create Profile
              </Text>
            </TouchableOpacity>
          </View>

          {profilesQuery.isLoading ? (
            <View className="bg-card border border-border rounded-lg p-6">
              <ActivityIndicator size="large" />
              <Text className="text-center text-muted-foreground mt-2">
                Loading profiles from Supabase...
              </Text>
            </View>
          ) : profilesQuery.error ? (
            <View className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <Text className="text-destructive font-semibold mb-2">Error</Text>
              <Text className="text-destructive/80 text-sm mb-3">
                {profilesQuery.error.message}
              </Text>
              <TouchableOpacity
                onPress={() => profilesQuery.refetch()}
                className="bg-destructive rounded-md px-4 py-2"
              >
                <Text className="text-destructive-foreground text-center font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : profilesQuery.data && profilesQuery.data.length > 0 ? (
            <View className="space-y-3">
              {profilesQuery.data.map((profile) => (
                <View
                  key={profile.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <Text className="text-base font-bold text-foreground mb-1">
                    {profile.display_name || "Unnamed User"}
                  </Text>
                  <Text className="text-sm text-muted-foreground mb-2">
                    {profile.email || "No email"}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-muted-foreground">
                      Created: {new Date(profile.created_at).toLocaleDateString()}
                    </Text>
                    {profile.avatar_url && (
                      <Text className="text-xs text-muted-foreground">
                        Has avatar
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-muted/50 border border-border rounded-lg p-6">
              <Text className="text-center text-muted-foreground">
                No profiles found. Create one to get started!
              </Text>
            </View>
          )}
        </View>

        {/* Query Details */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">
            📊 Query Details
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Total Profiles:</Text>
              <Text className="text-sm font-semibold text-foreground">
                {profilesQuery.data?.length || 0}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Query Status:</Text>
              <Text className="text-sm font-semibold text-foreground">
                {profilesQuery.isLoading
                  ? "Loading"
                  : profilesQuery.isError
                    ? "Error"
                    : "Success"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Is Stale:</Text>
              <Text className="text-sm font-semibold text-foreground">
                {profilesQuery.isStale ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            💡 Features Demonstrated
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Direct Supabase client queries
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • PostgreSQL full-text search (.ilike)
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Ordering and limiting results
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Insert with .select().single()
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Cache invalidation after mutations
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Current user auth state
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
