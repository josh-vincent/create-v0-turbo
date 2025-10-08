import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TimeRange = "today" | "week" | "month" | "year";

interface ReportData {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  pendingJobs: number;
  cancelledJobs: number;
  totalRevenue: string;
  averageJobValue: string;
  topCustomers: Array<{ name: string; jobCount: number; revenue: string }>;
  jobsByEquipment: Array<{ type: string; count: number }>;
  jobsByMaterial: Array<{ type: string; count: number }>;
}

export default function ReportsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  // Mock report data - replace with actual tRPC query
  const reportData: ReportData = {
    totalJobs: 47,
    completedJobs: 32,
    inProgressJobs: 8,
    pendingJobs: 5,
    cancelledJobs: 2,
    totalRevenue: "$142,500",
    averageJobValue: "$3,032",
    topCustomers: [
      { name: "Acme Inc", jobCount: 12, revenue: "$45,600" },
      { name: "BuildCo", jobCount: 8, revenue: "$28,400" },
      { name: "Metro Development", jobCount: 6, revenue: "$36,000" },
    ],
    jobsByEquipment: [
      { type: "Excavator", count: 18 },
      { type: "Bulldozer", count: 12 },
      { type: "Crane", count: 10 },
      { type: "Dump Truck", count: 7 },
    ],
    jobsByMaterial: [
      { type: "Concrete", count: 15 },
      { type: "Asphalt", count: 12 },
      { type: "Gravel", count: 10 },
      { type: "Steel Beams", count: 10 },
    ],
  };

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const completionRate = Math.round(
    (reportData.completedJobs / reportData.totalJobs) * 100
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Reports", headerShadowVisible: false }} />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Time Range Selector */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Time Range
          </Text>
          <View className="flex-row gap-2">
            {timeRangeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setTimeRange(option.value)}
                className={`flex-1 py-2 rounded-lg ${
                  timeRange === option.value
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <Text
                  className={`text-sm font-medium text-center ${
                    timeRange === option.value
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Overview Stats */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Overview
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Total Jobs
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {reportData.totalJobs}
              </Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Completion Rate
              </Text>
              <Text className="text-3xl font-bold text-green-600">
                {completionRate}%
              </Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Total Revenue
              </Text>
              <Text className="text-2xl font-bold text-primary">
                {reportData.totalRevenue}
              </Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Avg Job Value
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                {reportData.averageJobValue}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Status Breakdown */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Job Status Breakdown
          </Text>
          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-green-500" />
                <Text className="text-sm text-foreground">Completed</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {reportData.completedJobs}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-blue-500" />
                <Text className="text-sm text-foreground">In Progress</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {reportData.inProgressJobs}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-amber-500" />
                <Text className="text-sm text-foreground">Pending</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {reportData.pendingJobs}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-red-500" />
                <Text className="text-sm text-foreground">Cancelled</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {reportData.cancelledJobs}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Customers */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Top Customers
          </Text>
          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            {reportData.topCustomers.map((customer, index) => (
              <View key={customer.name}>
                {index > 0 && <View className="border-t border-border my-3" />}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground mb-1">
                      {customer.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {customer.jobCount} jobs
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-green-600">
                    {customer.revenue}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Jobs by Equipment */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Jobs by Equipment Type
          </Text>
          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            {reportData.jobsByEquipment.map((item) => (
              <View key={item.type} className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground flex-1">{item.type}</Text>
                <View className="flex-row items-center gap-3">
                  <View className="bg-primary/20 rounded-full px-3 py-1">
                    <Text className="text-sm font-semibold text-primary">
                      {item.count}
                    </Text>
                  </View>
                  <View className="w-24 bg-muted rounded-full h-2">
                    <View
                      className="bg-primary rounded-full h-2"
                      style={{
                        width: `${(item.count / reportData.totalJobs) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Jobs by Material */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Jobs by Material Type
          </Text>
          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            {reportData.jobsByMaterial.map((item) => (
              <View key={item.type} className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground flex-1">{item.type}</Text>
                <View className="flex-row items-center gap-3">
                  <View className="bg-blue-500/20 rounded-full px-3 py-1">
                    <Text className="text-sm font-semibold text-blue-600">
                      {item.count}
                    </Text>
                  </View>
                  <View className="w-24 bg-muted rounded-full h-2">
                    <View
                      className="bg-blue-500 rounded-full h-2"
                      style={{
                        width: `${(item.count / reportData.totalJobs) * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Export Report
          </Text>
          <View className="space-y-2">
            <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📊</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    Export as PDF
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Download detailed report
                  </Text>
                </View>
              </View>
              <Text className="text-xl text-muted-foreground">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📧</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    Email Report
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Send to your inbox
                  </Text>
                </View>
              </View>
              <Text className="text-xl text-muted-foreground">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
