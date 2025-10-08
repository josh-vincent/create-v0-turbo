import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const recentActivity = [
    { id: 1, type: "task", action: "created", title: "New task added", time: "2 hours ago" },
    { id: 2, type: "task", action: "completed", title: "Task completed", time: "5 hours ago" },
    { id: 3, type: "settings", action: "updated", title: "Settings changed", time: "1 day ago" },
    { id: 4, type: "profile", action: "updated", title: "Profile updated", time: "2 days ago" },
  ];

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Activity" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Activity
            </Text>
            <Text className="text-base text-muted-foreground">
              Recent activity and notifications
            </Text>
          </View>

          {/* Activity Feed */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Recent Activity
            </Text>
            <View className="space-y-3">
              {recentActivity.map((item) => (
                <View
                  key={item.id}
                  className="bg-card border border-border rounded-lg p-4 flex-row items-start"
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                      item.type === "task"
                        ? "bg-primary/20"
                        : item.type === "settings"
                        ? "bg-blue-500/20"
                        : "bg-green-500/20"
                    }`}
                  >
                    <Text className="text-lg">
                      {item.type === "task" ? "✓" : item.type === "settings" ? "⚙️" : "👤"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-foreground">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                      {item.time}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded ${
                      item.action === "created"
                        ? "bg-blue-500/20"
                        : item.action === "completed"
                        ? "bg-green-500/20"
                        : "bg-orange-500/20"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        item.action === "created"
                          ? "text-blue-600"
                          : item.action === "completed"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {item.action}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Summary */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              This Week
            </Text>
            <View className="bg-card border border-border rounded-lg overflow-hidden">
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-base text-foreground">Tasks Created</Text>
                <Text className="text-base font-bold text-primary">12</Text>
              </View>
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-base text-foreground">Tasks Completed</Text>
                <Text className="text-base font-bold text-green-600">8</Text>
              </View>
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-base text-foreground">Hours Tracked</Text>
                <Text className="text-base font-bold text-blue-600">24.5</Text>
              </View>
              <View className="p-4 flex-row justify-between">
                <Text className="text-base text-foreground">Active Projects</Text>
                <Text className="text-base font-bold text-orange-600">3</Text>
              </View>
            </View>
          </View>

          {/* Empty State for older activity */}
          <View className="bg-muted rounded-lg p-6 items-center">
            <Text className="text-sm text-muted-foreground text-center">
              That's all your recent activity
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
