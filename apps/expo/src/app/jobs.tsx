import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
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
  notes?: string;
  createdAt: string;
}

export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock jobs data
  const [jobs, setJobs] = useState<Job[]>([
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
      notes: "Urgent job - complete by end of week",
      createdAt: "2024-10-05",
    },
    {
      id: "2",
      jobNumber: "JOB-2024-002",
      customerName: "TechCorp",
      contactPerson: "Jane Smith",
      contactNumber: "+1 (555) 987-6543",
      address: "456 Oak Ave, San Jose, CA 95110",
      equipmentType: "Bulldozer",
      materialType: "Asphalt",
      price: "$8,500",
      status: "pending",
      notes: "Site preparation required",
      createdAt: "2024-10-06",
    },
  ]);

  const filteredJobs = jobs.filter((job) =>
    searchQuery === "" ||
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleDuplicate = (job: Job) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      jobNumber: `JOB-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setJobs([newJob, ...jobs]);
  };

  const renderJob = ({ item }: { item: Job }) => (
    <View className="bg-card border border-border rounded-lg p-4 mb-4">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">
            {item.jobNumber}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            {item.customerName}
          </Text>
        </View>
        <View className={`${getStatusColor(item.status)} px-3 py-1 rounded-full`}>
          <Text className="text-xs font-medium text-white capitalize">
            {item.status.replace("-", " ")}
          </Text>
        </View>
      </View>

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
      <View className="mb-3 pb-3 border-b border-border space-y-2">
        {item.equipmentType && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-28">Equipment:</Text>
            <Text className="text-sm text-foreground flex-1">
              {item.equipmentType}
            </Text>
          </View>
        )}
        {item.materialType && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-28">Material:</Text>
            <Text className="text-sm text-foreground flex-1">
              {item.materialType}
            </Text>
          </View>
        )}
        {item.price && (
          <View className="flex-row items-center">
            <Text className="text-sm text-muted-foreground w-28">Price:</Text>
            <Text className="text-sm font-semibold text-green-600 flex-1">
              {item.price}
            </Text>
          </View>
        )}
      </View>

      {/* Notes */}
      {item.notes && (
        <View className="mb-3 pb-3 border-b border-border">
          <Text className="text-xs text-muted-foreground mb-1">Notes:</Text>
          <Text className="text-sm text-foreground">{item.notes}</Text>
        </View>
      )}

      {/* Footer - Date and Actions */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-muted-foreground">
          Created: {item.createdAt}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.push(`/job-detail?id=${item.id}`)}
            className="px-3 py-2 bg-primary rounded-md"
          >
            <Text className="text-xs font-medium text-primary-foreground">
              View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDuplicate(item)}
            className="px-3 py-2 bg-muted rounded-md flex-row items-center gap-1"
          >
            <Text className="text-base">➕</Text>
            <Text className="text-xs font-medium text-foreground">
              Duplicate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Jobs", headerShadowVisible: false }} />

      <View className="flex-1 px-4">
        {/* Search Bar */}
        <View className="pt-2 pb-3">
          <View className="flex-row items-center bg-card border border-border rounded-lg px-4 py-3">
            <Text className="text-xl mr-2">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search jobs..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-foreground"
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text className="text-lg text-muted-foreground">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results Count */}
        <View className="mb-3">
          <Text className="text-sm text-muted-foreground">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {/* Jobs List */}
        <FlatList
          data={filteredJobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">💼</Text>
              </View>
              <Text className="text-xl font-bold text-foreground mb-2">
                No Jobs Found
              </Text>
              <Text className="text-base text-muted-foreground text-center px-8">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first job to get started"}
              </Text>
            </View>
          }
        />

        {/* Add Job FAB */}
        <TouchableOpacity
          onPress={() => router.push("/job-add")}
          className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-2xl text-primary-foreground">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
