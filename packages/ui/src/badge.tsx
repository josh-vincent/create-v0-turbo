/**
 * Badge - Web implementation
 * Uses standard div element with NativeWind/Tailwind styling
 */
import type * as React from "react";
import { cn } from "@tocld/ui";
import { type BaseBadgeProps, badgeVariants } from "./components/badge.ts";

// Re-export shared types for convenience
export type { BaseBadgeProps, BadgeVariant } from "./components/badge.ts";
export { badgeVariants } from "./components/badge.ts";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BaseBadgeProps {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
