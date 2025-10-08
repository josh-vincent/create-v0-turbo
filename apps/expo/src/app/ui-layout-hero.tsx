import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HeroLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Hero Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1">
        {/* Hero Image - Top 2/3 */}
        <View className="h-96 bg-muted relative">
          {/* Overlay Content */}
          <View className="absolute inset-0 bg-black/40 items-center justify-center p-8">
            <View className="items-center gap-4">
              <View className="h-12 bg-white/90 rounded w-3/4" />
              <View className="h-6 bg-white/70 rounded w-full" />
              <View className="h-6 bg-white/70 rounded w-5/6" />

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-6">
                <View className="h-12 bg-white rounded-lg w-32" />
                <View className="h-12 bg-white/30 rounded-lg w-32" />
              </View>
            </View>
          </View>
        </View>

        {/* Content Below Hero */}
        <View className="p-4 gap-4">
          {/* Section Title */}
          <View className="gap-2">
            <View className="h-8 bg-muted rounded w-1/2" />
            <View className="h-4 bg-muted rounded w-full" />
            <View className="h-4 bg-muted rounded w-4/5" />
          </View>

          {/* Feature Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card border border-border rounded-lg p-4 items-center gap-2">
              <View className="w-12 h-12 bg-primary/20 rounded-full" />
              <View className="h-4 bg-muted rounded w-20" />
              <View className="h-3 bg-muted rounded w-full" />
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-4 items-center gap-2">
              <View className="w-12 h-12 bg-primary/20 rounded-full" />
              <View className="h-4 bg-muted rounded w-20" />
              <View className="h-3 bg-muted rounded w-full" />
            </View>
          </View>

          {/* Stats Section */}
          <View className="bg-card border border-border rounded-lg p-4">
            <View className="h-6 bg-muted rounded w-1/3 mb-4" />
            <View className="flex-row justify-around">
              {[1, 2, 3].map((i) => (
                <View key={i} className="items-center gap-2">
                  <View className="h-8 bg-muted rounded w-16" />
                  <View className="h-3 bg-muted rounded w-12" />
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="gap-2">
            <View className="h-5 bg-muted rounded w-1/3" />
            <View className="h-4 bg-muted rounded w-full" />
            <View className="h-4 bg-muted rounded w-full" />
            <View className="h-4 bg-muted rounded w-full" />
            <View className="h-4 bg-muted rounded w-3/4" />
          </View>

          {/* CTA Section */}
          <View className="bg-primary/10 border border-primary/30 rounded-lg p-6 items-center gap-3 mt-4">
            <View className="h-6 bg-primary/30 rounded w-2/3" />
            <View className="h-4 bg-primary/20 rounded w-full" />
            <View className="h-12 bg-primary rounded-lg w-48 mt-2" />
          </View>

          <View className="bg-muted/50 border border-border rounded-lg p-4 mt-4 mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Pattern: Hero Image Layout
            </Text>
            <Text className="text-xs text-muted-foreground mb-1">
              • Large hero image captures attention (2/3 of viewport)
            </Text>
            <Text className="text-xs text-muted-foreground mb-1">
              • Overlay text with semi-transparent background
            </Text>
            <Text className="text-xs text-muted-foreground">
              • Primary and secondary CTAs in hero section
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
