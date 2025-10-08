import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "all" | "featured";

export default function TabsLayoutDemo() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Tabs Layout",
          headerShadowVisible: false,
        }}
      />

      {/* Tabs */}
      <View className="flex-row border-b border-border bg-card">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-4 border-b-2 ${
            activeTab === "all" ? "border-primary" : "border-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "all" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            All Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("featured")}
          className={`flex-1 py-4 border-b-2 ${
            activeTab === "featured" ? "border-primary" : "border-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "featured" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Featured
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Tab Content */}
        {activeTab === "all" && (
          <View className="gap-4">
            <Text className="text-sm text-muted-foreground mb-2">
              Showing all items with skeleton placeholders
            </Text>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} className="bg-card border border-border rounded-lg p-4">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-12 h-12 bg-muted rounded-full" />
                  <View className="flex-1 gap-2">
                    <View className="h-4 bg-muted rounded w-3/4" />
                    <View className="h-3 bg-muted rounded w-1/2" />
                  </View>
                </View>
                <View className="gap-2">
                  <View className="h-3 bg-muted rounded w-full" />
                  <View className="h-3 bg-muted rounded w-full" />
                  <View className="h-3 bg-muted rounded w-4/5" />
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "featured" && (
          <View className="gap-4">
            <Text className="text-sm text-muted-foreground mb-2">
              Featured items with larger cards
            </Text>
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                <View className="h-48 bg-muted" />
                <View className="p-4 gap-2">
                  <View className="h-6 bg-muted rounded w-3/4" />
                  <View className="h-4 bg-muted rounded w-full" />
                  <View className="h-4 bg-muted rounded w-5/6" />
                  <View className="flex-row gap-2 mt-2">
                    <View className="h-8 bg-primary/20 rounded w-20" />
                    <View className="h-8 bg-muted rounded w-20" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Tabbed Navigation
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Use tabs for switching between related content
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Highlight active tab with border and color
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Keep tab count to 2-5 for mobile screens
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
