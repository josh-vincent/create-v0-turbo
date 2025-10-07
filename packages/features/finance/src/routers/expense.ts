import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@tocld/api";
import { expenses } from "@tocld/db/schema";
import { eq, desc } from "@tocld/db";
import { createExpenseSchema, updateExpenseSchema } from "../types";

// Mock data for development
const mockExpenses = [
  {
    id: "exp_1",
    userId: "00000000-0000-0000-0000-000000000001",
    description: "Adobe Creative Cloud Subscription",
    amount: "52.99",
    category: "software" as const,
    date: new Date("2025-01-15"),
    vendor: "Adobe Inc.",
    receiptUrl: null,
    notes: "Monthly subscription",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "exp_2",
    userId: "00000000-0000-0000-0000-000000000001",
    description: "Facebook Ads Campaign",
    amount: "500.00",
    category: "marketing" as const,
    date: new Date("2025-01-20"),
    vendor: "Meta Platforms",
    receiptUrl: "https://example.com/receipt-2.pdf",
    notes: "Q1 Marketing campaign",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "exp_3",
    userId: "00000000-0000-0000-0000-000000000001",
    description: "Flight to NYC",
    amount: "450.00",
    category: "travel" as const,
    date: new Date("2025-01-25"),
    vendor: "Delta Airlines",
    receiptUrl: "https://example.com/receipt-3.pdf",
    notes: "Client meeting",
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-01-25"),
  },
];

export const expenseRouter = createTRPCRouter({
  // List all expenses
  list: protectedProcedure
    .input(
      z.object({
        category: z.enum(["software", "marketing", "operations", "hr", "travel", "equipment", "other"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] expense.list - Using mock data");
        let filtered = [...mockExpenses];

        if (input?.category) {
          filtered = filtered.filter(exp => exp.category === input.category);
        }

        return filtered.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 50));
      }

      // Real implementation
      const query = ctx.db
        .select()
        .from(expenses)
        .where(eq(expenses.userId, ctx.session!.user.id))
        .orderBy(desc(expenses.date))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);

      if (input?.category) {
        return query.where(eq(expenses.category, input.category));
      }

      return query;
    }),

  // Get single expense
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] expense.getById - Using mock data");
        const expense = mockExpenses.find(exp => exp.id === input.id);
        if (!expense) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found",
          });
        }
        return expense;
      }

      // Real implementation
      const [expense] = await ctx.db
        .select()
        .from(expenses)
        .where(eq(expenses.id, input.id))
        .limit(1);

      if (!expense || expense.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found",
        });
      }

      return expense;
    }),

  // Create expense
  create: protectedProcedure
    .input(createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] expense.create - Using mock data");
        const newExpense = {
          id: `exp_${Date.now()}`,
          userId: ctx.session!.user.id,
          ...input,
          date: new Date(input.date),
          amount: input.amount.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockExpenses.push(newExpense);
        return newExpense;
      }

      // Real implementation
      const [newExpense] = await ctx.db
        .insert(expenses)
        .values({
          userId: ctx.session!.user.id,
          ...input,
          date: new Date(input.date),
          amount: input.amount.toString(),
        })
        .returning();

      return newExpense!;
    }),

  // Update expense
  update: protectedProcedure
    .input(updateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] expense.update - Using mock data");
        const index = mockExpenses.findIndex(exp => exp.id === id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found",
          });
        }

        mockExpenses[index] = {
          ...mockExpenses[index]!,
          ...updateData,
          date: updateData.date ? new Date(updateData.date) : mockExpenses[index]!.date,
          amount: updateData.amount?.toString() || mockExpenses[index]!.amount,
          updatedAt: new Date(),
        };

        return mockExpenses[index]!;
      }

      // Real implementation
      const [updated] = await ctx.db
        .update(expenses)
        .set({
          ...updateData,
          date: updateData.date ? new Date(updateData.date) : undefined,
          amount: updateData.amount?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(expenses.id, id))
        .returning();

      if (!updated || updated.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found",
        });
      }

      return updated;
    }),

  // Delete expense
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] expense.delete - Using mock data");
        const index = mockExpenses.findIndex(exp => exp.id === input.id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expense not found",
          });
        }
        mockExpenses.splice(index, 1);
        return { success: true };
      }

      // Real implementation
      const [deleted] = await ctx.db
        .delete(expenses)
        .where(eq(expenses.id, input.id))
        .returning();

      if (!deleted || deleted.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Expense not found",
        });
      }

      return { success: true };
    }),

  // Get expense stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Mock mode
    if (ctx.isMockMode) {
      console.log("🔶 [MOCK] expense.getStats - Using mock data");

      const categoryTotals = mockExpenses.reduce((acc, exp) => {
        const category = exp.category;
        acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
        return acc;
      }, {} as Record<string, number>);

      return {
        total: mockExpenses.length,
        totalAmount: mockExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
        byCategory: categoryTotals,
        averageExpense: mockExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / mockExpenses.length,
      };
    }

    // Real implementation
    const userExpenses = await ctx.db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, ctx.session!.user.id));

    const categoryTotals = userExpenses.reduce((acc, exp) => {
      const category = exp.category;
      acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      total: userExpenses.length,
      totalAmount: userExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
      byCategory: categoryTotals,
      averageExpense: userExpenses.length > 0
        ? userExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / userExpenses.length
        : 0,
    };
  }),
});
