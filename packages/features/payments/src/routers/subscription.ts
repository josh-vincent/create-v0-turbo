import { createTRPCRouter, protectedProcedure, publicProcedure } from "@tocld/api";
import { eq } from "@tocld/db";
import { subscriptions } from "@tocld/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPaymentProviderFromEnv } from "../providers";

/**
 * Payment/Subscription tRPC router
 */
export const subscriptionRouter = createTRPCRouter({
  /**
   * Get current subscription for the user's team
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Mock mode
    if (ctx.isMockMode) {
      return {
        id: "sub_mock_123",
        teamId: "team_mock_123",
        provider: "stripe" as const,
        status: "active" as const,
        planName: "Pro Plan",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
    }

    // Get user's team (assuming first team for now)
    const subscription = await ctx.db.query.subscriptions.findFirst({
      where: (subs, { eq }) => eq(subs.teamId, ctx.session!.user.id),
    });

    return subscription;
  }),

  /**
   * Create checkout session
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Mock mode
      if (ctx.isMockMode) {
        return {
          sessionId: "cs_mock_123",
          url: "https://checkout.stripe.com/mock",
        };
      }

      const provider = getPaymentProviderFromEnv();
      if (!provider) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment provider not configured",
        });
      }

      const session = await provider.createCheckoutSession({
        customerEmail: ctx.session.user.email,
        priceId: input.priceId,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
        metadata: {
          userId: ctx.session.user.id,
        },
      });

      return session;
    }),

  /**
   * Create billing portal session
   */
  createBillingPortal: protectedProcedure
    .input(
      z.object({
        returnUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Mock mode
      if (ctx.isMockMode) {
        return {
          url: "https://billing.stripe.com/mock",
        };
      }

      const provider = getPaymentProviderFromEnv();
      if (!provider) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment provider not configured",
        });
      }

      // Get subscription to find customer ID
      const subscription = await ctx.db.query.subscriptions.findFirst({
        where: (subs, { eq }) => eq(subs.teamId, ctx.session!.user.id),
      });

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subscription found",
        });
      }

      const customerId = subscription.stripeCustomerId || subscription.polarCustomerId;
      if (!customerId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Customer ID not found",
        });
      }

      const portal = await provider.createBillingPortalSession({
        customerId,
        returnUrl: input.returnUrl,
      });

      return portal;
    }),

  /**
   * Cancel subscription
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Mock mode
    if (ctx.isMockMode) {
      return {
        success: true,
        message: "Subscription cancelled (mock mode)",
      };
    }

    const provider = getPaymentProviderFromEnv();
    if (!provider) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Payment provider not configured",
      });
    }

    const subscription = await ctx.db.query.subscriptions.findFirst({
      where: (subs, { eq }) => eq(subs.teamId, ctx.session!.user.id),
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    const subscriptionId = subscription.stripeSubscriptionId || subscription.polarSubscriptionId;
    if (!subscriptionId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Subscription ID not found",
      });
    }

    const updated = await provider.cancelSubscription(subscriptionId);

    // Update database
    await ctx.db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return { success: true };
  }),

  /**
   * Resume subscription
   */
  resume: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Mock mode
    if (ctx.isMockMode) {
      return {
        success: true,
        message: "Subscription resumed (mock mode)",
      };
    }

    const provider = getPaymentProviderFromEnv();
    if (!provider) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Payment provider not configured",
      });
    }

    const subscription = await ctx.db.query.subscriptions.findFirst({
      where: (subs, { eq }) => eq(subs.teamId, ctx.session!.user.id),
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    const subscriptionId = subscription.stripeSubscriptionId || subscription.polarSubscriptionId;
    if (!subscriptionId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Subscription ID not found",
      });
    }

    const updated = await provider.resumeSubscription(subscriptionId);

    // Update database
    await ctx.db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return { success: true };
  }),
});
