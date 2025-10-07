/**
 * Input - Native implementation
 * Uses React Native TextInput with NativeWind styling
 */
import * as React from "react";

import { cn } from "@tocld/ui";
import { type BaseInputProps, inputClassName } from "./input";
import { TextInput } from "./primitives";

export interface InputProps extends BaseInputProps {
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Input({
  className,
  value,
  onChangeText,
  onChange,
  placeholder,
  disabled,
  editable = true,
  secureTextEntry,
  accessibilityLabel,
  testID,
}: InputProps) {
  return (
    <TextInput
      className={cn(inputClassName, className)}
      value={value}
      onChangeText={onChangeText || onChange}
      placeholder={placeholder}
      editable={!disabled && editable}
      secureTextEntry={secureTextEntry}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}
