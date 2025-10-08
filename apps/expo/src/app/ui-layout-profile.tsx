import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProfileLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Profile Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1">
        {/* Cover Image */}
        <View className="h-32 bg-muted" />

        {/* Profile Info */}
        <View className="px-4 pb-4">
          {/* Avatar */}
          <View className="w-24 h-24 bg-card border-4 border-background rounded-full -mt-12 mb-4" />

          {/* Name & Bio */}
          <View className="gap-2 mb-4">
            <View className="h-6 bg-muted rounded w-40" />
            <View className="h-4 bg-muted rounded w-32" />
            <View className="h-4 bg-muted rounded w-full mt-2" />
            <View className="h-4 bg-muted rounded w-4/5" />
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around bg-card border border-border rounded-lg p-4 mb-4">
            <View className="items-center gap-1">
              <View className="h-6 bg-muted rounded w-16" />
              <View className="h-3 bg-muted rounded w-12" />
            </View>
            <View className="w-px bg-border" />
            <View className="items-center gap-1">
              <View className="h-6 bg-muted rounded w-16" />
              <View className="h-3 bg-muted rounded w-16" />
            </View>
            <View className="w-px bg-border" />
            <View className="items-center gap-1">
              <View className="h-6 bg-muted rounded w-16" />
              <View className="h-3 bg-muted rounded w-16" />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1 h-10 bg-primary rounded-lg" />
            <View className="flex-1 h-10 bg-muted rounded-lg" />
            <View className="w-10 h-10 bg-muted rounded-lg" />
          </View>

          {/* Highlights/Stories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} className="items-center gap-2">
                  <View className="w-16 h-16 bg-muted rounded-full" />
                  <View className="h-3 bg-muted rounded w-12" />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Content Tabs */}
          <View className="flex-row border-b border-border mb-4">
            <View className="flex-1 items-center py-3 border-b-2 border-primary">
              <View className="h-5 bg-muted rounded w-12" />
            </View>
            <View className="flex-1 items-center py-3">
              <View className="h-5 bg-muted rounded w-12" />
            </View>
            <View className="flex-1 items-center py-3">
              <View className="h-5 bg-muted rounded w-12" />
            </View>
          </View>

          {/* Content Grid */}
          <View className="flex-row flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <View key={i} className="w-[32.5%] aspect-square bg-muted rounded" />
            ))}
          </View>
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 m-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Profile Page
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Cover photo + profile avatar with overlap
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Stats row (posts, followers, following)
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Action buttons (Follow, Message, More)
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Content tabs with grid below
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
