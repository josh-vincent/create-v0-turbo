import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function CardsLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Card List Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground mb-4">
          Vertical card list for articles, news, and content feeds
        </Text>

        {/* Card List */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="bg-card border border-border rounded-lg mb-4 overflow-hidden">
            {/* Image Thumbnail */}
            <View className="h-48 bg-muted" />

            {/* Card Content */}
            <View className="p-4 gap-2">
              {/* Category Badge */}
              <View className="self-start h-5 bg-primary/20 rounded-full w-20" />

              {/* Title */}
              <View className="h-6 bg-muted rounded w-full" />
              <View className="h-6 bg-muted rounded w-4/5" />

              {/* Description */}
              <View className="gap-1 mt-1">
                <View className="h-4 bg-muted rounded w-full" />
                <View className="h-4 bg-muted rounded w-full" />
                <View className="h-4 bg-muted rounded w-3/4" />
              </View>

              {/* Meta Info */}
              <View className="flex-row items-center gap-3 mt-2">
                <View className="w-8 h-8 bg-muted rounded-full" />
                <View className="flex-1 gap-1">
                  <View className="h-3 bg-muted rounded w-24" />
                  <View className="h-3 bg-muted rounded w-32" />
                </View>
                <View className="w-6 h-6 bg-muted rounded" />
              </View>
            </View>
          </View>
        ))}

        {/* Horizontal Card Variation */}
        <Text className="text-sm font-semibold text-foreground mt-4 mb-4">
          Horizontal Cards (Compact)
        </Text>

        {[1, 2, 3].map((i) => (
          <View key={i} className="bg-card border border-border rounded-lg mb-3 flex-row overflow-hidden">
            {/* Image */}
            <View className="w-28 h-28 bg-muted" />

            {/* Content */}
            <View className="flex-1 p-3 gap-2">
              <View className="h-4 bg-muted rounded w-full" />
              <View className="h-4 bg-muted rounded w-4/5" />
              <View className="flex-row items-center gap-2 mt-auto">
                <View className="h-3 bg-muted rounded w-16" />
                <View className="h-3 bg-muted rounded w-12" />
              </View>
            </View>
          </View>
        ))}

        {/* Featured Card */}
        <Text className="text-sm font-semibold text-foreground mt-4 mb-4">
          Featured Card (Large)
        </Text>

        <View className="bg-card border border-border rounded-lg overflow-hidden mb-4">
          {/* Large Image */}
          <View className="h-64 bg-muted" />

          {/* Overlay Badge */}
          <View className="absolute top-4 left-4 h-8 bg-primary rounded-full w-24" />

          {/* Content */}
          <View className="p-4 gap-3">
            <View className="h-8 bg-muted rounded w-full" />
            <View className="h-8 bg-muted rounded w-3/4" />

            <View className="gap-1 mt-2">
              <View className="h-4 bg-muted rounded w-full" />
              <View className="h-4 bg-muted rounded w-full" />
              <View className="h-4 bg-muted rounded w-5/6" />
            </View>

            {/* Actions */}
            <View className="flex-row gap-2 mt-4">
              <View className="flex-1 h-12 bg-primary rounded-lg" />
              <View className="w-12 h-12 bg-muted rounded-lg" />
            </View>
          </View>
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Card Layouts
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Vertical cards: Best for articles, news, blog posts
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Horizontal cards: Compact list view, search results
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Featured cards: Highlight important content
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
