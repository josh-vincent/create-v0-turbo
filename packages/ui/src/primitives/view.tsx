import { cn } from "@tocld/ui";
/**
 * Universal View primitive (Web version)
 * Uses standard div element for web
 */
import * as React from "react";
import type { UniversalViewProps } from "./types";

export function View({
  className,
  children,
  style,
  accessibilityRole,
  accessibilityLabel,
  testID,
  ...props
}: UniversalViewProps) {
  return (
    <div
      className={cn(className)}
      style={style}
      role={accessibilityRole}
      aria-label={accessibilityLabel}
      data-testid={testID}
      {...props}
    >
      {children}
    </div>
  );
}
