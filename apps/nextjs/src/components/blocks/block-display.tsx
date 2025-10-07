import * as React from "react";
import { ComponentPreview } from "./component-preview";
import { BlockCodeViewer } from "./block-code-viewer";
import { cn } from "@tocld/ui";

interface BlockDisplayProps {
  name: string;
  preview: React.ReactNode;
  code?: string;
  description?: string;
  className?: string;
}

export async function BlockDisplay({
  name,
  preview,
  code,
  description,
  className,
}: BlockDisplayProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <ComponentPreview name={name} hideCode={!code}>
        {preview}
      </ComponentPreview>

      {code && <BlockCodeViewer code={code} />}
    </div>
  );
}
