/**
 * Universal UI Components
 * Automatically resolves to platform-specific implementations
 *
 * Metro automatically resolves .native.tsx files on React Native
 * Next.js uses the .tsx files
 */

// Re-export everything from button (Metro will resolve to .native.tsx on React Native)
export * from "./button";
// Re-export everything from input (Metro will resolve to .native.tsx on React Native)
export * from "../input";
