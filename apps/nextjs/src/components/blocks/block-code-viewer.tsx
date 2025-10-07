"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tocld/ui/tabs";
import { CodeBlockCopy } from "@/components/docs/code-block-copy";
import { cn } from "@tocld/ui";

interface BlockCodeViewerProps {
  code: string | Record<string, string>;
  className?: string;
}

export function BlockCodeViewer({ code, className }: BlockCodeViewerProps) {
  const codeEntries = typeof code === "string"
    ? { code: code }
    : code;

  const files = Object.entries(codeEntries);

  if (files.length === 1) {
    const [, content] = files[0]!;
    return (
      <div className={cn("relative", className)}>
        <div className="absolute right-2 top-2 z-10">
          <CodeBlockCopy code={content} />
        </div>
        <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
          <code>{content}</code>
        </pre>
      </div>
    );
  }

  return (
    <Tabs defaultValue={files[0]?.[0]} className={className}>
      <TabsList>
        {files.map(([name]) => (
          <TabsTrigger key={name} value={name}>
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map(([name, content]) => (
        <TabsContent key={name} value={name} className="relative">
          <div className="absolute right-2 top-2 z-10">
            <CodeBlockCopy code={content} />
          </div>
          <pre className="rounded-lg bg-muted p-4 pr-12 text-sm overflow-x-auto">
            <code>{content}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  );
}
