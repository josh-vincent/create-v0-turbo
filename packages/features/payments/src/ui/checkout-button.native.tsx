import * as React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { type CheckoutButtonProps, checkoutButtonVariants } from "./checkout-button";

export interface NativeCheckoutButtonProps extends CheckoutButtonProps {
  api: any; // tRPC client from the Expo app
}

/**
 * Native version of CheckoutButton (opens in-app browser)
 * @param api - tRPC client from the Expo app
 */
export function CheckoutButton({
  priceId,
  successUrl,
  cancelUrl,
  children = "Subscribe",
  variant,
  size,
  disabled,
  onSuccess,
  onError,
  api,
}: NativeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const createCheckout = api.subscription.createCheckout.useMutation();

  const handlePress = async () => {
    setIsLoading(true);

    try {
      const result = await createCheckout.mutateAsync({
        priceId,
        successUrl: successUrl || "myapp://dashboard?success=true",
        cancelUrl: cancelUrl || "myapp://pricing",
      });

      onSuccess?.(result.sessionId);

      // Open checkout URL in in-app browser (WebBrowser from expo)
      // You would import { WebBrowser } from 'expo-web-browser';
      // await WebBrowser.openBrowserAsync(result.url);
      console.log("Open checkout:", result.url);
    } catch (error) {
      console.error("Checkout error:", error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = checkoutButtonVariants({ variant, size });

  return (
    <Pressable onPress={handlePress} disabled={disabled || isLoading} className={buttonClass}>
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-primary-foreground font-semibold">{children}</Text>
      )}
    </Pressable>
  );
}
