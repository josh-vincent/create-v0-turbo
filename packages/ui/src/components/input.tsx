/**
 * Input - Web implementation
 * Uses standard HTML input element
 */
import type { ComponentProps } from "react";

import { cn } from "@tocld/ui";
import { inputClassName } from "./input.ts";

// Re-export shared types and styles
export type { BaseInputProps } from "./input.ts";
export { inputClassName } from "./input.ts";

export interface InputProps extends ComponentProps<"input"> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputClassName, className)} {...props} />;
}
