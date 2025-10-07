/**
 * Universal View primitive (Native version)
 * Uses React Native View with NativeWind support
 */
import * as React from "react";
import { View as RNView } from "react-native";
import type { UniversalViewProps } from "./types";

export function View({
  className,
  children,
  style,
  accessibilityRole,
  accessibilityLabel,
  testID,
  ...props
}: UniversalViewProps) {
  return (
    <RNView
      className={className}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...props}
    >
      {children}
    </RNView>
  );
}
