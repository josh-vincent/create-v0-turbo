/**
 * Universal Text primitive (Native version)
 * Uses React Native Text with NativeWind support
 */
import * as React from "react";
import { Text as RNText } from "react-native";
import type { UniversalTextProps } from "./types";

export function Text({
  className,
  children,
  style,
  accessibilityRole,
  accessibilityLabel,
  testID,
  ...props
}: UniversalTextProps) {
  return (
    <RNText
      className={className}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...props}
    >
      {children}
    </RNText>
  );
}
