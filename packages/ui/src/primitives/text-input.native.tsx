/**
 * Universal TextInput primitive (Native version)
 * Uses React Native TextInput with NativeWind support
 */
import * as React from "react";
import { TextInput as RNTextInput } from "react-native";
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
    <RNTextInput
      className={className}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      editable={editable}
      style={style}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...props}
    />
  );
}
