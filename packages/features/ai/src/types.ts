import { z } from "zod";

// AI Chat Types
export const aiChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.date(),
});

export const aiChatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().optional(),
});

export const aiChatResponseSchema = z.object({
  message: aiChatMessageSchema,
  conversationId: z.string(),
});

// AI Voice Types
export const aiVoiceRequestSchema = z.object({
  audioData: z.string(), // base64 encoded audio
  format: z.enum(["wav", "mp3", "m4a"]),
});

export const aiVoiceResponseSchema = z.object({
  transcript: z.string(),
  response: z.string(),
  audioUrl: z.string().optional(),
});

// AI Image Generation Types
export const aiImageGenerationRequestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.enum(["realistic", "artistic", "anime", "3d"]).default("realistic"),
  size: z.enum(["512x512", "1024x1024", "1024x1792"]).default("1024x1024"),
});

export const aiImageGenerationResponseSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  imageUrl: z.string(),
  timestamp: z.date(),
});

// Type exports
export type AIChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AIChatRequest = z.infer<typeof aiChatRequestSchema>;
export type AIChatResponse = z.infer<typeof aiChatResponseSchema>;
export type AIVoiceRequest = z.infer<typeof aiVoiceRequestSchema>;
export type AIVoiceResponse = z.infer<typeof aiVoiceResponseSchema>;
export type AIImageGenerationRequest = z.infer<typeof aiImageGenerationRequestSchema>;
export type AIImageGenerationResponse = z.infer<typeof aiImageGenerationResponseSchema>;
