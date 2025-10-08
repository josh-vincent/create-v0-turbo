/**
 * Badge - Native implementation
 * Uses React Native View with NativeWind styling
 */
import * as React from "react";
import { cn } from "@tocld/ui";
import { View, Text } from "./primitives";
import { type BaseBadgeProps, badgeVariants } from "./components/badge.ts";

// Re-export shared types for convenience
export type { BaseBadgeProps, BadgeVariant } from "./components/badge.ts";
export { badgeVariants } from "./components/badge.ts";

export interface BadgeProps extends BaseBadgeProps {
  testID?: string;
}

export function Badge({ className, variant, children, testID }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} testID={testID}>
      {typeof children === "string" ? (
        <Text className="text-xs font-medium text-inherit">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
