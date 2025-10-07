import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">V0</Text> Turbo
        </Text>

        <Text className="mt-4 text-center text-xl text-muted-foreground">
          ✅ Expo + NativeWind 5 Working!
        </Text>

        <Text className="mt-8 text-center text-base text-foreground">
          Your Expo app is now running successfully with:
        </Text>

        <View className="mt-4 px-8">
          <Text className="text-foreground">• Expo SDK 54</Text>
          <Text className="text-foreground">• React Native 0.81.4</Text>
          <Text className="text-foreground">• NativeWind 5 (Preview)</Text>
          <Text className="text-foreground">• Expo Router 6</Text>
          <Text className="text-foreground">• React 19.1.1</Text>
        </View>

        <Text className="mt-8 text-center text-sm text-muted-foreground">
          Ready to add your features! 🚀
        </Text>
      </View>
    </SafeAreaView>
  );
}
