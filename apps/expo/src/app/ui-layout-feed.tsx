import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function FeedLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Social Feed Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1">
        <Text className="text-sm text-muted-foreground p-4 pb-2">
          Social media feed with posts, interactions, and media
        </Text>

        {/* Feed Posts */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="bg-card border-b border-border p-4">
            {/* Post Header */}
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 bg-muted rounded-full" />
              <View className="flex-1 gap-1">
                <View className="h-4 bg-muted rounded w-32" />
                <View className="h-3 bg-muted rounded w-20" />
              </View>
              <View className="w-6 h-6 bg-muted rounded" />
            </View>

            {/* Post Content */}
            <View className="gap-2 mb-3">
              <View className="h-4 bg-muted rounded w-full" />
              <View className="h-4 bg-muted rounded w-full" />
              <View className="h-4 bg-muted rounded w-3/4" />
            </View>

            {/* Post Image (every other post) */}
            {i % 2 === 0 && (
              <View className="h-64 bg-muted rounded-lg mb-3" />
            )}

            {/* Engagement Stats */}
            <View className="flex-row items-center gap-4 mb-3 py-2">
              <View className="flex-row items-center gap-1">
                <View className="w-5 h-5 bg-primary/20 rounded-full" />
                <View className="h-3 bg-muted rounded w-8" />
              </View>
              <View className="h-3 bg-muted rounded w-16" />
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-around border-t border-border pt-2">
              <View className="flex-row items-center gap-2 py-2 px-4">
                <View className="w-5 h-5 bg-muted rounded" />
                <View className="h-3 bg-muted rounded w-10" />
              </View>
              <View className="flex-row items-center gap-2 py-2 px-4">
                <View className="w-5 h-5 bg-muted rounded" />
                <View className="h-3 bg-muted rounded w-12" />
              </View>
              <View className="flex-row items-center gap-2 py-2 px-4">
                <View className="w-5 h-5 bg-muted rounded" />
                <View className="h-3 bg-muted rounded w-10" />
              </View>
            </View>

            {/* Comments Preview */}
            {i === 2 && (
              <View className="mt-3 pt-3 border-t border-border gap-2">
                <View className="flex-row items-start gap-2">
                  <View className="w-8 h-8 bg-muted rounded-full" />
                  <View className="flex-1 bg-muted/50 rounded-lg p-2 gap-1">
                    <View className="h-3 bg-muted rounded w-20" />
                    <View className="h-3 bg-muted rounded w-full" />
                    <View className="h-3 bg-muted rounded w-3/4" />
                  </View>
                </View>
                <View className="flex-row items-start gap-2">
                  <View className="w-8 h-8 bg-muted rounded-full" />
                  <View className="flex-1 bg-muted/50 rounded-lg p-2 gap-1">
                    <View className="h-3 bg-muted rounded w-24" />
                    <View className="h-3 bg-muted rounded w-full" />
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}

        <View className="bg-muted/50 border border-border rounded-lg p-4 m-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Social Feed
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • User info at top (avatar, name, timestamp)
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Content area with optional media
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Engagement stats (likes, comments, shares)
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Action buttons for interactions
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
