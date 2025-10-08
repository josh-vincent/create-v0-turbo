import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { logMockUsage } from "../mock-data";
import { publicProcedure } from "../trpc";

// Mock data for demo purposes
const mockProducts = [
  { id: "1", name: "Laptop Pro", category: "Electronics", price: 1299, stock: 15 },
  { id: "2", name: "Wireless Mouse", category: "Accessories", price: 29, stock: 50 },
  { id: "3", name: "Keyboard", category: "Accessories", price: 79, stock: 30 },
  { id: "4", name: "Monitor 27\"", category: "Electronics", price: 399, stock: 12 },
  { id: "5", name: "USB-C Hub", category: "Accessories", price: 49, stock: 25 },
];

export const demoRouter = {
  // Get all products - demonstrates basic tRPC query
  getProducts: publicProcedure.query(async ({ ctx }) => {
    // Use mock data if in mock mode
    if (ctx.isMockMode) {
      logMockUsage("demo", "getProducts");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProducts;
    }

    // In a real app, this would query the database
    // For demo purposes, always return mock data
    return mockProducts;
  }),

  // Get product by ID - demonstrates query with input
  getProductById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("demo", "getProductById");
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const product = mockProducts.find((p) => p.id === input.id);
      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    }),

  // Search products - demonstrates filtering
  searchProducts: publicProcedure
    .input(z.object({ query: z.string(), category: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("demo", "searchProducts");
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      let results = mockProducts;

      // Filter by category
      if (input.category && input.category !== "all") {
        results = results.filter(
          (p) => p.category.toLowerCase() === input.category?.toLowerCase()
        );
      }

      // Filter by search query
      if (input.query) {
        results = results.filter((p) =>
          p.name.toLowerCase().includes(input.query.toLowerCase())
        );
      }

      return results;
    }),

  // Update product stock - demonstrates mutation
  updateStock: publicProcedure
    .input(z.object({ id: z.string(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("demo", "updateStock");
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      const product = mockProducts.find((p) => p.id === input.id);
      if (!product) {
        throw new Error("Product not found");
      }

      // Update stock (in-memory for demo)
      product.stock = input.quantity;

      return {
        success: true,
        product,
      };
    }),

  // Generate AI text - demonstrates AI Gateway integration
  generateText: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(500),
        model: z.enum(["openai/gpt-4o", "anthropic/claude-sonnet-4", "xai/grok-4"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("demo", "generateText");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Return mock AI response
        return {
          text: `This is a mock AI response to your prompt: "${input.prompt}". In production, this would call the Vercel AI Gateway using the ${input.model} model.`,
          model: input.model,
          tokens: 42,
        };
      }

      // In production, this would call Vercel AI Gateway
      // Example (commented out - requires env vars):
      /*
      const { generateText } = await import('ai');

      const result = await generateText({
        model: input.model,
        prompt: input.prompt,
      });

      return {
        text: result.text,
        model: input.model,
        tokens: result.usage?.totalTokens ?? 0,
      };
      */

      // For now, return mock response
      return {
        text: `This is a simulated AI response to: "${input.prompt}". Set up Vercel AI Gateway to enable real AI completions using ${input.model}.`,
        model: input.model,
        tokens: 42,
      };
    }),

  // Stream AI text - demonstrates streaming responses
  streamText: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(500),
        model: z.enum(["openai/gpt-4o", "anthropic/claude-sonnet-4", "xai/grok-4"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("demo", "streamText");
      }

      // Note: Streaming requires special setup with tRPC subscriptions
      // This is a simplified version that returns the full response
      // For real streaming, you'd need to set up Server-Sent Events or WebSockets

      const mockResponse = `This is a mock streaming response to your prompt: "${input.prompt}". In production, this would stream tokens from ${input.model} via Vercel AI Gateway.`;

      return {
        text: mockResponse,
        model: input.model,
        isStreaming: false, // Would be true with real streaming
      };
    }),
} satisfies TRPCRouterRecord;
