# RevenueCat Integration Guide

This guide explains how to set up and use RevenueCat for in-app purchases and subscriptions in your Expo app.

## Overview

RevenueCat has been integrated to support subscriptions across iOS, Android, and Web platforms. The SDK is automatically initialized when the app starts.

## Setup Steps

### 1. Create a RevenueCat Account

1. Go to [https://app.revenuecat.com/signup](https://app.revenuecat.com/signup)
2. Create a new account or sign in
3. Create a new project for your app

### 2. Connect Your App Stores

#### iOS (App Store Connect)
1. In RevenueCat dashboard, go to your project settings
2. Navigate to "App settings" → "Apple App Store"
3. Follow the instructions to connect your App Store Connect account
4. Add your app's Bundle ID (from `app.config.ts`)

#### Android (Google Play Console)
1. In RevenueCat dashboard, go to your project settings
2. Navigate to "App settings" → "Google Play Store"
3. Follow the instructions to connect your Google Play Console account
4. Add your app's Package Name (from `app.config.ts`)

#### Web (Stripe)
1. In RevenueCat dashboard, go to your project settings
2. Navigate to "App settings" → "Stripe"
3. Connect your Stripe account for web-based subscriptions

### 3. Get Your API Keys

1. In RevenueCat dashboard, go to "API keys"
2. Copy the following keys:
   - **Apple App Store** - iOS API key
   - **Google Play Store** - Android API key
   - **Stripe** - Web API key (if using web subscriptions)

### 4. Configure Environment Variables

Update your `.env` file with the API keys:

```env
# RevenueCat (In-App Purchases & Subscriptions)
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_WEB_API_KEY=strp_xxxxxxxxxxxxx
```

### 5. Create Products in RevenueCat

1. In RevenueCat dashboard, go to "Products"
2. Add your subscription or one-time purchase products
3. Create corresponding products in:
   - App Store Connect (for iOS)
   - Google Play Console (for Android)
   - Stripe Dashboard (for Web)

### 6. Create Entitlements

1. In RevenueCat dashboard, go to "Entitlements"
2. Create entitlements (e.g., "premium", "pro")
3. Attach your products to these entitlements

### 7. Create Offerings

1. In RevenueCat dashboard, go to "Offerings"
2. Create offerings (subscription packages)
3. Add your products to offerings
4. Set one offering as the default

## Usage

### Check Customer Info

```typescript
import { getCustomerInfo, hasActiveEntitlement } from '~/utils/revenuecat';

// Get customer info
const customerInfo = await getCustomerInfo();

// Check if user has active subscription
const isPremium = hasActiveEntitlement(customerInfo, 'premium');
```

### Display Available Offerings

```typescript
import { getOfferings } from '~/utils/revenuecat';

const offerings = await getOfferings();
const currentOffering = offerings.current;

if (currentOffering) {
  const packages = currentOffering.availablePackages;
  // Display packages to user
}
```

### Purchase a Package

```typescript
import { purchasePackage } from '~/utils/revenuecat';

try {
  const customerInfo = await purchasePackage(selectedPackage);
  // Check if user now has entitlement
  const isPremium = hasActiveEntitlement(customerInfo, 'premium');
  if (isPremium) {
    // Unlock premium features
  }
} catch (error) {
  // Handle purchase error
  console.error('Purchase failed:', error);
}
```

### Restore Purchases

```typescript
import { restorePurchases } from '~/utils/revenuecat';

try {
  const customerInfo = await restorePurchases();
  // Check restored entitlements
} catch (error) {
  console.error('Restore failed:', error);
}
```

## Building for Production

### Important: Custom Development Build Required

RevenueCat requires native modules that are not available in Expo Go. You must create a custom development build:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS in your project
eas init

# Configure build
eas build:configure

# Build for iOS Simulator (development)
eas build --platform ios --profile development

# Build for Android (development)
eas build --platform android --profile development

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Testing

### In Development

RevenueCat provides a sandbox environment for testing:

1. Use sandbox accounts for App Store (iOS)
2. Use test accounts for Google Play (Android)
3. RevenueCat automatically detects sandbox purchases

### In Production

Make sure to:
1. Test on physical devices with real App Store/Play Store accounts
2. Verify purchases are being tracked in RevenueCat dashboard
3. Test restore purchases functionality
4. Test subscription renewal and expiration

## Useful Resources

- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [RevenueCat Expo Guide](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [Testing In-App Purchases](https://www.revenuecat.com/docs/test-and-launch/sandbox)
- [RevenueCat Community](https://community.revenuecat.com/)

## Troubleshooting

### iOS: "No such module 'RevenueCat'"
- Make sure you've run a custom development build, not Expo Go
- Run: `eas build --platform ios --profile development`

### Android: RevenueCat not working
- Ensure you've connected your Google Play Console account
- Verify the package name matches your app.config.ts
- Run: `eas build --platform android --profile development`

### Web: Purchases not working
- Web subscriptions require Stripe integration
- Make sure you've added the Web API key to your .env file
- Web SDK has additional setup requirements - see RevenueCat docs

### API Keys not found
- Make sure your .env file is in the correct location: `apps/expo/.env`
- Restart the Expo dev server after changing .env variables
- Verify the keys start with `EXPO_PUBLIC_` prefix

## File Locations

- Configuration: `apps/expo/src/utils/revenuecat.ts`
- Initialization: `apps/expo/src/app/_layout.tsx`
- Environment variables: `apps/expo/.env`
