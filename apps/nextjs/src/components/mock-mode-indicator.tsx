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
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔶</span>
            <span className="text-sm font-medium">Mock Mode Active</span>
            <span className="hidden sm:inline text-xs opacity-90">- Using in-memory data</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
