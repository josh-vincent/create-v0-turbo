import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Web storage adapter using localStorage
const WebStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return Promise.resolve(null);
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// Expo SecureStore adapter for native platforms
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  // Use localStorage for web, SecureStore for native
  const storage = Platform.OS === "web" ? WebStorageAdapter : ExpoSecureStoreAdapter;

  client = createSupabaseClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  );

  return client;
}
