import { Stack } from "expo-router";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

export default function FormLayoutDemo() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Form Layout",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground mb-4">
          Form elements, inputs, and settings layouts
        </Text>

        {/* Form Section */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <View className="h-6 bg-muted rounded w-32 mb-4" />

          {/* Text Input */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-20 mb-2" />
            <View className="h-12 bg-muted rounded-lg w-full" />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-16 mb-2" />
            <View className="h-12 bg-muted rounded-lg w-full" />
          </View>

          {/* Textarea */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-24 mb-2" />
            <View className="h-24 bg-muted rounded-lg w-full" />
            <View className="h-3 bg-muted rounded w-16 mt-1" />
          </View>

          {/* Dropdown */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-20 mb-2" />
            <View className="h-12 bg-muted rounded-lg w-full flex-row items-center justify-between px-4">
              <View className="h-4 bg-muted-foreground/30 rounded w-32" />
              <View className="h-4 bg-muted-foreground/30 rounded w-4" />
            </View>
          </View>

          {/* Date Picker */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-16 mb-2" />
            <View className="h-12 bg-muted rounded-lg w-full" />
          </View>

          {/* Checkboxes */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-24 mb-3" />
            {[1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-center gap-3 mb-2">
                <View className="w-5 h-5 bg-muted border-2 border-muted-foreground/30 rounded" />
                <View className="h-4 bg-muted rounded w-40" />
              </View>
            ))}
          </View>

          {/* Radio Buttons */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-32 mb-3" />
            {[1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-center gap-3 mb-2">
                <View className="w-5 h-5 bg-muted border-2 border-muted-foreground/30 rounded-full" />
                <View className="h-4 bg-muted rounded w-36" />
              </View>
            ))}
          </View>

          {/* Toggle Switches */}
          <View className="mb-4">
            <View className="h-4 bg-muted rounded w-28 mb-3" />
            {[1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-center justify-between mb-3">
                <View className="h-4 bg-muted rounded w-40" />
                <View className="w-12 h-6 bg-primary/30 rounded-full" />
              </View>
            ))}
          </View>

          {/* File Upload */}
          <View className="mb-6">
            <View className="h-4 bg-muted rounded w-24 mb-2" />
            <View className="h-32 bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg items-center justify-center gap-2">
              <View className="w-12 h-12 bg-muted-foreground/20 rounded-full" />
              <View className="h-3 bg-muted-foreground/30 rounded w-32" />
            </View>
          </View>

          {/* Submit Button */}
          <View className="h-12 bg-primary rounded-lg" />
        </View>

        {/* Settings-style Form */}
        <View className="h-6 bg-muted rounded w-24 mb-3" />

        <View className="bg-card border border-border rounded-lg overflow-hidden mb-4">
          {[1, 2, 3, 4].map((i, index, arr) => (
            <View
              key={i}
              className={`flex-row items-center justify-between p-4 ${
                index < arr.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-muted rounded-lg" />
                <View className="gap-1">
                  <View className="h-4 bg-muted rounded w-32" />
                  <View className="h-3 bg-muted rounded w-24" />
                </View>
              </View>
              <View className="w-6 h-6 bg-muted rounded" />
            </View>
          ))}
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-foreground mb-2">
            💡 Pattern: Form Layouts
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Label above input for better mobile UX
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Group related fields together
          </Text>
          <Text className="text-xs text-muted-foreground mb-1">
            • Clear visual hierarchy with spacing
          </Text>
          <Text className="text-xs text-muted-foreground">
            • Settings style: List items with actions
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
