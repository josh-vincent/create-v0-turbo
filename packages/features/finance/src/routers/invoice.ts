import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@tocld/api/trpc";
import { invoices } from "@tocld/db/schema";
import { eq, desc } from "@tocld/db";
import { createInvoiceSchema, updateInvoiceSchema } from "../types";

// Mock data for development
const mockInvoices = [
  {
    id: "inv_1",
    userId: "00000000-0000-0000-0000-000000000001",
    clientName: "Acme Corp",
    clientEmail: "billing@acme.com",
    invoiceNumber: "INV-001",
    issueDate: new Date("2025-01-01"),
    dueDate: new Date("2025-01-31"),
    items: [
      { description: "Web Development", quantity: 40, rate: 150, amount: 6000 },
      { description: "Design Services", quantity: 20, rate: 100, amount: 2000 },
    ],
    subtotal: "8000.00",
    tax: "800.00",
    total: "8800.00",
    status: "sent" as const,
    notes: "Payment due within 30 days",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: "inv_2",
    userId: "00000000-0000-0000-0000-000000000001",
    clientName: "Tech Startup Inc",
    clientEmail: "accounts@techstartup.com",
    invoiceNumber: "INV-002",
    issueDate: new Date("2025-01-15"),
    dueDate: new Date("2025-02-15"),
    items: [
      { description: "Consulting Services", quantity: 30, rate: 200, amount: 6000 },
    ],
    subtotal: "6000.00",
    tax: "600.00",
    total: "6600.00",
    status: "paid" as const,
    notes: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
  },
];

export const invoiceRouter = createTRPCRouter({
  // List all invoices
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] invoice.list - Using mock data");
        let filtered = [...mockInvoices];

        if (input?.status) {
          filtered = filtered.filter(inv => inv.status === input.status);
        }

        return filtered.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 50));
      }

      // Real implementation
      const query = ctx.db
        .select()
        .from(invoices)
        .where(eq(invoices.userId, ctx.session!.user.id))
        .orderBy(desc(invoices.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);

      if (input?.status) {
        return query.where(eq(invoices.status, input.status));
      }

      return query;
    }),

  // Get single invoice
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] invoice.getById - Using mock data");
        const invoice = mockInvoices.find(inv => inv.id === input.id);
        if (!invoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }
        return invoice;
      }

      // Real implementation
      const [invoice] = await ctx.db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.id))
        .limit(1);

      if (!invoice || invoice.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      return invoice;
    }),

  // Create invoice
  create: protectedProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] invoice.create - Using mock data");
        const newInvoice = {
          id: `inv_${Date.now()}`,
          userId: ctx.session!.user.id,
          ...input,
          issueDate: new Date(input.issueDate),
          dueDate: new Date(input.dueDate),
          subtotal: input.subtotal.toString(),
          tax: input.tax?.toString() || null,
          total: input.total.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockInvoices.push(newInvoice);
        return newInvoice;
      }

      // Real implementation
      const [newInvoice] = await ctx.db
        .insert(invoices)
        .values({
          userId: ctx.session!.user.id,
          ...input,
          issueDate: new Date(input.issueDate),
          dueDate: new Date(input.dueDate),
          subtotal: input.subtotal.toString(),
          tax: input.tax?.toString(),
          total: input.total.toString(),
        })
        .returning();

      return newInvoice!;
    }),

  // Update invoice
  update: protectedProcedure
    .input(updateInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] invoice.update - Using mock data");
        const index = mockInvoices.findIndex(inv => inv.id === id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        mockInvoices[index] = {
          ...mockInvoices[index]!,
          ...updateData,
          issueDate: updateData.issueDate ? new Date(updateData.issueDate) : mockInvoices[index]!.issueDate,
          dueDate: updateData.dueDate ? new Date(updateData.dueDate) : mockInvoices[index]!.dueDate,
          subtotal: updateData.subtotal?.toString() || mockInvoices[index]!.subtotal,
          tax: updateData.tax?.toString() || mockInvoices[index]!.tax,
          total: updateData.total?.toString() || mockInvoices[index]!.total,
          updatedAt: new Date(),
        };

        return mockInvoices[index]!;
      }

      // Real implementation
      const [updated] = await ctx.db
        .update(invoices)
        .set({
          ...updateData,
          issueDate: updateData.issueDate ? new Date(updateData.issueDate) : undefined,
          dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
          subtotal: updateData.subtotal?.toString(),
          tax: updateData.tax?.toString(),
          total: updateData.total?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, id))
        .returning();

      if (!updated || updated.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      return updated;
    }),

  // Delete invoice
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] invoice.delete - Using mock data");
        const index = mockInvoices.findIndex(inv => inv.id === input.id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }
        mockInvoices.splice(index, 1);
        return { success: true };
      }

      // Real implementation
      const [deleted] = await ctx.db
        .delete(invoices)
        .where(eq(invoices.id, input.id))
        .returning();

      if (!deleted || deleted.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      return { success: true };
    }),

  // Get invoice stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Mock mode
    if (ctx.isMockMode) {
      console.log("🔶 [MOCK] invoice.getStats - Using mock data");
      return {
        total: mockInvoices.length,
        draft: mockInvoices.filter(inv => inv.status === "draft").length,
        sent: mockInvoices.filter(inv => inv.status === "sent").length,
        paid: mockInvoices.filter(inv => inv.status === "paid").length,
        overdue: mockInvoices.filter(inv => inv.status === "overdue").length,
        totalAmount: mockInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0),
        paidAmount: mockInvoices
          .filter(inv => inv.status === "paid")
          .reduce((sum, inv) => sum + parseFloat(inv.total), 0),
      };
    }

    // Real implementation
    const userInvoices = await ctx.db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, ctx.session!.user.id));

    return {
      total: userInvoices.length,
      draft: userInvoices.filter(inv => inv.status === "draft").length,
      sent: userInvoices.filter(inv => inv.status === "sent").length,
      paid: userInvoices.filter(inv => inv.status === "paid").length,
      overdue: userInvoices.filter(inv => inv.status === "overdue").length,
      totalAmount: userInvoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0),
      paidAmount: userInvoices
        .filter(inv => inv.status === "paid")
        .reduce((sum, inv) => sum + parseFloat(inv.total), 0),
    };
  }),
});
