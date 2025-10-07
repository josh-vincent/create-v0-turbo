import { cn } from "@tocld/ui";
/**
 * Universal TextInput primitive (Web version)
 * Uses standard input element for web
 */
import * as React from "react";
import type { UniversalTextInputProps } from "./types";

export function TextInput({
  className,
  value,
  onChangeText,
  placeholder,
  placeholderClassName,
  secureTextEntry,
  editable = true,
  style,
  accessibilityLabel,
  testID,
  ...props
}: UniversalTextInputProps) {
  return (
    <input
      type={secureTextEntry ? "password" : "text"}
      className={cn(className)}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      disabled={!editable}
      style={style}
      aria-label={accessibilityLabel}
      data-testid={testID}
      {...props}
    />
  );
}
