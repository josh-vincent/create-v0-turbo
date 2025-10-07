/**
 * Button - Native implementation
 * Uses React Native Pressable with NativeWind styling
 */
import * as React from "react";

import { cn } from "@tocld/ui";
import { type BaseButtonProps, buttonVariants } from "./button";
import { Pressable, Text } from "./primitives";

export interface ButtonProps extends BaseButtonProps {
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export function Button({
  className,
  variant,
  size,
  disabled,
  onPress,
  children,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      {typeof children === "string" ? (
        <Text className="text-inherit font-inherit">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
