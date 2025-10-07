"use client";

import { Button } from "@tocld/ui/button";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-border bg-zinc-950 overflow-hidden">
      {filename && (
        <div className="border-b border-border bg-zinc-900 px-4 py-2">
          <span className="text-xs text-zinc-400">{filename}</span>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute right-2 top-2 z-10 h-8 bg-zinc-800 hover:bg-zinc-700 text-xs"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
