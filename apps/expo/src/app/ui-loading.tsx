import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoadingStatesDemo() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shimmerAnim] = useState(new Animated.Value(0));

  // Shimmer animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Loading States",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        {/* Full-Screen Loaders */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Full-Screen Loaders</Text>

          <TouchableOpacity
            onPress={() => {
              setShowFullScreen(true);
              setTimeout(() => setShowFullScreen(false), 2000);
            }}
            className="bg-primary rounded-lg py-3 mb-3"
          >
            <Text className="text-center text-primary-foreground font-medium">
              Show Full-Screen Loader
            </Text>
          </TouchableOpacity>

          <View className="bg-muted rounded-lg p-6 items-center justify-center h-32">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-sm text-muted-foreground mt-2">Loading...</Text>
          </View>
        </View>

        {/* Inline Loaders */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Inline Loaders</Text>

          <View className="flex-row items-center gap-4 mb-3">
            <ActivityIndicator size="small" />
            <Text className="text-sm text-foreground">Small spinner</Text>
          </View>

          <View className="flex-row items-center gap-4 mb-3">
            <ActivityIndicator size="large" />
            <Text className="text-sm text-foreground">Large spinner</Text>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <Text className="text-sm text-foreground">Custom spinner</Text>
          </View>
        </View>

        {/* Progress Bars */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Progress Indicators</Text>

          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted-foreground">Linear Progress</Text>
              <Text className="text-sm text-foreground font-medium">{progress}%</Text>
            </View>
            <View className="h-2 bg-muted rounded-full overflow-hidden">
              <View
                style={[
                  styles.progressBar,
                  { width: `${progress}%` }
                ]}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-muted-foreground mb-2">Indeterminate</Text>
            <View className="h-2 bg-muted rounded-full overflow-hidden">
              <Animated.View
                className="h-full w-1/3 bg-primary"
                style={{
                  transform: [{ translateX }],
                }}
              />
            </View>
          </View>

          <View className="items-center">
            <Text className="text-sm text-muted-foreground mb-2">Circular Progress</Text>
            <View className="relative w-20 h-20">
              <View className="absolute inset-0 items-center justify-center">
                <Text className="text-lg font-bold text-foreground">{progress}%</Text>
              </View>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          </View>
        </View>

        {/* Skeleton Loaders */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Skeleton Loaders</Text>

          {/* List Item Skeleton */}
          <View className="mb-4">
            <Text className="text-sm text-muted-foreground mb-2">List Item</Text>
            <View className="bg-muted rounded-lg p-3">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-muted-foreground/20 rounded-full" />
                <View className="flex-1 gap-2">
                  <View className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                  <View className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                </View>
              </View>
            </View>
          </View>

          {/* Card Skeleton */}
          <View className="mb-4">
            <Text className="text-sm text-muted-foreground mb-2">Card</Text>
            <View className="bg-muted rounded-lg overflow-hidden">
              <View className="h-32 bg-muted-foreground/20" />
              <View className="p-3 gap-2">
                <View className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                <View className="h-3 bg-muted-foreground/20 rounded w-full" />
                <View className="h-3 bg-muted-foreground/20 rounded w-5/6" />
              </View>
            </View>
          </View>

          {/* Text Skeleton */}
          <View>
            <Text className="text-sm text-muted-foreground mb-2">Text Paragraph</Text>
            <View className="gap-2">
              <View className="h-3 bg-muted-foreground/20 rounded w-full" />
              <View className="h-3 bg-muted-foreground/20 rounded w-11/12" />
              <View className="h-3 bg-muted-foreground/20 rounded w-4/5" />
            </View>
          </View>
        </View>

        {/* Pull to Refresh */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Pull to Refresh</Text>
          <View className="bg-muted rounded-lg p-6 items-center">
            <Text className="text-sm text-muted-foreground mb-3">
              Pull down from the top to refresh
            </Text>
            <View className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </View>
        </View>

        {/* Infinite Scroll Loader */}
        <View className="bg-card border border-border rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">Infinite Scroll</Text>
          <View className="bg-muted rounded-lg p-4">
            <View className="mb-3">
              <View className="h-12 bg-background rounded mb-2" />
              <View className="h-12 bg-background rounded mb-2" />
              <View className="h-12 bg-background rounded mb-2" />
            </View>
            <View className="flex-row justify-center py-2">
              <ActivityIndicator size="small" />
              <Text className="text-sm text-muted-foreground ml-2">Loading more...</Text>
            </View>
          </View>
        </View>

        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
          <Text className="text-base font-semibold text-foreground mb-2">💡 Usage Tips</Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Use ActivityIndicator for simple loading states
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Show skeleton loaders for better perceived performance
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Use progress bars for operations with known duration
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Provide feedback for all async operations
          </Text>
        </View>
      </ScrollView>

      {/* Full-Screen Loading Overlay */}
      {showFullScreen && (
        <View className="absolute inset-0 bg-background items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-lg font-medium text-foreground mt-4">Loading...</Text>
          <Text className="text-sm text-muted-foreground mt-1">Please wait</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6', // primary color
  },
});
