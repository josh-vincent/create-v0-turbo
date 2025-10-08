import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const metrics = [
    { label: "Total Revenue", value: "$12,450", change: "+12.5%", positive: true },
    { label: "Active Projects", value: "8", change: "+2", positive: true },
    { label: "Tasks Completed", value: "142", change: "+18", positive: true },
    { label: "Team Members", value: "12", change: "0", positive: null },
  ];

  const recentActivity = [
    { type: "revenue", label: "New payment received", value: "$1,250" },
    { type: "project", label: "Project completed", value: "Design Studio" },
    { type: "task", label: "Tasks completed today", value: "8" },
    { type: "time", label: "Hours tracked this week", value: "32.5h" },
  ];

  // Simple bar chart data (mock visualization)
  const chartData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 90 },
    { month: "Apr", value: 81 },
    { month: "May", value: 95 },
    { month: "Jun", value: 88 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Analytics" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Analytics
            </Text>
            <Text className="text-base text-muted-foreground">
              Track your business metrics and performance
            </Text>
          </View>

          {/* Key Metrics Grid */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Key Metrics
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {metrics.map((metric, index) => (
                <View
                  key={index}
                  className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4"
                >
                  <Text className="text-sm text-muted-foreground mb-2">
                    {metric.label}
                  </Text>
                  <Text className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </Text>
                  {metric.change && (
                    <Text
                      className={`text-sm font-medium ${
                        metric.positive
                          ? "text-green-600"
                          : metric.positive === false
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {metric.change}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Revenue Chart */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Revenue Trend (6 Months)
            </Text>
            <View className="bg-card border border-border rounded-lg p-4">
              {/* Simple bar chart */}
              <View className="flex-row items-end justify-between h-40">
                {chartData.map((data, index) => {
                  const height = (data.value / maxValue) * 100;
                  return (
                    <View key={index} className="flex-1 items-center">
                      <View
                        style={{ height: `${height}%` }}
                        className="w-8 bg-primary rounded-t-lg mb-2"
                      />
                      <Text className="text-xs text-muted-foreground">
                        {data.month}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Recent Activity
            </Text>
            <View className="space-y-3">
              {recentActivity.map((activity, index) => {
                const iconMap: Record<string, string> = {
                  revenue: "💰",
                  project: "📁",
                  task: "✓",
                  time: "⏱️",
                };

                return (
                  <View
                    key={index}
                    className="bg-card border border-border rounded-lg p-4 flex-row items-center"
                  >
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">{iconMap[activity.type]}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        {activity.label}
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        {activity.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Performance Summary */}
          <View className="bg-primary/10 border border-primary rounded-lg p-6">
            <Text className="text-lg font-bold text-foreground mb-3">
              Performance Summary
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">
                  Completion Rate
                </Text>
                <Text className="text-sm font-semibold text-primary">87%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">
                  Billable Hours %
                </Text>
                <Text className="text-sm font-semibold text-primary">92%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">
                  Client Satisfaction
                </Text>
                <Text className="text-sm font-semibold text-primary">4.8/5</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
