import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SplashScreenDemo() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }} className="bg-primary">
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />

      <View className="flex-1 items-center justify-center p-8">
        {/* Animated Logo */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center mb-12"
        >
          <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
            <Text className="text-6xl">🚀</Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-2">Create V0 Turbo</Text>
          <Text className="text-lg text-white/80">Mobile App Starter</Text>
        </Animated.View>

        {/* Loading Progress */}
        <View className="w-full max-w-xs">
          <View className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
            <Animated.View
              style={[
                styles.progressBar,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text className="text-sm text-white/60 text-center">{progress}% Loading...</Text>
        </View>

        {/* Version */}
        <View className="absolute bottom-8">
          <Text className="text-sm text-white/60">Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
});
