import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function TimeTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState("");

  const timeEntries = [
    {
      id: "1",
      task: "Client Meeting",
      project: "Acme Corp",
      duration: "2h 30m",
      date: "2025-10-07",
      billable: true,
    },
    {
      id: "2",
      task: "Code Review",
      project: "Internal",
      duration: "1h 15m",
      date: "2025-10-07",
      billable: false,
    },
    {
      id: "3",
      task: "Feature Development",
      project: "TechStart Inc",
      duration: "4h 00m",
      date: "2025-10-06",
      billable: true,
    },
    {
      id: "4",
      task: "Bug Fixes",
      project: "Design Studio",
      duration: "1h 45m",
      date: "2025-10-06",
      billable: true,
    },
  ];

  const totalHours = timeEntries.reduce((sum, entry) => {
    const [hours, mins] = entry.duration.split("h ");
    return sum + parseInt(hours) + parseInt(mins.replace("m", "")) / 60;
  }, 0);

  const billableHours = timeEntries
    .filter((e) => e.billable)
    .reduce((sum, entry) => {
      const [hours, mins] = entry.duration.split("h ");
      return sum + parseInt(hours) + parseInt(mins.replace("m", "")) / 60;
    }, 0);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Time Tracking" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Time Tracking
            </Text>
            <Text className="text-base text-muted-foreground">
              Track your time and billable hours
            </Text>
          </View>

          {/* Active Timer */}
          <View className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm text-muted-foreground mb-1">
                  {isTracking ? "Currently Tracking" : "Start Tracking"}
                </Text>
                <Text className="text-3xl font-bold text-primary">
                  {isTracking ? "00:15:32" : "00:00:00"}
                </Text>
              </View>
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                <Text className="text-3xl">{isTracking ? "⏸️" : "▶️"}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsTracking(!isTracking)}
              className={`${isTracking ? "bg-destructive" : "bg-primary"} rounded-lg p-3 items-center`}
            >
              <Text className="text-base font-semibold text-white">
                {isTracking ? "Stop Timer" : "Start Timer"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Total Hours
              </Text>
              <Text className="text-2xl font-bold text-primary">
                {totalHours.toFixed(1)}h
              </Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Billable
              </Text>
              <Text className="text-2xl font-bold text-green-600">
                {billableHours.toFixed(1)}h
              </Text>
            </View>
          </View>

          {/* Time Entries */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Recent Entries
            </Text>
            <View className="space-y-3">
              {timeEntries.map((entry) => (
                <View
                  key={entry.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground mb-1">
                        {entry.task}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {entry.project}
                      </Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        entry.billable
                          ? "bg-green-500/20"
                          : "bg-muted"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          entry.billable
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {entry.billable ? "Billable" : "Non-billable"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-primary">
                      {entry.duration}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {entry.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
