import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "~/utils/api";
import { configureRevenueCat } from "~/utils/revenuecat";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [mswReady, setMswReady] = useState(false);
  const isMockMode = process.env.EXPO_PUBLIC_MOCK_AUTH === "true";

  useEffect(() => {
    async function init() {
      // Initialize RevenueCat SDK early in the app lifecycle
      configureRevenueCat();

      // MSW is disabled for React Native due to compatibility issues
      // The app will connect directly to the API instead
      if (isMockMode) {
        console.log("🔶 MOCK MODE: MSW disabled in React Native - connecting to real API");
      }
      setMswReady(true);
    }

    init();
  }, [isMockMode]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />
        <StatusBar />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
