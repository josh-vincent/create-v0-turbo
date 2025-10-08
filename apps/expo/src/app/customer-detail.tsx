import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "task";
  subject: string;
  description?: string;
  createdAt: string;
  completed?: boolean;
}

export default function CustomerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "activities">("overview");
  const [newNote, setNewNote] = useState("");

  // Mock customer data - replace with tRPC query
  const customer = {
    id: id as string,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    company: "Acme Inc",
    status: "customer" as const,
    phone: "+1 (555) 123-4567",
    jobTitle: "CEO",
    source: "website",
  };

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Initial contact made. Very interested in our enterprise plan.",
      author: "You",
      createdAt: "2024-10-05",
    },
    {
      id: "2",
      content: "Scheduled demo for next week.",
      author: "You",
      createdAt: "2024-10-06",
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "call",
      subject: "Initial discovery call",
      description: "Discussed their needs and pain points",
      createdAt: "2024-10-05",
      completed: true,
    },
    {
      id: "2",
      type: "meeting",
      subject: "Product demo",
      description: "Show enterprise features",
      createdAt: "2024-10-12",
      completed: false,
    },
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      Alert.alert("Error", "Please enter a note");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: "You",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setNotes([note, ...notes]);
    setNewNote("");
    Alert.alert("Success", "Note added successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer":
        return "bg-green-500";
      case "prospect":
        return "bg-blue-500";
      case "active":
        return "bg-purple-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "email":
        return "📧";
      case "meeting":
        return "🤝";
      case "task":
        return "✓";
      default:
        return "📝";
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Customer Details",
          headerBackTitle: "Back",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1">
          {/* Customer Header */}
          <View className="bg-card border-b border-border px-4 py-6">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-foreground">
                  {customer.firstName} {customer.lastName}
                </Text>
                {customer.company && (
                  <Text className="text-base text-muted-foreground mt-1">
                    {customer.jobTitle} at {customer.company}
                  </Text>
                )}
              </View>
              <View className={`${getStatusColor(customer.status)} px-3 py-1 rounded-full`}>
                <Text className="text-xs font-medium text-white capitalize">
                  {customer.status}
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="text-base text-foreground">📧 {customer.email}</Text>
              </View>
              {customer.phone && (
                <View className="flex-row items-center">
                  <Text className="text-base text-foreground">📱 {customer.phone}</Text>
                </View>
              )}
            </View>

            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3 items-center">
                <Text className="text-sm font-semibold text-primary-foreground">
                  📞 Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-muted rounded-lg py-3 items-center">
                <Text className="text-sm font-semibold text-foreground">
                  📧 Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-muted rounded-lg py-3 items-center">
                <Text className="text-sm font-semibold text-foreground">
                  ✏️ Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-border bg-background">
            <TouchableOpacity
              onPress={() => setActiveTab("overview")}
              className={`flex-1 py-4 items-center border-b-2 ${
                activeTab === "overview" ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "overview" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("notes")}
              className={`flex-1 py-4 items-center border-b-2 ${
                activeTab === "notes" ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "notes" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Notes ({notes.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("activities")}
              className={`flex-1 py-4 items-center border-b-2 ${
                activeTab === "activities" ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "activities" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Activities ({activities.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View className="px-4 py-4">
            {activeTab === "overview" && (
              <View className="space-y-4">
                <View className="bg-card border border-border rounded-lg p-4">
                  <Text className="text-base font-semibold text-foreground mb-3">
                    Contact Information
                  </Text>
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Source</Text>
                      <Text className="text-sm text-foreground capitalize">{customer.source}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Status</Text>
                      <Text className="text-sm text-foreground capitalize">{customer.status}</Text>
                    </View>
                  </View>
                </View>

                <View className="bg-card border border-border rounded-lg p-4">
                  <Text className="text-base font-semibold text-foreground mb-3">
                    Recent Activity
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Last contacted: 2 days ago
                  </Text>
                </View>
              </View>
            )}

            {activeTab === "notes" && (
              <View className="space-y-4">
                {/* Add Note */}
                <View className="bg-card border border-border rounded-lg p-4">
                  <Text className="text-base font-semibold text-foreground mb-3">
                    Add Note
                  </Text>
                  <TextInput
                    value={newNote}
                    onChangeText={setNewNote}
                    placeholder="Enter note..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground min-h-[80px] mb-3"
                  />
                  <TouchableOpacity
                    onPress={handleAddNote}
                    className="bg-primary rounded-lg py-3 items-center"
                  >
                    <Text className="text-sm font-semibold text-primary-foreground">
                      Add Note
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Notes List */}
                {notes.map((note) => (
                  <View
                    key={note.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-sm font-medium text-foreground">
                        {note.author}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {note.createdAt}
                      </Text>
                    </View>
                    <Text className="text-base text-foreground">{note.content}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === "activities" && (
              <View className="space-y-4">
                {activities.map((activity) => (
                  <View
                    key={activity.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-row items-center gap-2 flex-1">
                        <Text className="text-xl">{getActivityIcon(activity.type)}</Text>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-foreground">
                            {activity.subject}
                          </Text>
                          <Text className="text-sm text-muted-foreground capitalize">
                            {activity.type}
                          </Text>
                        </View>
                      </View>
                      {activity.completed && (
                        <View className="bg-green-500 px-2 py-1 rounded">
                          <Text className="text-xs font-medium text-white">
                            Completed
                          </Text>
                        </View>
                      )}
                    </View>
                    {activity.description && (
                      <Text className="text-sm text-foreground mt-2">
                        {activity.description}
                      </Text>
                    )}
                    <Text className="text-xs text-muted-foreground mt-2">
                      {activity.createdAt}
                    </Text>
                  </View>
                ))}

                <TouchableOpacity className="bg-muted border border-border rounded-lg py-4 items-center">
                  <Text className="text-sm font-semibold text-foreground">
                    + Add Activity
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
