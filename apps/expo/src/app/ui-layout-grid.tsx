import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function GridLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Grid Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground mb-4">
          2-column grid layout for galleries and product displays
        </Text>

        {/* 2-Column Grid */}
        <View className="flex-row flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <View key={i} className="w-[48%]">
              {/* Image Placeholder */}
              <View className="aspect-square bg-muted rounded-lg mb-2" />

              {/* Caption */}
              <View className="gap-1">
                <View className="h-4 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-3/4" />
              </View>

              {/* Meta Info */}
              <View className="flex-row items-center gap-2 mt-2">
                <View className="w-5 h-5 bg-muted rounded-full" />
                <View className="h-3 bg-muted rounded w-16" />
              </View>
            </View>
          ))}
        </View>

        {/* Alternative: 3-Column Grid */}
        <Text className="text-sm font-semibold text-foreground mt-8 mb-4">
          3-Column Variation
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} className="w-[31.5%]">
              <View className="aspect-square bg-muted rounded" />
            </View>
          ))}
        </View>

        {/* Pinterest-style Masonry Grid Placeholder */}
        <Text className="text-sm font-semibold text-foreground mt-8 mb-4">
          Masonry Style (Varied Heights)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-3">
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-40 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-56 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-32 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
          </View>
          <View className="flex-1 gap-3">
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-48 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-36 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="h-52 bg-muted" />
              <View className="p-2 gap-1">
                <View className="h-3 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
            </View>
          </View>
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 mt-6 mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Grid Layouts
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • 2-column grid: Best for products, photos, portfolios
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • 3-column grid: More compact, good for thumbnails
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Masonry grid: Varied heights for visual interest
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
