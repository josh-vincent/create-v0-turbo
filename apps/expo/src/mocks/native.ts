// Polyfills required for MSW in React Native
import "react-native-url-polyfill/auto";
import { TextDecoder, TextEncoder } from "text-encoding";
import { BroadcastChannel as BroadcastChannelPolyfill } from "broadcast-channel";

// Polyfill TextEncoder/TextDecoder for MSW
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

// Polyfill BroadcastChannel for MSW
if (typeof global.BroadcastChannel === "undefined") {
  global.BroadcastChannel = BroadcastChannelPolyfill as any;
}

import { handlers } from "@tocld/mocks";
import { setupServer } from "msw/native";

export const server = setupServer(...handlers);
