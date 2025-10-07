import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 * Used throughout the UI components for dynamic styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
