"use client";

import { useState } from "react";

import { authConfig } from "@/lib/auth-config";

export function MockModeIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  // Only show in mock mode
  if (!authConfig.isMockMode || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5 md:mt-0">
              <span className="text-lg">🔶</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-base">Mock Mode Active</span>
                <span className="text-xs rounded-full bg-white/20 px-2 py-0.5 whitespace-nowrap">
                  Development
                </span>
              </div>
              <p className="text-sm opacity-90">
                No database connection detected. Using mock data with in-memory storage.
              </p>
              <div className="mt-2 text-xs opacity-80 space-y-0.5">
                <div className="font-semibold">Missing environment variables:</div>
                <div className="font-mono flex flex-wrap gap-x-3 gap-y-1">
                  {!process.env.NEXT_PUBLIC_SUPABASE_URL && <div>• NEXT_PUBLIC_SUPABASE_URL</div>}
                  {!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                    <div>• NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                  )}
                  {!process.env.POSTGRES_URL && <div>• POSTGRES_URL</div>}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors mt-0.5 md:mt-0"
            aria-label="Dismiss banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
