/**
 * Shared types for universal primitives
 * These types work across web and native platforms
 */

export interface UniversalViewProps {
  className?: string;
  children?: React.ReactNode;
  style?: any;
  accessibilityRole?: string;
  accessibilityLabel?: string;
  testID?: string;
}

export interface UniversalTextProps {
  className?: string;
  children?: React.ReactNode;
  style?: any;
  accessibilityRole?: string;
  accessibilityLabel?: string;
  testID?: string;
}

export interface UniversalPressableProps {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  accessibilityRole?: string;
  accessibilityLabel?: string;
  accessibilityState?: { disabled?: boolean };
  testID?: string;
}

export interface UniversalTextInputProps {
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderClassName?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  style?: any;
  accessibilityLabel?: string;
  testID?: string;
}
