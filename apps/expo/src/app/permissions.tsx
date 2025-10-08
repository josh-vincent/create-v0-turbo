import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

interface Permission {
  id: string;
  name: string;
  icon: string;
  description: string;
  reason: string;
  status: "granted" | "denied" | "not-asked";
}

export default function PermissionsScreen() {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "camera",
      name: "Camera",
      icon: "📷",
      description: "Take photos and videos",
      reason: "Required for profile photos and creating posts",
      status: "not-asked",
    },
    {
      id: "photos",
      name: "Photo Library",
      icon: "🖼️",
      description: "Access your photos",
      reason: "Share images and upload photos",
      status: "not-asked",
    },
    {
      id: "location",
      name: "Location",
      icon: "📍",
      description: "Access your location",
      reason: "Show nearby places and location-based features",
      status: "not-asked",
    },
    {
      id: "microphone",
      name: "Microphone",
      icon: "🎙️",
      description: "Record audio",
      reason: "AI voice chat and voice messages",
      status: "not-asked",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "🔔",
      description: "Send push notifications",
      reason: "Keep you updated on important events",
      status: "not-asked",
    },
    {
      id: "contacts",
      name: "Contacts",
      icon: "👥",
      description: "Access your contacts",
      reason: "Find friends and invite contacts",
      status: "not-asked",
    },
  ]);

  const handleRequestPermission = async (id: string) => {
    // Simulate permission request (replace with actual permission APIs)
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id
          ? { ...perm, status: Math.random() > 0.3 ? "granted" : "denied" }
          : perm,
      ),
    );
  };

  const getStatusColor = (status: Permission["status"]) => {
    switch (status) {
      case "granted":
        return "bg-green-500/20 text-green-600";
      case "denied":
        return "bg-destructive/20 text-destructive";
      case "not-asked":
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: Permission["status"]) => {
    switch (status) {
      case "granted":
        return "Granted ✓";
      case "denied":
        return "Denied ✕";
      case "not-asked":
        return "Request";
    }
  };

  const grantedCount = permissions.filter((p) => p.status === "granted").length;
  const deniedCount = permissions.filter((p) => p.status === "denied").length;

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "App Permissions" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              App Permissions
            </Text>
            <Text className="text-base text-muted-foreground">
              Manage what data the app can access
            </Text>
          </View>

          {/* Summary */}
          <View className="bg-card border border-border rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground mb-1">
                  Permission Status
                </Text>
                <Text className="text-2xl font-bold text-foreground">
                  {grantedCount}/{permissions.length} Granted
                </Text>
              </View>
              <View className="items-center">
                <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center">
                  <Text className="text-3xl">🔐</Text>
                </View>
              </View>
            </View>
            {deniedCount > 0 && (
              <View className="mt-3 pt-3 border-t border-border">
                <Text className="text-sm text-destructive">
                  ⚠️ {deniedCount} permission(s) denied. Some features may not
                  work.
                </Text>
              </View>
            )}
          </View>

          {/* Permissions List */}
          <View className="gap-3 mb-6">
            {permissions.map((permission) => (
              <View
                key={permission.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-3 mb-2">
                      <Text className="text-3xl">{permission.icon}</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {permission.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {permission.description}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-muted rounded-lg p-3 mt-2">
                      <Text className="text-sm text-muted-foreground">
                        <Text className="font-semibold">Why needed: </Text>
                        {permission.reason}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <View
                    className={`flex-1 px-3 py-2 rounded-lg ${getStatusColor(permission.status)}`}
                  >
                    <Text className="text-sm font-semibold text-center">
                      {getStatusText(permission.status)}
                    </Text>
                  </View>

                  {permission.status !== "granted" && (
                    <TouchableOpacity
                      onPress={() => handleRequestPermission(permission.id)}
                      className="px-4 py-2 bg-primary rounded-lg"
                    >
                      <Text className="text-sm font-semibold text-primary-foreground">
                        {permission.status === "denied" ? "Settings" : "Allow"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Info Card */}
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Privacy First
            </Text>
            <Text className="text-sm text-muted-foreground">
              We only request permissions that are necessary for app features.
              You can change these settings anytime in your device settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
