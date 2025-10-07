import { Slot } from "radix-ui";
/**
 * Button - Web implementation
 * Uses Radix UI Slot for composition and standard button element
 */
import type * as React from "react";

import { cn } from "@tocld/ui";
import { type BaseButtonProps, buttonVariants } from "./button.ts";

// Re-export shared types for convenience
export type { BaseButtonProps, ButtonVariant, ButtonSize } from "./button.ts";
export { buttonVariants } from "./button.ts";

export interface ButtonProps extends React.ComponentProps<"button">, BaseButtonProps {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
