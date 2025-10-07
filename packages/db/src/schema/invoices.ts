import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const invoices = pgTable(
  "invoices",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    // Client Information
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email").notNull(),

    // Invoice Details
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),

    // Line Items (stored as JSON)
    items: jsonb("items").notNull().$type<Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>>(),

    // Amounts
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),

    // Status
    status: varchar("status", { length: 20 })
      .notNull()
      .default("draft")
      .$type<"draft" | "sent" | "paid" | "overdue" | "cancelled">(),

    // Additional Info
    notes: text("notes"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("invoices_user_id_idx").on(table.userId),
    statusIdx: index("invoices_status_idx").on(table.status),
    invoiceNumberIdx: index("invoices_number_idx").on(table.invoiceNumber),
  })
);

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(profiles, {
    fields: [invoices.userId],
    references: [profiles.id],
  }),
}));

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
