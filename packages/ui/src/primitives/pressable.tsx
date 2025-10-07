import { cn } from "@tocld/ui";
/**
 * Universal Pressable primitive (Web version)
 * Uses button element for web with proper accessibility
 */
import * as React from "react";
import type { UniversalPressableProps } from "./types";

export function Pressable({
  className,
  children,
  onPress,
  disabled,
  style,
  accessibilityRole = "button",
  accessibilityLabel,
  accessibilityState,
  testID,
  ...props
}: UniversalPressableProps) {
  return (
    <button
      type="button"
      className={cn(className)}
      onClick={onPress}
      disabled={disabled}
      style={style}
      role={accessibilityRole}
      aria-label={accessibilityLabel}
      aria-disabled={accessibilityState?.disabled ?? disabled}
      data-testid={testID}
      {...props}
    >
      {children}
    </button>
  );
}
