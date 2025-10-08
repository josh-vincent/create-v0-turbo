import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export default function ExternalAPIDemo() {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Fetch posts from JSONPlaceholder
  const postsQuery = useQuery({
    queryKey: ["external-posts"],
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Fetch user details for selected post
  const userQuery = useQuery({
    queryKey: ["external-user", selectedPost?.userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedPost?.userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!selectedPost, // Only fetch when post is selected
  });

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => setSelectedPost(item)}
      className={`bg-card border rounded-lg p-4 mb-3 ${
        selectedPost?.id === item.id ? "border-primary" : "border-border"
      }`}
    >
      <Text className="text-base font-bold text-foreground mb-2" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className="text-sm text-muted-foreground" numberOfLines={3}>
        {item.body}
      </Text>
      <Text className="text-xs text-muted-foreground mt-2">
        Post ID: {item.id} • User ID: {item.userId}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "External API Data",
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground mb-2">
            External API Demo
          </Text>
          <Text className="text-sm text-muted-foreground">
            Fetching data from JSONPlaceholder REST API using TanStack Query.
            Tap a post to see author details.
          </Text>
        </View>

        {/* Posts List */}
        <View className="flex-1">
          {postsQuery.isLoading ? (
            <View className="bg-card border border-border rounded-lg p-6 items-center">
              <ActivityIndicator size="large" />
              <Text className="text-center text-muted-foreground mt-2">
                Loading posts from external API...
              </Text>
            </View>
          ) : postsQuery.error ? (
            <View className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <Text className="text-destructive font-semibold mb-2">Error</Text>
              <Text className="text-destructive/80 text-sm mb-3">
                {postsQuery.error.message}
              </Text>
              <TouchableOpacity
                onPress={() => postsQuery.refetch()}
                className="bg-destructive rounded-md px-4 py-2"
              >
                <Text className="text-destructive-foreground text-center font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={postsQuery.data}
              renderItem={renderPost}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: selectedPost ? 300 : 20 }}
              refreshControl={
                <RefreshControl
                  refreshing={postsQuery.isRefetching}
                  onRefresh={() => postsQuery.refetch()}
                />
              }
              ListEmptyComponent={
                <View className="bg-muted/50 border border-border rounded-lg p-6">
                  <Text className="text-center text-muted-foreground">
                    No posts available
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Selected Post Details */}
        {selectedPost && (
          <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-foreground mb-1">
                Post Details
              </Text>
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                {selectedPost.title}
              </Text>
            </View>

            {userQuery.isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" />
                <Text className="text-sm text-muted-foreground">
                  Loading author...
                </Text>
              </View>
            ) : userQuery.error ? (
              <Text className="text-destructive text-sm">
                Error loading author: {userQuery.error.message}
              </Text>
            ) : userQuery.data ? (
              <View className="bg-card border border-border rounded-lg p-3 mb-3">
                <Text className="text-base font-semibold text-foreground mb-1">
                  👤 {userQuery.data.name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  @{userQuery.data.username}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {userQuery.data.email}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => setSelectedPost(null)}
              className="bg-primary rounded-lg py-2 items-center"
            >
              <Text className="text-base font-semibold text-primary-foreground">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info Footer */}
      {!selectedPost && (
        <View className="bg-muted/50 border-t border-border p-4">
          <Text className="text-base font-semibold text-foreground mb-2">
            💡 Features Demonstrated
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • REST API calls with fetch()
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • TanStack Query for caching
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Stale-while-revalidate pattern
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Conditional queries (enabled)
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Pull-to-refresh
          </Text>
        </View>
      )}
    </View>
  );
}
