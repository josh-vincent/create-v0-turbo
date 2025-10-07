"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tocld/ui/card";
import { Badge } from "@tocld/ui/badge";
import { cn } from "@tocld/ui";

interface BlockWrapperProps {
  name: string;
  title: string;
  description: string;
  category?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  liveUrl?: string;
}

export function BlockWrapper({
  name,
  title,
  description,
  category,
  icon,
  children,
  className,
  liveUrl,
}: BlockWrapperProps) {
  return (
    <Card id={name} className={cn("scroll-mt-20", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {category && <Badge className="ml-auto">{category}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {liveUrl && (
          <a
            href={liveUrl}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            View Live Example →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
