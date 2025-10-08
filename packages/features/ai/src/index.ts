// Types
export * from "./types";

// Routers
export * from "./routers";

// Providers (for future AI service integrations)
export * from "./providers";

// Feature manifest
export const aiFeatureManifest = {
  name: "ai",
  version: "1.0.0",
  description: "AI features including chat, voice, and image generation",
  enabled: true,
  requiredEnvVars: [
    // Optional: Add AI service API keys here
    // "OPENAI_API_KEY",
    // "ANTHROPIC_API_KEY",
    // "ELEVENLABS_API_KEY",
  ],
  routers: ["aiChat", "aiVoice", "aiImage"],
  features: [
    {
      id: "ai-chat",
      name: "AI Chat",
      description: "Text-based AI conversations",
      icon: "💬",
      tier: "pro", // Require pro subscription
    },
    {
      id: "ai-voice",
      name: "AI Voice",
      description: "Voice-based AI conversations",
      icon: "🎙️",
      tier: "pro",
    },
    {
      id: "ai-image",
      name: "Image Generation",
      description: "Generate images with AI",
      icon: "🎨",
      tier: "pro",
    },
  ],
};
