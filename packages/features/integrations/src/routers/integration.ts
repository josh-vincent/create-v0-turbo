import { createTRPCRouter, protectedProcedure } from "@tocld/api";
import { eq } from "@tocld/db";
import { integrations } from "@tocld/db/schema";
import { GmailProvider, OutlookProvider } from "@tocld/oauth-sync";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { integrationProviderSchema } from "../types";

/**
 * OAuth Integration tRPC router
 */
export const integrationRouter = createTRPCRouter({
  /**
   * List all integrations for the user's team
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Mock mode
    if (ctx.isMockMode) {
      return [
        {
          id: "int_mock_1",
          provider: "gmail" as const,
          status: "connected" as const,
          providerAccountEmail: "user@gmail.com",
          lastSyncedAt: new Date(),
          createdAt: new Date(),
        },
      ];
    }

    const userIntegrations = await ctx.db.query.integrations.findMany({
      where: (int, { eq }) => eq(int.profileId, ctx.session!.user.id),
    });

    return userIntegrations;
  }),

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl: protectedProcedure
    .input(
      z.object({
        provider: integrationProviderSchema,
        redirectUri: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Generate state token (in production, store this in session/cache)
      const state = `${ctx.session.user.id}:${Date.now()}`;

      let authUrl: string;

      switch (input.provider) {
        case "gmail": {
          const provider = new GmailProvider({
            clientId: process.env.GMAIL_CLIENT_ID!,
            clientSecret: process.env.GMAIL_CLIENT_SECRET!,
            redirectUri: input.redirectUri,
            scopes: [
              "https://www.googleapis.com/auth/gmail.readonly",
              "https://www.googleapis.com/auth/gmail.send",
            ],
          });
          authUrl = provider.getAuthUrl(state);
          break;
        }

        case "outlook": {
          const provider = new OutlookProvider({
            clientId: process.env.OUTLOOK_CLIENT_ID!,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET!,
            redirectUri: input.redirectUri,
            scopes: ["Mail.Read", "Mail.Send"],
            tenantId: process.env.OUTLOOK_TENANT_ID,
          });
          authUrl = provider.getAuthUrl(state);
          break;
        }

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Provider ${input.provider} not implemented`,
          });
      }

      return { authUrl, state };
    }),

  /**
   * Disconnect an integration
   */
  disconnect: protectedProcedure
    .input(z.object({ integrationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Mock mode
      if (ctx.isMockMode) {
        return { success: true, message: "Integration disconnected (mock mode)" };
      }

      const integration = await ctx.db.query.integrations.findFirst({
        where: (int, { eq, and }) =>
          and(eq(int.id, input.integrationId), eq(int.profileId, ctx.session!.user.id)),
      });

      if (!integration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Integration not found",
        });
      }

      // Revoke OAuth access
      try {
        // You would call the provider's revoke method here
        // e.g., await provider.revokeAccess(integration.accessToken);
      } catch (error) {
        console.error("Failed to revoke OAuth access:", error);
      }

      // Delete from database
      await ctx.db.delete(integrations).where(eq(integrations.id, integration.id));

      return { success: true };
    }),

  /**
   * Refresh integration tokens
   */
  refresh: protectedProcedure
    .input(z.object({ integrationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Mock mode
      if (ctx.isMockMode) {
        return { success: true, message: "Tokens refreshed (mock mode)" };
      }

      const integration = await ctx.db.query.integrations.findFirst({
        where: (int, { eq, and }) =>
          and(eq(int.id, input.integrationId), eq(int.profileId, ctx.session!.user.id)),
      });

      if (!integration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Integration not found",
        });
      }

      // Refresh tokens based on provider
      // This is a placeholder - implement actual refresh logic
      console.log(`Refreshing tokens for ${integration.provider}`);

      return { success: true };
    }),
});
