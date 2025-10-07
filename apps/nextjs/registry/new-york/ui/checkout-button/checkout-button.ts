import { type VariantProps, cva } from "class-variance-authority";

/**
 * Checkout button variants (shared across platforms)
 */
export const checkoutButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type CheckoutButtonVariants = VariantProps<typeof checkoutButtonVariants>;

export interface CheckoutButtonProps extends CheckoutButtonVariants {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
}
