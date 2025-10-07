/**
 * useNetworkStatus Hook Example
 * Shows how to detect and respond to network connectivity changes
 */
"use client";

import { useNetworkStatus } from "../ui/use-network-status";

export function NetworkStatusBanner() {
  const { isOnline, isOffline } = useNetworkStatus();

  if (isOnline) {
    return null; // Don't show banner when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50">
      <span className="font-medium">📡 You're offline</span>
      <span className="ml-2 text-sm">Some features may be limited</span>
    </div>
  );
}

export function NetworkStatusIndicator() {
  const { isOnline } = useNetworkStatus();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
      <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
}

// Example: Conditional rendering based on network status
export function SyncButton() {
  const { isOnline } = useNetworkStatus();

  return (
    <button
      disabled={!isOnline}
      className={`px-4 py-2 rounded ${
        isOnline
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isOnline ? "🔄 Sync Now" : "⚠️ Cannot Sync (Offline)"}
    </button>
  );
}

// Example: Show different content based on network status
export function ContentView() {
  const { isOnline, isOffline } = useNetworkStatus();

  return (
    <div>
      {isOffline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You're currently offline. Data shown may be outdated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Your content here */}
      <h1>My App</h1>
      <p>Status: {isOnline ? "Connected" : "Disconnected"}</p>
    </div>
  );
}
