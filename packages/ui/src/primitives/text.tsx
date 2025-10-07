import { cn } from "@tocld/ui";
/**
 * Universal Text primitive (Web version)
 * Uses standard span element for web
 */
import * as React from "react";
import type { UniversalTextProps } from "./types";

export function Text({
  className,
  children,
  style,
  accessibilityRole,
  accessibilityLabel,
  testID,
  ...props
}: UniversalTextProps) {
  return (
    <span
      className={cn(className)}
      style={style}
      role={accessibilityRole}
      aria-label={accessibilityLabel}
      data-testid={testID}
      {...props}
    >
      {children}
    </span>
  );
}
