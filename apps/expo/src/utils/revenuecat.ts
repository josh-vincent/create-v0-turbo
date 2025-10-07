/**
 * RevenueCat Configuration
 * Handles in-app purchases and subscriptions across iOS, Android, and Web
 */
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

/**
 * Check if RevenueCat is configured
 */
let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 * Must be called early in the app lifecycle, ideally in the root component
 * Gracefully handles missing API keys to allow app to build without them
 */
export function configureRevenueCat() {
  try {
    // Set log level for debugging (use VERBOSE in development, INFO in production)
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.INFO);
    }

    // Configure SDK with platform-specific API keys
    if (Platform.OS === "ios") {
      const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
      if (apiKey && apiKey !== "your-ios-api-key") {
        Purchases.configure({ apiKey });
        isConfigured = true;
        console.log("✅ RevenueCat configured for iOS");
      } else {
        console.log("ℹ️ RevenueCat iOS API key not configured - in-app purchases disabled");
      }
    } else if (Platform.OS === "android") {
      const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
      if (apiKey && apiKey !== "your-android-api-key") {
        Purchases.configure({ apiKey });
        isConfigured = true;
        console.log("✅ RevenueCat configured for Android");
      } else {
        console.log("ℹ️ RevenueCat Android API key not configured - in-app purchases disabled");
      }
    } else if (Platform.OS === "web") {
      const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY;
      if (apiKey && apiKey !== "your-web-api-key") {
        // Note: Web SDK requires additional setup
        // See: https://www.revenuecat.com/docs/web
        console.log("ℹ️ RevenueCat Web SDK requires additional configuration");
      } else {
        console.log("ℹ️ RevenueCat Web API key not configured - in-app purchases disabled");
      }
    }
  } catch (error) {
    console.warn("⚠️ Failed to configure RevenueCat:", error);
    isConfigured = false;
  }
}

/**
 * Check if RevenueCat is properly configured
 */
export function isRevenueCatConfigured(): boolean {
  return isConfigured;
}

/**
 * Get the current customer info
 */
export async function getCustomerInfo() {
  if (!isConfigured) {
    console.warn("RevenueCat is not configured");
    return null;
  }
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error("Error getting customer info:", error);
    throw error;
  }
}

/**
 * Get available offerings (subscription packages)
 */
export async function getOfferings() {
  if (!isConfigured) {
    console.warn("RevenueCat is not configured");
    return null;
  }
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error("Error getting offerings:", error);
    throw error;
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(pkg: any) {
  if (!isConfigured) {
    throw new Error("RevenueCat is not configured. Cannot purchase package.");
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error) {
    console.error("Error purchasing package:", error);
    throw error;
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases() {
  if (!isConfigured) {
    console.warn("RevenueCat is not configured");
    return null;
  }
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error("Error restoring purchases:", error);
    throw error;
  }
}

/**
 * Check if user has active entitlement
 */
export function hasActiveEntitlement(customerInfo: any, entitlementId: string): boolean {
  return customerInfo.entitlements.active[entitlementId]?.isActive === true || false;
}
