/**
 * Query Provider Example
 * Shows how to use the QueryProvider with offline persistence
 */
"use client";

import { QueryProvider } from "../ui/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider
      config={{
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        throttleTime: 1000, // 1 second
      }}
      enableDevtools={process.env.NODE_ENV === "development"}
    >
      {children}
    </QueryProvider>
  );
}

// Example: Use in your root layout (Next.js)
/*
// app/layout.tsx
import { AppProviders } from "@/components/app-providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
*/

// Example: Use in your root component (Expo)
/*
// app/_layout.tsx
import { AppProviders } from "@/components/app-providers";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}
*/
