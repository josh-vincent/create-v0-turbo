import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Job {
  id: string;
  jobNumber: string;
  customerName: string;
  contactPerson?: string;
  contactNumber?: string;
  address: string;
  equipmentType?: string;
  materialType?: string;
  price?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  scheduledTime?: string;
  priority?: "low" | "medium" | "high" | "urgent";
}

export default function TodayScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Mock today's jobs - replace with actual tRPC query filtered by today's date
  const [todaysJobs, setTodaysJobs] = useState<Job[]>([
    {
      id: "1",
      jobNumber: "JOB-2024-001",
      customerName: "Acme Inc",
      contactPerson: "John Doe",
      contactNumber: "+1 (555) 123-4567",
      address: "123 Main St, San Francisco, CA 94103",
      equipmentType: "Excavator",
      materialType: "Concrete",
      price: "$5,000",
      status: "in-progress",
      scheduledTime: "09:00 AM",
      priority: "high",
    },
    {
      id: "2",
      jobNumber: "JOB-2024-005",
      customerName: "BuildCo",
      contactPerson: "Sarah Johnson",
      contactNumber: "+1 (555) 234-5678",
      address: "789 Construction Ave, Oakland, CA 94601",
      equipmentType: "Bulldozer",
      materialType: "Gravel",
      price: "$3,500",
      status: "pending",
      scheduledTime: "11:30 AM",
      priority: "medium",
    },
    {
      id: "3",
      jobNumber: "JOB-2024-008",
      customerName: "Metro Development",
      contactPerson: "Mike Chen",
      contactNumber: "+1 (555) 345-6789",
      address: "456 Urban Plaza, Berkeley, CA 94704",
      equipmentType: "Crane",
      materialType: "Steel Beams",
      price: "$12,000",
      status: "pending",
      scheduledTime: "02:00 PM",
      priority: "urgent",
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Integrate with tRPC query
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-500";
      case "high":
        return "bg-orange-100 border-orange-500";
      case "medium":
        return "bg-yellow-100 border-yellow-500";
      case "low":
        return "bg-green-100 border-green-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      onPress={() => router.push(`/job-detail?id=${item.id}`)}
      className={`border-l-4 ${getPriorityColor(item.priority)} bg-card rounded-lg p-4 mb-4 shadow-sm`}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-bold text-foreground">
              {item.jobNumber}
            </Text>
            {item.priority && (
              <View className="flex-row items-center gap-1">
                <Text className="text-sm">{getPriorityIcon(item.priority)}</Text>
                <Text className="text-xs font-medium text-muted-foreground capitalize">
                  {item.priority}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-muted-foreground">
            {item.customerName}
          </Text>
        </View>
        <View className={`${getStatusColor(item.status)} px-3 py-1 rounded-full`}>
          <Text className="text-xs font-medium text-white capitalize">
            {item.status.replace("-", " ")}
          </Text>
        </View>
      </View>

      {/* Scheduled Time */}
      {item.scheduledTime && (
        <View className="bg-muted rounded-md px-3 py-2 mb-3">
          <View className="flex-row items-center">
            <Text className="text-base mr-2">🕐</Text>
            <Text className="text-sm font-semibold text-foreground">
              {item.scheduledTime}
            </Text>
          </View>
        </View>
      )}

      {/* Contact Info */}
      {(item.contactPerson || item.contactNumber) && (
        <View className="mb-3 pb-3 border-b border-border">
          {item.contactPerson && (
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-foreground">
                👤 {item.contactPerson}
              </Text>
            </View>
          )}
          {item.contactNumber && (
            <View className="flex-row items-center">
              <Text className="text-sm text-foreground">
                📱 {item.contactNumber}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Location */}
      <View className="mb-3 pb-3 border-b border-border">
        <Text className="text-sm text-foreground">
          📍 {item.address}
        </Text>
      </View>

      {/* Job Details */}
      <View className="space-y-2">
        {item.equipmentType && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-24">Equipment:</Text>
            <Text className="text-sm text-foreground flex-1">
              {item.equipmentType}
            </Text>
          </View>
        )}
        {item.materialType && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-24">Material:</Text>
            <Text className="text-sm text-foreground flex-1">
              {item.materialType}
            </Text>
          </View>
        )}
        {item.price && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-24">Price:</Text>
            <Text className="text-sm font-semibold text-green-600 flex-1">
              {item.price}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Today", headerShadowVisible: false }} />

      <View className="flex-1 px-4">
        {/* Header */}
        <View className="pt-2 pb-3 border-b border-border">
          <Text className="text-2xl font-bold text-foreground mb-1">
            Today's Schedule
          </Text>
          <Text className="text-sm text-muted-foreground">{todayDate}</Text>
        </View>

        {/* Summary Stats */}
        <View className="pt-3 pb-2 flex-row gap-3">
          <View className="flex-1 bg-card border border-border rounded-lg p-3">
            <Text className="text-2xl font-bold text-foreground">
              {todaysJobs.length}
            </Text>
            <Text className="text-xs text-muted-foreground">Total Jobs</Text>
          </View>
          <View className="flex-1 bg-card border border-border rounded-lg p-3">
            <Text className="text-2xl font-bold text-blue-600">
              {todaysJobs.filter((j) => j.status === "in-progress").length}
            </Text>
            <Text className="text-xs text-muted-foreground">In Progress</Text>
          </View>
          <View className="flex-1 bg-card border border-border rounded-lg p-3">
            <Text className="text-2xl font-bold text-amber-600">
              {todaysJobs.filter((j) => j.status === "pending").length}
            </Text>
            <Text className="text-xs text-muted-foreground">Pending</Text>
          </View>
        </View>

        {/* Jobs List */}
        <FlatList
          data={todaysJobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">📅</Text>
              </View>
              <Text className="text-xl font-bold text-foreground mb-2">
                No Jobs Today
              </Text>
              <Text className="text-base text-muted-foreground text-center px-8">
                You have no scheduled jobs for today
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
