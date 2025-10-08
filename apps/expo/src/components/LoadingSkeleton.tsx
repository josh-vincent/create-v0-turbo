import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius = "rounded-md",
  className = "",
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        opacity,
        width,
        height,
      }}
      className={`bg-muted ${borderRadius} ${className}`}
    />
  );
}

// Preset skeleton components for common use cases
export function CardSkeleton() {
  return (
    <View className="bg-card border border-border rounded-lg p-4 space-y-3">
      <LoadingSkeleton height={24} width="60%" />
      <LoadingSkeleton height={16} width="100%" />
      <LoadingSkeleton height={16} width="80%" />
    </View>
  );
}

export function ListItemSkeleton() {
  return (
    <View className="bg-card border border-border rounded-lg p-4 mb-3 flex-row items-center">
      <LoadingSkeleton width={48} height={48} borderRadius="rounded-full" className="mr-4" />
      <View className="flex-1 space-y-2">
        <LoadingSkeleton height={16} width="70%" />
        <LoadingSkeleton height={14} width="40%" />
      </View>
    </View>
  );
}

export function ScreenSkeleton() {
  return (
    <View className="flex-1 p-6 space-y-4">
      <LoadingSkeleton height={32} width="50%" className="mb-2" />
      <LoadingSkeleton height={16} width="70%" className="mb-6" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </View>
  );
}
