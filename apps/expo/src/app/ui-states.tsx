import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type StateType = "empty" | "error" | "success" | "loading";

export default function UIStatesDemo() {
  const [activeState, setActiveState] = useState<StateType | null>(null);

  const states: Array<{ type: StateType; label: string; color: string }> = [
    { type: "empty", label: "Empty States", color: "bg-blue-500" },
    { type: "error", label: "Error States", color: "bg-red-500" },
    { type: "success", label: "Success States", color: "bg-green-500" },
    { type: "loading", label: "Loading States", color: "bg-yellow-500" },
  ];

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "UI States Gallery",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        {/* State Selector */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Select State Type</Text>
          <View className="gap-2">
            {states.map((state) => (
              <TouchableOpacity
                key={state.type}
                onPress={() => setActiveState(state.type)}
                className={`${state.color} rounded-lg py-3 ${activeState === state.type ? "opacity-100" : "opacity-70"}`}
              >
                <Text className="text-center text-white font-semibold">{state.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Empty States */}
        {activeState === "empty" && (
          <View className="gap-4">
            {/* No Data */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">📭</Text>
                <Text className="text-xl font-bold text-foreground mb-2">No Data Yet</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  You haven't added any items yet. Get started by creating your first one!
                </Text>
                <TouchableOpacity className="bg-primary rounded-lg px-6 py-3">
                  <Text className="text-primary-foreground font-medium">Add New Item</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* No Search Results */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">🔍</Text>
                <Text className="text-xl font-bold text-foreground mb-2">No Results Found</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  We couldn't find anything matching your search. Try different keywords.
                </Text>
                <TouchableOpacity className="bg-muted rounded-lg px-6 py-2">
                  <Text className="text-foreground font-medium">Clear Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* No Internet */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">📡</Text>
                <Text className="text-xl font-bold text-foreground mb-2">No Internet Connection</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  Please check your connection and try again.
                </Text>
                <TouchableOpacity className="bg-primary rounded-lg px-6 py-3">
                  <Text className="text-primary-foreground font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* First Time User */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">👋</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Welcome!</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  Let's get you started. Create your first project in just a few clicks.
                </Text>
                <TouchableOpacity className="bg-primary rounded-lg px-6 py-3">
                  <Text className="text-primary-foreground font-medium">Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Error States */}
        {activeState === "error" && (
          <View className="gap-4">
            {/* Network Error */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">⚠️</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Connection Error</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  Failed to connect to the server. Please try again.
                </Text>
                <TouchableOpacity className="bg-red-500 rounded-lg px-6 py-3">
                  <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Server Error */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">🔥</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Server Error</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  Something went wrong on our end. We're working on it!
                </Text>
                <Text className="text-xs text-muted-foreground">Error Code: 500</Text>
              </View>
            </View>

            {/* Not Found */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">🤷</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Page Not Found</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  The page you're looking for doesn't exist.
                </Text>
                <TouchableOpacity className="bg-primary rounded-lg px-6 py-3">
                  <Text className="text-primary-foreground font-medium">Go Home</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Permission Denied */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">🔒</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Access Denied</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  You don't have permission to access this resource.
                </Text>
                <TouchableOpacity className="bg-muted rounded-lg px-6 py-2">
                  <Text className="text-foreground font-medium">Request Access</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Validation Error */}
            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">❌</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-red-700 mb-1">Validation Error</Text>
                  <Text className="text-xs text-red-600">Please check the following:</Text>
                  <View className="mt-2 gap-1">
                    <Text className="text-xs text-red-600">• Email is required</Text>
                    <Text className="text-xs text-red-600">• Password must be at least 8 characters</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Success States */}
        {activeState === "success" && (
          <View className="gap-4">
            {/* Success Confirmation */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                  <Text className="text-4xl">✓</Text>
                </View>
                <Text className="text-xl font-bold text-foreground mb-2">Success!</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  Your changes have been saved successfully.
                </Text>
              </View>
            </View>

            {/* Toast Success (Top) */}
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold">✓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-green-800">Item Created</Text>
                  <Text className="text-xs text-green-700">Successfully added to your list</Text>
                </View>
              </View>
            </View>

            {/* Celebration */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <Text className="text-6xl mb-4">🎉</Text>
                <Text className="text-xl font-bold text-foreground mb-2">Congratulations!</Text>
                <Text className="text-sm text-muted-foreground text-center mb-4">
                  You've completed all your tasks for today!
                </Text>
                <View className="flex-row gap-2">
                  <Text className="text-2xl">🎊</Text>
                  <Text className="text-2xl">✨</Text>
                  <Text className="text-2xl">🌟</Text>
                </View>
              </View>
            </View>

            {/* Checkmark Animation */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-4">
                  <Text className="text-5xl text-white">✓</Text>
                </View>
                <Text className="text-lg font-semibold text-foreground">Payment Confirmed</Text>
                <Text className="text-sm text-muted-foreground">Transaction ID: #12345</Text>
              </View>
            </View>

            {/* Inline Success */}
            <View className="bg-green-50 border-l-4 border-green-500 rounded p-3">
              <Text className="text-sm font-medium text-green-800">
                ✓ Settings updated successfully
              </Text>
            </View>
          </View>
        )}

        {/* Loading States */}
        {activeState === "loading" && (
          <View className="gap-4">
            {/* Standard Loading */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-sm text-muted-foreground mt-3">Loading...</Text>
              </View>
            </View>

            {/* Loading with Progress */}
            <View className="bg-card border border-border rounded-lg p-6">
              <View className="items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-lg font-semibold text-foreground mt-3">Processing Payment</Text>
                <Text className="text-sm text-muted-foreground">Please wait...</Text>
                <View className="w-full h-2 bg-muted rounded-full mt-4 overflow-hidden">
                  <View className="h-full w-2/3 bg-primary" />
                </View>
              </View>
            </View>

            {/* Skeleton List */}
            <View className="bg-card border border-border rounded-lg p-4">
              <Text className="text-sm font-semibold text-foreground mb-3">Loading Items...</Text>
              <View className="gap-3">
                {[1, 2, 3].map((i) => (
                  <View key={i} className="flex-row items-center gap-3">
                    <View className="w-12 h-12 bg-muted rounded-full" />
                    <View className="flex-1 gap-2">
                      <View className="h-4 bg-muted rounded w-3/4" />
                      <View className="h-3 bg-muted rounded w-1/2" />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Inline Loading */}
            <View className="bg-card border border-border rounded-lg p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">Saving changes...</Text>
                <ActivityIndicator size="small" />
              </View>
            </View>
          </View>
        )}

        {!activeState && (
          <View className="bg-muted/50 border border-border rounded-lg p-8">
            <Text className="text-center text-muted-foreground">
              Select a state type above to view examples
            </Text>
          </View>
        )}

        <View className="bg-muted/50 border border-border rounded-lg p-4 mt-4 mb-4">
          <Text className="text-base font-semibold text-foreground mb-2">💡 Best Practices</Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Always provide feedback for user actions
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Use appropriate icons and colors for each state
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Provide clear action buttons for error recovery
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Keep loading states simple and informative
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
