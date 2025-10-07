import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@tocld/ui";
import { ThemeProvider, ThemeToggle } from "@tocld/ui/theme";
import { Toaster } from "@tocld/ui/toast";

import { MockModeIndicator } from "~/components/mock-mode-indicator";
import { MockModeWrapper } from "~/components/mock-mode-wrapper";
import { env } from "~/env";
import { MSWProvider } from "~/mocks/msw-provider";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production" ? "https://turbo.v0.gg" : "http://localhost:3000",
  ),
  title: "Create v0 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create v0 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-v0-turbo.vercel.app",
    siteName: "Create v0 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vinnai",
    creator: "@vinnai",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <MSWProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MockModeIndicator />
            <MockModeWrapper>
              <TRPCReactProvider>{props.children}</TRPCReactProvider>
            </MockModeWrapper>
            <div className="absolute bottom-4 right-4">
              <ThemeToggle />
            </div>
            <Toaster />
          </ThemeProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
