import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BottomTabBar } from "~/components/BottomTabBar";
import { DrawerMenu } from "~/components/DrawerMenu";
import { GlobalSearch } from "~/components/GlobalSearch";
import { queryClient } from "~/utils/api";
import { configureRevenueCat } from "~/utils/revenuecat";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [mswReady, setMswReady] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
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
        <View style={{ flex: 1 }}>
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
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  className="ml-2 p-2"
                >
                  <Text className="text-2xl text-primary-foreground">☰</Text>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => setSearchVisible(true)}
                  className="mr-2 p-2"
                >
                  <Text className="text-xl text-primary-foreground">🔍</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <BottomTabBar />
          <DrawerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
          <GlobalSearch visible={searchVisible} onClose={() => setSearchVisible(false)} />
          <StatusBar />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
