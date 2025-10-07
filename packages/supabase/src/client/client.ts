import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use placeholder values if env vars not set (for mock mode)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
