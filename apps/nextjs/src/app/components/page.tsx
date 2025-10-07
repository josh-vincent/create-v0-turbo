import { Button } from "@tocld/ui/button";
import { Input } from "@tocld/ui/input";
import Link from "next/link";
import { ComponentPreview } from "~/components/component-preview";

export default function ComponentsShowcase() {
  return (
    <div className="container max-w-6xl py-10">
      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Universal Components</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Beautiful, accessible components that work seamlessly across Next.js and Expo. Built with
          Radix UI for web and React Native primitives for mobile.
        </p>
      </div>

      {/* Registry Info */}
      <div className="py-8 space-y-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent -mx-6 px-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Shadcn-Compatible Registry</h2>
            <p className="text-muted-foreground mb-4">
              These components are available via our custom registry. Use the official shadcn CLI to
              install them directly into your project.
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Install from Registry</h3>
                <code className="block text-sm bg-zinc-950 text-zinc-100 p-3 rounded-md font-mono">
                  npx shadcn@latest add http://localhost:3000/r/button
                </code>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Or browse available components</h3>
                <code className="block text-sm bg-zinc-950 text-zinc-100 p-3 rounded-md font-mono">
                  curl http://localhost:3000/r/registry.json
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="py-8 space-y-4 border-b border-border">
        <h2 className="text-2xl font-bold">Quick Start</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 p-4 rounded-lg border border-border bg-muted/50">
            <h3 className="font-medium">Method 1: Shadcn CLI (Recommended)</h3>
            <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
              npx shadcn@latest add http://localhost:3000/r/button
            </code>
            <p className="text-xs text-muted-foreground mt-2">Install directly from our registry</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg border border-border bg-muted/50">
            <h3 className="font-medium">Method 2: Custom CLI</h3>
            <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
              bun tocld add button
            </code>
            <p className="text-xs text-muted-foreground mt-2">Use our custom CLI (coming soon)</p>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="py-10 space-y-16">
        {/* Button Component */}
        <ComponentPreview
          name="Button"
          description="A universal button component with multiple variants and sizes that works on both web and native platforms."
          preview={
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          }
          code={{
            shared: `import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface BaseButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}`,
            web: `import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@tocld/ui";
import { buttonVariants, type BaseButtonProps } from "./button";

export interface ButtonProps
  extends React.ComponentProps<"button">,
    BaseButtonProps {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}`,
            native: `import * as React from "react";
import { Pressable, Text } from "@tocld/ui/primitives";
import { cn } from "@tocld/ui";
import { buttonVariants, type BaseButtonProps } from "./button";

export interface ButtonProps extends BaseButtonProps {
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export function Button({
  className,
  variant,
  size,
  disabled,
  onPress,
  children,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      {typeof children === "string" ? (
        <Text className="text-inherit font-inherit">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}`,
          }}
          dependencies={["class-variance-authority", "radix-ui"]}
        />

        {/* Input Component */}
        <ComponentPreview
          name="Input"
          description="A universal input component with consistent styling across platforms. Uses native HTML input on web and TextInput on native."
          preview={
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <Input placeholder="Email address" type="email" />
              <Input placeholder="Password" type="password" />
              <Input placeholder="Disabled input" disabled />
            </div>
          }
          code={{
            shared: `export const inputClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export interface BaseInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  editable?: boolean;
}`,
            web: `import type { ComponentProps } from "react";
import { cn } from "@tocld/ui";
import { inputClassName } from "./input";

export interface InputProps extends ComponentProps<"input"> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input className={cn(inputClassName, className)} {...props} />
  );
}`,
            native: `import * as React from "react";
import { TextInput } from "@tocld/ui/primitives";
import { cn } from "@tocld/ui";
import { inputClassName, type BaseInputProps } from "./input";

export interface InputProps extends BaseInputProps {
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Input({
  className,
  value,
  onChangeText,
  onChange,
  placeholder,
  disabled,
  editable = true,
  secureTextEntry,
  accessibilityLabel,
  testID,
}: InputProps) {
  return (
    <TextInput
      className={cn(inputClassName, className)}
      value={value}
      onChangeText={onChangeText || onChange}
      placeholder={placeholder}
      editable={!disabled && editable}
      secureTextEntry={secureTextEntry}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}`,
          }}
          dependencies={[]}
        />
      </div>

      {/* Registry Endpoints */}
      <div className="py-8 space-y-4 border-t border-border">
        <h2 className="text-2xl font-bold">Registry Endpoints</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-lg border border-border bg-muted/50">
            <h3 className="font-medium mb-2">Registry Index</h3>
            <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
              GET http://localhost:3000/r/registry.json
            </code>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/50">
            <h3 className="font-medium mb-2">Component Files</h3>
            <div className="space-y-2">
              <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
                GET http://localhost:3000/r/button.json
              </code>
              <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
                GET http://localhost:3000/r/input.json
              </code>
              <code className="block text-sm bg-zinc-950 text-zinc-100 p-2 rounded">
                GET http://localhost:3000/r/primitives.json
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-border text-center text-sm text-muted-foreground space-y-2">
        <p>
          Built with{" "}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            shadcn/ui
          </a>{" "}
          registry •{" "}
          <a
            href="https://nativewind.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            NativeWind
          </a>{" "}
          for styling
        </p>
        <p className="text-xs">
          See{" "}
          <a
            href="https://github.com/yourusername/create-v0-turbo/blob/main/apps/nextjs/REGISTRY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            REGISTRY.md
          </a>{" "}
          for documentation
        </p>
      </div>
    </div>
  );
}
