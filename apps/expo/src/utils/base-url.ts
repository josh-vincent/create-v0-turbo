import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  // First, check if there's an explicit API URL in env variables
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */

  // For web, default to localhost
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  // For mobile, try to get the host IP from Expo
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // If we can't detect it, default to localhost (works for simulators)
    return "http://localhost:3000";
  }
  return `http://${localhost}:3000`;
};
