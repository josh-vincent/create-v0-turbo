"use client";

import { Card, CardContent } from "@tocld/ui/card";
import { cn } from "@tocld/ui";

interface BlockPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockPreview({ children, className }: BlockPreviewProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
