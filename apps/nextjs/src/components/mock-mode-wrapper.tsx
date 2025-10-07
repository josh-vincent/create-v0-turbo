"use client";

import { authConfig } from "@/lib/auth-config";

export function MockModeWrapper({ children }: { children: React.ReactNode }) {
  // Add top padding if mock mode is active to account for the banner
  return <div className={authConfig.isMockMode ? "pt-32 md:pt-24" : ""}>{children}</div>;
}
