/**
 * Input - Shared types and styles
 * This file contains the shared logic between web and native implementations
 */

/**
 * Base input props shared between web and native
 */
export interface BaseInputProps {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
}

/**
 * Shared input className for consistent styling
 */
export const inputClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
