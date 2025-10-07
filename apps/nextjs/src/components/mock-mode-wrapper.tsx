"use client";

import { authConfig } from "@/lib/auth-config";

export function MockModeWrapper({ children }: { children: React.ReactNode }) {
  // Add minimal top padding if mock mode is active to account for the small banner
  return <div className={authConfig.isMockMode ? "pt-10" : ""}>{children}</div>;
}
