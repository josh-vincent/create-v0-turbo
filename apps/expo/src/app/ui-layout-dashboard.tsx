import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function DashboardLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Dashboard Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground mb-4">
          Analytics dashboard with metrics, charts, and activity
        </Text>

        {/* Summary Cards (2x2 Grid) */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-[48%] bg-card border border-border rounded-lg p-4 gap-2">
              <View className="flex-row items-center justify-between">
                <View className="h-3 bg-muted rounded w-16" />
                <View className="w-6 h-6 bg-primary/20 rounded" />
              </View>
              <View className="h-8 bg-muted rounded w-20" />
              <View className="h-3 bg-muted rounded w-24" />
            </View>
          ))}
        </View>

        {/* Chart Section */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="h-5 bg-muted rounded w-32" />
            <View className="h-8 bg-muted rounded-full w-24" />
          </View>

          {/* Bar Chart Placeholder */}
          <View className="h-48 flex-row items-end justify-between gap-2">
            {[60, 80, 45, 90, 70, 85, 65].map((height, i) => (
              <View
                key={i}
                className="flex-1 bg-primary/30 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </View>

          {/* X-Axis Labels */}
          <View className="flex-row justify-between mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <View key={i} className="flex-1 items-center">
                <View className="h-3 bg-muted rounded w-8" />
              </View>
            ))}
          </View>
        </View>

        {/* Line Chart Variation */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <View className="h-5 bg-muted rounded w-28 mb-4" />

          <View className="h-32 bg-gradient-to-b from-primary/20 to-transparent rounded-lg mb-2">
            {/* Line path would go here */}
          </View>

          <View className="flex-row justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} className="h-3 bg-muted rounded w-12" />
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-primary/10 border border-primary/30 rounded-lg p-4 items-center gap-2">
            <View className="w-12 h-12 bg-primary/30 rounded-full" />
            <View className="h-6 bg-primary/40 rounded w-16" />
            <View className="h-3 bg-primary/30 rounded w-20" />
          </View>
          <View className="flex-1 bg-card border border-border rounded-lg p-4 items-center gap-2">
            <View className="w-12 h-12 bg-muted rounded-full" />
            <View className="h-6 bg-muted rounded w-16" />
            <View className="h-3 bg-muted rounded w-20" />
          </View>
        </View>

        {/* Recent Activity List */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="h-5 bg-muted rounded w-32" />
            <View className="h-4 bg-muted rounded w-16" />
          </View>

          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              className="flex-row items-center gap-3 pb-3 mb-3 border-b border-border last:border-b-0"
            >
              <View className="w-10 h-10 bg-muted rounded-full" />
              <View className="flex-1 gap-1">
                <View className="h-4 bg-muted rounded w-full" />
                <View className="h-3 bg-muted rounded w-2/3" />
              </View>
              <View className="h-3 bg-muted rounded w-12" />
            </View>
          ))}
        </View>

        {/* Progress Indicators */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <View className="h-5 bg-muted rounded w-24 mb-4" />

          {[
            { label: "Completed", value: 75 },
            { label: "In Progress", value: 45 },
            { label: "Pending", value: 60 },
          ].map((item, i) => (
            <View key={i} className="mb-4 last:mb-0">
              <View className="flex-row justify-between mb-2">
                <View className="h-3 bg-muted rounded w-20" />
                <View className="h-3 bg-muted rounded w-10" />
              </View>
              <View className="h-2 bg-muted rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.value}%` }}
                />
              </View>
            </View>
          ))}
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Dashboard Layout
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Summary cards at top for quick metrics
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Charts and visualizations for trends
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Recent activity/notifications list
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Progress indicators for goals
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
