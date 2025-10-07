/**
 * Input - Shared types and styles
 * This file contains the shared logic between web and native implementations
 */

/**
 * Base input styles that work with both Tailwind and NativeWind
 */
export const inputClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Base input props interface
 * Shared across web and native implementations
 */
export interface BaseInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  editable?: boolean;
}
