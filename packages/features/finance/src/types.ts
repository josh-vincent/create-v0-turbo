import { z } from "zod";

// Invoice Types
export const invoiceStatusEnum = z.enum([
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
]);

export const createInvoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email required"),
  invoiceNumber: z.string().min(1, "Invoice number required"),
  issueDate: z.string(),
  dueDate: z.string(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().min(1),
      rate: z.number().min(0),
      amount: z.number().min(0),
    })
  ),
  subtotal: z.number().min(0),
  tax: z.number().min(0).optional(),
  total: z.number().min(0),
  notes: z.string().optional(),
  status: invoiceStatusEnum.default("draft"),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string(),
});

export type InvoiceStatus = z.infer<typeof invoiceStatusEnum>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;

// Expense Types
export const expenseCategoryEnum = z.enum([
  "software",
  "marketing",
  "operations",
  "hr",
  "travel",
  "equipment",
  "other",
]);

export const createExpenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  category: expenseCategoryEnum,
  date: z.string(),
  vendor: z.string().optional(),
  receiptUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.string(),
});

export type ExpenseCategory = z.infer<typeof expenseCategoryEnum>;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;

// Time Entry Types
export const createTimeEntrySchema = z.object({
  projectName: z.string().min(1, "Project name required"),
  description: z.string().min(1, "Description required"),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.number().min(0).optional(), // in minutes
  hourlyRate: z.number().min(0).optional(),
  billable: z.boolean().default(true),
  notes: z.string().optional(),
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial().extend({
  id: z.string(),
});

export type CreateTimeEntry = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntry = z.infer<typeof updateTimeEntrySchema>;

// Feature Manifest
export const financeFeatureManifest = {
  name: "finance",
  version: "1.0.0",
  description: "Invoice management, expense tracking, and time tracking",
  enabled: true,
  requiredEnvVars: [],
  routers: ["invoiceRouter", "expenseRouter", "timeRouter"],
} as const;
