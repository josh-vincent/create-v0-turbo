/**
 * Universal Pressable primitive (Native version)
 * Uses React Native Pressable with NativeWind support
 */
import * as React from "react";
import { Pressable as RNPressable } from "react-native";
import type { UniversalPressableProps } from "./types";

export function Pressable({
  className,
  children,
  onPress,
  disabled,
  style,
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
  testID,
  ...props
}: UniversalPressableProps) {
  return (
    <RNPressable
      className={className}
      onPress={onPress}
      disabled={disabled}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      testID={testID}
      {...props}
    >
      {children}
    </RNPressable>
  );
}
