/**
 * Button - Shared types and variants
 * This file contains the shared logic between web and native implementations
 */
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

/**
 * Button variants using CVA
 * These styles work with both web (Tailwind) and native (NativeWind)
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

/**
 * Base button props interface
 * Shared across web and native implementations
 */
export interface BaseButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export type ButtonVariant = NonNullable<BaseButtonProps["variant"]>;
export type ButtonSize = NonNullable<BaseButtonProps["size"]>;
