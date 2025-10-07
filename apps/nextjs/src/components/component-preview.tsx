"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

interface ComponentPreviewProps {
  name: string;
  description: string;
  preview: React.ReactNode;
  code: {
    web: string;
    native: string;
    shared?: string;
  };
  dependencies?: string[];
}

export function ComponentPreview({
  name,
  description,
  preview,
  code,
  dependencies,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "web" | "native">("preview");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "preview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab("web")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "web"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Web (Next.js)
        </button>
        <button
          onClick={() => setActiveTab("native")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "native"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Native (Expo)
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "preview" && (
          <div className="rounded-lg border border-border bg-background p-8 flex items-center justify-center min-h-[200px]">
            {preview}
          </div>
        )}

        {activeTab === "web" && (
          <div className="space-y-4">
            {code.shared && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Shared Types & Variants
                </h3>
                <CodeBlock
                  code={code.shared}
                  language="typescript"
                  filename={`${name.toLowerCase()}.ts`}
                />
              </>
            )}
            <h3 className="text-sm font-medium text-muted-foreground">Web Implementation</h3>
            <CodeBlock code={code.web} language="tsx" filename={`${name.toLowerCase()}.tsx`} />
          </div>
        )}

        {activeTab === "native" && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Native Implementation</h3>
            <CodeBlock
              code={code.native}
              language="tsx"
              filename={`${name.toLowerCase()}.native.tsx`}
            />
          </div>
        )}
      </div>

      {/* Installation */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Installation</h3>
        <CodeBlock code={`bun tocld add ${name.toLowerCase()}`} language="bash" />
        {dependencies && dependencies.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Dependencies:</span> {dependencies.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
