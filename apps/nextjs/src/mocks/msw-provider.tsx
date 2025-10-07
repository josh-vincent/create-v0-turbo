"use client";

import { useEffect, useState } from "react";

import { authConfig } from "~/lib/auth-config";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function init() {
      // MSW is disabled in favor of centralized tRPC mock system
      // The tRPC mock system (ctx.isMockMode) handles all mocking at the API layer
      // which is cleaner and more maintainable
      //
      // If you need to mock non-tRPC APIs in the future, you can enable MSW here
      // and configure it to bypass tRPC endpoints
      if (false && authConfig.isMockMode && typeof window !== "undefined") {
        const { getWorker } = await import("./browser");
        const worker = await getWorker();
        await worker.start({
          onUnhandledRequest: "bypass",
        });
        console.log("🔶 MSW: Mock Service Worker started");
        setMswReady(true);
      } else {
        setMswReady(true);
      }
    }

    init();
  }, []);

  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}
