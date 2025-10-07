import type { z } from "zod";

/**
 * Registry schema for component definitions
 * Based on shadcn/ui registry specification
 */

export interface RegistryEntry {
  name: string;
  type: "registry:ui" | "registry:hook" | "registry:lib";
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    type: "registry:ui" | "registry:hook" | "registry:lib" | "registry:util";
    target?: string; // Optional custom target path
  }>;
  tailwind?: {
    config?: Record<string, unknown>;
  };
  cssVars?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

export interface Registry {
  name: string;
  version: string;
  homepage?: string;
  items: string[]; // List of available component names
}

export type RegistryItem = RegistryEntry;
