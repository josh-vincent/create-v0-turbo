import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
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

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = params.id as string;

  // Mock job data - replace with actual tRPC query
  const [job, setJob] = useState<Job>({
    id: jobId,
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(job.notes || "");

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

  const handleUpdateStatus = (newStatus: Job["status"]) => {
    setJob({ ...job, status: newStatus });
    Alert.alert("Success", `Job status updated to ${newStatus}`);
  };

  const handleSaveNotes = () => {
    setJob({ ...job, notes: editedNotes });
    setIsEditing(false);
    Alert.alert("Success", "Notes updated successfully");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Integrate with tRPC mutation
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: job.jobNumber,
          headerBackTitle: "Jobs",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Status Card */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-sm text-muted-foreground mb-3">Job Status</Text>
          <View className="flex-row flex-wrap gap-2">
            {["pending", "in-progress", "completed", "cancelled"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => handleUpdateStatus(status as Job["status"])}
                className={`px-4 py-2 rounded-full ${
                  job.status === status
                    ? getStatusColor(status)
                    : "bg-muted"
                }`}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    job.status === status
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {status.replace("-", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Customer Info */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Customer Information
          </Text>
          <View className="space-y-3">
            <View>
              <Text className="text-sm text-muted-foreground mb-1">Customer</Text>
              <Text className="text-base text-foreground font-medium">
                {job.customerName}
              </Text>
            </View>
            {job.contactPerson && (
              <View>
                <Text className="text-sm text-muted-foreground mb-1">
                  Contact Person
                </Text>
                <Text className="text-base text-foreground">
                  {job.contactPerson}
                </Text>
              </View>
            )}
            {job.contactNumber && (
              <View>
                <Text className="text-sm text-muted-foreground mb-1">
                  Contact Number
                </Text>
                <Text className="text-base text-foreground">
                  {job.contactNumber}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Location */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Job Location
          </Text>
          <View className="flex-row items-start">
            <Text className="text-2xl mr-2">📍</Text>
            <Text className="text-base text-foreground flex-1">{job.address}</Text>
          </View>
        </View>

        {/* Job Details */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Job Details
          </Text>
          <View className="space-y-3">
            {job.equipmentType && (
              <View className="flex-row items-center">
                <Text className="text-sm text-muted-foreground w-32">
                  Equipment:
                </Text>
                <Text className="text-base text-foreground flex-1">
                  {job.equipmentType}
                </Text>
              </View>
            )}
            {job.materialType && (
              <View className="flex-row items-center">
                <Text className="text-sm text-muted-foreground w-32">Material:</Text>
                <Text className="text-base text-foreground flex-1">
                  {job.materialType}
                </Text>
              </View>
            )}
            {job.price && (
              <View className="flex-row items-center">
                <Text className="text-sm text-muted-foreground w-32">Price:</Text>
                <Text className="text-lg font-semibold text-green-600 flex-1">
                  {job.price}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Text className="text-sm text-muted-foreground w-32">Created:</Text>
              <Text className="text-base text-foreground flex-1">
                {job.createdAt}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View className="bg-card border border-border rounded-lg p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">Notes</Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => {
                  setEditedNotes(job.notes || "");
                  setIsEditing(true);
                }}
                className="bg-primary rounded-md px-3 py-1.5"
              >
                <Text className="text-xs font-medium text-primary-foreground">
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View>
              <TextInput
                value={editedNotes}
                onChangeText={setEditedNotes}
                placeholder="Add notes..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground min-h-[120px] mb-3"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleSaveNotes}
                  className="flex-1 bg-primary rounded-md py-2 items-center"
                >
                  <Text className="text-sm font-semibold text-primary-foreground">
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setEditedNotes(job.notes || "");
                    setIsEditing(false);
                  }}
                  className="flex-1 bg-muted rounded-md py-2 items-center"
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-base text-foreground">
              {job.notes || "No notes added yet."}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="space-y-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push(`/job-add?duplicate=${job.id}`)}
            className="bg-muted rounded-lg py-3 flex-row items-center justify-center gap-2"
          >
            <Text className="text-xl">➕</Text>
            <Text className="text-base font-semibold text-foreground">
              Duplicate Job
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 rounded-lg py-3 items-center"
          >
            <Text className="text-base font-semibold text-white">Delete Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
