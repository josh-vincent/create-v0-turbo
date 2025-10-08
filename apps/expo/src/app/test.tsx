import { Stack } from "expo-router";
import { Text, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function TestPage() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Test Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="text-center text-5xl font-bold text-foreground">
          Test Page Works! 🎉
        </Text>
        <Text className="mt-4 text-center text-lg text-muted-foreground">
          Expo + NativeWind 5 is configured correctly
        </Text>
      </View>
    </View>
  );
}
