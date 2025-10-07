/**
 * Universal UI Components
 * Automatically resolves to platform-specific implementations
 *
 * Metro automatically resolves .native.tsx files on React Native
 * Next.js uses the .tsx files
 */

// Import and re-export to ensure proper resolution
import { Button, type ButtonProps } from "./button";
import { Input, type InputProps } from "./input.native";

export { Button, type ButtonProps, Input, type InputProps };
