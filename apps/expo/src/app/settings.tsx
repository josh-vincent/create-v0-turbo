import { Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Settings" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Settings
            </Text>
            <Text className="text-base text-muted-foreground">
              Customize your app experience
            </Text>
          </View>

          {/* Settings Sections */}
          <View className="space-y-4">
            {/* Account Section */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
                Account
              </Text>
              <View className="bg-card border border-border rounded-lg overflow-hidden">
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Email Preferences
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    Manage notification settings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Password & Security
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    Update your password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4">
                  <Text className="text-base font-medium text-foreground">
                    Privacy Settings
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    Control your data
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* App Section */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
                App Preferences
              </Text>
              <View className="bg-card border border-border rounded-lg overflow-hidden">
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Theme
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    Light mode
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Language
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4">
                  <Text className="text-base font-medium text-foreground">
                    Notifications
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    Push notifications enabled
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* About Section */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
                About
              </Text>
              <View className="bg-card border border-border rounded-lg overflow-hidden">
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Version
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    1.0.0
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 border-b border-border">
                  <Text className="text-base font-medium text-foreground">
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4">
                  <Text className="text-base font-medium text-foreground">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
