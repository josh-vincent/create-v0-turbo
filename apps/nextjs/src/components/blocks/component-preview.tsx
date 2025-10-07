"use client";

import * as React from "react";
import { cn } from "@tocld/ui";

interface ComponentPreviewProps extends React.ComponentProps<"div"> {
  name: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  children: React.ReactNode;
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  hideCode = false,
  children,
  ...props
}: ComponentPreviewProps) {
  return (
    <div
      className={cn("preview group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <div
        className={cn(
          "preview-container relative rounded-md border",
          align === "center" && "items-center",
          align === "start" && "items-start",
          align === "end" && "items-end"
        )}
      >
        <div
          className={cn(
            "preview-content flex min-h-[350px] w-full justify-center p-6",
            align === "center" && "items-center",
            align === "start" && "items-start",
            align === "end" && "items-end"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
