import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@tocld/api/trpc";
import { customerActivities, customerNotes, customers } from "@tocld/db/schema";

import {
  createCustomerSchema,
  customerActivitySchema,
  customerNoteSchema,
  searchCustomersSchema,
  updateCustomerSchema,
} from "../types";

export const customerRouter = createTRPCRouter({
  // List all customers with optional search/filter
  list: protectedProcedure.input(searchCustomersSchema).query(async ({ ctx, input }) => {
    const { query, status, source, teamId, limit, offset } = input;

    const conditions = [];

    // Full-text search across multiple fields
    if (query) {
      conditions.push(
        or(
          ilike(customers.firstName, `%${query}%`),
          ilike(customers.lastName, `%${query}%`),
          ilike(customers.email, `%${query}%`),
          ilike(customers.company, `%${query}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(customers.status, status));
    }

    if (source) {
      conditions.push(eq(customers.source, source));
    }

    if (teamId) {
      conditions.push(eq(customers.teamId, teamId));
    }

    // If user is not admin, only show customers they own or their team owns
    if (ctx.session.user.role !== "admin") {
      conditions.push(
        or(eq(customers.ownerId, ctx.session.user.id), eq(customers.teamId, ctx.session.user.teamId))
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, totalCount] = await Promise.all([
      ctx.db.query.customers.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(customers.createdAt)],
      }),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(whereClause),
    ]);

    return {
      items,
      total: totalCount[0]?.count ?? 0,
      limit,
      offset,
    };
  }),

  // Get single customer by ID with relations
  byId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, input.id),
      with: {
        notes: {
          orderBy: [desc(customerNotes.createdAt)],
          limit: 10,
        },
        activities: {
          orderBy: [desc(customerActivities.createdAt)],
          limit: 10,
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }),

  // Create new customer
  create: protectedProcedure.input(createCustomerSchema).mutation(async ({ ctx, input }) => {
    const [customer] = await ctx.db
      .insert(customers)
      .values({
        ...input,
        ownerId: ctx.session.user.id,
        teamId: input.teamId ?? ctx.session.user.teamId,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      })
      .returning();

    return customer;
  }),

  // Update existing customer
  update: protectedProcedure.input(updateCustomerSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;

    const [customer] = await ctx.db
      .update(customers)
      .set({
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    return customer;
  }),

  // Delete customer
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(customers).where(eq(customers.id, input.id));
    return { success: true };
  }),

  // Get customer statistics
  stats: protectedProcedure.query(async ({ ctx }) => {
    const whereClause =
      ctx.session.user.role !== "admin"
        ? or(eq(customers.ownerId, ctx.session.user.id), eq(customers.teamId, ctx.session.user.teamId))
        : undefined;

    const [totalCustomers, activeCustomers, prospects] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(whereClause),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(and(whereClause, eq(customers.status, "active"))),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(and(whereClause, eq(customers.status, "prospect"))),
    ]);

    return {
      total: totalCustomers[0]?.count ?? 0,
      active: activeCustomers[0]?.count ?? 0,
      prospects: prospects[0]?.count ?? 0,
    };
  }),
});

export const customerNoteRouter = createTRPCRouter({
  // Add note to customer
  create: protectedProcedure.input(customerNoteSchema).mutation(async ({ ctx, input }) => {
    const [note] = await ctx.db
      .insert(customerNotes)
      .values({
        ...input,
        authorId: ctx.session.user.id,
      })
      .returning();

    return note;
  }),

  // Get notes for customer
  byCustomerId: protectedProcedure.input(z.object({ customerId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.query.customerNotes.findMany({
      where: eq(customerNotes.customerId, input.customerId),
      orderBy: [desc(customerNotes.createdAt)],
    });
  }),
});

export const customerActivityRouter = createTRPCRouter({
  // Create activity
  create: protectedProcedure.input(customerActivitySchema).mutation(async ({ ctx, input }) => {
    const [activity] = await ctx.db
      .insert(customerActivities)
      .values({
        ...input,
        userId: ctx.session.user.id,
      })
      .returning();

    return activity;
  }),

  // Get activities for customer
  byCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.customerActivities.findMany({
        where: eq(customerActivities.customerId, input.customerId),
        orderBy: [desc(customerActivities.createdAt)],
      });
    }),

  // Mark activity as complete
  complete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const [activity] = await ctx.db
      .update(customerActivities)
      .set({ completedAt: new Date() })
      .where(eq(customerActivities.id, input.id))
      .returning();

    return activity;
  }),
});
