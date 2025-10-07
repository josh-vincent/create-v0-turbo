/**
 * Centralized authentication configuration
 *
 * This determines whether the app runs in mock mode or real Supabase mode.
 *
 * Logic:
 * 1. If NEXT_PUBLIC_MOCK_AUTH is explicitly set, respect that choice
 * 2. If in production and no Supabase credentials, throw error (fail-safe)
 * 3. If in development and no Supabase credentials, auto-enable mock mode
 * 4. Otherwise, use real Supabase authentication
 */

const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

const hasSupabaseCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const explicitMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

// Determine auth mode
const isMockMode = (() => {
  // Explicit mock mode always wins
  if (explicitMockMode) {
    return true;
  }

  // Production without credentials is an error
  if (isProduction && !hasSupabaseCredentials) {
    throw new Error(
      "Production environment requires Supabase credentials. " +
        "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, " +
        "or explicitly set NEXT_PUBLIC_MOCK_AUTH=true for testing.",
    );
  }

  // Development without credentials auto-enables mock mode
  if (!isProduction && !hasSupabaseCredentials) {
    console.log(
      "🔶 [AUTH CONFIG] No Supabase credentials detected. " +
        "Automatically enabling mock mode for development.\n" +
        "   To use real Supabase, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
        "   To explicitly enable mock mode, set NEXT_PUBLIC_MOCK_AUTH=true",
    );
    return true;
  }

  // Has credentials, use real auth
  return false;
})();

export const authConfig = {
  /**
   * Whether the app is running in mock mode (no real authentication)
   */
  isMockMode,

  /**
   * Whether Supabase credentials are available
   */
  hasSupabaseCredentials,

  /**
   * Whether we're in production environment
   */
  isProduction,

  /**
   * Mock user session for development
   */
  mockSession: {
    user: {
      id: "00000000-0000-0000-0000-000000000001",
      email: "mock@example.com",
    },
  },
} as const;

// Log current mode on initialization (only once)
if (typeof window === "undefined") {
  // Server-side only
  if (isMockMode) {
    console.log("🔶 [AUTH] Running in MOCK MODE");
    console.log("   Mock User: mock@example.com");
    console.log("   Mock User ID: 00000000-0000-0000-0000-000000000001");
  } else {
    console.log("✅ [AUTH] Running with Supabase authentication");
  }
}
