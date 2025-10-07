// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import type { Config } from "tailwindcss";

import baseConfig from "@tocld/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(240 10% 3.9%)",
        popover: "hsl(0 0% 100%)",
        "popover-foreground": "hsl(240 10% 3.9%)",
        primary: "hsl(327 66% 69%)",
        "primary-foreground": "hsl(337 65.5% 17.1%)",
        secondary: "hsl(240 4.8% 95.9%)",
        "secondary-foreground": "hsl(240 5.9% 10%)",
        muted: "hsl(240 4.8% 95.9%)",
        "muted-foreground": "hsl(240 3.8% 46.1%)",
        accent: "hsl(240 4.8% 95.9%)",
        "accent-foreground": "hsl(240 5.9% 10%)",
        destructive: "hsl(0 72.22% 50.59%)",
        "destructive-foreground": "hsl(0 0% 98%)",
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
        ring: "hsl(240 5% 64.9%)",
      },
    },
  },
} satisfies Config;
