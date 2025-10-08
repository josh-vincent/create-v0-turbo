import { Stack, useRouter } from "expo-router";
import { useState } from "react";

import { useIsOnline } from "@/hooks/useNetworkStatus";
import { useSyncQueue } from "@/hooks/useSyncQueue";
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

type CustomerStatus = "active" | "inactive" | "prospect" | "customer";
type CustomerSource = "website" | "referral" | "cold-call" | "social-media" | "event" | "partner" | "other";

export default function AddCustomerScreen() {
  const router = useRouter();
  const { addToQueue } = useSyncQueue();
  const isOnline = useIsOnline();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<CustomerStatus>("prospect");
  const [source, setSource] = useState<CustomerSource>("website");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all required fields (First Name, Last Name, Email)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const newCustomer = {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      status,
      source,
      notes,
    };

    // Add to sync queue (will auto-sync if online)
    await addToQueue({
      type: "create",
      entity: "customer",
      data: newCustomer,
    });

    const message = isOnline
      ? "Customer added and synced successfully!"
      : "Customer added to offline queue. Will sync when online.";

    Alert.alert("Success", message, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Add Customer",
          headerBackTitle: "Back",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1 px-4 py-6">
          {/* Basic Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Basic Information
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  First Name *
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Last Name *
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Email *
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="john@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Phone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Company
                </Text>
                <TextInput
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Acme Inc."
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Job Title
                </Text>
                <TextInput
                  value={jobTitle}
                  onChangeText={setJobTitle}
                  placeholder="CEO"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>
            </View>
          </View>

          {/* CRM Fields */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              CRM Information
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(["prospect", "active", "customer", "inactive"] as CustomerStatus[]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setStatus(s)}
                      className={`px-4 py-2 rounded-full border ${
                        status === s
                          ? "bg-primary border-primary"
                          : "bg-muted border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium capitalize ${
                          status === s
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Source
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(["website", "referral", "cold-call", "social-media"] as CustomerSource[]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setSource(s)}
                      className={`px-4 py-2 rounded-full border ${
                        source === s
                          ? "bg-primary border-primary"
                          : "bg-muted border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          source === s
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {s.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Notes
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes about this customer..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground min-h-[100px]"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary rounded-lg py-4 items-center mb-6"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              {isOnline ? "Save & Sync" : "Save Offline"}
            </Text>
          </TouchableOpacity>

          {/* Network Status Indicator */}
          <View className="mb-6">
            <View
              className={`flex-row items-center justify-center gap-2 p-3 rounded-lg ${
                isOnline ? "bg-green-500/20" : "bg-amber-500/20"
              }`}
            >
              <Text className="text-lg">{isOnline ? "🌐" : "📡"}</Text>
              <Text
                className={`text-sm font-medium ${
                  isOnline ? "text-green-700" : "text-amber-700"
                }`}
              >
                {isOnline
                  ? "Online - Changes will sync immediately"
                  : "Offline - Changes will sync when online"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
